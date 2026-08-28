"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";

import { AshramCard } from "@/components/cards/ashram-card";
import type { Ashram, AshramRegion } from "@/lib/types";
import { cn } from "@/lib/utils";

const ALL = "બધા" as const;

function normalize(value: string) {
  return value.normalize("NFKC").toLocaleLowerCase().replace(/[—,./()\-]/g, " ").replace(/\s+/g, " ").trim();
}

export function AshramDirectory({ ashrams, regions }: { ashrams: Ashram[]; regions: AshramRegion[] }) {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<typeof ALL | AshramRegion>(ALL);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    const q = normalize(query);
    return ashrams.filter((ashram) => {
      const matchesRegion = region === ALL || ashram.region === region;
      const searchable = normalize([ashram.nameGu, ashram.nameEn, ashram.slug, ashram.localityGu, ashram.cityGu, ashram.districtGu, ashram.addressGu, ashram.addressEn].filter(Boolean).join(" "));
      return matchesRegion && (!q || searchable.includes(q));
    });
  }, [ashrams, query, region]);

  const featured = filtered.filter((ashram) => ashram.featured && ashram.verified);
  const regular = filtered.filter((ashram) => !ashram.featured || !ashram.verified);
  const reset = () => { setQuery(""); setRegion(ALL); };

  return (
    <div>
      <div className="sticky top-0 z-20 -mx-2 rounded-2xl border border-border bg-background/95 p-3 shadow-[0_8px_30px_rgba(72,45,28,.08)] backdrop-blur-sm sm:static sm:mx-0 sm:p-5 sm:shadow-none">
        <div className="flex gap-2">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">શહેર, જિલ્લો અથવા આશ્રમ શોધો</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="શહેર, જિલ્લો અથવા આશ્રમ શોધો…" autoComplete="off" className="min-h-12 w-full rounded-xl border border-border-strong bg-surface py-3 pl-12 pr-10 text-[16px] outline-none transition focus:border-primary" />
            {query ? <button type="button" onClick={() => setQuery("")} aria-label="શોધ સાફ કરો" className="tap-target absolute right-0 top-1/2 inline-flex -translate-y-1/2 items-center justify-center text-muted-foreground"><X className="size-4" /></button> : null}
          </label>
          <button type="button" onClick={() => setShowFilters((value) => !value)} aria-expanded={showFilters} aria-controls="region-filters" className="tap-target inline-flex items-center gap-2 rounded-xl border border-border-strong bg-surface px-3 text-[14px] font-bold text-primary sm:hidden">
            <SlidersHorizontal className="size-4" />પ્રદેશ
          </button>
        </div>
        <div id="region-filters" className={cn("mt-3 flex flex-wrap gap-2", !showFilters && "hidden sm:flex")} aria-label="પ્રદેશ મુજબ આશ્રમ ફિલ્ટર">
          {[ALL, ...regions].map((item) => <button key={item} type="button" onClick={() => { setRegion(item); setShowFilters(false); }} aria-pressed={region === item} className={cn("tap-target rounded-full border px-4 py-2 text-[13px] font-bold leading-5", region === item ? "border-primary bg-primary text-primary-foreground" : "border-border-strong bg-surface text-muted-foreground hover:text-primary")}>{item}</button>)}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[14px] text-muted-foreground" aria-live="polite"><strong className="text-primary">{filtered.length}</strong> આશ્રમ મળ્યાં</p>
        <p className="text-[12px] text-muted-foreground"><span className="font-bold text-sacred-green">ચકાસેલ વિગત</span> સત્તાવાર સ્રોત પર આધારિત છે</p>
      </div>

      {filtered.length ? <>
        {featured.length ? <section className="mt-7" aria-labelledby="featured-heading">
          <div className="flex items-end justify-between gap-4"><div><p className="eyebrow">મુખ્ય કેન્દ્રો</p><h2 id="featured-heading" className="mt-2 font-serif text-2xl font-bold text-primary-strong sm:text-3xl">ચકાસેલ આશ્રમ માહિતી</h2></div><p className="hidden max-w-sm text-right text-[13px] text-muted-foreground md:block">સરનામું અને ફોન ઉપલબ્ધ હોય તેવા કેન્દ્રો</p></div>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{featured.map((ashram) => <AshramCard key={ashram.id} ashram={ashram} featured />)}</div>
        </section> : null}
        {regular.length ? <section className="mt-10" aria-labelledby="all-heading"><h2 id="all-heading" className="font-serif text-2xl font-bold text-primary-strong">આશ્રમ પરિવારની બધી શાખાઓ</h2><p className="mt-1 text-[14px] text-muted-foreground">ઉપલબ્ધ પ્રાદેશિક માહિતી મુજબ ગોઠવેલ શાખાઓ</p><div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{regular.map((ashram) => <AshramCard key={ashram.id} ashram={ashram} />)}</div></section> : null}
      </> : <div className="card-sacred mt-6 px-5 py-10 text-center"><h2 className="font-serif text-2xl font-bold text-primary">આ શોધ માટે કોઈ આશ્રમ મળ્યું નથી.</h2><p className="mt-2 text-[14px] text-muted-foreground">શહેરનું બીજું નામ અજમાવો અથવા ફરીથી આખી યાદી જુઓ.</p><button type="button" onClick={reset} className="tap-target mt-5 rounded-xl bg-primary px-5 py-2 font-bold text-primary-foreground">બધા આશ્રમ જુઓ</button></div>}
    </div>
  );
}
