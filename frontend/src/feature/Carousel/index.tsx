import React from "react";
import Image from "@foundation/shared-components/Image";

interface Carousel {
  slider: CarouselItem[];
}

interface CarouselItem {
  key: string;
  media: string;
  text: string;
}

const Carousel: React.FC<Carousel> = ({ slider }) => {
  if (!slider) return null;

  return (
    <div>
      {slider.map(({ key, media, text }) => (
        <div key={key}>
          <div>{text}</div>
          <div>
            <Image src={media} alt="image" width={400} height={400} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Carousel;
