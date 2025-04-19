import {
    readdir,
    stat,
    createWriteStream,
    createReadStream,
    mkdirSync as _mkdir,
    unlink,
    rename as _rename,
    rmdirSync as _rmdir,
} from 'fs';
import deleteFolderRecursive from '../utils/utils';
import FileSystem from './fileSystem';
import LocalFileInfo from './localFileInfo';
import Stats from '../interface/Stats';

export default class LocalFileSystem extends FileSystem {
    static create() {
        return new Promise((resolve) => resolve(new LocalFileSystem()));
    }

    static async list(path: string) {
        return new Promise((resolve, reject) => {
            readdir(path, async (err, files) => {
                if (err) {
                    return reject(err);
                }
                await Promise.all(
                    files.map((fileName) => new Promise((res, rej) => {
                        stat(path + fileName, (errr, stats) => {
                            if (errr) {
                                return rej(errr);
                            }
                            const other: Stats = Object.assign({}, stats);
                            other.name = fileName;
                            res(new LocalFileInfo(other));
                        });
                    })),
                ).then((res) => {
                    resolve(res);
                }).catch((error) => {
                    reject(error);
                });
            });
        });
    }

    static put(src: NodeJS.ReadableStream, toPath: string): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                const writeStream = createWriteStream(toPath);
                src.pipe(writeStream);
                resolve(true);
            } catch (e) {
                reject(e);
            }
        });
    }

    static get(path: string): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                const readStream = createReadStream(path);
                resolve(readStream);
            } catch (e) {
                reject(e);
            }
        });
    }

    static mkdir(path: string, recursive: boolean) {
        return _mkdir(path, { recursive });
    }

    static rmdir(path: string, recursive: boolean) {
        if (!recursive) return _rmdir(path);
        return new Promise((resolve, reject) => {
            try {
                deleteFolderRecursive(path);
                resolve(true);
            } catch (e) {
                reject(e);
            }
        });
    }

    static delete(path: string) {
        return new Promise((resolve, reject) => {
            unlink(path, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve(true);
            });
        });
    }

    static rename(oldPath: string, newPath: string) {
        return new Promise((resolve, reject) => {
            _rename(oldPath, newPath, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve(true);
            });
        });
    }
}
