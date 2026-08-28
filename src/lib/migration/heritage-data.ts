import type { Publication, SourceReference } from "@/lib/types";
import { publications } from "@/lib/site-data";

export interface HeritageRecord {
  id: string;
  slug: string;
  kind: "person" | "history" | "publication" | "channel";
  titleGu: string;
  descriptionGu: string;
  source: SourceReference;
  relatedPublicationSlug?: string;
}

const legacyHome = "https://omshreemadhavanandji.org/home.php";

export const heritageRecords: HeritageRecord[] = [
  {
    id: "madhavanandji-founder-history",
    slug: "madhavanandji-founder-history",
    kind: "person",
    titleGu: "શ્રી માધવાનંદજી મહારાજ",
    descriptionGu: "જાહેર વારસા વર્ણન પરંપરાના મૂળને શ્રી માધવાનંદજી મહારાજ સાથે જોડે છે અને બાળવયના વૈરાગ્ય તથા કાશીના વેદ-ઉપનિષદ અધ્યયનનો ઉલ્લેખ કરે છે.",
    source: { sourceSite: "legacy", sourceUrl: legacyHome, sourceLabel: "Legacy organization history", status: "verified-legacy", reviewRequired: true },
  },
  {
    id: "madhavanand-parampara-history",
    slug: "madhavanand-parampara-history",
    kind: "history",
    titleGu: "આશરે બે સદીનો જાહેર ઉલ્લેખ",
    descriptionGu: "ઉપલબ્ધ જાહેર નોંધ પરંપરાને આશરે બે સદી જૂની સામાજિક-આધ્યાત્મિક પરંપરા તરીકે વર્ણવે છે.",
    source: { sourceSite: "legacy", sourceUrl: legacyHome, sourceLabel: "Legacy organization history", status: "verified-legacy", reviewRequired: true },
  },
  {
    id: "official-youtube-channel",
    slug: "official-youtube-channel",
    kind: "channel",
    titleGu: "અધિકૃત સત્સંગ ચેનલ",
    descriptionGu: "સત્સંગ અને પ્રવચન માટે રિપોઝિટરીમાં નોંધાયેલ સંસ્થાકીય YouTube પ્રવેશ.",
    source: { sourceSite: "repository", sourceUrl: "https://www.youtube.com/@SachchidanandMadhavanand/", sourceLabel: "Repository owner-supplied channel", status: "review-required", reviewRequired: true },
  },
];

export const heritagePublications: Array<Publication & { source: SourceReference }> = publications.map((publication) => ({
  ...publication,
  source: {
    sourceSite: "legacy",
    sourceUrl: publication.pdfUrl ?? legacyHome,
    sourceLabel: "Legacy Veda Rahasya archive",
    status: "verified-legacy",
    reviewRequired: true,
  },
}));
