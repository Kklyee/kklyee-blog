import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const files = [
  "src/components/posts/PostList.astro",
  "src/pages/collections/[id].astro",
  "src/layouts/ArticleLayout.astro",
];

for (const file of files) {
  const source = await readFile(file, "utf8");
  assert.doesNotMatch(
    source,
    /transition:name={`post-title-/,
    `${file} must not create a shared transition for post titles`,
  );
}

const articleLayout = await readFile("src/layouts/ArticleLayout.astro", "utf8");
assert.doesNotMatch(
  articleLayout,
  /series-navigation__link[^>]*data-astro-reload/,
  "previous and next article links must keep their existing client navigation",
);

console.log("Post title transition output passed");
