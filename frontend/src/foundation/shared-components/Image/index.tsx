import React from "react";
import { default as NextImage } from "next/image";

declare const VALID_LOADING_VALUES: readonly ["lazy", "eager", undefined];
type LoadingValue = typeof VALID_LOADING_VALUES[number];

type ImageProps = {
  src: string;
  quality?: number | string;
  loading?: LoadingValue;
  alt: string;
} & (
  | {
      width: number | string;
      height: number | string;
      unsized?: false;
    }
  | {
      width?: number | string;
      height?: number | string;
      unsized: true;
    }
);

const Image: React.FC<ImageProps> = (props: ImageProps) => {
  if (!props?.src) return <></>;

  return <NextImage {...props} />;
};

export default Image;
