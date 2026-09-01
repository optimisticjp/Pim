import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, HeartHandshake, Landmark, Radio, ScrollText } from "lucide-react";

import { getPublicGuruProfiles } from "@/lib/cms/public-data";

export const metadata: Metadata = {
  title: "ગુરુપરંપરા અને આશ્રમ પરિચય",
  description: "જાહેર કરાયેલા ગુરુપરંપરા પ્રોફાઇલ અને ઉપલબ્ધ આધ્યાત્મિક અભ્યાસનો પ્રવેશ.",
};

const paths = [
  [Radio, "સત્સંગ", "નિયમિત સત્સંગ અને કાર્યક્રમો સાથે જોડાઓ.", "/programmes"],
  [Landmark, "આશ્રમ", "સમિતિ દ્વારા પ્રકાશિત આશ્રમ કેન્દ્રો શોધો.", "/ashrams"],
  [HeartHandshake, "સેવા", "ચાલુ સેવા પ્રવૃત્તિઓ અને સ્વયંસેવક માર્ગ જુઓ.", "/seva"],
  [BookOpen, "પ્રકાશન", "વેદ રહસ્ય અને ડિજિટલ વાંચન મેળવો.", "/publications"],
] as const;

export default async function ParamparaPage() {
  const gurus = await getPublicGuruProfiles();
  const featured = gurus.filter(guru => guru.featured);
  const ordered = [...gurus].sort((a, b) => (a.lineage_order ?? 9999) - (b.lineage_order ?? 9999) || a.name_gu.localeCompare(b.name_gu, "gu"));
  const shown = featured.length ? featured : ordered;

  return <>
    <header className="relative overflow-hidden border-b border-border bg-[#f3e7d6]">
      <div className="pattern-jali absolute inset-y-0 right-0 hidden w-1/2 opacity-35 lg:block" aria-hidden="true" />
      <div className="container-site relative py-10 sm:py-14 lg:py-16">
        <div className="max-w-4xl">
          <p className="eyebrow">ગુરુપરંપરા</p>
          <h1 className="display-title mt-4 max-w-[14ch] text-primary-strong">જ્ઞાન, સાધના અને સેવાથી જીવંત પરંપરા</h1>
          <p className="body-large mt-5 max-w-3xl">જાહેર કરાયેલી ગુરુપરંપરાની ઉપલબ્ધ પ્રોફાઇલ અહીં એક જ જગ્યાએ વાંચી શકાય છે.</p>
        </div>
      </div>
    </header>

    <section className="section-pad">
      <div className="container-site">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="eyebrow">ગુરુ પરિચય</p><h2 className="section-title mt-3 text-primary-strong">ગુરુપરંપરાના ઉપલબ્ધ પરિચય</h2></div>
          <Link href="/heritage" className="inline-flex min-h-11 items-center gap-2 self-start rounded-full border border-border-strong px-5 font-bold text-primary">વારસા સંગ્રહ <ArrowRight className="size-4" /></Link>
        </div>

        {shown.length ? <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{shown.map(guru => <Link key={guru.id} href={`/parampara/${guru.slug}`} className="group rounded-[1.3rem] border border-[#d8c4aa] bg-surface p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">{guru.name_gu.trim().charAt(0)}</div>
          <h3 className="mt-5 font-serif text-xl font-bold leading-snug text-primary-strong">{guru.name_gu}</h3>
          {guru.qualification_gu ? <p className="mt-2 text-xs font-bold text-gold-deep">{guru.qualification_gu}</p> : null}
          <p className="mt-4 text-sm font-bold text-primary">વિગત અને અધ્યાય વાંચો →</p>
        </Link>)}</div> : <div className="mt-8 rounded-2xl border border-dashed border-border bg-surface p-8 text-sm text-muted-foreground">હાલ જાહેર વાંચન માટે કોઈ ગુરુ પ્રોફાઇલ ઉપલબ્ધ નથી.</div>}
      </div>
    </section>

    <section className="border-y border-border bg-surface-soft section-pad">
      <div className="container-site grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
        <div><ScrollText className="size-6 text-gold-deep" /><p className="eyebrow mt-4">અધ્યાય અને સ્રોત</p><h2 className="section-title mt-3 text-primary-strong">પ્રોફાઇલ ખોલો અને ઉપલબ્ધ અધ્યાય વાંચો</h2></div>
        <div className="space-y-4 text-[16px] leading-8 text-muted-foreground"><p>દરેક ગુરુ પ્રોફાઇલ સાથે જાહેર કરાયેલા ઉપલબ્ધ અધ્યાય વાંચી શકાય છે.</p><p>કોઈ ઐતિહાસિક માહિતી, ઉપાધિ, તારીખ અથવા વંશક્રમ સ્રોત વિના આપમેળે ઉમેરવામાં આવતો નથી.</p></div>
      </div>
    </section>

    <section className="section-pad">
      <div className="container-site">
        <p className="eyebrow">પરંપરા જીવનમાં</p>
        <h2 className="section-title mt-3 text-primary-strong">સત્સંગથી સેવા સુધી</h2>
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{paths.map(([Icon, title, text, href]) => <Link key={href} href={href} className="rounded-2xl border border-border bg-surface p-5"><Icon className="size-5 text-gold-deep" /><h3 className="mt-4 font-serif text-xl font-bold text-primary-strong">{title}</h3><p className="mt-2 text-sm leading-7 text-muted-foreground">{text}</p><p className="mt-4 text-sm font-bold text-primary">ખોલો →</p></Link>)}</div>
      </div>
    </section>
  </>;
}
