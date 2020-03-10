const { serializeData } = require("../serialize-data");

exports.generateFrontmatter = (format: string, data: object) =>{
    if (data) {
        switch (format) {
            case "yaml":
            case "yml":
                return `---\n${serializeData(format, data)}\n---\n\n`;

            case "json":
                return `${serializeData(format, data)}\n\n`;

            case "md":
                return "";

            default:
                throw new Error(`Unsupported format: ${format}`);
        }
    } else {
        return "";
    }
}