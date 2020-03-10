// @ts-ignore
const fs = require("fs");
const path = require("path");
// @ts-ignore
const baseMkdirp = require("mkdirp");

const fsWriteFile = fs.writeFile;
const mkdirp = baseMkdirp;

exports.writeFile = (filePath: string, content: string) => {
    return mkdirp(path.dirname(filePath))
        .then(() => fsWriteFile(filePath, content, (response: object) => console.log("response", response) ))
        .then(() => `Written ${path.relative(process.cwd(), filePath)}`);
};