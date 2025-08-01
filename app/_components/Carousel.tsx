"use client";
import { useState } from "react";
import Marquee from "react-fast-marquee";
import { Channel } from "../_interface/rss";
import CarouselCard from "./CarouselCard";
import { MinimizeIcon } from "./CollapseIcon";
import { MaximizeIcon } from "./ExpandIcon";
import { PauseIcon } from "./PauseIcon";
import { ResumeIcon } from "./ResumeIcon";

export interface CarouselProps {
  channel: Channel;
  handleRemoveCarousel: () => void;
}

export default function Carousel({
  channel,
  handleRemoveCarousel,
}: CarouselProps) {
  const [paused, setPaused] = useState<boolean>(false);
  const [minimized, setMinimized] = useState<boolean>(false);

  const handleMinimize = () => {
    setMinimized(!minimized);
  };

  return (
    <div
      id="carousel"
      className={`border rounded-md border-foreground transition ${
        !minimized ? "h-[850px]" : ""
      } w-full p-5 flex flex-col gap-y-5`}
    >
      <div className="my-3 bg-background rounded-lg shadow-md">
        <div
          id="header"
          className="mb-5 w-full flex flex-row gap-x-5 items-center"
        >
          <button
            className="rounded-full px-4 py-2 transition-colors hover:text-white text-3xl text-red-500 font-bold hover:bg-red-800 hover:cursor-pointer"
            onClick={handleRemoveCarousel}
          >
            x
          </button>
          <div className="flex flex-col place-items-start">
            <p className="text-3xl font-bold">{channel.title}</p>
            <p className="italic">{channel.description}</p>
          </div>
          <button
            className="ml-auto p-4 transition rounded-full hover:bg-gray-800"
            onClick={handleMinimize}
          >
            {minimized ? <MaximizeIcon /> : <MinimizeIcon />}
          </button>
        </div>
        {!minimized && (
          <>
            <button
              onClick={() => setPaused(!paused)}
              className="flex p-2 mb-2 transition rounded-full hover:bg-gray-800"
            >
              {paused ? <ResumeIcon /> : <PauseIcon />}
            </button>
            <Marquee
              autoFill
              pauseOnHover
              play={!paused}
              className="min-h-[500px] [&_div.rfm-initial-child-container]:items-stretch! [&_div.rfm-marquee]:items-stretch!"
            >
              {channel.publications.map((item) => (
                <CarouselCard key={item.guid} item={item} />
              ))}
            </Marquee>
          </>
        )}
      </div>
    </div>
  );
}
{
  /* <div className="relative overflow-hidden w-full h-full flex flex-row justify-evenly hover:*:pause">
        {channel.publications.map((item, i) => (
          <div
            key={item.guid}
            style={{
              animationDelay: `${
                (25 / channel.publications.length) *
                (channel.publications.length - (i + 1)) *
                -1
              }s`,
            }}
            className={`absolute left-[105%] w-10 h-20 m-5 animate-scroll-card hover:pause`}
          >
            <CarouselCard item={item} />
          </div>
        ))}
      </div> */
}
