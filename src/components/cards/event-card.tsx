import { ArrowRight, ExternalLink, MapPin, Radio } from "lucide-react";
import Link from "next/link";

import { getAshramById } from "@/lib/ashram-data";
import { formatEventDate, formatEventDateBlock } from "@/lib/event-format";
import type { EventItem } from "@/lib/types";

export function EventCard({ event }: { event: EventItem }) {
  const ashram = event.ashramId ? getAshramById(event.ashramId) : undefined;
  const mapUrl = event.mapUrl ?? ashram?.mapUrl;
  const startsAt = event.startsAt;
  const date = startsAt ? formatEventDateBlock(startsAt) : undefined;

  return (
    <article className="card-sacred flex h-full flex-col p-5 sm:p-6">
      {event.status === "cancelled" && <p role="status" className="mb-4 rounded-xl bg-[#fff2ef] px-3 py-2 text-sm font-bold text-danger">આ કાર્યક્રમ રદ કરવામાં આવ્યો છે.</p>}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        {date ? (
          <time dateTime={startsAt} aria-label={formatEventDate(startsAt!)} className="flex w-full shrink-0 items-baseline gap-2 rounded-2xl bg-[#f2e6d5] px-4 py-3 text-primary sm:w-28 sm:flex-col sm:items-center sm:gap-0 sm:text-center">
            <span className="font-serif text-3xl font-bold leading-none sm:text-4xl">{date.day}</span>
            <span className="font-bold">{date.month}</span>
            <span className="text-sm">{date.year}</span>
          </time>
        ) : event.recurringLabelGu ? (
          <div className="w-full shrink-0 rounded-2xl bg-[#e5ede8] px-4 py-3 text-sm font-bold leading-6 text-[#294c45] sm:w-36">{event.recurringLabelGu}</div>
        ) : null}
        <div className="min-w-0 flex-1">
          {event.eyebrowGu && <p className="text-xs font-bold text-gold-deep">{event.eyebrowGu}</p>}
          <h3 className="mt-1 font-serif text-[1.4rem] font-bold leading-snug text-primary-strong">{event.titleGu}</h3>
          {(event.venueGu || ashram) && <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-muted-foreground"><MapPin className="mt-0.5 size-4 shrink-0 text-gold-deep" aria-hidden="true" />{event.venueGu ?? ashram?.nameGu}</p>}
          {event.livestreamUrl && <p className="mt-2 flex items-center gap-2 text-sm font-bold text-[#294c45]"><Radio className="size-4" aria-hidden="true" /> લાઇવ પ્રસારણ ઉપલબ્ધ</p>}
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
        <Link href={`/events/${event.slug}`} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground">વિગત જુઓ <ArrowRight className="size-4" aria-hidden="true" /></Link>
        {mapUrl && <a href={mapUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border-strong px-4 text-sm font-bold text-primary">દિશા મેળવો <ExternalLink className="size-3.5" aria-hidden="true" /><span className="sr-only">(નવા ટેબમાં)</span></a>}
        {event.registrationUrl && <a href={event.registrationUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border-strong px-4 text-sm font-bold text-primary">નોંધણી <ExternalLink className="size-3.5" aria-hidden="true" /><span className="sr-only">(નવા ટેબમાં)</span></a>}
      </div>
    </article>
  );
}
