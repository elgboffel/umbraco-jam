import { useRouter } from "next/router";
import React from "react";
import { BaseContent, Link as ILink } from "@foundation/umbracoContent/typings";
import Image from "@feature/Image";
import Link from "@feature/Link";

export interface ArticleProps extends BaseContent {
  heading: string;
  lead: string;
  bodyText: string;
  media: string;
  link: ILink;
}

const Article: React.FC<ArticleProps> = ({
  media,
  heading,
  bodyText,
  link,
}) => {
  const router = useRouter();

  if (router.isFallback) return <div>Spinner...</div>;

  return (
    <article className="container mx-auto px-4">
      {media && <Image url={media} />}
      <h1 className="mt-10">{heading}</h1>
      <div dangerouslySetInnerHTML={{ __html: bodyText }} />
      <Link id={link?.id}>Go to {link?.name}</Link>
      <button onClick={() => console.log("test")}>test</button>
    </article>
  );
};

export default Article;
