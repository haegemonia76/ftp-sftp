import FileInfo from './fileInfo';
import Stats from '../interface/Stats';

export default class LocalFileInfo extends FileInfo {
    original: any;
    constructor(original: Stats) {
        super(original);
        this.original = original;
    }
    isDirectory() {
        return this.original.isDirectory();
    }
}
