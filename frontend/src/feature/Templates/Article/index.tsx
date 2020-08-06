﻿﻿﻿import {NextPage} from "next";
import { useRouter } from 'next/router'
import React, {FunctionComponent} from "react";
import Link from "~/feature/Link";
import {BaseContent, Media, Link as ILink} from "~/foundation/umbracoContent/typings";

export interface ArticleProps extends BaseContent {
    heading: string,
    lead: string,
    bodyText: string,
    media: Media,
    link: ILink
}

const Article: FunctionComponent<ArticleProps> = ({media, heading, bodyText, link, ...props}) => {
    const router = useRouter();

    if (router.isFallback)
        return <div>Loading...</div>

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

export default Article;