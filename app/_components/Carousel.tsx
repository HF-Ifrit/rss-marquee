"use client";
import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { Channel } from "../_interface/rss";
import CarouselCard from "./CarouselCard";
import { PauseIcon } from "./PauseIcon";
import { ResumeIcon } from "./ResumeIcon";

export interface CarouselProps {
  channelUrl?: string;
  handleRemoveCarousel: () => void;
  handleSuccessfulLink: (link: string) => void;
}

export default function Carousel({
  channelUrl = "",
  handleRemoveCarousel,
  handleSuccessfulLink,
}: CarouselProps) {
  const [channel, setChannel] = useState<Channel | null>(null);
  const [rssUrl, setRssUrl] = useState<string | null>(channelUrl);
  const [debouncedRssUrl, setDebouncedRssUrl] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [paused, setPaused] = useState<boolean>(false);
  const [error, setError] = useState<{ message: string } | null>(null);
  const handleChangeUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRssUrl(event.target.value);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedRssUrl(rssUrl);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [rssUrl]);

  useEffect(() => {
    if (debouncedRssUrl) {
      console.log("Attempting to fetch RSS feed");
      setIsFetching(true);
      setError(null);
      fetch("http://localhost:3000/api?query=" + debouncedRssUrl)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch RSS feed");
          if (res.ok) {
            setIsFetching(false);
            setError(null);
            res.json().then(
              (channel: Channel) => {
                console.log(`Found channel: ${channel}`);
                setIsFetching(false);
                setChannel(channel);
                handleSuccessfulLink(channel.link);
              },
              (err) => {
                setError(err);
              }
            );
          }
        })
        .catch((err) => {
          setIsFetching(false);
          setError(err);
        });
    }
  }, [debouncedRssUrl, handleSuccessfulLink]);

  if (!channel)
    return (
      <div
        id="initialFeedEntry"
        className="flex flex-row gap-x-2 justify-between border p-10 rounded-full"
      >
        <input
          className="border-b"
          type="text"
          placeholder="Enter RSS URL"
          onChange={handleChangeUrl}
        />
        {error && (
          <p className="p-2 border-2 rounded-sm bg-orange-950/50 text-red-500">
            {error.message}
          </p>
        )}
        {isFetching && (
          <div className="w-10 h-10 rounded-full border-4 border-gray-600 border-t-blue-500 animate-spin"></div>
        )}
      </div>
    );

  return (
    <div
      id="carousel"
      className="border rounded-md border-foreground h-[850px] w-full p-5 flex flex-col gap-y-5"
    >
      <div className="my-3 bg-background rounded-lg shadow-md">
        <div id="header" className="mb-5 flex flex-row gap-x-5 items-center">
          <button
            className="transition-colors hover:text-white text-4xl text-red-500 font-bold hover:cursor-pointer"
            onClick={handleRemoveCarousel}
          >
            x
          </button>
          <div className="flex flex-col place-items-start">
            <p className="text-3xl font-bold">{channel.title}</p>
            <p className="italic">{channel.description}</p>
          </div>
        </div>
        <button
          onClick={() => setPaused(!paused)}
          className="p-2 transition rounded-full hover:bg-gray-800"
        >
          {paused ? <ResumeIcon /> : <PauseIcon />}
        </button>
        <Marquee
          autoFill
          pauseOnHover
          play={!paused}
          className="min-h-[500px] [&_rtm-initial-child-container]:[align-items:stretch] [&_div.rtm-marquee]:[align-items-stretch] [&>*]:[align-items-stretch]"
        >
          {channel.publications.map((item) => (
            <CarouselCard key={item.guid} item={item} />
          ))}
        </Marquee>
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
