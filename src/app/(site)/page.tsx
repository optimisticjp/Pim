import Link from "next/link";
import { ArrowRight, BookOpenText, CalendarDays, Camera, HeartHandshake, Landmark, MapPin, Radio, ScrollText } from "lucide-react";

import { YouTubeMark } from "@/components/icons/youtube-mark";
import { YouTubeFacade } from "@/components/media/youtube-facade";
import { AshramCard } from "@/components/cards/ashram-card";
import { EventCard } from "@/components/cards/event-card";
import { SevaCard } from "@/components/cards/seva-card";
import { HomeHero } from "@/components/sections/home-hero";
import { HomeIdentityCard } from "@/components/sections/home-identity-card";
import { MadhavRekha } from "@/components/ui/madhav-rekha";
import { SectionHeading } from "@/components/ui/section-heading";
import { getUpcomingEvents } from "@/lib/event-data";
import { featuredAshrams, sevaActivities, youtubeChannel, youtubeChannelId } from "@/lib/site-data";

const quickActions = [
  { icon: CalendarDays, label: "આગામી કાર્યક્રમો", note: "તારીખ અને સ્થળ જુઓ", href: "/events" },
  { icon: Radio, label: "સત્સંગ જુઓ", note: "અધિકૃત વિડિયો", href: "/satsang" },
  { icon: MapPin, label: "આશ્રમ શોધો", note: "નજીકનું કેન્દ્ર શોધો", href: "/ashrams" },
  { icon: BookOpenText, label: "પ્રકાશનો વાંચો", note: "વેદ રહસ્ય સંગ્રહ", href: "/publications" },
];

export default function HomePage() {
  const upcomingEvents = getUpcomingEvents().slice(0, 3);
  return (
    <>
      <HomeHero />

      <section aria-label="ઝડપી સેવાઓ" className="relative z-10 bg-surface py-5 shadow-[0_10px_35px_rgba(72,45,28,.05)] sm:py-6">
        <div className="container-site grid grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-3">
          {quickActions.map(({ icon: Icon, label, note, href }) => (
            <Link key={href} href={href} className="group flex min-h-[6.5rem] flex-col justify-between rounded-2xl border border-border bg-background p-4 transition hover:border-gold/45 hover:bg-surface-soft sm:min-h-[7rem] sm:p-5">
              <Icon className="h-5 w-5 text-gold-deep" aria-hidden="true" />
              <span className="mt-3 font-serif text-[1.02rem] font-bold leading-snug text-primary sm:text-lg">{label}</span>
              <span className="mt-1 hidden text-xs text-muted-foreground sm:block">{note}</span>
            </Link>
          ))}
          <HomeIdentityCard variant="compact" className="col-span-2 mt-2 md:col-span-4 lg:hidden" />
        </div>
      </section>

      <section className="py-11 sm:py-16 lg:py-20">
        <div className="container-site">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading eyebrow="આગામી કાર્યક્રમ" title="આશ્રમ પરિવાર સાથે જોડાયેલા રહો" description="સત્સંગ, પરંપરાગત કાર્યક્રમ અને સેવાકાર્યની ઉપલબ્ધ માહિતી એક જ સ્થાનેથી મેળવો." />
            <Link href="/events" className="inline-flex min-h-12 items-center gap-2 self-start rounded-full border border-border-strong bg-surface px-5 font-bold text-primary transition hover:bg-surface-soft">બધા કાર્યક્રમો <ArrowRight className="h-4 w-4" /></Link>
          </div>
          {upcomingEvents.length > 0 ? <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{upcomingEvents.map((event) => <EventCard key={event.id} event={event} />)}</div> : <div className="mt-7 flex flex-col gap-4 rounded-[1.25rem] border border-[#dbc9b5] bg-[#fffaf3] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"><p className="font-serif text-lg font-bold text-primary">હાલ નવી તારીખો જાહેર થવાની બાકી છે.</p><div className="flex flex-col gap-2 sm:flex-row"><Link href="/events" className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-5 font-bold text-white">કાર્યક્રમ પંચિકા જુઓ</Link><Link href="/satsang" className="inline-flex min-h-11 items-center justify-center rounded-full border border-border-strong px-5 font-bold text-primary">સત્સંગ જુઓ</Link></div></div>}
        </div>
      </section>

      <section className="border-y border-border/70 bg-surface py-11 sm:py-16 lg:py-20">
        <div className="container-site grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:items-center lg:gap-16">
          <SectionHeading eyebrow="ગુરુપરંપરા અને ઓળખ" title="ચાર દિશાઓ, એક સંતુલિત જીવનમાર્ગ" description="ધર્મ, ભક્તિ, જ્ઞાન અને વૈરાગ્ય — પરંપરાના આ ચાર આધારને આચરણ અને સ્વાધ્યાય સાથે જીવવાનો માર્ગ." />
          <MadhavRekha />
        </div>
      </section>

      <section className="overflow-hidden bg-[#37151c] text-[#f8ece0]">
        <div className="container-site grid gap-10 py-16 md:py-20 lg:grid-cols-[.88fr_1.12fr] lg:items-center lg:gap-16 lg:py-24">
          <div>
            <div className="text-xs font-bold tracking-[.1em] text-[#e6ad56]">અધિકૃત YouTube સત્સંગ</div>
            <h2 className="section-title mt-4 max-w-xl text-white">જ્યાં હો ત્યાંથી સત્સંગ સાથે જોડાઓ.</h2>
            <p className="mt-5 max-w-xl text-[17px] leading-8 text-[#d9c8bb]">તાજા પ્રવચન, ગુરુ ગીતા પાઠ અને કાર્યક્રમો અધિકૃત ચેનલ પર સરળતાથી જુઓ.</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/satsang" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#f8ece0] px-5 font-bold text-primary"><Radio className="h-4 w-4" /> સત્સંગ જુઓ</Link>
              <a href={youtubeChannel} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 px-5 font-bold text-white"><YouTubeMark className="h-4 w-4" /> YouTube ચેનલ</a>
            </div>
          </div>
          <YouTubeFacade playlistId={`UU${youtubeChannelId.slice(2)}`} title="શ્રી માધવાનંદ આશ્રમના તાજા સત્સંગ" compact />
        </div>
      </section>

      <section className="section-pad bg-surface">
        <div className="container-site">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading eyebrow="આશ્રમ પરિવાર" title="એક પરંપરા, અનેક કેન્દ્રો" description="ચકાસેલી સંપર્ક વિગતો સાથે મુખ્ય આશ્રમ કેન્દ્રો શોધો અને સીધી દિશા મેળવો." />
            <Link href="/ashrams" className="inline-flex min-h-12 items-center gap-2 self-start rounded-full bg-primary px-5 font-bold text-primary-foreground"><Landmark className="h-4 w-4" /> તમામ આશ્રમ જુઓ</Link>
          </div>
          <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{featuredAshrams.slice(0, 3).map((ashram) => <AshramCard key={ashram.id} ashram={ashram} />)}</div>
        </div>
      </section>

      <section className="section-pad border-y border-border/70">
        <div className="container-site">
          <SectionHeading eyebrow="સેવા એટલે સાધના" title="ભક્તિ જ્યારે સમાજ સુધી પહોંચે" description="સમાજ, પ્રકૃતિ અને નવી પેઢી માટે ચાલતી સેવા પ્રવૃત્તિઓને જાણો અને જોડાવાનો માર્ગ મેળવો." />
          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{sevaActivities.slice(0, 3).map((activity) => <SevaCard key={activity.id} activity={activity} />)}</div>
          <Link href="/activities" className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full border border-border-strong bg-surface px-5 font-bold text-primary">બધી સેવા પ્રવૃત્તિઓ <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>

      <section className="section-pad bg-[#f1e5d3]">
        <div className="container-site">
          <SectionHeading eyebrow="જ્ઞાન અને વારસો" title="વાંચનથી સંરક્ષણ સુધી" description="આધ્યાત્મિક વાંચન, પરંપરાની ઓળખ અને આશ્રમ પરિવારના પ્રસંગો સાથે જોડાઓ." />
          <div className="mt-9 grid gap-5 lg:grid-cols-[1.18fr_.91fr_.91fr]">
            {[
              { icon: BookOpenText, title: "વેદ રહસ્ય ડિજિટલ સંગ્રહ", copy: "ઉપલબ્ધ જૂના અંકોને વર્ષ અને અંક પ્રમાણે વાંચો અને PDF ખોલો.", href: "/publications", cta: "પ્રકાશનો વાંચો", featured: true },
              { icon: ScrollText, title: "વારસા સંગ્રહ", copy: "પરંપરાની સ્રોતસચેત નોંધો અને ઉપલબ્ધ ડિજિટલ પ્રકાશનો વાંચો.", href: "/heritage", cta: "વારસો જુઓ" },
              { icon: Camera, title: "પ્રસંગ સંગ્રહ", copy: "સત્સંગ, ઉત્સવ અને સેવાપ્રસંગોની સ્મૃતિ સાથે જોડાઓ.", href: "/events", cta: "પ્રસંગો જુઓ" },
            ].map(({ icon: Icon, title, copy, href, cta, featured }) => (
              <article key={title} className={`flex min-h-[14rem] flex-col rounded-[1.4rem] border p-6 sm:p-7 ${featured ? "border-primary/20 bg-primary text-primary-foreground" : "border-[#d8c2a5] bg-[#fffaf1]"}`}>
                <Icon className={`h-7 w-7 ${featured ? "text-[#efbd6b]" : "text-gold-deep"}`} />
                <h2 className={`mt-7 font-serif text-2xl font-bold leading-snug ${featured ? "text-white" : "text-primary-strong"}`}>{title}</h2>
                <p className={`mt-3 flex-1 text-[15px] leading-7 ${featured ? "text-[#eadbd0]" : "text-muted-foreground"}`}>{copy}</p>
                <Link href={href} className={`mt-6 inline-flex min-h-11 items-center gap-2 font-bold ${featured ? "text-white" : "text-primary"}`}>{cta} <ArrowRight className="h-4 w-4" /></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-14 sm:py-16">
        <div className="container-site rounded-[1.75rem] border border-primary/15 bg-[#fff9ef] px-5 py-9 sm:px-9 lg:flex lg:items-center lg:justify-between lg:gap-12 lg:px-12 lg:py-11">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-sm font-bold text-gold-deep"><HeartHandshake className="h-5 w-5" /> આશ્રમ પરિવાર સાથે જોડાઓ</div>
            <h2 className="mt-3 font-serif text-[clamp(1.8rem,3vw,2.7rem)] font-bold leading-tight text-primary-strong">સંપર્ક અને આશ્રમ વિગતો</h2>
            <p className="mt-4 text-[16px] leading-7 text-muted-foreground">મુખ્ય આશ્રમની ચકાસેલી સંપર્ક વિગતો, સરનામું અને પૂછપરછના માર્ગ એક જ સ્થળે જુઓ.</p>
          </div>
          <Link href="/contact" className="mt-7 inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 font-bold text-primary-foreground lg:mt-0">સંપર્ક જુઓ <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </>
  );
}
