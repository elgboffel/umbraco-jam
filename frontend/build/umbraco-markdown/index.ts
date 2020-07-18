import { BaseContent } from "~/foundation/umbracoContent/typings";
const { createSiteMapObj } = require("./helpers");
const fetch = require('node-fetch');
const { writeFile } = require("./write-file");
const { createContent } = require('./create-markdown');
const { serializeData } = require('./serialize-data');
const { siteConstants } = require("./constants");

// fetch("http://local.umbraco-jam.dk/Umbraco/Api/Headless/GetContentById?id=1065")
//     .then(res => res.json())
//     .then((json: baseContent) => {
//         console.log(json);
//         createContent(json, json.Url, "");
//
//     })
//     .catch(error => console.log(error));

fetch("http://localhost:5000/Umbraco/Api/Headless/GetAllContent")
    .then((res: any) => res.json())
    .then((result: BaseContent[]) => {
        const siteMap = createSiteMapObj(result);

        /*  Create Site maps */
        writeFile(siteConstants.siteMapPath, `module.exports = ${serializeData("json", siteMap)}`);
        writeFile(siteConstants.siteMapFoundationPath, `export const siteMap = ${serializeData("json", siteMap)};`);
        
        /* Creat Markdown content */
        result.forEach(content => createContent(content, content.url, ""))
    })
    .catch((error: any) => console.log(error));
