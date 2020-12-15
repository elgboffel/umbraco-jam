import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { ParsedUrlQuery } from "querystring";
import { BaseContent } from "@foundation/umbracoContent/typings";
import { Templates } from "@feature/Templates";
import { toUrlString } from "@foundation/utils/toUrlString";
import SiteLayout from "@feature/Layouts/SiteLayout";

const Page: NextPage<BaseContent> = ({ template, context, ...props }) => {
  const router = useRouter();
  const templates = Templates;
  if (router.isFallback) return <div>Loading...</div>;

  const Template = templates[template];

  if (!Page) return <>No page template/component found</>;

  return (
    <SiteLayout context={context}>
      <Template {...props} />
    </SiteLayout>
  );
};

type Paths = string | { params: ParsedUrlQuery };

type PublishedPath = {
  slug: string[];
} & (
  | {
      id?: number;
      url: string;
    }
  | {
      url?: string;
      id: number;
    }
);

const toParams = (array: Array<PublishedPath>) => {
  return array.reduce((paths: Paths[], publishedPath: PublishedPath) => {
    if (!publishedPath) return paths;

    paths.push({
      params: {
        slug: publishedPath?.slug,
      },
    });

    return paths;
  }, []);
};

export const getStaticPaths: GetStaticPaths = async () => {
  const content = await fetch(
    `${process.env.NEXT_PUBLIC_UMBRACO_BASE_PATH}/Umbraco/Api/Headless/GetAllPaths`
  );
  const result = (await content.json()) as Array<PublishedPath>;
  const paths = toParams(result);

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const url = toUrlString(params?.slug);

  const content = await fetch(
    `${process.env.NEXT_PUBLIC_UMBRACO_BASE_PATH}/Umbraco/Api/Headless/GetContentByRoute?route=${url}`
  );
  const props = await content.json();

  return {
    props,
    revalidate: 1,
  };
};

export default Page;
