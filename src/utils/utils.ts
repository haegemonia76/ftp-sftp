
import {
    existsSync,
    readdirSync,
    lstatSync,
    unlinkSync,
    rmdirSync,
} from 'fs';

// credits going to https://geedew.com/remove-a-directory-that-is-not-empty-in-nodejs/
const deleteFolderRecursive = (path: string) => {
    if (existsSync(path)) {
        readdirSync(path).forEach((file) => {
            const curPath = `${path}/${file}`;
            if (lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                unlinkSync(curPath);
            }
        });
        rmdirSync(path);
    }
};

export default deleteFolderRecursive;
