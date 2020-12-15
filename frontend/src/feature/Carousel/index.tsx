import React from "react";
import Image from "@foundation/shared-components/Image";
import styled from "styled-components";

interface Carousel {
  slider: CarouselItem[];
}

interface CarouselItem {
  key: string;
  media: string;
  text: string;
}

const Slide = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  img {
    object-fit: cover;
  }
`;

const Carousel: React.FC<Carousel> = ({ slider }) => {
  if (!slider) return null;

  return (
    <div>
      {slider.map(({ key, media, text }) => (
        <Slide key={key}>
          <div>{text}</div>
          <div>
            <Image src={media} alt="image" width={400} height={400} />
          </div>
        </Slide>
      ))}
    </div>
  );
};

export default Carousel;
