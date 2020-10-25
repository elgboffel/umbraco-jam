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
  console.log(template, props);
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

const toPaths = (array: Array<string>) => {
  return array.reduce((paths: Paths[], path: string) => {
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
  const json = (await content.json()) as Array<string>;
  const paths = toPaths(json);

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
