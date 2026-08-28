import type { Publication, SourceReference } from "@/lib/types";

export const vedaRahasyaIndexUrl = "https://omshreemadhavanandji.org/publication_vedarahasya.php";
export const vedaRahasyaSource: SourceReference = { sourceSite: "legacy", sourceUrl: vedaRahasyaIndexUrl, sourceLabel: "Legacy Veda Rahasya index", status: "source-derived", reviewRequired: true };

const months = [
  ["January", "જાન્યુઆરી"], ["February", "ફેબ્રુઆરી"], ["March", "માર્ચ"], ["April", "એપ્રિલ"],
  ["May", "મે"], ["June", "જૂન"], ["July", "જુલાઈ"], ["August", "ઑગસ્ટ"],
  ["September", "સપ્ટેમ્બર"], ["October", "ઑક્ટોબર"], ["November", "નવેમ્બર"], ["December", "ડિસેમ્બર"],
] as const;

const ranges = [{ year: 2014, from: 6, to: 11 }, { year: 2015, from: 0, to: 11 }, { year: 2016, from: 0, to: 11 }, { year: 2017, from: 0, to: 11 }, { year: 2018, from: 0, to: 3 }];

export const legacyVedaRahasyaIssues: Publication[] = ranges.flatMap(({ year, from, to }) =>
  months.slice(from, to + 1).map(([monthEn, monthGu]) => ({
    id: `veda-rahasya-${monthEn.toLowerCase()}-${year}`,
    slug: `veda-rahasya-${monthEn.toLowerCase()}-${year}`,
    kind: "veda-rahasya" as const,
    titleGu: "વેદ રહસ્ય",
    editionGu: `${monthGu} ${year} અંક`,
    monthGu,
    year,
    pdfUrl: `https://omshreemadhavanandji.org/content/pub_vedarahasya/Ved-Rahasya-${monthEn}-${year}.pdf`,
    sourceUrl: vedaRahasyaIndexUrl,
    verified: true,
  })),
).sort((a, b) => (b.year ?? 0) - (a.year ?? 0) || months.findIndex(([, gu]) => gu === b.monthGu) - months.findIndex(([, gu]) => gu === a.monthGu));
