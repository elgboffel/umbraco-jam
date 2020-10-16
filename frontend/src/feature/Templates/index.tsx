import Article from "@feature/Templates/Article";
import React from "react";

interface TemplatesType {
  [key: string]: React.FC<any>;
}

export const Templates: TemplatesType = {
  Article,
};
