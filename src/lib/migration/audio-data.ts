import crawl from "@/data/source-crawl.json";
export interface DevotionalAudio { id: string; title: string; categoryGu: "ભજન અને આરતી"; audioUrl: string; sourceUrl: string; format: "mp3" | "wav" }
const currentAudio = [...new Set(crawl.pages.filter((page) => page.sourceSite === "legacy").flatMap((page) => page.audio))]
  .filter((url) => !/[?&]_=/i.test(url));
export const devotionalAudio: DevotionalAudio[] = currentAudio.map((audioUrl) => {
  const file = decodeURIComponent(new URL(audioUrl).pathname.split("/").pop() ?? "audio");
  const format = file.toLowerCase().endsWith(".wav") ? "wav" as const : "mp3" as const;
  return { id: `audio-${file.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-")}`, title: file.replace(/\.[^.]+$/, "").replaceAll("-", " "), categoryGu: "ભજન અને આરતી", audioUrl, sourceUrl: "https://omshreemadhavanandji.org/download_mringtone.php", format };
});
