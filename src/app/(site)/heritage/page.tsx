import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenText, CalendarDays, ExternalLink, LibraryBig, PlayCircle, Radio, ScrollText } from "lucide-react";

import { GuruCard } from "@/components/heritage/guru-card";
import { GuruPortrait } from "@/components/heritage/guru-portrait";
import { SectionHeading } from "@/components/ui/section-heading";
import { heritageRecords } from "@/lib/migration/heritage-data";
import { featuredGuruProfiles, guruProfiles } from "@/lib/migration/guru-data";
import { legacyArchivedEvents } from "@/lib/migration/legacy-event-data";
import { historicalVideoCollections } from "@/lib/migration/video-data";
import { legacyVedaRahasyaIssues } from "@/lib/migration/veda-rahasya-data";

export const metadata: Metadata = {
  title: "વારસા સંગ્રહ",
  description: "શ્રી માધવાનંદજી મહારાજ, ગુરુપરંપરા અને ઉપલબ્ધ વેદ રહસ્ય પ્રકાશનોનો સ્રોતસચેત ડિજિટલ વારસા પ્રવેશ.",
};

export default function HeritagePage() {
  const history = heritageRecords.filter((record) => record.kind !== "channel");
  return <main>
    <header className="relative overflow-hidden border-b border-border bg-[#efe1ce]">
      <div className="pattern-jali absolute inset-0 opacity-30" aria-hidden="true" />
      <div className="container-site relative py-12 sm:py-16 lg:py-20">
        <p className="eyebrow">વારસા સંગ્રહ</p>
        <h1 className="display-title mt-4 max-w-[13ch] text-primary-strong">સ્મૃતિને સંદર્ભ સાથે સાચવતો ડિજિટલ વારસો</h1>
        <p className="body-large mt-5 max-w-3xl">ગુરુપરંપરાની ઉપલબ્ધ ઐતિહાસિક નોંધો, વેદ રહસ્યના અંકો અને અધિકૃત સત્સંગ તરફનો શાંત, સંપાદકીય પ્રવેશ.</p>
      </div>
    </header>

    <section className="border-b border-border bg-[#37151c] text-white"><div className="container-site grid gap-8 py-12 lg:grid-cols-[.72fr_1.28fr] lg:items-center lg:gap-14"><GuruPortrait profile={guruProfiles[0]} className="sacred-arch mx-auto aspect-[4/5] w-full max-w-sm" priority/><div><p className="text-xs font-bold text-[#efbd6b]">પરંપરાનું દૃશ્ય અભિલેખ</p><h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">{guruProfiles[0].nameGu}</h2><p className="mt-4 max-w-2xl leading-8 text-[#d8c7bb]">ઉપલબ્ધ અભિલેખોમાં નામ અને ચિત્ર સાથે નોંધાયેલી ૧૭ આધ્યાત્મિક વ્યક્તિત્વોની પસંદ કરેલી દૃશ્યસૂચિ.</p><Link href="/parampara" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 font-bold text-primary">ગુરુપરંપરા જુઓ <ArrowRight className="size-4"/></Link></div></div></section>

    <section className="section-pad"><div className="container-site"><SectionHeading eyebrow="સંત-સ્વામી ચિત્રસંગ્રહ" title="સ્રોત સાથે ઓળખાયેલી વ્યક્તિત્વ છબીઓ" description="ગુરુપરંપરાના ઉપલબ્ધ ઐતિહાસિક ચિત્રો — નામ અને ઉપાધિ સાથે સંભાળપૂર્વક ગોઠવાયેલ સંગ્રહ."/><div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">{featuredGuruProfiles.map(profile=><GuruCard key={profile.id} profile={profile}/>)}</div></div></section>

    <section className="section-pad">
      <div className="container-site grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:gap-14">
        <SectionHeading eyebrow="પરંપરાનું મૂળ" title="પ્રમાણિત નોંધ જેટલું જ કહીએ" description="આ સંગ્રહ અપૂર્ણ હોવા છતાં ઉપયોગી છે. ચોક્કસ વર્ષ, ઉપાધિ કે ઓળખ સ્રોત વિના ઉમેરવામાં આવતી નથી." />
        <div className="grid gap-4 sm:grid-cols-2">
          {history.map((record, index) => <article key={record.id} className={`rounded-[1.35rem] border p-6 ${index === 0 ? "border-primary/20 bg-primary text-white sm:row-span-2" : "border-[#d8c2a5] bg-surface"}`}>
            <ScrollText className={`size-6 ${index === 0 ? "text-[#efbd6b]" : "text-gold-deep"}`} aria-hidden="true" />
            <h2 className={`mt-8 font-serif text-2xl font-bold ${index === 0 ? "text-white" : "text-primary-strong"}`}>{record.titleGu}</h2>
            <p className={`mt-3 leading-8 ${index === 0 ? "text-[#eadbd0]" : "text-muted-foreground"}`}>{record.descriptionGu}</p>
            <Link href="/parampara" className="mt-6 inline-flex min-h-11 items-center gap-2 font-bold">ગુરુપરંપરા વાંચો <ArrowRight className="size-4" /></Link>
          </article>)}
        </div>
      </div>
    </section>

    <section className="border-y border-border bg-[#f1e5d3] section-pad"><div className="container-site grid gap-8 lg:grid-cols-[.75fr_1.25fr]"><div><ScrollText className="size-7 text-gold-deep"/><p className="eyebrow mt-4">ઐતિહાસિક પત્રો</p><h2 className="section-title mt-3 text-primary-strong">માધવાનંદ પરિવાર માટે સાચવાયેલ પત્રવારસો</h2></div><article className="rounded-[1.4rem] border border-[#cdb18d] bg-[#fffaf1] p-6 sm:p-8"><p className="font-serif text-2xl font-bold leading-relaxed text-primary">સ્વામી શ્રી દ્વારા લખાયેલા ઐતિહાસિક પત્રો માધવાનંદ પરિવાર માટે સંરક્ષિત કરવામાં આવ્યા છે.</p><p className="mt-4 leading-8 text-muted-foreground">આ પત્રસંગ્રહ માટે શ્રી દેવરાજભાઈ પ્રેમજીભાઈ મોનપરા (નવડા)નું સન્માનપૂર્વક સ્મરણ કરવામાં આવ્યું છે.</p><a href="https://omshreemadhavanandji.org/letter.php" target="_blank" rel="noreferrer" className="mt-6 inline-flex min-h-11 items-center gap-2 font-bold text-primary">પત્રસંગ્રહ જુઓ <ExternalLink className="size-4"/></a></article></div></section>

    <section className="border-y border-border bg-surface section-pad">
      <div className="container-site">
        <SectionHeading eyebrow="ડિજિટલ ગ્રંથાલય" title="વેદ રહસ્યના ઉપલબ્ધ વારસા અંકો" description="૨૦૧૪થી ૨૦૧૮ વચ્ચેના ઉપલબ્ધ વેદ રહસ્ય અંકોમાંથી પસંદ કરેલા અંકો." />
        <div className="mt-9 grid gap-5 md:grid-cols-3">
          {legacyVedaRahasyaIssues.slice(0, 3).map((publication) => <article key={publication.id} className="flex min-h-72 flex-col overflow-hidden rounded-[1.25rem] border border-[#d8c4aa] bg-[#fffaf2]">
            <div className="pattern-jali flex flex-1 flex-col justify-end border-b border-[#d8c4aa] bg-[#f1e5d3] p-5">
              <BookOpenText className="size-6 text-gold-deep" aria-hidden="true" />
              <h2 className="mt-8 font-serif text-2xl font-bold text-primary-strong">{publication.titleGu}</h2>
              <p className="mt-2 font-bold text-primary">{publication.editionGu}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 p-4">
              <Link href={`/publications/${publication.slug}`} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-3 font-bold text-white">વાંચો</Link>
              {publication.pdfUrl ? <a href={publication.pdfUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border-strong px-3 font-bold text-primary">PDF <ExternalLink className="size-4" /></a> : null}
            </div>
          </article>)}
        </div>
      </div>
    </section>

    <section className="section-pad"><div className="container-site"><SectionHeading eyebrow="ઐતિહાસિક સત્સંગ" title="ઐતિહાસિક વિડિયો સંગ્રહ" description="પ્રવચન, જ્ઞાનયજ્ઞ અને પરંપરાના ઉપલબ્ધ વિડિયો સંગ્રહો."/><div className="mt-8 grid gap-4 md:grid-cols-2">{historicalVideoCollections.map(item=><a key={item.id} href={item.sourceUrl} target="_blank" rel="noreferrer" className="rounded-[1.25rem] border border-border bg-surface p-5"><PlayCircle className="size-6 text-gold-deep"/><h3 className="mt-5 font-serif text-xl font-bold text-primary">{item.titleGu}</h3>{item.contextGu?<p className="mt-2 text-sm text-muted-foreground">{item.contextGu}</p>:null}<p className="mt-4 font-bold text-sacred-green">{item.videoCount} વિડિયો • સંગ્રહ ખોલો</p></a>)}</div></div></section>

    <section className="border-y border-border bg-surface section-pad"><div className="container-site"><div className="mb-6 flex justify-end"><Link href="/heritage/gallery" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border-strong px-5 font-bold text-primary">ચિત્રસંગ્રહ જુઓ <ArrowRight className="size-4"/></Link></div><SectionHeading eyebrow="પ્રસંગ સ્મૃતિ" title="પરિવારના ઐતિહાસિક કાર્યક્રમો"/><div className="mt-8 grid gap-4 md:grid-cols-3">{legacyArchivedEvents.map(event=><Link key={event.id} href={`/events/${event.slug}`} className="rounded-[1.25rem] border border-border bg-background p-5"><CalendarDays className="size-5 text-gold-deep"/><h3 className="mt-4 font-serif text-xl font-bold text-primary">{event.titleGu}</h3><p className="mt-3 text-sm text-muted-foreground">{event.venueGu}</p><span className="mt-5 inline-flex min-h-11 items-center gap-2 font-bold text-primary">પ્રસંગ જુઓ <ArrowRight className="size-4"/></span></Link>)}</div></div></section>

    <section className="section-pad">
      <div className="container-site grid gap-5 md:grid-cols-2">
        <Link href="/publications" className="rounded-[1.25rem] border border-border bg-surface p-6"><LibraryBig className="size-6 text-gold-deep" /><h2 className="mt-5 font-serif text-2xl font-bold text-primary">ડિજિટલ ગ્રંથાલય</h2><p className="mt-2 leading-7 text-muted-foreground">પ્રકાશન પ્રકાર, વર્ષ અને વર્ણન દ્વારા ઉપલબ્ધ સંગ્રહ શોધો.</p><span className="mt-5 inline-flex min-h-11 items-center gap-2 font-bold text-primary">પ્રકાશનો જુઓ <ArrowRight className="size-4" /></span></Link>
        <Link href="/satsang" className="rounded-[1.25rem] bg-[#37151c] p-6 text-white"><Radio className="size-6 text-[#efbd6b]" /><h2 className="mt-5 font-serif text-2xl font-bold">જીવંત સત્સંગ વારસો</h2><p className="mt-2 leading-7 text-[#d8c7bb]">અધિકૃત YouTube ચેનલ પર ઉપલબ્ધ પ્રવચન અને પાઠ સાથે જોડાઓ.</p><span className="mt-5 inline-flex min-h-11 items-center gap-2 font-bold">સત્સંગ જુઓ <ArrowRight className="size-4" /></span></Link>
      </div>
    </section>
  </main>;
}
