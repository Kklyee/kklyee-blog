import rss from "@astrojs/rss";
import { getPublishedPosts } from "../lib/content";

export async function GET(context) {
  const posts = await getPublishedPosts();
  return rss({
    title: "Kklyee.top",
    description: "写代码，也记录技术背后的判断与取舍。",
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishedAt,
      link: `/posts/${post.id}/`,
    })),
  });
}
