import type { Metadata } from "next";
import { ArrowRight, HeartHandshake, Landmark, Radio } from "lucide-react";
import Link from "next/link";

import { EventCard } from "@/components/cards/event-card";
import { getArchivedEvents, getRecurringProgrammes, getUpcomingEvents } from "@/lib/event-data";

export const metadata: Metadata = {
  title: "કાર્યક્રમ પંચિકા",
  description: "આશ્રમ પરિવારના જાહેર થયેલા કાર્યક્રમો, ઉત્સવો અને સત્સંગની ચકાસેલી તારીખ, સ્થળ અને જોડાવાની માહિતી મેળવો.",
};

export default function EventsPage() {
  const upcoming = getUpcomingEvents();
  const recurring = getRecurringProgrammes();
  const archived = getArchivedEvents();
  return (
    <>
      <section className="border-b border-border bg-[#f5eadc]">
        <div className="container-site py-9 sm:py-12">
          <div className="max-w-3xl">
            <p className="eyebrow">કાર્યક્રમ પંચિકા</p>
            <h1 className="display-title mt-4 text-primary-strong">આશ્રમ પરિવારના કાર્યક્રમો અને ઉત્સવો</h1>
            <p className="body-large mt-4">જાહેર થયેલા સત્સંગ, ઉત્સવ, સેવા કાર્યક્રમ અને વિશેષ પ્રસંગોની ચકાસેલી માહિતી અહીં મેળવો.</p>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-site">
          <p className="eyebrow">તારીખ મુજબ</p>
          <h2 className="section-title mt-3 text-primary-strong">આગામી કાર્યક્રમો</h2>
          {upcoming.length > 0 ? (
            <div className="mt-7 grid gap-5 lg:grid-cols-2">{upcoming.map((event) => <EventCard key={event.id} event={event} />)}</div>
          ) : (
            <div className="mt-6 rounded-[1.25rem] border border-[#dbc9b5] bg-[#fffaf3] p-5 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-6">
              <div><h3 className="font-serif text-xl font-bold text-primary">હાલ નવી તારીખો જાહેર થવાની બાકી છે.</h3><p className="mt-2 text-[15px] leading-7 text-muted-foreground">ચકાસેલી તારીખ જાહેર થતાં કાર્યક્રમની સંપૂર્ણ માહિતી અહીં ઉપલબ્ધ થશે.</p></div>
              <div className="mt-5 flex flex-col gap-2 sm:mt-0 sm:shrink-0 sm:flex-row">
                <Link href="/satsang" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 font-bold text-white"><Radio className="size-4" /> સત્સંગ જુઓ</Link>
                <Link href="/ashrams" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border-strong px-5 font-bold text-primary"><Landmark className="size-4" /> આશ્રમ શોધો</Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {recurring.length > 0 && <section className="section-pad border-y border-border bg-surface"><div className="container-site"><p className="eyebrow">નિયમિત જોડાણ</p><h2 className="section-title mt-3 text-primary-strong">નિયમિત સત્સંગ અને જોડાવાના માર્ગો</h2><div className="mt-7 grid gap-5 lg:grid-cols-2">{recurring.map((event) => <EventCard key={event.id} event={event} />)}</div></div></section>}
      {archived.length > 0 && <section className="section-pad border-t border-border"><div className="container-site"><p className="eyebrow">સ્મૃતિ અને સંદર્ભ</p><h2 className="section-title mt-3 text-primary-strong">પાછલા કાર્યક્રમો</h2><div className="mt-7 grid gap-5 lg:grid-cols-2">{archived.map((event) => <EventCard key={event.id} event={event} />)}</div></div></section>}

      <section className="pb-24 sm:pb-20">
        <div className="container-site rounded-[1.5rem] border border-primary/15 bg-[#f2e6d5] p-6 sm:flex sm:items-center sm:justify-between sm:gap-10 sm:p-8">
          <div className="max-w-2xl"><p className="flex items-center gap-2 text-sm font-bold text-gold-deep"><HeartHandshake className="size-5" /> આશ્રમ પરિવાર સાથે જોડાઓ</p><h2 className="mt-3 font-serif text-2xl font-bold text-primary-strong">કાર્યક્રમ અંગે પૂછવું છે કે સેવામાં જોડાવું છે?</h2><p className="mt-2 text-[15px] leading-7 text-muted-foreground">તમારો સંદેશ મોકલો; ઉપલબ્ધ માહિતીના આધારે માર્ગદર્શન મળશે.</p></div>
          <div className="mt-5 flex flex-col gap-2 sm:mt-0 sm:shrink-0"><Link href="/contact?type=seva" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 font-bold text-white">સેવામાં જોડાઓ <ArrowRight className="size-4" /></Link><Link href="/contact?type=event" className="inline-flex min-h-11 items-center justify-center rounded-full border border-border-strong bg-surface px-5 font-bold text-primary">કાર્યક્રમ અંગે પૂછો</Link></div>
        </div>
      </section>
    </>
  );
}
