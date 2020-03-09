import serializeData from "../serialize-data";

export function generateFrontmatter(format, data) {
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