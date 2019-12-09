import FileInfo from './fileInfo';
import Stats from '../interface/Stats';

export default class FtpFileInfo extends FileInfo {
    original: any;
    constructor(original: Stats) {
        super(original);
        this.original = original;
    }

    isDirectory() {
        return this.original.type === 'd';
    }
}
