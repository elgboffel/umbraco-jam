import React from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Img, { CloudimageProvider } from "react-cloudimage-responsive";

interface ImageProps {
  url: string;
}

const Image: React.FC<ImageProps> = ({ url }) => {
  const cloudimageConfig = {
    token: "ajtjpeymfo",
    baseURL: "https://ajtjpeymfo.cloudimg.io/",
  };

  if (!url) return <></>;

  return (
    <CloudimageProvider config={cloudimageConfig}>
      <Img
        className="mb-5 object-cover h-full w-full"
        src={url}
        alt=""
        ratio={1.5}
      />
    </CloudimageProvider>
  );
};

export default Image;
