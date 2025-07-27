import { DOMParser } from "xmldom";
import { Channel, ChannelImage, Item } from "./_interface/rss";

const HTML_CODE_MAP: Record<string, string> = {
  "&lt;": "<",
  "&gt;": ">",
  "&amp;": "&",
  "&nbsp;": " ",
  "&#8216;": "'",
  "&#8217;": "'",
  "&#8220;": '"',
  "&#8221;": '"',
};

export default class RSSParser {
  readonly xml: string;
  readonly contentType: string;

  constructor(xml: string, contentType: string) {
    this.xml = xml;
    this.contentType = contentType;
  }

  convertDescriptionToText = (description: Element | undefined): string => {
    if (!description) return "";
    let text = description.textContent!;

    // Replace HTML entities with their corresponding characters
    Object.entries(HTML_CODE_MAP).forEach(([key, value]) => {
      text = text.replace(new RegExp(key, "g"), value);
    });

    // Remove HTML tags
    text = text.replace(/<[^>]*>/g, "");

    // Remove any line breaks or extra whitespace
    text = text.replace(/\s+/g, " ").trim();
    return text;
  };

  extractChannel = (channelElement: Element): Channel => {
    const imageElement = channelElement.getElementsByTagName("image")
      ? channelElement.getElementsByTagName("image")[0]
      : undefined;
    const title = channelElement.getElementsByTagName("title")[0].textContent!;
    const description =
      channelElement.getElementsByTagName("description")[0].textContent!;
    const link = channelElement.getElementsByTagName("link")[0].textContent!;
    const lastBuildDate = channelElement.getElementsByTagName(
      "lastBuildDate"
    )[0]
      ? new Date(
          channelElement.getElementsByTagName("lastBuildDate")[0].textContent!
        )
      : undefined;
    const ttl = parseInt(
      channelElement.getElementsByTagName("ttl")[0]?.textContent || ""
    );
    const channel = {
      title,
      description,
      link,
      lastBuildDate,
      ttl,
      image: undefined,
      publications: [],
    } as Channel;

    if (imageElement) {
      channel.image = {
        url: imageElement.getElementsByTagName("url")[0].textContent,
        title: imageElement.getElementsByTagName("title")[0].textContent,
        link: imageElement.getElementsByTagName("link")[0].textContent,
      } as ChannelImage;
    }

    return channel;
  };

  extractItem = (itemElement: Element): Item => {
    const title = itemElement.getElementsByTagName("title")[0].textContent!;
    // Need to build a regex that captures the paragraph tag portion of the description
    // and then iterate over the text with a regex that aggregates the actual text
    // and replaces the tags with nothing
    const descriptionElement =
      itemElement.getElementsByTagName("description")?.[0];
    const description = this.convertDescriptionToText(descriptionElement);
    const link = itemElement.getElementsByTagName("link")[0].textContent;

    const guid = itemElement.getElementsByTagName("guid")[0].textContent;
    const categoryCollection = itemElement.getElementsByTagName("category");
    const categories: string[] = [];
    Array.from(categoryCollection).reduce(
      (categories, category) => categories.concat([category.textContent!]),
      categories
    );
    const dcCreator =
      itemElement.getElementsByTagName("dc:creator")[0].textContent;
    const pubDate = new Date(
      itemElement.getElementsByTagName("pubDate")[0].textContent!
    );
    let mediaElement = itemElement.getElementsByTagName("media:content");
    if (mediaElement.length === 0) {
      mediaElement = itemElement.getElementsByTagName("media:thumbnail");
    }
    const mediaContent = mediaElement[0]?.getAttribute("url");
    const contentEncoded =
      itemElement.getElementsByTagName("content:encoded")[0]?.textContent;

    const item = {
      title,
      description,
      link,
      guid,
      categories,
      dcCreator,
      pubDate,
      mediaContent,
      contentEncoded,
    } as Item;

    return item;
  };
  parse = () => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(this.xml, this.contentType);

    // Build the channel object
    const channelElement = xmlDoc.getElementsByTagName("channel")
      ? xmlDoc.getElementsByTagName("channel")[0]
      : undefined;
    if (!channelElement) throw new Error("No channel element found");
    const channel = this.extractChannel(channelElement);

    // Build the publication items for the channel
    const items = xmlDoc.getElementsByTagName("item");
    if (items.length === 0) throw new Error("No publication items found");
    const publishedItems = Array.from(items).map((itemXML) =>
      this.extractItem(itemXML)
    );

    channel.publications = publishedItems;
    return channel;
  };
}
