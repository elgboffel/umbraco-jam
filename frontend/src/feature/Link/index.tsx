import React from "react";
import NextLink from "next/link";

interface LinkProps {
  template: string;
  id?: string | number;
  url?: string;
  name?: string;
}

const Link: React.FC<LinkProps> = (props) => {
  const { id, url, name, template } = props;
  // const siteMapObj: SiteMapObj = siteMap;

  // const page = siteMapObj[id];
  //
  // if (!page) return <></>;

  const link = {
    href: `/${template}`,
    as: url,
  };

  return (
    <NextLink {...link}>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a>{props.children ? props.children : name}</a>
    </NextLink>
  );
};

export default Link;
