#!/usr/bin/env node

/** Bounded, dependency-free crawler for the two approved organizational hosts. */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
const execFileAsync = promisify(execFile);

const allowedHosts = new Set(["omshreemadhavanandji.org", "www.omshreemadhavanandji.org", "sachchidanandmadhavanand.org", "www.sachchidanandmadhavanand.org"]);
const seeds = ["https://sachchidanandmadhavanand.org/", "https://omshreemadhavanandji.org/home.php"];
const output = resolve(process.argv.find((arg) => arg.startsWith("--output="))?.slice(9) || "src/data/source-crawl.json");
const maxPages = Number(process.argv.find((arg) => arg.startsWith("--max-pages="))?.slice(12) || 500);
const concurrency = Math.min(6, Math.max(1, Number(process.argv.find((arg) => arg.startsWith("--concurrency="))?.slice(14) || 4)));

function normalize(raw, base) {
  try {
    const url = new URL(raw.replaceAll("&amp;", "&"), base);
    if (!allowedHosts.has(url.hostname) || !["http:", "https:"].includes(url.protocol)) return null;
    url.hash = "";
    url.hostname = url.hostname.replace(/^www\./, "");
    url.protocol = "https:";
    [...url.searchParams.keys()].filter((key) => /^(utm_|fbclid|gclid)/i.test(key)).forEach((key) => url.searchParams.delete(key));
    return url.href.replace(/\/$/, url.pathname === "/" ? "/" : "");
  } catch { return null; }
}

const unique = (items) => [...new Set(items.filter(Boolean))].sort();
const attrUrls = (html, base) => [...html.matchAll(/(?:href|src|data-src|data-lazy-src)\s*=\s*["']([^"'#]+)["']/gi)].map((m) => normalize(m[1].trim(), base));
const youtubeUrls = (html) => unique([...html.matchAll(/https?:\\?\/\\?\/(?:www\.)?(?:youtube\.com|youtu\.be)\/[A-Za-z0-9_?&=\-./%]+/gi)].map((m) => m[0].replaceAll("\\/", "/").replace(/["'<>)]+$/, "")));
const isAsset = (url, extensions) => new RegExp(`\\.(?:${extensions})(?:$|\\?)`, "i").test(url);
const cleanText = (value = "") => value.replace(/<[^>]+>/g, " ").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();

const queues = new Map(seeds.map((seed) => [new URL(seed).hostname.replace(/^www\./, ""), [seed]]));
const seen = new Set();
const attempts = new Map();
const pages = [];
const failures = [];

async function crawl(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);
  try {
    const marker = "\n__CRAWL_META__";
    const { stdout } = await execFileAsync("curl", ["-fsSL", "--max-time", "20", "-A", "MadhavanandContentCrawler/2.0", "-w", `${marker}%{http_code}|%{content_type}|%{url_effective}`, url], { maxBuffer: 20 * 1024 * 1024 });
    const split = stdout.lastIndexOf(marker);
    const [status, responseType, effectiveUrl] = stdout.slice(split + marker.length).split("|");
    const responseBody = stdout.slice(0, split);
    const response = { ok: Number(status) >= 200 && Number(status) < 400, status: Number(status), url: effectiveUrl, headers: { get: (name) => name === "content-type" ? responseType : null }, text: async () => responseBody };
    const contentType = response.headers.get("content-type") || "";
    if (!response.ok || !contentType.includes("text/html")) {
      failures.push({ pageUrl: url, status: response.status, contentType }); return;
    }
    const html = await response.text();
    const finalUrl = normalize(response.url, url) || url;
    const links = unique(attrUrls(html, finalUrl));
    const images = links.filter((item) => isAsset(item, "avif|gif|jpe?g|png|svg|webp"));
    const pdfs = links.filter((item) => isAsset(item, "pdf"));
    const audio = links.filter((item) => isAsset(item, "aac|m4a|mp3|ogg|wav"));
    const internalLinks = links.filter((item) => !isAsset(item, "avif|gif|jpe?g|png|svg|webp|pdf|aac|m4a|mp3|ogg|wav|mp4|webm|zip|css|js|ico|woff2?|ttf|eot"));
    pages.push({ pageUrl: finalUrl, title: cleanText(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]) || null, sourceSite: new URL(finalUrl).hostname.includes("sachchidanandmadhavanand") ? "current" : "legacy", status: response.status, images, pdfs, audio, videos: youtubeUrls(html), internalLinks });
    const host = new URL(finalUrl).hostname;
    const queue = queues.get(host) || [];
    for (const link of internalLinks) if (!seen.has(link) && queue.length < maxPages * 2) queue.push(link);
    queues.set(host, queue);
  } catch (error) { failures.push({ pageUrl: url, error: error instanceof Error ? error.message : String(error) }); }
  finally { clearTimeout(timer); }
}

async function worker(host) {
  const queue = queues.get(host);
  while (queue && (attempts.get(host) || 0) < maxPages) {
    const url = queue.shift();
    if (!url || seen.has(url)) continue;
    seen.add(url);
    attempts.set(host, (attempts.get(host) || 0) + 1);
    await crawl(url);
  }
}

await Promise.all([...queues.keys()].flatMap((host) => Array.from({ length: concurrency }, () => worker(host))));
pages.sort((a, b) => a.pageUrl.localeCompare(b.pageUrl));
const manifest = { generatedAt: new Date().toISOString(), allowedHosts: [...allowedHosts], limits: { maxPagesPerDomain: maxPages, concurrency, timeoutMs: 10000 }, summary: { pages: pages.length, currentPages: pages.filter((p) => p.sourceSite === "current").length, legacyPages: pages.filter((p) => p.sourceSite === "legacy").length, images: unique(pages.flatMap((p) => p.images)).length, pdfs: unique(pages.flatMap((p) => p.pdfs)).length, audio: unique(pages.flatMap((p) => p.audio)).length, videos: unique(pages.flatMap((p) => p.videos)).length, failures: failures.length }, pages, failures };
await mkdir(dirname(output), { recursive: true });
await writeFile(output, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify({ output, ...manifest.summary }, null, 2));
if (!pages.length) process.exitCode = 1;
