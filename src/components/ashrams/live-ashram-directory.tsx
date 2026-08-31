"use client";

import { MapPin, Phone, Search } from "lucide-react";
import { useMemo, useState } from "react";

import type { PublicAshram } from "@/lib/operations/public-data";

function normalize(value:string){return value.normalize("NFKC").toLocaleLowerCase().replace(/\s+/g," ").trim();}

export function LiveAshramDirectory({ashrams}:{ashrams:PublicAshram[]}){
  const[query,setQuery]=useState("");
  const filtered=useMemo(()=>{const q=normalize(query);if(!q)return ashrams;return ashrams.filter(a=>normalize([a.name_gu,a.city_gu,a.state_gu,a.full_address].filter(Boolean).join(" ")).includes(q));},[ashrams,query]);
  return <div>
    <label className="relative block max-w-2xl"><span className="sr-only">આશ્રમ શોધો</span><Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"/><input value={query} onChange={e=>setQuery(e.target.value)} className="field min-h-12 pl-12 text-base" placeholder="આશ્રમ, શહેર અથવા રાજ્ય શોધો…"/></label>
    <p className="mt-4 text-sm text-muted-foreground"><strong className="text-primary">{filtered.length}</strong> પ્રકાશિત આશ્રમ</p>
    {filtered.length?<div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filtered.map(a=><article key={a.id} className="card-sacred p-5"><p className="text-xs font-bold text-sacred-green">સમિતિ દ્વારા પ્રકાશિત</p><h2 className="mt-2 font-serif text-xl font-bold text-primary-strong">{a.name_gu}</h2><p className="mt-2 text-sm leading-7 text-muted-foreground">{a.full_address||[a.city_gu,a.state_gu].filter(Boolean).join(", ")}</p>{a.accepts_stays?<p className="mt-3 inline-flex rounded-full bg-[#edf4ef] px-3 py-1 text-xs font-bold text-sacred-green">ઉતારો ઉપલબ્ધ</p>:null}<div className="mt-5 flex flex-wrap gap-2">{a.office_phone?<a href={`tel:${a.office_phone}`} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-bold text-white"><Phone className="size-4"/>{a.office_phone}</a>:null}{a.map_url?<a href={a.map_url} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border-strong px-4 text-sm font-bold text-primary"><MapPin className="size-4"/>દિશા</a>:null}</div></article>)}</div>:<div className="mt-5 rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">આ શોધ માટે કોઈ પ્રકાશિત આશ્રમ મળ્યો નથી.</div>}
  </div>;
}
