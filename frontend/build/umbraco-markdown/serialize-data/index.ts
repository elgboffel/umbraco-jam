﻿const yaml = require("js-yaml");

exports.serializeData = (format: string, data: any) => {   
    
    switch (format) {
        case "yaml":
        case "yml":
            return yaml.safeDump(data, { lineWidth: -1 }).trim();

        case "json":
            return JSON.stringify(data, null, 2).trim();

        default:
            throw new Error(`Unsupported format: ${format}`);
    }
};