"use client";
import { useCallback, useEffect, useState } from "react";
import Carousel from "./_components/Carousel";
import { NewCarouselForm } from "./_components/NewCarouselForm";
import { Channel } from "./_interface/rss";

type FetchedChannel = {
  fetchedUrl: string;
  channel: Channel;
};
export default function Home() {
  const [carouselCounter, setCarouselCounter] = useState(1);
  const [carouselMap, setCarouselMap] = useState<
    Map<number, FetchedChannel | undefined>
  >(new Map());

  useEffect(() => {
    const storedLinks = localStorage.getItem("carouselLinks");
    if (storedLinks) {
      const urls: string[] = JSON.parse(storedLinks);
      urls?.forEach((url, index) => {
        fetch(`http://localhost:3000/api?query=${url}`)
          .then((res) => res.json())
          .then((channel: Channel) => {
            setCarouselMap(
              (prevMap) =>
                new Map(
                  prevMap.set(index + 1, { channel: channel, fetchedUrl: url })
                )
            );
          })
          .catch((err) => console.error("Failed to fetch channel:", err));
      });
      setCarouselCounter(urls.length + 1);
    }
  }, []);

  const addNewCarousel = useCallback((id: number, channel?: FetchedChannel) => {
    setCarouselMap((prevMap) => new Map(prevMap.set(id, channel)));
    setCarouselCounter((prev) => prev + 1);
  }, []);

  const removeCarousel = (id: number) => {
    setCarouselMap((prevMap) => {
      const newMap = new Map(prevMap);
      newMap.delete(id);
      const urls = Array.from(
        newMap
          .values()
          .map((channel) => channel?.fetchedUrl)
          .filter((url) => url !== undefined)
      );
      localStorage.setItem("carouselLinks", JSON.stringify(urls));

      return newMap;
    });
  };

  const handleSuccessfulLink = useCallback(
    (id: number, channel: Channel, url: string) => {
      addNewCarousel(id, { fetchedUrl: url, channel: channel });
      const urls = Array.from(
        carouselMap
          .values()
          .map((channel) => channel?.fetchedUrl)
          .filter((url) => url !== undefined)
      );
      localStorage.setItem("carouselLinks", JSON.stringify(urls));
    },
    [addNewCarousel, carouselMap]
  );

  return (
    <div className="px-5 pt-5 pb-10 flex flex-col gap-y-5">
      {Array.from(carouselMap.entries()).map((entry) => (
        <div key={`carousel${entry[0]}`} className="flex justify-center">
          {entry[1] ? (
            <Carousel
              handleRemoveCarousel={() => removeCarousel(entry[0])}
              channel={entry[1].channel}
            />
          ) : (
            <NewCarouselForm
              id={Number(entry[0])}
              handleSuccessfulLink={handleSuccessfulLink}
            />
          )}
        </div>
      ))}
      <button
        className="mt-5 max-w-1/12 text-center bg-blue-500! hover:cursor-pointer hover:bg-blue-700! text-white rounded"
        onClick={() => addNewCarousel(carouselCounter, undefined)}
      >
        + New RSS Feed
      </button>
    </div>
  );
}
