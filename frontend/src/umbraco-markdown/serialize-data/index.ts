import yaml from "js-yaml";
import traverse from "traverse";

export const serializeData = (format: string, data: any) => {
    
    const safeData = traverse(data).map(function transform(value) {
        if (typeof value === "undefined") {
            this.update(null);
        }
    });
    
    switch (format) {
        case "yaml":
        case "yml":
            return yaml.safeDump(safeData, { lineWidth: -1 }).trim();

        case "json":
            return JSON.stringify(safeData, null, 2).trim();

        default:
            throw new Error(`Unsupported format: ${format}`);
    }
};