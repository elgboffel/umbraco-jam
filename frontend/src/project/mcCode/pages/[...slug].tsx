﻿import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { ParsedUrlQuery } from "querystring";
import { BaseContent } from "@foundation/umbracoContent/typings";
import { Templates } from "@feature/Templates";
import { toUrlString } from "@foundation/utils/toUrlString";

const Page: NextPage<BaseContent> = ({ template, ...props }) => {
  const router = useRouter();
  const templates: any = Templates;

  if (router.isFallback) return <div>Loading...</div>;

  const Page = templates[template];

  if (!Page) return <>No page template/component found</>;

  return <Page {...props} />;
};

const toPaths = (array: Array<ParsedUrlQuery>) => {
  return array.reduce((paths: any[], path: ParsedUrlQuery) => {
    if (!path) return paths;

    paths.push({
      params: {
        slug: path,
      },
    });

    return paths;
  }, []);
};

export const getStaticPaths: GetStaticPaths = async () => {
  const content = await fetch(
    `${process.env.NEXT_PUBLIC_UMBRACO_BASE_PATH}/Umbraco/Api/Headless/GetAllPaths`
  );
  const json = (await content.json()) as Array<ParsedUrlQuery>;
  const paths = toPaths(json) as any;

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
