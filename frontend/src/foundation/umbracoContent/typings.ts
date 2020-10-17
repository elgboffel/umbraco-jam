export interface BaseContent {
  id: number;
  name: string;
  urlSegment: string;
  sortOrder: number;
  level: number;
  path: string;
  templateId: number;
  template: string;
  creatorId: number;
  creatorName: string;
  createDate: Date;
  writerId: number;
  writerName: string;
  updateDate: Date;
  url: string;
}

export interface SiteMapObj {
  [key: string]: SiteMapItem;
}

export interface SiteMapItem {
  id: number;
  template: string;
  url: string;
}

export interface Media {
  format: string;
  size: number;
  width: number;
  height: number;
  title: string;
  alt: string;
  url: string;
  filename: string;
  isImage: boolean;
}

export type Link = BaseContent;

export interface LinkPicker {
  url: string;
  name?: string;
  template?: string;
}
