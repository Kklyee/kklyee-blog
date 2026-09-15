import { getCollection, type CollectionEntry } from "astro:content";
import type { Locale } from "./i18n";

export type Post = CollectionEntry<"posts">;
export type Series = CollectionEntry<"series">;

export async function getPublishedPosts() {
  const posts = await getCollection("posts", ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
}

export async function getSeriesMap() {
  const entries = await getCollection("series");
  return new Map(entries.map((entry) => [entry.id.toLowerCase(), entry]));
}

/**
 * Nested post paths are the source of truth for a post's series. The
 * frontmatter fallback keeps older top-level posts working while they are
 * being migrated.
 */
export function postSeriesId(post: Post) {
  const [seriesId] = post.id.split("/");
  return post.id.includes("/") ? seriesId : post.data.series;
}

/**
 * Numbered filenames (for example, `01-llm.md`) define the order within a
 * series. An explicit frontmatter value remains a fallback for legacy posts.
 */
export function postSeriesOrder(post: Post) {
  const filename = post.id.split("/").at(-1) ?? "";
  const orderMatch = filename.match(/^(\d+)(?:-|$)/);

  return orderMatch ? Number(orderMatch[1]) : post.data.seriesOrder;
}

export function postsInSeries(posts: Post[], seriesId: string) {
  return posts
    .filter((post) => postSeriesId(post) === seriesId)
    .sort((a, b) => {
      const orderDifference =
        (postSeriesOrder(a) ?? Number.POSITIVE_INFINITY) -
        (postSeriesOrder(b) ?? Number.POSITIVE_INFINITY);

      return orderDifference || b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf();
    });
}

export function formatDate(date: Date, locale: Locale = "zh-cn") {
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}
