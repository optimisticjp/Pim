import { ArrowLeft, CalendarDays, MapPin, Phone, ShieldCheck, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

import { getAshramBySlug, getAshrams } from "@/lib/ashram-data";
import { prototypeAshramHighlights } from "@/lib/prototype-content";
import { ashramMedia } from "@/lib/migration/ashram-media";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAshrams().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const ashram = getAshramBySlug((await params).slug);
  return { title: ashram?.nameGu ?? "આશ્રમ કેન્દ્ર", description: ashram ? `${ashram.localityGu} ખાતે શ્રી માધવાનંદ આશ્રમ કેન્દ્રની ઉપલબ્ધ ચકાસેલ માહિતી.` : undefined };
}

export default async function AshramDetailPage({ params }: Props) {
  const ashram = getAshramBySlug((await params).slug);
  if (!ashram) notFound();
  const highlights = prototypeAshramHighlights[ashram.id];
  const media = ashramMedia[ashram.id];

  return <main>
    <header className="border-b border-border bg-surface-soft">{media?.heroImage ? <div className="container-site pt-6 sm:pt-8"><div className="relative aspect-[16/7] overflow-hidden rounded-[1.4rem] border border-border bg-[#eadcc8]"><Image src={media.heroImage} alt={`${ashram.nameGu}નું દૃશ્ય`} fill priority sizes="100vw" className="object-cover" /></div></div> : null}<div className="container-site py-9 sm:py-14"><Link href="/ashrams" className="tap-target inline-flex items-center gap-2 text-[14px] font-bold text-primary"><ArrowLeft className="size-4" />આશ્રમ યાદીમાં પાછા જાઓ</Link><p className="eyebrow mt-5">{ashram.region}</p><h1 className="mt-3 max-w-4xl font-serif text-4xl font-bold leading-tight text-primary-strong sm:text-5xl">{ashram.nameGu}</h1><p className="mt-3 text-[17px] text-muted-foreground">{ashram.localityGu}</p>{ashram.verified ? <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-sacred-green/10 px-3 py-1.5 text-[13px] font-bold text-sacred-green"><ShieldCheck className="size-4" />ચકાસેલ વિગત</p> : null}</div></header>
    <section className="container-site py-10 sm:py-14"><div className="grid max-w-4xl gap-5 md:grid-cols-2">
      {ashram.addressGu ? <article className="card-sacred p-5 sm:p-6"><MapPin className="size-5 text-gold-deep" /><h2 className="mt-3 font-serif text-2xl font-bold text-primary-strong">સરનામું</h2><p className="mt-2 leading-7 text-muted-foreground">{ashram.addressGu}</p>{ashram.mapUrl ? <a href={ashram.mapUrl} target="_blank" rel="noopener noreferrer" className="tap-target mt-5 inline-flex items-center rounded-xl bg-primary px-4 py-2 text-[14px] font-bold text-primary-foreground">Google Maps દિશા</a> : null}</article> : null}
      {ashram.phone ? <article className="card-sacred p-5 sm:p-6"><Phone className="size-5 text-gold-deep" /><h2 className="mt-3 font-serif text-2xl font-bold text-primary-strong">સંપર્ક</h2>{ashram.contactPersonGu ? <p className="mt-2 text-muted-foreground">{ashram.contactPersonGu}</p> : null}<a href={`tel:${ashram.phone.replace(/[^+\d]/g, "")}`} className="tap-target mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-[14px] font-bold text-primary-foreground"><Phone className="size-4" />ફોન કરો</a><p className="mt-2 text-[13px] text-muted-foreground">{ashram.phone}</p></article> : null}
      {!ashram.addressGu && !ashram.phone ? <article className="card-sacred p-6 md:col-span-2"><h2 className="font-serif text-2xl font-bold text-primary-strong">વિગત ઉમેરાઈ રહી છે</h2><p className="mt-2 text-muted-foreground">આ કેન્દ્રની સંપર્ક અને સરનામાની વિગત સમિતિની ચકાસણી હેઠળ છે.</p></article> : null}
    </div>{highlights && <div className="mt-8 grid max-w-4xl gap-5 md:grid-cols-2"><article className="rounded-[1.25rem] border border-border bg-surface p-5 sm:p-6"><Sparkles className="size-5 text-gold-deep"/><h2 className="mt-3 font-serif text-2xl font-bold text-primary">આશ્રમ સુવિધાઓ</h2><ul className="mt-4 flex flex-wrap gap-2">{highlights.facilities.map(item=><li key={item} className="rounded-full bg-[#f2e6d5] px-3 py-2 text-sm font-bold text-primary">{item}</li>)}</ul></article><article className="rounded-[1.25rem] border border-border bg-[#e8eee8] p-5 sm:p-6"><CalendarDays className="size-5 text-sacred-green"/><h2 className="mt-3 font-serif text-2xl font-bold text-primary">નિયમિત આશ્રમ જીવન</h2><ul className="mt-4 space-y-2">{highlights.programmes.map(item=><li key={item} className="border-b border-sacred-green/15 pb-2 text-sm font-bold text-[#294c45]">{item}</li>)}</ul><Link href="/events" className="mt-5 inline-flex min-h-11 items-center font-bold text-primary">કાર્યક્રમો જુઓ</Link></article></div>}</section>
  </main>;
}
