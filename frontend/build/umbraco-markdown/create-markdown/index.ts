﻿// @ts-ignore
const fs = require("fs");
const { siteConstants } = require("../constants");
const { generateFrontmatter } = require("../generate-frontmatter");
const { writeFile } = require("../write-file");

exports.createContent = (data: object, path: string, root: string) => {
    const filePath = `${siteConstants.contentRootPath}${path}`;
    createMarkdown(data, filePath, root);
};

exports.createData = (data: object, path: string, root: string) => {
    const filePath = `${siteConstants.dataRootPath}${path}`;
    createMarkdown(data, filePath, root);
};

const createMarkdown = (data: object, filePath: string, root: string) => {

    if (!data) throw `item is ${data}`;

    const FILE_NAME = "index.md";
    const MARKDOWN_TYPE = "yaml";
    const frontmatter = { frontmatter: {...data } };
    const path = `${filePath}/${FILE_NAME}`;

    // Check if we already have an existing folder and avoid creating a new folder
    if (fs.existsSync(path)) return createFile(path, MARKDOWN_TYPE, frontmatter);

    // If we get here create a new folder and create a post
    createFile(path, MARKDOWN_TYPE, frontmatter);
};

const createFile = (file: string, format: string, { frontmatter = {}, content = "" }) => {
    return writeFile(file, generateFrontmatter(format, frontmatter) + content);
};
