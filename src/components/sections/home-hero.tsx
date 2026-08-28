import Link from "next/link";
import { ArrowRight, MapPin, Play } from "lucide-react";

import { BrandMark } from "@/components/ui/brand-mark";
import { invocation } from "@/lib/site-data";

export function HomeHero() {
  return (
    <section className="home-hero relative isolate overflow-hidden border-b border-border/70 bg-[#fbf7ef]">
      <div className="home-hero-pattern absolute inset-0 -z-20" aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

      <div className="container-site grid min-h-[43rem] items-center gap-12 py-14 md:py-20 lg:grid-cols-[1.05fr_.95fr] lg:gap-16 lg:py-24">
        <div className="max-w-[46rem]">
          <p className="font-serif text-[.82rem] font-semibold tracking-[.06em] text-gold-deep sm:text-sm">{invocation}</p>
          <div className="mt-7 flex items-center gap-3 text-primary">
            <span className="h-px w-8 bg-gold" aria-hidden="true" />
            <span className="text-sm font-bold tracking-[.08em]">જય સચ્ચિદાનંદ</span>
          </div>
          <h1 className="display-title mt-5 max-w-[12ch] text-primary-strong">શાંતિથી સત્સંગ તરફ, સેવાથી સાર્થકતા તરફ.</h1>
          <p className="body-large mt-6 max-w-[40rem]">વેદ-ઉપનિષદના જ્ઞાન, ગુરુભક્તિ અને માનવસેવાની પરંપરા સાથે જોડાતું ગુજરાતી ડિજિટલ ધામ.</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/satsang" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground shadow-[0_12px_30px_rgba(113,31,45,.16)] transition hover:bg-primary-strong">
              <Play className="h-4 w-4 fill-current" /> સત્સંગ જુઓ
            </Link>
            <Link href="/ashrams" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border-strong bg-surface px-6 py-3 font-bold text-primary transition hover:border-primary/30 hover:bg-surface-soft">
              <MapPin className="h-4 w-4" /> નજીકનો આશ્રમ શોધો
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[31rem] lg:justify-self-end">
          <div className="sacred-arch relative overflow-hidden border border-primary/15 bg-primary px-5 pb-6 pt-24 text-primary-foreground shadow-[0_28px_75px_rgba(79,37,31,.2)] sm:px-8 sm:pb-8 sm:pt-28">
            <div className="absolute inset-0 opacity-25 pattern-jali" aria-hidden="true" />
            <div className="absolute left-1/2 top-8 h-12 w-px -translate-x-1/2 bg-[#edbd70]" aria-hidden="true" />
            <div className="absolute left-1/2 top-6 h-3 w-3 -translate-x-1/2 rotate-45 border border-[#edbd70] bg-primary" aria-hidden="true" />
            <div className="relative border border-white/15 bg-[#5a1925]/90 px-5 py-7 text-center sm:px-8 sm:py-9">
              <BrandMark className="mx-auto h-14 w-14 border-[#efbd6b]/50 bg-[#681c29] text-[#efbd6b]" />
              <p className="mt-6 text-xs font-bold tracking-[.12em] text-[#efbd6b]">શ્રી સચ્ચિદાનંદ માધવાનંદ સદ્‌ગુરુ પરંપરા</p>
              <h2 className="mt-4 font-serif text-[1.8rem] font-bold leading-snug text-white sm:text-[2.15rem]">શાંતિ • પરંપરા<br />જ્ઞાન • સેવા</h2>
              <div className="mx-auto my-6 h-px w-20 bg-[#efbd6b]/60" />
              <p className="text-[15px] leading-7 text-[#eadbd0]">ગુરુપરંપરા, સત્સંગ, આશ્રમ અને સેવાપ્રવૃત્તિઓનો વિશ્વસનીય પ્રવેશ.</p>
              <Link href="/parampara" className="mt-6 inline-flex min-h-12 w-full items-center justify-between rounded-xl bg-[#fff8ec] px-4 font-bold text-primary">
                ગુરુપરંપરા જાણો <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
