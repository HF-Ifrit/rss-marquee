import { NextRequest } from "next/server";
import RSSParser from "../rssParser";

export async function GET(request: NextRequest) {
  const searchParams = await request.nextUrl.searchParams;
  const urlString = searchParams.get("query");
  if (!urlString) return new Response("No query provided", { status: 400 });
  if (!URL.canParse(urlString))
    return new Response("Invalid URL", { status: 400 });

  let response;
  try {
    response = await fetch(urlString);
  } catch (error) {
    if (error instanceof TypeError)
      return new Response(error.message, { status: 400 });
    return new Response("Error occurred while fetching feed at url", {
      status: 500,
    });
  }

  if (!response.ok)
    return new Response("Failed to fetch RSS feed", {
      status: response.status,
    });
  const text = await response.text();
  const rssParser = new RSSParser(text, response.headers.get("content-type")!);
  const channel = rssParser.parse();

  return Response.json(channel);
}
