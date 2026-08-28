import Link from "next/link";
import { ArrowRight, HeartHandshake } from "lucide-react";
import { SevaCard } from "@/components/cards/seva-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { sevaActivities } from "@/lib/site-data";

export const metadata = { title: "સેવા પ્રવૃત્તિઓ" };

export default function ActivitiesPage() {
  return (
    <>
      <section className="border-b border-border bg-[#e8eee8]">
        <div className="container-site section-pad grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-end">
          <div>
            <div className="eyebrow text-[#31574f]">સેવા એટલે સાધના</div>
            <h1 className="display-title mt-5 text-[#21433d]">ભક્તિ હૃદયમાં જન્મે, સેવા રૂપે સમાજ સુધી પહોંચે.</h1>
          </div>
          <p className="body-large">ગૌ સેવા, માનવસેવા, ગુરુકુળ, અન્નક્ષેત્ર, પર્યાવરણ અને સેવક મંડળ જેવી પ્રવૃત્તિઓને સરળ ભાષામાં સમજાવીને ભક્તને ‘હું કેવી રીતે જોડાઈ શકું?’ તેનો તરત જવાબ આપવો.</p>
        </div>
      </section>
      <section className="section-pad">
        <div className="container-site">
          <SectionHeading eyebrow="આશ્રમની સેવાયાત્રા" title="સમાજકલ્યાણ સાથે આધ્યાત્મિક ભાવ" description="દરેક સેવા માટે ફોટો, સ્થળ, સમયગાળો અને તાજેતરની કામગીરી ઉમેરાતી જાય ત્યારે આ વિભાગ જીવંત સેવાવાર્તા બની શકે." />
          <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{sevaActivities.map((activity) => <SevaCard key={activity.id} activity={activity} />)}</div>
        </div>
      </section>
      <section className="pb-24">
        <div className="container-site rounded-[1.5rem] bg-primary p-6 text-primary-foreground sm:p-9 lg:flex lg:items-center lg:justify-between lg:gap-10">
          <div className="flex max-w-2xl gap-4"><HeartHandshake className="mt-1 h-7 w-7 shrink-0 text-[#f1bd67]" /><div><h2 className="font-serif text-2xl font-bold">આગામી સેવા માટે નામ નોંધાવવું છે?</h2><p className="mt-2 text-[14px] leading-7 text-[#e4d2c7]">રસ, શહેર અને સંપર્ક વિગત મોકલો. Production backend જોડાયા બાદ committee inboxમાં તે સીધું આવશે.</p></div></div>
          <Link href="/contact?type=seva" className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#fff4e5] px-5 font-bold text-primary lg:mt-0">સેવામાં જોડાઓ <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </>
  );
}
