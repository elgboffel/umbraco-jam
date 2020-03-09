import fs from "fs";
import path from "path";
import baseMkdirp from "mkdirp";

const fsWriteFile = fs.writeFile;
const mkdirp = baseMkdirp;

export default function writeFile(filePath, content) {
    return mkdirp(path.dirname(filePath))
        .then(() => fsWriteFile(filePath, content, null, null))
        .then(() => `Written ${path.relative(process.cwd(), filePath)}`);
}