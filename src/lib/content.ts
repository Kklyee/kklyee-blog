import { getCollection, type CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"posts">;
export type Series = CollectionEntry<"series">;

export async function getPublishedPosts() {
  const posts = await getCollection("posts", ({ data }) => !data.draft);
  return posts.sort(
    (a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf(),
  );
}

export async function getSeriesMap() {
  const entries = await getCollection("series");
  return new Map(entries.map((entry) => [entry.id, entry]));
}

export function postsInSeries(posts: Post[], seriesId: string) {
  return posts
    .filter((post) => post.data.series === seriesId)
    .sort((a, b) => (a.data.seriesOrder ?? 999) - (b.data.seriesOrder ?? 999));
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}
