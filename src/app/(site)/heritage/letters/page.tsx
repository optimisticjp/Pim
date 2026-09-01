import type { Metadata } from "next";
import { ExternalLink, ScrollText } from "lucide-react";

import { getPublicHeritageDocuments } from "@/lib/cms/public-data";

export const metadata: Metadata = {
  title: "ઐતિહાસિક પત્રો",
  description: "સમિતિ દ્વારા જાહેર કરાયેલા ઉપલબ્ધ ઐતિહાસિક પત્ર અને સ્કેન.",
};

export default async function HistoricalLettersPage() {
  const documents = await getPublicHeritageDocuments();
  const letters = documents.filter(document => document.kind === "historical_letter");

  return <main>
    <header className="border-b border-border bg-[#efe1ce]"><div className="container-site py-12 sm:py-16"><p className="eyebrow">વારસા સંગ્રહ</p><h1 className="display-title mt-4 text-primary-strong">ઐતિહાસિક પત્રો</h1><p className="body-large mt-4 max-w-2xl">સમિતિ દ્વારા ચકાસીને જાહેર કરાયેલી ઉપલબ્ધ પત્રપ્રતિઓ, સ્કેન અને સંબંધિત નોંધો અહીં વાંચી શકાય છે.</p></div></header>
    <section className="section-pad"><div className="container-site">
      {letters.length ? <div className="grid gap-6 md:grid-cols-2">{letters.map(letter => <article key={letter.id} className="rounded-[1.35rem] border border-border bg-surface p-5 sm:p-6"><ScrollText className="size-6 text-gold-deep" /><p className="mt-4 text-xs font-bold text-gold-deep">{letter.date_label_gu || letter.document_date || "તારીખ ઉપલબ્ધ નથી"}</p><h2 className="mt-2 font-serif text-2xl font-bold text-primary">{letter.title_gu}</h2>{letter.description_gu ? <p className="mt-3 text-sm leading-7 text-muted-foreground">{letter.description_gu}</p> : null}<div className="mt-5 flex flex-wrap gap-2">{letter.image_url ? <a href={letter.image_url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-4 font-bold text-white">સ્કેન જુઓ <ExternalLink className="size-4" /></a> : null}{letter.file_url ? <a href={letter.file_url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border-strong px-4 font-bold text-primary">ફાઇલ ખોલો <ExternalLink className="size-4" /></a> : null}{!letter.image_url && !letter.file_url ? <span className="text-sm text-muted-foreground">હાલ ડિજિટલ પ્રતિ જોડાયેલી નથી.</span> : null}</div></article>)}</div> : <div className="rounded-2xl border border-dashed border-border bg-surface p-8 text-sm text-muted-foreground">હાલ જાહેર વાંચન માટે કોઈ ઐતિહાસિક પત્ર ઉપલબ્ધ નથી.</div>}
    </div></section>
  </main>;
}
