import React from "react";
import NextLink from "next/link";

interface LinkProps {
  template?: string;
  url?: string;
  name?: string;
}

const Link: React.FC<LinkProps> = ({ url, name, template, children }) => {
  if (!url) return null;

  if (!template) return <a href={url}>{children ? children : name}</a>;

  return (
    <NextLink href={`/${template}`} as={url}>
      <a>{children ? children : name}</a>
    </NextLink>
  );
};

export default Link;
