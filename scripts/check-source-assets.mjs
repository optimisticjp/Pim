#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";

const crawl = JSON.parse(await readFile("src/data/source-crawl.json", "utf8"));
const candidates = [...new Set(crawl.pages.flatMap((page) => [...page.pdfs, ...page.audio, ...page.videos]))];
const results = [];
async function check(url) {
  try {
    const response = await fetch(url, { method: "HEAD", redirect: "follow", signal: AbortSignal.timeout(20000), headers: { "user-agent": "MadhavanandAssetChecker/1.0" } });
    const contentType = response.headers.get("content-type") || "";
    results.push({ url, ok: response.ok && !contentType.includes("text/html"), status: response.status, contentType, size: Number(response.headers.get("content-length")) || null });
  } catch (error) { results.push({ url, ok: false, error: error instanceof Error ? error.message : String(error) }); }
}
for (let index = 0; index < candidates.length; index += 5) await Promise.all(candidates.slice(index, index + 5).map(check));
await writeFile("src/data/source-assets-check.json", `${JSON.stringify({ checkedAt: new Date().toISOString(), summary: { checked: results.length, valid: results.filter((item) => item.ok).length, invalid: results.filter((item) => !item.ok).length }, results }, null, 2)}\n`);
console.log(JSON.stringify({ checked: results.length, valid: results.filter((item) => item.ok).length, invalid: results.filter((item) => !item.ok).length }, null, 2));
process.exitCode = results.some((item) => !item.ok) ? 2 : 0;
