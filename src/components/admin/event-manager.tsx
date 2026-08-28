"use client";

import { Plus, Trash2 } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { getPreviewEvents, savePreviewEvents } from "@/lib/demo-store";
import type { EventItem } from "@/lib/types";

export function EventManager() {
  const [rows, setRows] = useState<EventItem[]>([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  useEffect(() => setRows(getPreviewEvents()), []);

  function add(event: FormEvent) {
    event.preventDefault();
    if (title.trim().length < 3) return;
    const item: EventItem = { id: `evt-${Date.now()}`, titleGu: title.trim(), eyebrowGu: "નવો કાર્યક્રમ", descriptionGu: "Admin previewમાં ઉમેરાયેલ કાર્યક્રમ. D1 જોડાયા બાદ અહીં સંપૂર્ણ description, date, venue, poster અને registration fields હશે.", scheduleGu: "તારીખ ઉમેરવાની બાકી", venueGu: "સ્થળ ઉમેરવાનું બાકી", href: "/events", tone: "gold" };
    const next=[item,...rows]; setRows(savePreviewEvents(next)); setTitle(""); setOpen(false);
  }
  function remove(id:string) { const next=rows.filter((row)=>row.id!==id); setRows(savePreviewEvents(next)); }

  return <div><div className="mb-4 flex justify-end"><button onClick={()=>setOpen(true)} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-primary px-4 text-[12px] font-bold text-primary-foreground"><Plus className="h-4 w-4" /> નવો કાર્યક્રમ</button></div><div className="grid gap-4 lg:grid-cols-2">{rows.map((row)=><article key={row.id} className="rounded-2xl border border-[#decfbf] bg-[#fffaf3] p-5"><div className="flex items-start justify-between gap-4"><div><div className="text-[10px] font-bold text-gold-deep">{row.eyebrowGu}</div><h2 className="mt-1 font-serif text-xl font-bold text-primary">{row.titleGu}</h2></div><button onClick={()=>remove(row.id)} className="tap-target grid place-items-center rounded-xl border border-border text-danger" aria-label="Delete"><Trash2 className="h-4 w-4" /></button></div><p className="mt-3 text-[12px] leading-6 text-muted-foreground">{row.descriptionGu}</p><div className="mt-4 rounded-xl bg-[#f1e8dd] px-3 py-2 text-[11px] text-[#65574d]">{row.scheduleGu} • {row.venueGu}</div></article>)}</div>{open?<div className="fixed inset-0 z-[80] grid place-items-center bg-black/55 p-4"><form onSubmit={add} className="w-full max-w-lg rounded-2xl bg-[#fffaf3] p-6 shadow-2xl"><h2 className="font-serif text-2xl font-bold text-primary">નવો કાર્યક્રમ</h2><label className="mt-5 block text-[12px] font-bold">ગુજરાતી શીર્ષક<input autoFocus value={title} onChange={(e)=>setTitle(e.target.value)} className="field mt-2" /></label><p className="mt-3 text-[11px] leading-5 text-muted-foreground">Preview manager minimal છે. Production schemaમાં date, venue, ashram, poster, livestream, registration અને publish status fields પહેલેથી તૈયાર છે.</p><div className="mt-5 flex gap-2"><button type="submit" className="min-h-11 flex-1 rounded-xl bg-primary font-bold text-primary-foreground">ઉમેરો</button><button type="button" onClick={()=>setOpen(false)} className="min-h-11 rounded-xl border border-border px-4 font-bold text-primary">રદ</button></div></form></div>:null}</div>;
}
