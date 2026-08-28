"use client";

import { Check, ExternalLink, MapPin, Phone, Share2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import type { Ashram } from "@/lib/types";
import { cn } from "@/lib/utils";

export function AshramCard({ ashram, featured = false }: { ashram: Ashram; featured?: boolean }) {
  const [copied, setCopied] = useState(false);
  const branchUrl = `/ashrams/${ashram.slug}`;

  async function shareAshram() {
    const url = ashram.mapUrl ?? new URL(branchUrl, window.location.origin).toString();
    if (navigator.share) {
      await navigator.share({ title: ashram.nameGu, text: ashram.localityGu, url }).catch(() => undefined);
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.assign(url);
    }
  }

  return (
    <article className={cn("card-sacred flex h-full min-w-0 flex-col p-5 sm:p-6", featured && "border-gold/50 bg-surface")}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[12px] font-bold leading-5 text-gold-deep">{ashram.region}{ashram.districtGu ? ` • ${ashram.districtGu}` : ""}</p>
          <h3 className="mt-1.5 font-serif text-[1.3rem] font-bold leading-snug text-primary-strong sm:text-[1.4rem]">
            <Link href={branchUrl} className="rounded-sm hover:underline hover:decoration-gold/50 hover:underline-offset-4">{ashram.nameGu}</Link>
          </h3>
        </div>
        {ashram.verified ? (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-sacred-green/10 px-2.5 py-1 text-[11px] font-bold text-sacred-green">
            <ShieldCheck className="size-3.5" aria-hidden="true" />ચકાસેલ વિગત
          </span>
        ) : null}
      </div>

      <div className="mt-4 flex flex-1 flex-col gap-3 text-[14px] leading-6">
        {ashram.addressGu ? (
          <p className="text-foreground"><span className="sr-only">સરનામું: </span>{ashram.addressGu}</p>
        ) : (
          <div className="rounded-xl border border-dashed border-border-strong bg-surface-soft px-3.5 py-3 text-muted-foreground">
            <p className="font-bold text-foreground/75">{ashram.localityGu}</p>
            <p className="mt-0.5 text-[13px]">સંપર્ક વિગત ચકાસણી હેઠળ</p>
          </div>
        )}
        {ashram.contactPersonGu ? <p><span className="font-bold text-primary">સંપર્ક: </span>{ashram.contactPersonGu}</p> : null}
        {ashram.amenities?.length ? (
          <ul className="flex flex-wrap gap-2" aria-label="ઉપલબ્ધ સુવિધાઓ">
            {ashram.amenities.map((amenity) => <li key={amenity} className="rounded-full bg-surface-soft px-3 py-1 text-[12px] font-bold text-sacred-green">{amenity}</li>)}
          </ul>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
        {ashram.mapUrl ? (
          <a href={ashram.mapUrl} target="_blank" rel="noopener noreferrer" className="tap-target inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2 text-[13px] font-bold text-primary-foreground">
            <MapPin className="size-4" aria-hidden="true" />Google Maps દિશા<ExternalLink className="size-3.5" aria-hidden="true" />
          </a>
        ) : null}
        {ashram.phone ? (
          <a href={`tel:${ashram.phone.replace(/[^+\d]/g, "")}`} className="tap-target inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2 text-[13px] font-bold text-primary-foreground">
            <Phone className="size-4" aria-hidden="true" />ફોન કરો
          </a>
        ) : null}
        <button type="button" onClick={shareAshram} className="tap-target inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-border-strong px-3 py-2 text-[13px] font-bold text-primary hover:bg-surface-soft">
          {copied ? <Check className="size-4" aria-hidden="true" /> : <Share2 className="size-4" aria-hidden="true" />}{copied ? "લિંક કૉપી થઈ" : "શેર કરો"}
        </button>
      </div>
      {ashram.phone ? <p className="mt-2 text-center text-[12px] text-muted-foreground">{ashram.phone}</p> : null}
    </article>
  );
}
