import {BaseContent, SiteMapItem, SiteMapObj} from "~/foundation/umbracoContent/typings";

exports.createSiteMapObj = (data: BaseContent[]) => {
    return data
        .filter(x => x.template === "Article")
        .reduce<SiteMapObj>((obj, content) => {
        const item: SiteMapItem = {id: content.id, template: content.template, url: content.url};
        obj[`${content.id}`] = {...item};

        return obj;
    }, {});
};
