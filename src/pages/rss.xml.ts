import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const posts = (await getCollection("posts", ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: "ysmiles",
    description: "Personal writing on software, life, music, and other interests.",
    site: context.site ?? "https://ysmiles.com",
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.summary ?? post.data.subtitle ?? post.data.title,
      pubDate: post.data.date,
      link: `/posts/${post.id}/`,
    })),
  });
}
