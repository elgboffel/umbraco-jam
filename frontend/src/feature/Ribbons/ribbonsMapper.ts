import React from "react";
import Carousel from "@feature/Carousel";

interface RibbonsMapper {
  [key: string]: React.FC<any>;
}

export const ribbonsMapper: RibbonsMapper = {
  ribbonSlider: Carousel,
};
