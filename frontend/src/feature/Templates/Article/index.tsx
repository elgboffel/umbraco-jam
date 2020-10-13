import { useRouter } from "next/router";
import React from "react";
import { BaseContent, LinkPicker } from "@foundation/umbracoContent/typings";
import Image from "@feature/Image";
import Link from "@feature/Link";

export interface ArticleProps extends BaseContent {
  heading: string;
  lead: string;
  bodyText: string;
  media: string;
  singleUrlPicker: LinkPicker[];
}

const Article: React.FC<ArticleProps> = ({
  media,
  heading,
  bodyText,
  singleUrlPicker,
  ...otherProps
}) => {
  const router = useRouter();
  const singleLink = singleUrlPicker ? singleUrlPicker[0] : null;

  if (router.isFallback) return <div>Spinner...</div>;

  return (
    <article className="container mx-auto px-4">
      {console.log(otherProps)}
      {media && <Image url={media} />}
      <h1 className="mt-10">{heading}</h1>
      <div dangerouslySetInnerHTML={{ __html: bodyText }} />
      {singleLink && (
        <Link url={singleLink.url} template={singleLink.template}>
          Go to {singleLink.url}
        </Link>
      )}
      {console.log(otherProps)}
    </article>
  );
};

export default Article;
