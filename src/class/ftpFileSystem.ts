import FtpClient = require('ftp');
import FileSystem from './fileSystem';
import FtpFileInfo from './ftpFileInfo';
import Stats from '../interface/Stats';

export default class FtpFileSystem extends FileSystem {
    client: any;
    constructor(client: FtpClient) {
        super();
        this.client = client;
    }

    static async create(host: string, port: number, user: string, password: string): Promise<FtpFileSystem | Error> {
        const c = new FtpClient();
        return new Promise((resolve, reject) => {
            c.on('ready', () => {
                resolve(new FtpFileSystem(c));
            });
            c.once('error', (err: Error) => {
                reject(err);
            });
            c.connect({
                host,
                port,
                user,
                password,
            });
        });
    }

    list(path: string): Promise<Array<FtpFileInfo>> | Error {
        return new Promise((resolve, reject) => {
            this.client.list(path, (err: Error, listing: Array<Stats>) => {
                if (err) {
                    return reject(err);
                }
                resolve(listing.map((l: Stats) => new FtpFileInfo(l)));
            });
        });
    }

    put(src: string, toPath: string): Promise<boolean> | Error {
        return new Promise((resolve, reject) => {
            this.client.put(src, toPath, (err: Error) => {
                if (err) {
                    reject(err);
                }
                resolve(true);
            });
        });
    }

    get(path: string): Promise<NodeJS.ReadableStream> | Error {
        return new Promise((resolve, reject) => {
            this.client.get(path, (err: Error, stream: NodeJS.ReadableStream) => {
                if (err) {
                    return reject(err);
                }
                resolve(stream);
            });
        });
    }

    mkdir(path: string, recursive: boolean): Promise<boolean> | Error {
        return new Promise((resolve, reject) => {
            this.client.mkdir(path, recursive, (err: Error) => {
                if (err) {
                    return reject(err);
                }
                resolve(true);
            });
        });
    }

    rmdir(path: string, recursive: boolean): Promise<boolean> | Error {
        return new Promise((resolve, reject) => {
            this.client.rmdir(path, recursive, (err: Error) => {
                if (err) {
                    return reject(err);
                }
                resolve(true);
            });
        });
    }

    delete(path: string): Promise<string> | Error {
        return new Promise((resolve, reject) => {
            this.client.delete(path, (err: Error) => {
                if (err) {
                    return reject(err);
                }
                resolve(path);
            });
        });
    }

    rename(oldPath: string, newPath: string): Promise<boolean> | Error {
        return new Promise((resolve, reject) => {
            this.client.rename(oldPath, newPath, (err: Error) => {
                if (err) {
                    return reject(err);
                }
                resolve(true);
            });
        });
    }

    exists(path: string): Promise<Boolean> {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.list(path);
            } catch (err) {
                return resolve(false);
            }
            resolve(true);
        });
    }

    end(): void {
        this.client.end();
    }
}
