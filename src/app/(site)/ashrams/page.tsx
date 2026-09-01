import { ArrowRight, MapPinned, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { LiveAshramDirectory } from "@/components/ashrams/live-ashram-directory";
import { getPublicAshrams } from "@/lib/operations/public-data";

export const metadata = {
  title: "આશ્રમ યાત્રા માર્ગદર્શિકા",
  description: "સમિતિ દ્વારા જાહેર કરાયેલી શ્રી માધવાનંદ આશ્રમ પરિવારનાં કેન્દ્રો, સરનામાં અને સંપર્ક માહિતી મેળવો.",
};

export default async function AshramsPage() {
  const ashrams = await getPublicAshrams();
  return <>
    <header className="relative overflow-hidden border-b border-border bg-surface-soft">
      <div className="pattern-jali absolute inset-y-0 right-0 hidden w-1/3 opacity-50 lg:block" aria-hidden="true" />
      <div className="container-site relative py-10 sm:py-14 lg:py-16">
        <div className="max-w-3xl">
          <p className="eyebrow">આશ્રમ પરિવાર</p>
          <h1 className="mt-4 font-serif text-[2.25rem] font-bold leading-[1.14] tracking-[-.025em] text-primary-strong sm:text-5xl">આપની નજીકનું આશ્રમ કેન્દ્ર શોધો</h1>
          <p className="mt-4 max-w-2xl text-[16px] leading-7 text-muted-foreground sm:text-[18px]">સમિતિ દ્વારા ચકાસીને જાહેર કરાયેલી આશ્રમ માહિતી અહીં મળે છે. યાત્રા પહેલાં ઉપલબ્ધ સરનામું, ફોન અને મેપ વિગતો તપાસી લો.</p>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[13px] font-bold text-sacred-green"><span className="inline-flex items-center gap-1.5"><MapPinned className="size-4" />{ashrams.length} આશ્રમ કેન્દ્ર</span><span className="inline-flex items-center gap-1.5"><ShieldCheck className="size-4" />સમિતિ દ્વારા જાહેર માહિતી</span></div>
        </div>
      </div>
    </header>

    <main>
      <section className="container-site py-7 sm:py-10" aria-label="આશ્રમ શોધ અને પરિણામો"><LiveAshramDirectory ashrams={ashrams}/></section>
      <section className="border-y border-border bg-surface-soft py-10 sm:py-14"><div className="container-site grid gap-5 md:grid-cols-3"><article className="rounded-2xl border border-border bg-surface p-5"><ShieldCheck className="size-5 text-sacred-green"/><h2 className="mt-3 font-serif text-lg font-bold text-primary">ચકાસેલી માહિતી</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">સમિતિ દ્વારા જાહેર કરવા માટે ચકાસેલી આશ્રમ માહિતી અહીં દેખાય છે.</p></article><article className="rounded-2xl border border-border bg-surface p-5"><MapPinned className="size-5 text-sacred-green"/><h2 className="mt-3 font-serif text-lg font-bold text-primary">યાત્રા પહેલાં તપાસ</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">ઉતારો અથવા કાર્યક્રમ માટે ઉપલબ્ધ ફોન/મેપ માહિતીથી પહેલાં સંપર્ક કરવો હિતાવહ છે.</p></article><article className="rounded-2xl border border-border bg-surface p-5"><ArrowRight className="size-5 text-sacred-green"/><h2 className="mt-3 font-serif text-lg font-bold text-primary">સુધારો સૂચવવો છે?</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">ખોટી અથવા અધૂરી માહિતી મળે તો સમિતિને ચકાસણી માટે જાણ કરો.</p></article></div></section>
      <section className="border-t border-border bg-primary py-10 text-primary-foreground sm:py-12"><div className="container-site flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-[13px] font-bold text-primary-foreground/70">માહિતી પૂર્ણ કરવામાં સહયોગ</p><h2 className="mt-1 font-serif text-2xl font-bold sm:text-3xl">આશ્રમની અધિકૃત વિગત મોકલવી છે?</h2><p className="mt-2 max-w-2xl text-[15px] text-primary-foreground/75">સમિતિ ચકાસણી માટે સંપર્ક પૃષ્ઠ દ્વારા માહિતી મોકલી શકો છો.</p></div><Link href="/contact" className="tap-target inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full bg-primary-foreground px-5 py-2.5 font-bold text-primary sm:self-auto">સંપર્ક કરો<ArrowRight className="size-4" /></Link></div></section>
    </main>
  </>;
}
