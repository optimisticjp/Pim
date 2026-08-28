import Link from "next/link";
import { MapPin, Play } from "lucide-react";

import { HomeIdentityCard } from "@/components/sections/home-identity-card";
import { invocation } from "@/lib/site-data";

export function HomeHero() {
  return (
    <section className="home-hero relative isolate overflow-hidden border-b border-border/70 bg-[#fbf7ef]">
      <div className="home-hero-pattern absolute inset-0 -z-20" aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

      <div className="container-site grid items-center gap-8 py-9 sm:py-12 md:py-16 lg:grid-cols-[1.05fr_.95fr] lg:gap-16 lg:min-h-[42rem] lg:py-20">
        <div className="max-w-[46rem]">
          <p className="font-serif text-[.82rem] font-semibold tracking-[.06em] text-gold-deep sm:text-sm">{invocation}</p>
          <div className="mt-4 flex items-center gap-3 text-primary">
            <span className="h-px w-8 bg-gold" aria-hidden="true" />
            <span className="text-sm font-bold tracking-[.08em]">જય સચ્ચિદાનંદ</span>
          </div>
          <h1 className="display-title mt-3 max-w-[12ch] text-primary-strong">શાંતિથી સત્સંગ તરફ, સેવાથી સાર્થકતા તરફ.</h1>
          <p className="body-large mt-4 max-w-[40rem]">વેદ-ઉપનિષદના જ્ઞાન, ગુરુભક્તિ અને માનવસેવાની પરંપરા સાથે જોડાતું ગુજરાતી ડિજિટલ ધામ.</p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/satsang" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground shadow-[0_12px_30px_rgba(113,31,45,.16)] transition hover:bg-primary-strong">
              <Play className="h-4 w-4 fill-current" /> સત્સંગ જુઓ
            </Link>
            <Link href="/ashrams" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border-strong bg-surface px-6 py-3 font-bold text-primary transition hover:border-primary/30 hover:bg-surface-soft">
              <MapPin className="h-4 w-4" /> નજીકનો આશ્રમ શોધો
            </Link>
          </div>
        </div>

        <HomeIdentityCard className="relative mx-auto hidden w-full max-w-[31rem] lg:block lg:justify-self-end" />
      </div>
    </section>
  );
}
