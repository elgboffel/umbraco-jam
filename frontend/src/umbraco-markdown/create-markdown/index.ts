import generateFrontmatter from "../generate-frontmatter";
import writeFile from "../write-file";

export function createPost(
    file,
    format,
    { frontmatter, content = "" },
) {
    return writeFile(file, generateFrontmatter(format, frontmatter) + content);
}