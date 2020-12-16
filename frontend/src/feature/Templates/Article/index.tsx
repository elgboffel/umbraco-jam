import { useRouter } from "next/router";
import React from "react";
import Image from "@foundation/shared-components/Image";
import Link from "@foundation/shared-components/Link";
import { BaseContent, LinkPicker } from "@foundation/umbracoContent/typings";
import Ribbons from "@feature/Ribbons";

export interface ArticleProps extends BaseContent {
  heading: string;
  lead: string;
  bodyText: string;
  media: string;
  ribbons: any;
  singleUrlPicker: LinkPicker[];
}

const Article: React.FC<ArticleProps> = ({
  media,
  heading,
  bodyText,
  singleUrlPicker,
  ribbons,
  ...otherProps
}) => {
  const router = useRouter();
  const singleLink = singleUrlPicker ? singleUrlPicker[0] : null;

  if (router.isFallback) return <div>Spinner...</div>;

  return (
    <article className="container mx-auto px-4">
      {media && <Image src={media} width={1280} height={600} alt="" />}
      <h1 className="mt-10">{heading}</h1>
      <div dangerouslySetInnerHTML={{ __html: bodyText }} />
      {singleLink && (
        <Link url={singleLink.url} template={singleLink.template}>
          Go to {singleLink.url}
        </Link>
      )}
      <Ribbons ribbons={ribbons} />
    </article>
  );
};

export default Article;
