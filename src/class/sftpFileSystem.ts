import SftpClient = require('ssh2-sftp-client');
import FileSystem from './fileSystem';
import SftpFileInfo from './sftpFileInfo';

export default class SftpFileSystem extends FileSystem {
    client: any;
    constructor(client: SftpClient) {
        super();
        this.client = client;
    }

    static async create(host: string, port: number, user: string, password: string) {
        const c = new SftpClient();
        return new Promise((resolve, reject) => {
            c.connect({
                host,
                port,
                username: user,
                password,
            }).then(() => {
                resolve(new SftpFileSystem(c));
            }).catch((err) => {
                reject(err);
            });
        });
    }

    async list(path: string) {
        return new Promise((resolve, reject) => {
            this.client.list(path)
                .then((paths: Array<SftpClient.FileStats>) => {
                    resolve(paths.map((it: SftpClient.FileStats) => new SftpFileInfo(it)));
                }).catch((err: Error) => {
                    reject(err);
                });
        });
    }

    put(src: NodeJS.ReadableStream, toPath: string) {
        return this.client.put(src, toPath);
    }

    get(path: string) {
        return new Promise((resolve, reject) => {
            try {
                resolve(this.client.sftp.createReadStream(path));
            } catch (e) {
                reject(e);
            }
        });
    }

    mkdir(path: string, recursive: boolean) {
        return this.client.mkdir(path, recursive);
    }

    rmdir(path: string, recursive: boolean) {
        return this.client.rmdir(path, recursive);
    }

    delete(path: string) {
        return this.client.delete(path);
    }

    rename(oldPath: string, newPath: string) {
        return this.client.rename(oldPath, newPath);
    }

    /**
     * Tests to see if remote file or directory exists.
     * Returns type of remote object if it exists or false if it does not.
     * @param path path to the file or directory to test
     * @returns {boolean | string} false or d, -, l (dir, file or link)
     */
    async exists(path: string): Promise<boolean | string> {
        return this.client.exists(path);
    }

    async end() {
        await this.client.end();
    }
}
