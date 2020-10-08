import Image from "~/feature/Image";

import { useRouter } from 'next/router'
import React, {FunctionComponent} from "react";
import Link from "~/feature/Link";
import {BaseContent, Link as ILink} from "~/foundation/umbracoContent/typings";

export interface ArticleProps extends BaseContent {
    heading: string,
    lead: string,
    bodyText: string,
    media: string,
    link: ILink
}

const Article: FunctionComponent<ArticleProps> = ({media, heading, bodyText, link, ...props}) => {
    const router = useRouter();

    if (router.isFallback)
        return <div>Loading...</div>
    
    return (
        <article className="container mx-auto px-4">
            {media && (
                <Image url={media} />
            )}
            <h1 className="mt-10">{heading}</h1>
            <div  dangerouslySetInnerHTML={{__html: bodyText}}/>
            <Link id={link?.id}>
                Go to {link?.name}
            </Link>
        </article>
    )
}

export default Article;