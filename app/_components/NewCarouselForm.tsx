import { useEffect, useState } from "react";
import { Channel } from "../_interface/rss";

interface NewCarouselFormProps {
  id: number;
  handleSuccessfulLink: (id: number, channel: Channel, url: string) => void;
}
export const NewCarouselForm = ({
  id,
  handleSuccessfulLink,
}: NewCarouselFormProps) => {
  const [rssUrl, setRssUrl] = useState<string | null>("");
  const [debouncedRssUrl, setDebouncedRssUrl] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
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
      setIsFetching(true);
      setError(null);
      fetch(`http://localhost:3000/api?query=${debouncedRssUrl}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch RSS feed");
          if (res.ok) {
            setIsFetching(false);
            setError(null);
            res.json().then(
              (channel: Channel) => {
                console.log(`Found channel: ${channel}`);
                handleSuccessfulLink(id, channel, debouncedRssUrl);
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
  }, [debouncedRssUrl, handleSuccessfulLink, id]);

  return (
    <div
      id="initialFeedEntry"
      className="flex flex-row gap-x-2 justify-between border p-10 rounded-full"
    >
      <input
        className="border-b"
        type="text"
        placeholder="Enter RSS URL..."
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
};
