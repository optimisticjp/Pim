import { ArrowRight, Compass, MapPinned, PhoneCall, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { AshramDirectory } from "@/components/ashrams/ashram-directory";
import { getAshramRegions, getAshrams } from "@/lib/ashram-data";

export const metadata = {
  title: "આશ્રમ યાત્રા માર્ગદર્શિકા",
  description: "શ્રી માધવાનંદ આશ્રમ પરિવારનાં કેન્દ્રો શહેર અને પ્રદેશ મુજબ શોધો તથા ચકાસેલ સંપર્ક માહિતી મેળવો.",
};

export default function AshramsPage() {
  const ashrams = getAshrams();
  const regions = getAshramRegions();
  const verified = ashrams.filter((item) => item.verified).length;

  return (
    <>
      <header className="relative overflow-hidden border-b border-border bg-surface-soft">
        <div className="pattern-jali absolute inset-y-0 right-0 hidden w-1/3 opacity-50 lg:block" aria-hidden="true" />
        <div className="container-site relative py-10 sm:py-14 lg:py-16">
          <div className="max-w-3xl">
            <p className="eyebrow">આશ્રમ પરિવાર</p>
            <h1 className="mt-4 font-serif text-[2.25rem] font-bold leading-[1.14] tracking-[-.025em] text-primary-strong sm:text-5xl">આપની નજીકનું આશ્રમ કેન્દ્ર શોધો</h1>
            <p className="mt-4 max-w-2xl text-[16px] leading-7 text-muted-foreground sm:text-[18px]">શહેર અને પ્રદેશ મુજબ શ્રી માધવાનંદ આશ્રમ પરિવારનાં કેન્દ્રો શોધો. ઉપલબ્ધ ચકાસેલ સરનામું અને સંપર્ક માહિતી યાત્રા પહેલાં સહેલાઈથી મેળવો.</p>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[13px] font-bold text-sacred-green"><span className="inline-flex items-center gap-1.5"><MapPinned className="size-4" />{ashrams.length} આશ્રમ કેન્દ્રો</span><span className="inline-flex items-center gap-1.5"><ShieldCheck className="size-4" />{verified} ચકાસેલ સંપર્ક નોંધ</span></div>
          </div>
        </div>
      </header>

      <main>
        <section className="container-site py-6 sm:py-9" aria-label="આશ્રમ શોધ અને પરિણામો">
          <AshramDirectory ashrams={ashrams} regions={regions} />
        </section>

        <section className="border-y border-border bg-surface-soft py-12 sm:py-16" aria-labelledby="region-heading">
          <div className="container-site grid gap-7 lg:grid-cols-[.75fr_1.25fr] lg:items-start">
            <div><p className="eyebrow">પ્રદેશ પરિચય</p><h2 id="region-heading" className="mt-3 font-serif text-3xl font-bold text-primary-strong">આશ્રમ પરિવારનું વિસ્તરણ</h2><p className="mt-3 max-w-lg text-[16px] leading-7 text-muted-foreground">હાલની સ્રોત યાદીમાં ઉપલબ્ધ પ્રાદેશિક વર્ગીકરણ મુજબ કેન્દ્રોની સંખ્યા. ઉપરના ફિલ્ટરથી તે પ્રદેશની શાખાઓ તરત જુઓ.</p></div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {regions.map((region) => { const count = ashrams.filter((ashram) => ashram.region === region).length; return <li key={region} className="flex min-h-16 items-center justify-between rounded-2xl border border-border bg-surface px-4 py-3"><span className="font-bold text-foreground">{region}</span><span className="rounded-full bg-primary/8 px-3 py-1 text-[13px] font-bold text-primary">{count} કેન્દ્ર</span></li>; })}
            </ul>
          </div>
        </section>

        <section className="container-site py-12 sm:py-16" aria-labelledby="guidance-heading">
          <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
            <div><p className="eyebrow">યાત્રા સહાય</p><h2 id="guidance-heading" className="mt-3 font-serif text-3xl font-bold text-primary-strong">પ્રસ્થાન પહેલાં ધ્યાનમાં રાખો</h2><p className="mt-3 text-[16px] leading-7 text-muted-foreground">ડિરેક્ટરીની માહિતી ઉપયોગી માર્ગદર્શન માટે છે. યાત્રા, ઉતારો કે કાર્યક્રમ માટે ઉપલબ્ધ ચકાસેલ નંબર પર પહેલાં સંપર્ક કરવો હિતાવહ છે.</p></div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[{ icon: ShieldCheck, title: "ચકાસેલ નોંધ જુઓ", text: "લીલા ચિહ્નવાળી વિગત ઉપલબ્ધ સ્રોતથી ચકાસેલી છે." }, { icon: PhoneCall, title: "પહેલાં ફોન કરો", text: "ફોન માત્ર ચકાસેલ નંબર ઉપલબ્ધ હોય ત્યારે જ દેખાય છે." }, { icon: Compass, title: "અપૂર્ણ નોંધ", text: "વિગત ચકાસણી હેઠળ હોય તો સ્થાનિક માહિતી મળ્યા પછી જ આયોજન કરો." }].map(({ icon: Icon, title, text }) => <article key={title} className="rounded-2xl border border-border bg-surface p-5"><Icon className="size-5 text-sacred-green" aria-hidden="true" /><h3 className="mt-3 font-serif text-lg font-bold text-primary-strong">{title}</h3><p className="mt-2 text-[14px] leading-6 text-muted-foreground">{text}</p></article>)}
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-primary py-10 text-primary-foreground sm:py-12">
          <div className="container-site flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-[13px] font-bold text-primary-foreground/70">માહિતી પૂર્ણ કરવામાં સહયોગ</p><h2 className="mt-1 font-serif text-2xl font-bold sm:text-3xl">આશ્રમની અધિકૃત વિગત મોકલવી છે?</h2><p className="mt-2 max-w-2xl text-[15px] text-primary-foreground/75">સમિતિ ચકાસણી માટે સંપર્ક પૃષ્ઠ દ્વારા માહિતી મોકલી શકો છો.</p></div><Link href="/contact" className="tap-target inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full bg-primary-foreground px-5 py-2.5 font-bold text-primary sm:self-auto">સંપર્ક કરો<ArrowRight className="size-4" /></Link></div>
        </section>
      </main>
    </>
  );
}
