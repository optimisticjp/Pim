#!/usr/bin/env node
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readFile, writeFile } from "node:fs/promises";
const execFileAsync = promisify(execFile);

const crawl = JSON.parse(await readFile("src/data/source-crawl.json", "utf8"));
const candidates = [...new Set(crawl.pages.flatMap((page) => [...page.pdfs, ...page.audio, ...page.videos]))].sort();
const results = [];

async function check(url) {
  const kind = /(?:youtube\.com|youtu\.be)/i.test(url) ? "youtube" : /\.(?:mp3|m4a|wav|ogg)(?:$|\?)/i.test(url) ? "audio" : "pdf";
  try {
    const marker = "__ASSET_META__";
    const { stdout } = await execFileAsync("curl", ["-sSL", "--max-time", "25", "--range", "0-0", "-o", "/dev/null", "-A", "MadhavanandAssetChecker/2.0", "-w", `${marker}%{http_code}|%{content_type}|%{size_download}|%{url_effective}`, url]);
    const [statusValue, contentType = "", sizeValue, finalUrl] = stdout.slice(stdout.lastIndexOf(marker) + marker.length).split("|");
    const status = Number(statusValue);
    const expectedType = kind === "youtube" || (kind === "pdf" ? /(?:pdf|octet-stream)/i.test(contentType) : /(?:audio|octet-stream)/i.test(contentType));
    results.push({ url, finalUrl, kind, ok: status >= 200 && status < 400 && expectedType, status, contentType, size: Number(sizeValue) || null });
  } catch (error) {
    results.push({ url, kind, ok: false, error: error instanceof Error ? error.message : String(error) });
  }
}

for (let index = 0; index < candidates.length; index += 5) await Promise.all(candidates.slice(index, index + 5).map(check));
results.sort((a, b) => a.url.localeCompare(b.url));
const summary = {
  checked: results.length,
  valid: results.filter((item) => item.ok).length,
  invalid: results.filter((item) => !item.ok).length,
  pdfs: results.filter((item) => item.kind === "pdf").length,
  audio: results.filter((item) => item.kind === "audio").length,
  youtube: results.filter((item) => item.kind === "youtube").length,
};
await writeFile("src/data/source-assets-check.json", `${JSON.stringify({ checkedAt: new Date().toISOString(), summary, results }, null, 2)}\n`);
console.log(JSON.stringify(summary, null, 2));
if (summary.invalid) process.exitCode = 2;
