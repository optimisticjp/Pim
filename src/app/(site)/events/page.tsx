import Link from "next/link";
import { ArrowRight, CalendarPlus, Share2 } from "lucide-react";
import { EventCard } from "@/components/cards/event-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { events } from "@/lib/site-data";

export const metadata = { title: "કાર્યક્રમો અને ઉત્સવો" };

export default function EventsPage() {
  return (
    <>
      <section className="border-b border-border bg-[#f5eadc]">
        <div className="container-site section-pad"><div className="max-w-4xl"><div className="eyebrow">કાર્યક્રમો અને ઉત્સવો</div><h1 className="display-title mt-5 text-primary-strong">એક event record, આખી વેબસાઇટ પર સાચી માહિતી.</h1><p className="body-large mt-6">સમિતિ event એક વાર ઉમેરે. એ જ માહિતી homepage, event archive, સંબંધિત આશ્રમ અને WhatsApp share previewમાં ફરી ઉપયોગ થાય. તારીખ પસાર થયા પછી event આપમેળે archiveમાં જઈ શકે.</p></div></div>
      </section>
      <section className="section-pad">
        <div className="container-site">
          <SectionHeading eyebrow="આગામી અને નિયમિત" title="મહત્વના પ્રવેશદ્વાર" description="અનિશ્ચિત તારીખો બતાવવાને બદલે, સમિતિ દ્વારા જાહેર થયેલી ચોક્કસ તારીખ અને સમય મળતાં જ અહીં પ્રકાશિત કરવાની પદ્ધતિ રાખવામાં આવી છે." />
          <div className="mt-9 grid gap-5 lg:grid-cols-3">{events.map((event) => <EventCard key={event.id} event={event} />)}</div>
        </div>
      </section>
      <section className="pb-24"><div className="container-site grid gap-5 md:grid-cols-2">
        <div className="card-sacred p-6"><CalendarPlus className="h-6 w-6 text-gold-deep" /><h2 className="mt-4 font-serif text-2xl font-bold text-primary">Add to Calendar</h2><p className="mt-2 text-[14px] leading-7 text-muted-foreground">ચોક્કસ event date મળ્યા બાદ Google/Apple calendar file જનરેટ કરી શકાય. ભક્તને સમય યાદ રાખવામાં મદદરૂપ.</p></div>
        <div className="card-sacred p-6"><Share2 className="h-6 w-6 text-gold-deep" /><h2 className="mt-4 font-serif text-2xl font-bold text-primary">WhatsApp-ready share card</h2><p className="mt-2 text-[14px] leading-7 text-muted-foreground">દરેક event URL માટે Gujarati title, તારીખ, સ્થળ અને poster સાથે સચોટ Open Graph preview. QR code પણ આ જ permanent URL પર જઈ શકે.</p><Link href="/admin/events" className="mt-4 inline-flex items-center gap-2 font-bold text-primary">Admin preview જુઓ <ArrowRight className="h-4 w-4" /></Link></div>
      </div></section>
    </>
  );
}
