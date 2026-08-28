import Link from "next/link";
import { ArrowRight, BookOpenText, Camera, Landmark, Radio, ScrollText } from "lucide-react";
import { YouTubeMark } from "@/components/icons/youtube-mark";

import { AshramCard } from "@/components/cards/ashram-card";
import { EventCard } from "@/components/cards/event-card";
import { SevaCard } from "@/components/cards/seva-card";
import { HomeHero } from "@/components/sections/home-hero";
import { MadhavRekha } from "@/components/ui/madhav-rekha";
import { SectionHeading } from "@/components/ui/section-heading";
import { events, featuredAshrams, sevaActivities, youtubeChannel, youtubeChannelId } from "@/lib/site-data";

export default function HomePage() {
  return (
    <>
      <HomeHero />

      <section className="section-pad bg-surface">
        <div className="container-site">
          <SectionHeading eyebrow="માધવ ચતુષ્ટય" title="પરંપરાની ચાર જીવંત દિશાઓ" description="ધર્મ, ભક્તિ, જ્ઞાન અને વૈરાગ્યને માત્ર શબ્દ નહીં, જીવનના સંતુલિત માર્ગ તરીકે અનુભવવાની પરંપરા." align="center" />
          <div className="mt-10"><MadhavRekha /></div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-site">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading eyebrow="હમણાં શું મહત્વનું છે" title="સત્સંગ, કાર્યક્રમ અને સેવા" description="ભક્તને સૌથી વધુ જરૂરી ત્રણ પ્રવેશદ્વાર પ્રથમ નજરે મળે: શું સાંભળવું, ક્યાં જવું અને કેવી રીતે જોડાવું." />
            <Link href="/events" className="inline-flex min-h-11 items-center gap-2 self-start rounded-full border border-border-strong bg-surface px-5 font-bold text-primary">બધા કાર્યક્રમો <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="mt-9 grid gap-5 lg:grid-cols-3">{events.map((event) => <EventCard key={event.id} event={event} />)}</div>
        </div>
      </section>

      <section className="overflow-hidden bg-[#39151c] text-[#f8ece0]">
        <div className="container-site grid gap-10 py-16 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:py-20">
          <div>
            <div className="text-[12px] font-bold tracking-[.08em] text-[#e6ad56]">અધિકૃત YouTube સત્સંગ</div>
            <h2 className="section-title mt-4 text-white">સાંભળવા માટે સરળ. ફરી શોધવા માટે ગોઠવાયેલું.</h2>
            <p className="mt-5 max-w-xl text-[16px] leading-8 text-[#d9c8bb]">તાજા પ્રવચન, ગુરુ ગીતા પાઠ, ભાગવત કથા અને ચાતુર્માસના કાર્યક્રમો માટે YouTubeને જ વિડિયો હોસ્ટ રાખીએ છીએ. વેબસાઇટ તેમાં સરળ શોધ અને વિષયગત ગોઠવણી ઉમેરે છે.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/satsang" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#f8ece0] px-5 font-bold text-primary"><Radio className="h-4 w-4" /> સત્સંગ ખોલો</Link>
              <a href={youtubeChannel} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/20 px-5 font-bold text-white"><YouTubeMark className="h-4 w-4" /> YouTube ચેનલ</a>
            </div>
          </div>
          <div className="overflow-hidden rounded-[1.4rem] border border-white/12 bg-black shadow-2xl">
            <div className="aspect-video">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/videoseries?list=UU${youtubeChannelId.slice(2)}`}
                title="શ્રી માધવાનંદ આશ્રમના તાજા સત્સંગ"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad bg-surface">
        <div className="container-site">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading eyebrow="આશ્રમ પરિવાર" title="એક પરંપરા, અનેક કેન્દ્રો" description="સુરતથી ચાણોદ, સુઘડ, ભાવનગર, હરિદ્વાર અને વિદેશ સુધીના આશ્રમોને એક જ શોધી શકાય તેવી ડિરેક્ટરીમાં ગોઠવવાનું લક્ષ્ય." />
            <Link href="/ashrams" className="inline-flex min-h-11 items-center gap-2 self-start rounded-full bg-primary px-5 font-bold text-primary-foreground"><Landmark className="h-4 w-4" /> ૫૦+ શાખાઓ જુઓ</Link>
          </div>
          <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{featuredAshrams.slice(0, 6).map((ashram) => <AshramCard key={ashram.id} ashram={ashram} />)}</div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-site">
          <SectionHeading eyebrow="સેવા એટલે સાધના" title="ભક્તિ જ્યારે સમાજ સુધી પહોંચે" description="આશ્રમની સામાજિક અને આધ્યાત્મિક પ્રવૃત્તિઓને અલગ અલગ 'સેવા' તરીકે ગોઠવીને ભક્તને સમજવામાં અને જોડાવામાં સરળતા કરીએ છીએ." />
          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{sevaActivities.map((activity) => <SevaCard key={activity.id} activity={activity} />)}</div>
        </div>
      </section>

      <section className="section-pad bg-[#f2e7d7]">
        <div className="container-site grid gap-6 lg:grid-cols-3">
          {[
            { icon: BookOpenText, title: "વેદ રહસ્ય ડિજિટલ સંગ્રહ", copy: "વર્ષ અને અંક પ્રમાણે જૂની પત્રિકાઓ વાંચો અને PDF ખોલો.", href: "/publications", cta: "પ્રકાશન જુઓ" },
            { icon: ScrollText, title: "ઐતિહાસિક વારસો", copy: "પત્રો, ગુરુપરંપરા અને જૂની સામગ્રીને ગોઠવાયેલ ડિજિટલ વારસામાં ફેરવવાનો વિભાગ.", href: "/parampara", cta: "પરંપરા વાંચો" },
            { icon: Camera, title: "ફોટો અને પ્રસંગ સંગ્રહ", copy: "સમિતિ દ્વારા ચકાસાયેલ ફોટો અને પ્રસંગોને વર્ષ, સ્થળ અને વિષય પ્રમાણે ગોઠવવા માટેનું આગામી માળખું.", href: "/events", cta: "પ્રસંગો જુઓ" },
          ].map(({ icon: Icon, title, copy, href, cta }) => (
            <article key={title} className="rounded-[1.35rem] border border-[#dac5a9] bg-[#fffaf1] p-6 sm:p-7">
              <Icon className="h-7 w-7 text-gold-deep" />
              <h2 className="mt-5 font-serif text-2xl font-bold text-primary-strong">{title}</h2>
              <p className="mt-3 text-[14px] leading-7 text-muted-foreground">{copy}</p>
              <Link href={href} className="mt-5 inline-flex items-center gap-2 font-bold text-primary">{cta} <ArrowRight className="h-4 w-4" /></Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
