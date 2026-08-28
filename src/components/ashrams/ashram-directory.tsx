"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { AshramCard } from "@/components/cards/ashram-card";
import { ashrams } from "@/lib/site-data";
import type { AshramRegion } from "@/lib/types";
import { cn } from "@/lib/utils";

const regions: ("બધા" | AshramRegion)[] = ["બધા", "મુખ્ય કેન્દ્ર", "મધ્ય ગુજરાત", "સૌરાષ્ટ્ર", "ઉત્તર ગુજરાત", "ઉત્તર ભારત", "મહારાષ્ટ્ર", "વિદેશ"];

export function AshramDirectory() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<(typeof regions)[number]>("બધા");

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("gu");
    return ashrams.filter((ashram) => {
      const matchesRegion = region === "બધા" || ashram.region === region;
      const haystack = `${ashram.nameGu} ${ashram.localityGu} ${ashram.addressGu ?? ""}`.toLocaleLowerCase("gu");
      return matchesRegion && (!q || haystack.includes(q));
    });
  }, [query, region]);

  return (
    <div>
      <div className="card-sacred p-4 sm:p-5">
        <label className="relative block">
          <span className="sr-only">આશ્રમ શોધો</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="શહેર, ગામ અથવા આશ્રમનું નામ શોધો..." className="min-h-12 w-full rounded-xl border border-border bg-background py-3 pl-12 pr-4 text-[16px] outline-none transition focus:border-primary/50" />
        </label>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1" aria-label="પ્રદેશ ફિલ્ટર">
          {regions.map((item) => (
            <button key={item} type="button" onClick={() => setRegion(item)} className={cn("min-h-10 shrink-0 rounded-full border px-4 text-[13px] font-bold", region === item ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface text-muted-foreground hover:border-primary/30 hover:text-primary")}>
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between text-[13px] text-muted-foreground">
        <span><strong className="text-primary">{filtered.length}</strong> શાખાઓ મળ્યાં</span>
        <span className="hidden sm:inline">✓ ચિહ્નવાળી સંપર્ક વિગતો legacy સ્રોતથી ચકાસેલી</span>
      </div>

      {filtered.length ? (
        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{filtered.map((ashram) => <AshramCard key={ashram.id} ashram={ashram} />)}</div>
      ) : (
        <div className="card-sacred mt-5 p-10 text-center">
          <div className="font-serif text-2xl font-bold text-primary">આ શોધ માટે આશ્રમ મળ્યો નથી</div>
          <p className="mt-2 text-[14px] text-muted-foreground">બીજું શહેર/ગામ લખો અથવા “બધા” પ્રદેશ પસંદ કરો.</p>
        </div>
      )}
    </div>
  );
}
