import matter from "gray-matter";
import { NextPageContext } from "next";

// export const getFrontmatterDataByTypeAndId = async <T>(type: string, id: string) => {
//
//     if (!id || !type) return;
//
//     const content = await import(`../../../site/data/${type}/${id}/index.md`);
//     const data = matter(content.default);
//
//     return {
//         content: data.content,
//         data: data.data as T
//     }
// };

export const getFrontmatterByContext = async <T>(context: NextPageContext) => {
    console.log("context", context)
    const { asPath, req } = context;
    const pathToMarkdown = `${req?.url ? `${req?.url}` : `${asPath}`}`;
    const content = await import(`../../../site/content${pathToMarkdown}index.md`);
    const frontmatter = matter(content.default);
    return <T>{ ...frontmatter.data }
};
