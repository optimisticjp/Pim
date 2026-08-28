import Link from "next/link";
import { ArrowRight, MapPin, Play, Radio, ScrollText } from "lucide-react";

import { BrandMark } from "@/components/ui/brand-mark";
import { invocation } from "@/lib/site-data";

export function HomeHero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#fbf7ef]">
      <div className="absolute inset-y-0 right-0 -z-10 w-[58%] bg-[radial-gradient(circle_at_55%_28%,rgba(199,129,43,.14),transparent_24rem)]" />
      <div className="absolute -right-28 top-16 -z-10 h-[35rem] w-[35rem] rounded-full border border-primary/8" />
      <div className="absolute -right-12 top-32 -z-10 h-[25rem] w-[25rem] rounded-full border border-gold/14" />

      <div className="container-site grid min-h-[720px] items-center gap-12 py-14 lg:grid-cols-[1.08fr_.92fr] lg:py-20">
        <div>
          <div className="eyebrow">શ્રી સચ્ચિદાનંદ માધવાનંદ સદ્‌ગુરુ પરંપરા</div>
          <h1 className="display-title mt-5 max-w-4xl text-primary-strong">સત્સંગથી અંતર પ્રકાશિત થાય, સેવાથી સમાજ.</h1>
          <p className="body-large mt-6 max-w-2xl">વેદ-ઉપનિષદના જ્ઞાન, ગુરુભક્તિ અને માનવસેવાની અવિરત પરંપરા. સત્સંગ સાંભળો, નજીકના આશ્રમ સુધી પહોંચો અને આશ્રમ પરિવારની સેવાયાત્રામાં જોડાઓ.</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/satsang" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground shadow-[0_12px_30px_rgba(113,31,45,.18)] transition hover:bg-primary-strong">
              <Play className="h-4 w-4 fill-current" /> આજનો સત્સંગ
            </Link>
            <Link href="/ashrams" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border-strong bg-surface px-6 py-3 font-bold text-primary transition hover:border-primary/30 hover:bg-surface-soft">
              <MapPin className="h-4 w-4" /> આશ્રમ શોધો
            </Link>
          </div>

          <div className="mt-10 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["૨૦૦+", "વર્ષોની પરંપરા"],
              ["૫૦+", "આશ્રમ શાખાઓ"],
              ["વેદ રહસ્ય", "ડિજિટલ સંગ્રહ"],
              ["YouTube", "નિયમિત સત્સંગ"],
            ].map(([value, label]) => (
              <div key={label} className="border-l border-border-strong pl-4">
                <div className="font-serif text-lg font-bold text-primary">{value}</div>
                <div className="mt-1 text-[12px] font-semibold leading-5 text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[520px] lg:mx-0 lg:justify-self-end">
          <div className="arch-frame pattern-jali relative overflow-hidden border border-primary/15 bg-[#6c1d2a] p-5 pt-24 shadow-[0_30px_80px_rgba(79,37,31,.22)] sm:p-7 sm:pt-28">
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#4d1720] to-transparent" />
            <div className="absolute left-1/2 top-9 h-12 w-px -translate-x-1/2 bg-gold/65" />
            <div className="absolute left-1/2 top-6 h-3 w-3 -translate-x-1/2 rounded-full border border-[#f0c474] bg-[#6c1d2a]" />

            <div className="relative rounded-[1.35rem] border border-white/13 bg-[#4b1821]/86 p-5 text-[#fff5e9] shadow-inner sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <BrandMark className="border-[#efbd6b]/45 bg-[#5b1b27] text-[#efbd6b]" />
                  <div>
                    <div className="text-[11px] font-bold tracking-[.1em] text-[#efbd6b]">ડિજિટલ સત્સંગ દ્વાર</div>
                    <div className="mt-1 font-serif text-lg font-bold">જય સચ્ચિદાનંદ</div>
                  </div>
                </div>
                <Radio className="h-5 w-5 text-[#efbd6b]" />
              </div>

              <div className="mt-8 border-y border-white/10 py-6">
                <div className="text-[12px] font-semibold text-[#d7c4b9]">નિયમિત પ્રસારણ</div>
                <h2 className="mt-2 font-serif text-2xl font-bold leading-snug">ગુરુ ગીતા પાઠ, પ્રવચન અને સત્સંગ</h2>
                <p className="mt-3 text-[14px] leading-7 text-[#d7c4b9]">અધિકૃત YouTube ચેનલના તાજા વિડિયો અને લાઇવ કાર્યક્રમો એક જ સ્થાનેથી જુઓ.</p>
              </div>

              <Link href="/satsang" className="mt-5 flex min-h-12 items-center justify-between rounded-xl bg-[#fff5e9] px-4 font-bold text-primary">
                સત્સંગ વિભાગ ખોલો <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="absolute -bottom-6 -left-5 hidden rounded-2xl border border-border bg-surface px-5 py-4 shadow-card sm:block">
            <div className="flex items-center gap-3">
              <ScrollText className="h-5 w-5 text-gold-deep" />
              <div>
                <div className="text-[11px] font-bold text-muted-foreground">વારસાગત સંગ્રહ</div>
                <div className="font-serif font-bold text-primary">વેદ રહસ્ય • ઐતિહાસિક પત્રો</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container-site pb-6 text-center text-[12px] font-semibold tracking-[.07em] text-gold-deep">{invocation}</div>
    </section>
  );
}
