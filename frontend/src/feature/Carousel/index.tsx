/** @jsx jsx */
import React from "react";
import Image from "@foundation/shared-components/Image";
import { jsx, SxStyleProp } from "theme-ui";
interface Carousel {
  slider: CarouselItem[];
}

interface CarouselItem {
  key: string;
  media: string;
  text: string;
}

const wrapStyles: SxStyleProp = {
  backgroundColor: "primary",
};

const itemStyles: SxStyleProp = {
  maxWidth: "600px",
};

const Carousel: React.FC<Carousel> = ({ slider }) => {
  if (!slider) return null;

  return (
    <div>
      {slider.map(({ key, media, text }) => (
        <div sx={{ ...wrapStyles }} key={key}>
          <div>{text}</div>
          <div sx={{ ...itemStyles }}>
            <Image
              src={media}
              alt="image"
              layout="intrinsic"
              width={600}
              height={400}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Carousel;
