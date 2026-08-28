import crawl from "@/data/source-crawl.json";

export interface HistoricalLetter { id: string; slug: string; titleGu: string; descriptionGu?: string; scanImages: string[]; sourceUrl: string }
const sourceUrl = "https://sachchidanandmadhavanand.org/about-us/historical-letters";
const page = crawl.pages.find((item) => item.pageUrl === sourceUrl);
const scans = (page?.images ?? []).filter((src) => /\/letter_[^/]+\.jpe?g$/i.test(src) && !/-\d+x\d+\./.test(src));
const groups = [
  ["01", /letter_01_/], ["02", /letter_(?:02|202)_/], ["03", /letter_03_/], ["04", /letter_04_/], ["05", /letter_05_/],
  ["06", /letter_06_/], ["07", /letter_07_/], ["08", /letter_08_/], ["09", /letter_09_/], ["10", /letter_10\./],
] as const;
export const historicalLetters: HistoricalLetter[] = groups.flatMap(([number, pattern]) => {
  const scanImages = scans.filter((src) => pattern.test(src));
  return scanImages.length ? [{ id: `historical-letter-${number}`, slug: `historical-letter-${number}`, titleGu: `ઐતિહાસિક પત્ર ${Number(number)}`, descriptionGu: "માધવાનંદ પરિવાર માટે સંરક્ષિત પત્રની ઉપલબ્ધ પ્રતિ.", scanImages, sourceUrl }] : [];
});
