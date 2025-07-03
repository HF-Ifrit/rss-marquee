export interface Item {
  title: string;
  description: string;
  link: string;
  guid: string;
  categories: [string];
  dcCreator: string;
  pubDate: Date;
  mediaContent: string;
  contentEncoded: string;
}
export interface ChannelImage {
  url: string;
  title: string;
  link: string;
}
export interface Channel {
  title: string;
  description: string;
  link: string;
  image?: ChannelImage;
  lastBuildDate?: Date;
  ttl: number;
  publications: Item[];
}
