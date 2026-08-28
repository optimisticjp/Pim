import { ExternalLink, MapPin, Phone, ShieldCheck } from "lucide-react";
import type { Ashram } from "@/lib/types";

export function AshramCard({ ashram }: { ashram: Ashram }) {
  return (
    <article className="card-sacred flex h-full flex-col p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] font-bold tracking-[.06em] text-gold-deep">{ashram.region}</div>
          <h3 className="mt-2 font-serif text-[1.35rem] font-bold leading-snug text-primary-strong">{ashram.nameGu}</h3>
        </div>
        {ashram.verified ? <ShieldCheck className="h-5 w-5 shrink-0 text-sacred-green" aria-label="ચકાસેલી સંપર્ક વિગતો" /> : null}
      </div>
      <p className="mt-3 flex-1 text-[14px] leading-7 text-muted-foreground">{ashram.addressGu ?? `${ashram.localityGu} • વિસ્તૃત સંપર્ક વિગતો સમિતિની ચકાસણી બાદ ઉમેરાશે.`}</p>
      {ashram.phone ? <a href={`tel:${ashram.phone.replace(/\s/g, "")}`} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-surface-soft px-4 text-[14px] font-bold text-primary"><Phone className="h-4 w-4" />{ashram.phone}</a> : null}
      <a href={ashram.mapUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex min-h-11 items-center justify-between rounded-xl border border-border px-4 text-[14px] font-bold text-primary hover:bg-surface-soft">
        <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" />દિશા મેળવો</span><ExternalLink className="h-3.5 w-3.5" />
      </a>
    </article>
  );
}
