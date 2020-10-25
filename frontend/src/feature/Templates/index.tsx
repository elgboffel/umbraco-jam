import Article from "@feature/Templates/Article";
import React from "react";
import FrontPage from "@feature/Templates/FrontPage";

interface TemplatesType {
  [key: string]: React.FC<any>;
}

export const Templates: TemplatesType = {
  Article,
  FrontPage,
};
