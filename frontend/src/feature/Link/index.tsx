import React from "react";
import NextLink from "next/link";
import { siteMap } from "~/foundation/umbracoContent/siteMap.js";
import { SiteMapObj } from "~/foundation/umbracoContent/typings";

interface LinkProps {
    id: string|number,
    name?: string
}

const Link: React.FC<LinkProps> = (props) => {
    const {id, name} = props;
    const siteMapObj: SiteMapObj = siteMap;
    
    const page = siteMapObj[id];

    if (!page) return <></>;

    const link = {
        href: `/${page.template}`,
        as: page.url
    };
    
    return (
        <NextLink {...link}>
            <a>
                {props.children
                    ? props.children
                    : name ?? page.id
                }
            </a>
        </NextLink>
    )
};

export default Link;