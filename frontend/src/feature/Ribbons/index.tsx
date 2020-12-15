import React from "react";
import { ribbonsMapper } from "@feature/Ribbons/ribbonsMapper";

interface Ribbons {
  ribbons: Ribbon[];
}

const Ribbons: React.FC<Ribbons> = ({ ribbons }) => {
  if (!ribbons || ribbons.length < 1) return null;

  return (
    <>
      {ribbons.map(({ key, name, ...rest }) => (
        <Ribbon key={`${name}-${key}`} {...rest} />
      ))}
    </>
  );
};

interface Ribbon {
  key?: string;
  name?: string;
  ncContentTypeAlias: string;
  [key: string]: any;
}

const Ribbon: React.FC<Ribbon> = ({ ncContentTypeAlias, ...otherProps }) => {
  const Component = ribbonsMapper[ncContentTypeAlias];

  if (!Component) return null;

  return <Component {...otherProps} />;
};

export default Ribbons;
