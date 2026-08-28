import type { Metadata } from "next";
import { ArrowLeft, ExternalLink, Landmark, MapPin, Radio, UserRoundCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { EventActions } from "@/components/events/event-actions";
import { getAshramById } from "@/lib/ashram-data";
import { getEventBySlug, getPublishedEvents } from "@/lib/event-data";
import { formatEventDateTime } from "@/lib/event-format";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPublishedEvents().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = getEventBySlug((await params).slug);
  if (!event) return {};
  const details = [event.startsAt && formatEventDateTime(event.startsAt), event.venueGu].filter(Boolean).join(" • ");
  const description = [details, event.descriptionGu].filter(Boolean).join(" — ") || `${event.titleGu} કાર્યક્રમની ચકાસેલી માહિતી.`;
  return {
    title: event.titleGu,
    description,
    openGraph: { title: event.titleGu, description, type: "website", ...(event.posterImageUrl ? { images: [{ url: event.posterImageUrl, alt: event.titleGu }] } : {}) },
  };
}

export default async function EventDetailPage({ params }: Props) {
  const event = getEventBySlug((await params).slug);
  if (!event) notFound();
  const ashram = event.ashramId ? getAshramById(event.ashramId) : undefined;
  const mapUrl = event.mapUrl ?? ashram?.mapUrl;
  return (
    <>
      <section className="border-b border-border bg-[#f5eadc]">
        <div className="container-site py-8 sm:py-12">
          <Link href="/events" className="inline-flex min-h-11 items-center gap-2 font-bold text-primary"><ArrowLeft className="size-4" /> કાર્યક્રમ પંચિકામાં પાછા જાઓ</Link>
          <div className="mt-5 max-w-4xl">
            {event.eyebrowGu && <p className="eyebrow">{event.eyebrowGu}</p>}
            <h1 className="mt-3 font-serif text-[clamp(2.1rem,5vw,4rem)] font-bold leading-tight text-primary-strong">{event.titleGu}</h1>
            {event.status === "cancelled" && <div role="status" className="mt-5 rounded-xl border border-danger/30 bg-[#fff2ef] px-4 py-3 font-bold text-danger">આ કાર્યક્રમ રદ કરવામાં આવ્યો છે.</div>}
            {event.startsAt && <p className="mt-5 text-lg font-bold text-primary"><time dateTime={event.startsAt}>{formatEventDateTime(event.startsAt)}</time>{event.endsAt && <> થી <time dateTime={event.endsAt}>{formatEventDateTime(event.endsAt)}</time></>}</p>}
            {!event.startsAt && event.recurringLabelGu && <p className="mt-5 text-lg font-bold text-[#294c45]">{event.recurringLabelGu}</p>}
            {event.descriptionGu && <p className="body-large mt-4 max-w-3xl">{event.descriptionGu}</p>}
          </div>
          <div className="mt-7"><EventActions event={event} /></div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-site grid gap-8 lg:grid-cols-[1fr_.72fr] lg:items-start">
          <div className="space-y-5">
            {(event.venueGu || ashram) && <section className="card-sacred p-5 sm:p-6"><h2 className="font-serif text-2xl font-bold text-primary-strong">સ્થળ અને દિશા</h2>{event.venueGu && <p className="mt-4 flex gap-2 text-base leading-7 text-muted-foreground"><MapPin className="mt-1 size-5 shrink-0 text-gold-deep" />{event.venueGu}</p>}{ashram && <Link href={`/ashrams/${ashram.slug}`} className="mt-3 inline-flex min-h-11 items-center gap-2 font-bold text-primary"><Landmark className="size-4" />{ashram.nameGu}</Link>}{mapUrl && <a href={mapUrl} target="_blank" rel="noreferrer" className="mt-3 flex min-h-11 w-fit items-center gap-2 rounded-full border border-border-strong px-5 font-bold text-primary">દિશા મેળવો <ExternalLink className="size-4" /><span className="sr-only">(નવા ટેબમાં)</span></a>}</section>}
            {event.status !== "cancelled" && (event.livestreamUrl || event.registrationUrl || event.contactUrl) && <section className="card-sacred p-5 sm:p-6"><h2 className="font-serif text-2xl font-bold text-primary-strong">જોડાવાના માર્ગો</h2><div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">{event.livestreamUrl && <a href={event.livestreamUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 font-bold text-white"><Radio className="size-4" /> લાઇવ પ્રસારણ <ExternalLink className="size-3.5" /><span className="sr-only">(નવા ટેબમાં)</span></a>}{event.registrationUrl && <a href={event.registrationUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border-strong px-5 font-bold text-primary"><UserRoundCheck className="size-4" /> નોંધણી કરો <ExternalLink className="size-3.5" /><span className="sr-only">(નવા ટેબમાં)</span></a>}{event.contactUrl && <Link href={event.contactUrl} className="inline-flex min-h-11 items-center justify-center rounded-full border border-border-strong px-5 font-bold text-primary">સંપર્ક કરો</Link>}</div></section>}
          </div>
          {event.posterImageUrl && <figure className="relative aspect-[4/5] max-h-[42rem] overflow-hidden rounded-[1.5rem] border border-border bg-surface"><Image src={event.posterImageUrl} alt={`${event.titleGu} કાર્યક્રમ પત્રિકા`} fill sizes="(max-width: 1024px) 100vw, 38vw" className="object-contain" unoptimized /></figure>}
        </div>
      </section>
    </>
  );
}
