import React from "react";
import NextLink from "next/link";

interface LinkProps {
  template?: string;
  url?: string;
  name?: string;
}

const Link: React.FC<LinkProps> = (props) => {
  const { url, name, template } = props;

  if (!url) return null;

  if (!template)
    return <a href={url}>{props.children ? props.children : name}</a>;

  return (
    <NextLink href={`/${template}`} as={url}>
      <a>{props.children ? props.children : name}</a>
    </NextLink>
  );
};

export default Link;
