import Image from "next/image";
import { Item } from "../_interface/rss";
import { ImagePlaceholder } from "./ImagePlaceholder";

export interface CarouselCardProps {
  item: Item;
}
export default function CarouselCard({ item }: CarouselCardProps) {
  item.pubDate = new Date(item.pubDate);
  return (
    <div className="flex flex-col justify-between mx-1 w-50 min-h-full max-h-full rounded-lg p-2 bg-gray-700 items-center">
      <div>
        {item.mediaContent ? (
          <Image
            src={item.mediaContent}
            alt={item.title}
            width={200}
            height={150}
            className="rounded-md max-h-[150px]"
          />
        ) : (
          <ImagePlaceholder />
        )}
        <p className="text-sm my-1">{item.pubDate.toLocaleDateString()}</p>
        <p className="place-self-start text-sm mb-1 italic">{item.dcCreator}</p>
        <p className="text-sm font-bold my-2">{item.title}</p>
        <p>{item.description.substring(0, 150)}...</p>
      </div>

      <a href={item.link} target="_blank" rel="noreferrer">
        <button className="my-2 bg-blue-500 hover:bg-blue-700 hover:cursor-pointer text-foreground font-bold py-2 px-4 rounded">
          Read More
        </button>
      </a>
    </div>
  );
}
