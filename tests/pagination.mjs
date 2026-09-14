import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile("dist/index.html", "utf8");
const styles = await readFile("src/styles/global.css", "utf8");
const rows = [...html.matchAll(/<li class="post-row"[\s\S]*?<\/li>/g)].map(([row]) => row);
const pagination = html.match(
  /<nav class="floating-pagination"[^>]*data-page-size="(\d+)"[^>]*data-total-pages="(\d+)"/,
);

assert.ok(pagination, "pagination metadata is missing");

const pageSize = Number(pagination[1]);
const totalPages = Number(pagination[2]);
const hiddenRows = rows.filter((row) => /<li class="post-row"[^>]*\shidden(?:=|\s|>)/.test(row));

assert.ok(rows.length > pageSize, "fixture must contain more posts than one page");
assert.equal(rows.length - hiddenRows.length, pageSize, "the first page must expose only pageSize rows");
assert.equal(totalPages, Math.ceil(rows.length / pageSize), "total page count is incorrect");
assert.match(
  styles,
  /\.post-row\[hidden\]\s*\{[\s\S]*?display:\s*none(?:\s*!important)?\s*;/,
  "post rows with the hidden attribute must stay hidden despite the grid display rule",
);

console.log(`Pagination output passed: ${rows.length} posts, ${pageSize} per page, ${totalPages} pages`);
