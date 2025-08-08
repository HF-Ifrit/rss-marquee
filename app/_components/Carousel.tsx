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
  const [refreshEnabled, setRefreshEnabled] = useState<boolean>(false);

  const handleMinimize = () => {
    setMinimized(!minimized);
  };

  const handleRefreshClicked = () => {
    setRefreshEnabled(!refreshEnabled);
  };

  return (
    <div
      id="carousel"
      className={`border-foreground rounded-xl border transition ${
        !minimized ? "h-[850px]" : ""
      } flex w-full flex-col gap-y-5 p-5`}
    >
      <div className="bg-background my-3 rounded-lg shadow-md">
        <div
          id="header"
          className="mb-5 flex w-full flex-row items-center gap-x-5"
        >
          <button
            className="rounded-full px-4 py-2 text-3xl font-bold text-red-500 transition-colors hover:cursor-pointer hover:bg-red-800 hover:text-white"
            onClick={handleRemoveCarousel}
          >
            x
          </button>
          <div className="flex flex-col place-items-start">
            <p className="text-3xl font-bold">{channel.title}</p>
            <p className="italic">{channel.description}</p>
          </div>
          <button
            className="ml-auto rounded-full p-4 transition hover:bg-gray-800"
            onClick={handleMinimize}
          >
            {minimized ? <MaximizeIcon /> : <MinimizeIcon />}
          </button>
        </div>
        {!minimized && (
          <>
            <div className="mb-2 flex flex-row items-center align-middle">
              <button
                onClick={() => setPaused(!paused)}
                className="flex rounded-full p-2 transition hover:bg-gray-800"
              >
                {paused ? <ResumeIcon /> : <PauseIcon />}
              </button>
              <button
                className={`${refreshEnabled ? "refreshEnabled" : "refreshDisabled"} h-8 w-8 rounded-full`}
                onClick={handleRefreshClicked}
              ></button>
            </div>

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
