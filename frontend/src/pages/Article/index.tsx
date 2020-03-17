import { NextPage } from 'next';
import React from "react";
import Link from "~/feature/Link";
import {getFrontmatterByContext} from "~/foundation/frontmatter/frontmatter";
import {BaseContent, Media, Link as ILink} from "~/foundation/umbracoContent/typings";

export interface Article extends BaseContent {
    heading: string,
    lead: string,
    bodyText: string,
    media: Media,
    link: ILink
}

const Article: NextPage<Article> = (props) => {
    const {media, heading, bodyText, link} = props;
console.log("article", props)
    return (
        <article>
            {media && (
                <img src={`${media}`} alt=""/>                
            )}
            <h1>{heading}</h1>
            <div  dangerouslySetInnerHTML={{__html: bodyText}}/>
            {/*<Link id={link?.id}>*/}
            {/*    Go to {link.name}*/}
            {/*</Link>*/}
        </article>
    )
}

Article.getInitialProps = (context) => getFrontmatterByContext(context);

export default Article;
