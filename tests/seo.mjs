import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const dist = fileURLToPath(new URL("../dist/", import.meta.url));

async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? htmlFiles(path) : entry.name.endsWith(".html") ? [path] : [];
    }),
  );

  return nested.flat();
}

for (const file of await htmlFiles(dist)) {
  const html = await readFile(file, "utf8");
  const canonical = html.match(/<link rel="canonical" href="([^"]+)">/);
  const description = html.match(/<meta name="description" content="([^"]+)">/);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)];

  assert.ok(canonical?.[1].startsWith("https://kklyee.top/"), `${file}: canonical missing`);
  assert.ok(description?.[1].trim(), `${file}: description missing`);
  assert.ok(html.includes('<meta property="og:url"'), `${file}: Open Graph URL missing`);
  assert.ok(schemas.length > 0, `${file}: JSON-LD missing`);
  schemas.forEach((match) => JSON.parse(match[1]));
}

const robots = await readFile(join(dist, "robots.txt"), "utf8");
assert.match(robots, /Sitemap: https:\/\/kklyee\.top\/sitemap-index\.xml/);
await readFile(join(dist, "sitemap-index.xml"), "utf8");
await readFile(join(dist, "llms.txt"), "utf8");

const home = await readFile(join(dist, "index.html"), "utf8");
assert.match(home, /<link rel="icon" href="\/brand\/favicon\.svg"/);
const favicon = await readFile(join(dist, "brand", "favicon.svg"), "utf8");
assert.match(favicon, /viewBox="0 0 112 112"/);

console.log("SEO output test passed");
