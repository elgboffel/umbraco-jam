
exports.writeFile = (filePath: string, content: string) => {
    const fs = require("fs");
    const path = require("path");
    const baseMkdirp = require("mkdirp");

    return baseMkdirp(path.dirname(filePath))
        .then(() => 
            fs.writeFile(filePath, content, () => 
                console.log(`Written ${path.relative(process.cwd(), filePath)}`)));
};