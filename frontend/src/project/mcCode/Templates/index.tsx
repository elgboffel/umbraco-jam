import Article from "./Article";
import React from "react";
import FrontPage from "./FrontPage";

interface TemplatesType {
  [key: string]: React.FC<any>;
}

export const Templates: TemplatesType = {
  Article,
  FrontPage,
};
