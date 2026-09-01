import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenText, FileImage, FolderOpen, PlayCircle, ScrollText } from "lucide-react";

import { getPublicGuruProfiles, getPublicHeritageDocuments, getPublicMediaAssets, getPublicMediaFolders } from "@/lib/cms/public-data";
import { getPublicVedaIssues } from "@/lib/veda/public-data";

export const metadata: Metadata = {
  title: "વારસા સંગ્રહ",
  description: "સમિતિ દ્વારા પ્રકાશિત ગુરુપરંપરા, ઐતિહાસિક દસ્તાવેજ, વેદ રહસ્ય અને ડિજિટલ વારસાનો સંગ્રહ.",
};

const guMonths = ["", "જાન્યુઆરી", "ફેબ્રુઆરી", "માર્ચ", "એપ્રિલ", "મે", "જૂન", "જુલાઈ", "ઓગસ્ટ", "સપ્ટેમ્બર", "ઓક્ટોબર", "નવેમ્બર", "ડિસેમ્બર"];
const guNumber = (value: number) => new Intl.NumberFormat("gu-IN").format(value);

export default async function HeritagePage() {
  const [gurus, documents, folders, assets, vedaIssues] = await Promise.all([
    getPublicGuruProfiles(),
    getPublicHeritageDocuments(),
    getPublicMediaFolders(),
    getPublicMediaAssets(),
    getPublicVedaIssues(),
  ]);

  const featuredGurus = gurus.filter(guru => guru.featured).slice(0, 6);
  const shownGurus = featuredGurus.length ? featuredGurus : gurus.slice(0, 6);
  const letters = documents.filter(document => document.kind === "historical_letter");
  const otherDocuments = documents.filter(document => document.kind !== "historical_letter").slice(0, 6);
  const videos = assets.filter(asset => asset.media_type === "youtube" || asset.media_type === "video");
  const images = assets.filter(asset => asset.media_type === "image");

  return <main>
    <header className="relative overflow-hidden border-b border-border bg-[#efe1ce]">
      <div className="pattern-jali absolute inset-0 opacity-30" aria-hidden="true" />
      <div className="container-site relative py-12 sm:py-16 lg:py-20">
        <p className="eyebrow">વારસા સંગ્રહ</p>
        <h1 className="display-title mt-4 max-w-[14ch] text-primary-strong">સમિતિ દ્વારા સંચાલિત જીવંત ડિજિટલ વારસો</h1>
        <p className="body-large mt-5 max-w-3xl">આ પાનાં પર હવે Guru & Heritage CMS, Media Library અને Veda Rahasya Adminમાંથી Publish થયેલી સામગ્રી જ દેખાય છે. Draft અથવા Archived સામગ્રી જાહેરમાં દેખાતી નથી.</p>
      </div>
    </header>

    <section className="section-pad">
      <div className="container-site">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">ગુરુપરંપરા</p><h2 className="section-title mt-3 text-primary-strong">પ્રકાશિત ગુરુ પ્રોફાઇલ</h2></div><Link href="/parampara" className="inline-flex min-h-11 items-center gap-2 self-start rounded-full border border-border-strong px-5 font-bold text-primary">બધી પ્રોફાઇલ જુઓ <ArrowRight className="size-4" /></Link></div>
        {shownGurus.length ? <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{shownGurus.map(guru => <Link href={`/parampara/${guru.slug}`} key={guru.id} className="rounded-2xl border border-[#d8c4aa] bg-surface p-5"><div className="flex size-11 items-center justify-center rounded-full bg-primary font-bold text-white">{guru.name_gu.trim().charAt(0)}</div><h3 className="mt-4 font-serif text-xl font-bold text-primary-strong">{guru.name_gu}</h3>{guru.qualification_gu ? <p className="mt-2 text-xs font-bold text-gold-deep">{guru.qualification_gu}</p> : null}<p className="mt-4 text-sm font-bold text-primary">વિગત વાંચો →</p></Link>)}</div> : <p className="mt-6 rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">હાલ કોઈ ગુરુ પ્રોફાઇલ Publish નથી.</p>}
      </div>
    </section>

    <section className="border-y border-border bg-[#f1e5d3] section-pad">
      <div className="container-site">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><ScrollText className="size-6 text-gold-deep" /><p className="eyebrow mt-3">ઐતિહાસિક પત્રો</p><h2 className="section-title mt-3 text-primary-strong">પ્રકાશિત પત્ર અને સ્કેન</h2></div><Link href="/heritage/letters" className="inline-flex min-h-11 items-center gap-2 self-start rounded-full border border-border-strong px-5 font-bold text-primary">પત્રસંગ્રહ જુઓ <ArrowRight className="size-4" /></Link></div>
        <div className="mt-6 rounded-2xl border border-[#d8c2a5] bg-[#fffaf2] p-6"><p className="font-serif text-2xl font-bold text-primary">{guNumber(letters.length)} પ્રકાશિત પત્ર નોંધ</p><p className="mt-2 text-sm leading-7 text-muted-foreground">Adminમાં Historical Letter તરીકે Publish કરેલી નોંધો અહીં અને પત્રસંગ્રહ પાનાં પર દેખાય છે.</p></div>
      </div>
    </section>

    <section className="section-pad">
      <div className="container-site">
        <p className="eyebrow">દસ્તાવેજ સંગ્રહ</p><h2 className="section-title mt-3 text-primary-strong">પ્રકાશિત ઐતિહાસિક દસ્તાવેજ</h2>
        {otherDocuments.length ? <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{otherDocuments.map(document => <article key={document.id} className="rounded-2xl border border-border bg-surface p-5"><ScrollText className="size-5 text-gold-deep" /><p className="mt-4 text-xs font-bold uppercase tracking-wide text-muted-foreground">{document.kind}</p><h3 className="mt-2 font-serif text-xl font-bold text-primary-strong">{document.title_gu}</h3>{document.description_gu ? <p className="mt-2 text-sm leading-7 text-muted-foreground">{document.description_gu}</p> : null}<div className="mt-4 flex flex-wrap gap-2">{document.file_url ? <a href={document.file_url} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center rounded-xl bg-primary px-3 text-sm font-bold text-white">ફાઇલ ખોલો</a> : null}{document.image_url ? <a href={document.image_url} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center rounded-xl border border-border-strong px-3 text-sm font-bold text-primary">સ્કેન જુઓ</a> : null}</div></article>)}</div> : <p className="mt-6 rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">હાલ અન્ય ઐતિહાસિક દસ્તાવેજ Publish નથી.</p>}
      </div>
    </section>

    <section className="border-y border-border bg-surface-soft section-pad">
      <div className="container-site">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><BookOpenText className="size-6 text-primary" /><p className="eyebrow mt-3">વેદ રહસ્ય</p><h2 className="section-title mt-3 text-primary-strong">તાજેતરના પ્રકાશિત અંકો</h2></div><Link href="/publications" className="inline-flex min-h-11 items-center gap-2 self-start rounded-full border border-border-strong px-5 font-bold text-primary">ડિજિટલ ગ્રંથાલય <ArrowRight className="size-4" /></Link></div>
        {vedaIssues.length ? <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{vedaIssues.slice(0, 3).map(issue => <article key={issue.id} className="rounded-2xl border border-border bg-white p-5"><p className="text-xs font-bold text-gold-deep">{guMonths[issue.issue_month]} {guNumber(issue.issue_year)}</p><h3 className="mt-2 font-serif text-xl font-bold text-primary">{issue.title_gu}</h3>{issue.pdf_url ? <a href={issue.pdf_url} target="_blank" rel="noreferrer" className="mt-4 inline-flex min-h-10 items-center rounded-xl bg-primary px-3 text-sm font-bold text-white">PDF વાંચો</a> : null}</article>)}</div> : <p className="mt-6 text-sm text-muted-foreground">હાલ કોઈ Veda issue Publish નથી.</p>}
      </div>
    </section>

    <section className="section-pad">
      <div className="container-site">
        <p className="eyebrow">ડિજિટલ મીડિયા</p><h2 className="section-title mt-3 text-primary-strong">Media Library સાથે જોડાયેલ સંગ્રહ</h2>
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><div className="rounded-2xl border border-border bg-surface p-5"><FolderOpen className="size-5 text-gold-deep" /><p className="mt-3 font-serif text-3xl font-bold text-primary">{guNumber(folders.length)}</p><p className="mt-1 text-sm text-muted-foreground">પ્રકાશિત ફોલ્ડર</p></div><div className="rounded-2xl border border-border bg-surface p-5"><PlayCircle className="size-5 text-primary" /><p className="mt-3 font-serif text-3xl font-bold text-primary">{guNumber(videos.length)}</p><p className="mt-1 text-sm text-muted-foreground">Video / YouTube</p></div><div className="rounded-2xl border border-border bg-surface p-5"><FileImage className="size-5 text-sacred-green" /><p className="mt-3 font-serif text-3xl font-bold text-primary">{guNumber(images.length)}</p><p className="mt-1 text-sm text-muted-foreground">પ્રકાશિત ફોટા</p></div><Link href="/downloads" className="rounded-2xl border border-primary/20 bg-primary p-5 text-white"><FolderOpen className="size-5 text-[#efbd6b]" /><h3 className="mt-3 font-serif text-xl font-bold">ડિજિટલ પ્રસાદ ખોલો</h3><p className="mt-2 text-sm text-white/75">Audio, PDF, photos અને video folders જુઓ.</p></Link></div>
      </div>
    </section>
  </main>;
}
