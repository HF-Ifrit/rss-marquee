import useSWR from "swr";
import { Channel } from "../_interface/rss";

const fetcher = (url: string) =>
  fetch(url)
    .then((res) => res.json())
    .catch((err) => console.error("Failed to fetch channel:", err));

export default function useChannel(url: string) {
  const { data: channel, error } = useSWR<Channel>(
    `http://localhost:3000/api?query=${url}`,
    fetcher,
  );
  return { channel, error };
}
