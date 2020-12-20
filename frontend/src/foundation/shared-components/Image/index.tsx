import React from "react";
import { default as NextImage, ImageProps } from "next/image";

const Image: React.FC<ImageProps> = (props: ImageProps) => {
  if (!props?.src) return <></>;

  return <NextImage {...props} />;
};

export default Image;
