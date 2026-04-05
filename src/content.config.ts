import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

function normalizeSlug(value: string) {
  return value
    .trim()
    .replace(/\\/g, "/")
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9+/ -]/g, "")
    .replace(/\s+/g, "-");
}

const posts = defineCollection({
  loader: glob({
    base: "./src/content/posts",
    pattern: "**/*.md",
    generateId: ({ entry, data }) => normalizeSlug(typeof data.slug === "string" ? data.slug : entry),
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    subtitle: z.string().optional(),
    summary: z.string().optional(),
    draft: z.boolean().optional(),
    slug: z.string().optional(),
    updated: z.coerce.date().optional(),
  }),
});

export const collections = { posts };
