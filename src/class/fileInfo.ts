import Stats from '../interface/Stats';

export default class FileInfo {
    original: any;
    constructor(original: Stats) {
        this.original = original;
    }

    getName() {
        return this.original.name;
    }

    getSize() {
        return this.original.size;
    }
}
