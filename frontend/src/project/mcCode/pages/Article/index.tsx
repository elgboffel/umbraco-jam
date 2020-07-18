﻿﻿import { NextPage } from "next";
import React from "react";
import Link from "~/feature/Link";
import {FrontmatterByContext, getFrontmatterByContext} from "~/foundation/frontmatter/frontmatter";
import {BaseContent, Media, Link as ILink} from "~/foundation/umbracoContent/typings";

export interface Article extends BaseContent {
    heading: string,
    lead: string,
    bodyText: string,
    media: Media,
    link: ILink
}

interface ArticleProps extends FrontmatterByContext<Article> {
    
}

const Article: NextPage<ArticleProps> = (props) => {
    const { content: {media, heading, bodyText, link }} = props;

    return (
        <article className="container mx-auto px-4">
            {media && (
                <img className="mb-5 object-cover h-full w-full" src={`${media}`} alt=""/>                
            )}
            <h1 className="mt-10">{heading}</h1>
            <div  dangerouslySetInnerHTML={{__html: bodyText}}/>
            <Link id={link?.id}>
                Go to {link?.name}
            </Link>
        </article>
    )
}

Article.getInitialProps = (context) => getFrontmatterByContext(context);

export default Article;
