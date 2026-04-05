import { getCollection } from "astro:content";

export async function GET() {
  const posts = (await getCollection("posts", ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
    .map((post) => ({
      slug: post.id,
      title: post.data.title,
      subtitle: post.data.subtitle ?? "",
      summary: post.data.summary ?? "",
      tags: post.data.tags,
      date: post.data.date.toISOString().slice(0, 10),
    }));

  return new Response(JSON.stringify(posts), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
