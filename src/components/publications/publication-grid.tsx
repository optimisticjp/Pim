"use client";

import { ExternalLink, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { formatGujaratiNumber } from "@/lib/gujarati-format";
import type { Publication } from "@/lib/types";

export function PublicationGrid({ publications, years }: { publications: Publication[]; years: number[] }) {
  const [year, setYear] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | "veda-rahasya" | "other">("all");
  const [visibleCount, setVisibleCount] = useState(12);
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("gu");
    return publications.filter((publication) => {
      const matchesYear = year === null || publication.year === year;
      const matchesCategory = category === "all" || (category === "veda-rahasya" ? publication.kind === "veda-rahasya" : publication.kind !== "veda-rahasya");
      const metadata = [publication.titleGu, publication.subtitleGu, publication.editionGu, publication.monthGu, publication.year, publication.kind, publication.descriptionGu].join(" ").toLocaleLowerCase("gu");
      return matchesYear && matchesCategory && (!normalized || metadata.includes(normalized));
    });
  }, [category, publications, query, year]);

  const reset = () => { setYear(null); setQuery(""); setCategory("all"); setVisibleCount(12); };

  return (
    <div>
      <div className="rounded-[1.25rem] border border-[#d8c4aa] bg-[#fffaf2] p-4 sm:p-5">
        <div className="grid gap-5 lg:grid-cols-[minmax(15rem,1fr)_auto] lg:items-end">
          <label className="block">
            <span className="mb-2 block text-[14px] font-bold text-primary">પ્રકાશન શોધો</span>
            <span className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="શીર્ષક, વર્ષ, પ્રકાર અથવા વર્ણન શોધો…" className="min-h-12 w-full rounded-xl border border-border-strong bg-white py-3 pl-12 pr-4 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
            </span>
          </label>
          <fieldset>
            <legend className="mb-2 text-[14px] font-bold text-primary">વર્ષ</legend>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setYear(null)} aria-pressed={year === null} className="min-h-11 rounded-full border border-border-strong px-4 font-bold aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-white">બધા</button>
              {years.map((item) => <button key={item} type="button" onClick={() => setYear(item)} aria-pressed={year === item} className="min-h-11 rounded-full border border-border-strong px-4 font-bold aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-white">{formatGujaratiNumber(item)}</button>)}
            </div>
          </fieldset>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2" aria-label="પ્રકાશન પ્રકાર">
        {([['all','બધાં પ્રકાશનો'],['veda-rahasya','વેદ રહસ્ય'],['other','ગ્રંથો અને અન્ય']] as const).map(([value,label])=><button key={value} type="button" onClick={()=>{setCategory(value);setVisibleCount(12);}} aria-pressed={category===value} className="min-h-11 rounded-full border border-border-strong bg-surface px-4 font-bold text-primary aria-pressed:bg-primary aria-pressed:text-white">{label}</button>)}
      </div>

      <p className="mt-6 text-[15px] text-muted-foreground" aria-live="polite">{year ? `${formatGujaratiNumber(year)}નાં ` : ""}{formatGujaratiNumber(filtered.length)} પ્રકાશન</p>
      {filtered.length ? (
        <><div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{filtered.slice(0,visibleCount).map((publication) => <PublicationCard key={publication.id} publication={publication} />)}</div>{visibleCount<filtered.length?<div className="mt-8 text-center"><button type="button" onClick={()=>setVisibleCount(count=>count+12)} className="min-h-12 rounded-full bg-primary px-6 font-bold text-white">વધુ પ્રકાશનો જુઓ</button></div>:null}</>
      ) : (
        <div className="mt-4 rounded-[1.25rem] border border-dashed border-[#c9ad89] bg-[#fffaf2] px-5 py-12 text-center">
          <h2 className="font-serif text-2xl font-bold text-primary-strong">આ શોધ માટે કોઈ પ્રકાશન મળ્યું નથી.</h2>
          <button type="button" onClick={reset} className="mt-5 min-h-11 rounded-full bg-primary px-5 font-bold text-white">બધાં પ્રકાશનો જુઓ</button>
        </div>
      )}
    </div>
  );
}

export function PublicationCard({ publication }: { publication: Publication }) {
  return (
    <article className="flex min-h-[19rem] flex-col overflow-hidden rounded-[1.25rem] border border-[#d8c4aa] bg-surface shadow-[0_12px_30px_rgba(87,22,33,.06)]">
      <div className="relative flex min-h-40 flex-col justify-between overflow-hidden border-b border-[#d8c4aa] bg-[#f1e5d3] p-5">
        <div className="absolute inset-0 pattern-jali opacity-20" />
        <span className="relative self-start rounded-full border border-[#b99568] bg-[#fffaf2] px-3 py-1 text-[11px] font-bold text-gold-deep">{publication.kind === "veda-rahasya" ? "વેદ રહસ્ય અંક" : publication.kind === "book" ? "ગ્રંથ" : publication.kind === "letter" ? "પત્ર સંગ્રહ" : "પ્રકાશન"}</span>
        <div className="relative mt-7">
          <h2 className="font-serif text-3xl font-bold text-primary-strong">{publication.titleGu}</h2>
          {(publication.monthGu || publication.year) && <p className="mt-2 text-base font-bold text-primary">{[publication.monthGu, publication.year && formatGujaratiNumber(publication.year)].filter(Boolean).join(" • ")}</p>}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        {publication.editionGu && <p className="text-[14px] text-muted-foreground">{publication.editionGu}</p>}
        <div className={`mt-auto grid gap-2 pt-6 ${publication.pdfUrl ? "grid-cols-2" : "grid-cols-1"}`}>
          <Link href={`/publications/${publication.slug}`} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-3 font-bold text-white">વાંચો</Link>
          {publication.pdfUrl && <a href={publication.pdfUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border-strong px-3 font-bold text-primary"><ExternalLink className="size-4" /> PDF ખોલો</a>}
        </div>
      </div>
    </article>
  );
}
