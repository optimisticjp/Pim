import { Suspense } from "react";
import { MapPin, Phone, ShieldCheck } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata = { title: "સંપર્ક અને સહયોગ" };

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-border bg-[#e9eee9]"><div className="container-site section-pad"><div className="max-w-4xl"><div className="eyebrow text-[#31574f]">સંપર્ક અને સહયોગ</div><h1 className="display-title mt-5 text-[#21433d]">પ્રશ્ન હોય, સેવા માટે જોડાવું હોય કે માર્ગદર્શન જોઈએ, યોગ્ય સ્થાન સુધી સીધો સંદેશ.</h1></div></div></section>
      <section className="section-pad"><div className="container-site grid gap-8 lg:grid-cols-[.72fr_1.28fr]">
        <div>
          <SectionHeading eyebrow="મુખ્ય આશ્રમ" title="સુરત સંપર્ક" description="Legacy contact page પરથી ચકાસેલી મુખ્ય સંપર્ક વિગતો." />
          <div className="mt-6 card-sacred p-6">
            <div className="flex gap-3"><MapPin className="mt-1 h-5 w-5 shrink-0 text-gold-deep" /><div><div className="font-bold text-primary">ઉદયનગર-૧, કતારગામ રોડ</div><p className="mt-1 text-[14px] leading-7 text-muted-foreground">સુરત, ગુજરાત — ૩૯૫૦૦૪</p></div></div>
            <a href="tel:+912612534610" className="mt-5 flex min-h-12 items-center gap-3 rounded-xl bg-surface-soft px-4 font-bold text-primary"><Phone className="h-4 w-4" />+91 261 2534610</a>
          </div>
          <div className="mt-5 rounded-2xl border border-[#dac5a9] bg-[#fff8ec] p-5"><ShieldCheck className="h-5 w-5 text-sacred-green" /><h2 className="mt-3 font-serif text-xl font-bold text-primary">દાન વિગતો અંગે</h2><p className="mt-2 text-[13px] leading-6 text-muted-foreground">બેંક ખાતું, UPI અથવા 80G વિશે કોઈ માહિતી અહીં કલ્પિત રીતે મૂકવામાં આવી નથી. વર્તમાન trust-approved વિગતો મળ્યા પછી જ publish કરવી.</p></div>
        </div>
        <div><SectionHeading eyebrow="પૂછપરછ / સેવા નોંધણી" title="આપનો સંદેશ મોકલો" description="મોબાઇલ પર ઓછું typing, સ્પષ્ટ વિષય અને સરળ status workflow ધ્યાનમાં રાખીને બનાવેલું form." /><div className="mt-6"><Suspense fallback={<div className="card-sacred min-h-[420px] animate-pulse" />}><ContactForm /></Suspense></div></div>
      </div></section>
    </>
  );
}
