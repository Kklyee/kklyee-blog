import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const layout = await readFile("src/layouts/BaseLayout.astro", "utf8");
const articleLayout = await readFile("src/layouts/ArticleLayout.astro", "utf8");
const styles = await readFile("src/styles/global.css", "utf8");

assert.match(layout, /astro:after-swap/, "page navigation must handle Astro scroll restoration");
assert.match(layout, /astro:before-preparation/, "page navigation must disable smooth scrolling before preparation");
assert.match(layout, /scrollBehavior\s*=\s*["']auto["']/, "page navigation must disable smooth scrolling before scroll restoration");
assert.match(layout, /behavior:\s*["']instant["']/, "page navigation scroll restoration must be instant");
assert.match(layout, /location\.hash/, "hash navigation must remain separate from forced page-top restoration");
assert.doesNotMatch(styles, /html\s*\{[\s\S]*?scroll-behavior:\s*smooth\s*;/, "page navigation must not inherit smooth scroll behavior");
assert.match(layout, /<html[^>]*transition:animate=/, "page fade must be attached to the viewport root");
assert.doesNotMatch(layout, /<main[^>]*transition:animate=/, "the scrolling main element must not interpolate between pages");
assert.doesNotMatch(articleLayout, /transition:name="article-content"/, "the full article must not interpolate from its old scroll position");
assert.doesNotMatch(styles, /view-transition-(?:old|new)\(article-content\)/, "article-level view transition styles must be removed");

console.log("Scroll navigation output passed");
