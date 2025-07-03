import { cookies } from "next/headers";

export async function setLinks(links: string[]) {
  (await cookies()).set("carouselLinks", JSON.stringify(links));
}

export async function getLinks(): Promise<string[]> {
  const cookieStore = await cookies();
  const links = cookieStore.get("carouselLinks");
  return links ? JSON.parse(links.value) : [];
}
