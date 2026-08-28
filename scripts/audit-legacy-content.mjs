#!/usr/bin/env node

const allowedHosts = new Set(["omshreemadhavanandji.org", "www.omshreemadhavanandji.org", "sachchidanandmadhavanand.org", "www.sachchidanandmadhavanand.org"]);
const seeds = process.argv.slice(2).length ? process.argv.slice(2) : ["https://omshreemadhavanandji.org/home.php", "https://sachchidanandmadhavanand.org/"];

for (const value of seeds) {
  const url = new URL(value);
  if (!allowedHosts.has(url.hostname)) throw new Error(`Host is outside the migration allowlist: ${url.hostname}`);
  try {
    const response = await fetch(url, { redirect: "follow", headers: { "user-agent": "Madhavanand heritage audit/1.0" }, signal: AbortSignal.timeout(20000) });
    const body = await response.text();
    const links = [...body.matchAll(/(?:href|src)=["']([^"']+)["']/gi)].map((match) => {
      try { return new URL(match[1], response.url).href; } catch { return null; }
    }).filter(Boolean).filter((link) => allowedHosts.has(new URL(link).hostname));
    const assets = links.filter((link) => /\.(?:avif|jpe?g|png|webp|pdf|mp3|m4a|wav)(?:\?|$)/i.test(link));
    console.log(JSON.stringify({ seed: value, finalUrl: response.url, status: response.status, internalLinks: [...new Set(links)], assets: [...new Set(assets)] }, null, 2));
  } catch (error) {
    console.error(JSON.stringify({ seed: value, error: error instanceof Error ? error.message : String(error) }));
    process.exitCode = 1;
  }
}
