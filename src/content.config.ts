import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const posts = defineCollection({
  loader: glob({ base: "./src/content/posts", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    series: z.string().optional(),
    seriesOrder: z.number().int().positive().optional(),
    cover: z.string().optional(),
  }),
});

const series = defineCollection({
  loader: glob({ base: "./src/content/series", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    status: z.enum(["planning", "writing", "complete"]).default("writing"),
    updatedAt: z.coerce.date(),
  }),
});

export const collections = { posts, series };
