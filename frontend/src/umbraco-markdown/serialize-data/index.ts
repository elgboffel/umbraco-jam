const yaml = require("js-yaml");
// import traverse from "traverse";

exports.serializeData = (format: string, data: any) => {
    
    // const safeData = traverse(data).map(function transform(value) {
    //     if (typeof value === "undefined") {
    //         this.update(null);
    //     }
    // });
    
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