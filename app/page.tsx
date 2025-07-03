"use client";
import { useCallback, useEffect, useState } from "react";
import Carousel from "./_components/Carousel";

export default function Home() {
  const [carouselCounter, setCarouselCounter] = useState(1);
  const [carouselIds, setCarouselIds] = useState<string[]>([]);
  const [carouselLinks, setCarouselLinks] = useState<string[]>([]);

  const generateCarouselId = useCallback(() => {
    const id = carouselCounter + 1;
    setCarouselCounter(carouselCounter + 1);
    setCarouselIds([...carouselIds, id.toString()]);
  }, [carouselCounter, carouselIds]);

  const addNewLink = (link: string) => {
    if (link && !carouselLinks.includes(link)) {
      setCarouselLinks([...carouselLinks, link]);
      localStorage.setItem("links", JSON.stringify([...carouselLinks, link]));
    }
  };

  useEffect(() => {
    const links = JSON.parse(localStorage.getItem("links") || "[]");
    setCarouselLinks(links);
    links.forEach((link) => generateCarouselId());
  }, [generateCarouselId]);

  return (
    <div className="px-5 pt-5 pb-10 flex flex-col gap-y-5">
      {carouselLinks.map((link, index) => (
        <div
          key={`carousel${carouselIds[index]}`}
          className="flex justify-center"
        >
          <Carousel
            handleRemoveCarousel={() =>
              setCarouselIds(
                carouselIds.filter((x) => x !== carouselIds[index])
              )
            }
            handleSuccessfulLink={addNewLink}
            channelUrl={link}
          />
        </div>
      ))}
      <button
        className="mt-5 max-w-1/12 text-center bg-blue-500! hover:cursor-pointer hover:bg-blue-700! text-white rounded"
        onClick={generateCarouselId}
      >
        + New RSS Feed
      </button>
    </div>
  );
}
