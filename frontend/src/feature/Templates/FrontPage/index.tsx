import { useRouter } from "next/router";
import React from "react";
import Image from "@foundation/shared-components/Image";
import { BaseContent } from "@foundation/umbracoContent/typings";

export interface FrontPageProps extends BaseContent {
  heading: string;
  lead: string;
  media: string;
}

const FrontPage: React.FC<FrontPageProps> = ({ media, heading }) => {
  const router = useRouter();

  if (router.isFallback) return <div>Spinner...</div>;

  return (
    <article className="container mx-auto px-4">
      {media && <Image url={media} />}
      <h1 className="mt-10">{heading}</h1>
    </article>
  );
};

export default FrontPage;
