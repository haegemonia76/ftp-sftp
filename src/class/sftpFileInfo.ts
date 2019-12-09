import FileInfo from './fileInfo';
import Stats from '../interface/Stats';

export default class SftpFileInfo extends FileInfo {
    original: Stats | any;
    constructor(original: Stats | any) {
        super(original);
        this.original = original;
    }
    isDirectory() {
        return this.original.type === 'd';
    }
}
