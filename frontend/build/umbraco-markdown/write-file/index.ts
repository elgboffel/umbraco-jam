﻿// @ts-ignore
const fs = require("fs");
const path = require("path");
// @ts-ignore
const baseMkdirp = require("mkdirp");

exports.writeFile = (filePath: string, content: string) => {

    return baseMkdirp(path.dirname(filePath))
        .then(() => 
            fs.writeFile(filePath, content, () => 
                console.log(`Written ${path.relative(process.cwd(), filePath)}`)));
};