import { Suspense } from "react";
import { MapPin, Phone, ShieldCheck } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPublicAshrams } from "@/lib/operations/public-data";

export const metadata = { title: "સંપર્ક અને સહયોગ" };

export default async function ContactPage() {
  const ashrams = await getPublicAshrams();
  const mainAshram = ashrams.find((ashram) => ashram.slug === "surat");
  const address = mainAshram?.full_address || [mainAshram?.city_gu, mainAshram?.state_gu].filter(Boolean).join(", ");
  const phone = mainAshram?.office_phone;

  return (
    <>
      <section className="border-b border-border bg-[#e9eee9]"><div className="container-site section-pad"><div className="max-w-4xl"><div className="eyebrow text-[#31574f]">સંપર્ક અને સહયોગ</div><h1 className="display-title mt-5 text-[#21433d]">પ્રશ્ન હોય, સેવા માટે જોડાવું હોય કે માર્ગદર્શન જોઈએ, યોગ્ય સ્થાન સુધી સીધો સંદેશ.</h1></div></div></section>
      <section className="section-pad"><div className="container-site grid gap-8 lg:grid-cols-[.72fr_1.28fr]">
        <div>
          <SectionHeading eyebrow="મુખ્ય આશ્રમ" title={mainAshram?.name_gu ?? "આશ્રમ સંપર્ક"} description="સમિતિ દ્વારા જાહેર કરાયેલી આશ્રમ સંપર્ક વિગતો." />
          <div className="mt-6 card-sacred p-6">
            {mainAshram ? <>
              <div className="flex gap-3"><MapPin className="mt-1 h-5 w-5 shrink-0 text-gold-deep" /><div><div className="font-bold text-primary">{mainAshram.name_gu}</div>{address ? <p className="mt-1 text-[14px] leading-7 text-muted-foreground">{address}</p> : <p className="mt-1 text-[14px] leading-7 text-muted-foreground">સરનામું હાલમાં જાહેર ઉપલબ્ધ નથી.</p>}</div></div>
              {phone ? <a href={`tel:${phone.replace(/\s+/g, "")}`} className="mt-5 flex min-h-12 items-center gap-3 rounded-xl bg-surface-soft px-4 font-bold text-primary"><Phone className="h-4 w-4" />{phone}</a> : <p className="mt-5 rounded-xl bg-surface-soft px-4 py-3 text-[13px] text-muted-foreground">ફોન નંબર હાલમાં જાહેર ઉપલબ્ધ નથી.</p>}
            </> : <p className="text-[14px] leading-7 text-muted-foreground">હાલ મુખ્ય આશ્રમની જાહેર સંપર્ક વિગતો ઉપલબ્ધ નથી. આશ્રમ ડિરેક્ટરીમાં પ્રકાશિત કેન્દ્રોની વિગતો તપાસો.</p>}
          </div>
          <div className="mt-5 rounded-2xl border border-[#dac5a9] bg-[#fff8ec] p-5"><ShieldCheck className="h-5 w-5 text-sacred-green" /><h2 className="mt-3 font-serif text-xl font-bold text-primary">વિગતોની સુરક્ષા</h2><p className="mt-2 text-[13px] leading-6 text-muted-foreground">પૂછપરછ માટે જરૂરી માહિતી જ મોકલો. બેંક, ઓળખપત્ર અથવા અન્ય સંવેદનશીલ વિગતો ફોર્મમાં ન લખશો.</p></div>
        </div>
        <div><SectionHeading eyebrow="પૂછપરછ" title="આપનો સંદેશ મોકલો" description="યોગ્ય વિષય પસંદ કરીને આપનો પ્રશ્ન અથવા સંદેશ સરળતાથી મોકલો." /><div className="mt-6"><Suspense fallback={<div className="card-sacred min-h-[420px] animate-pulse" />}><ContactForm /></Suspense></div></div>
      </div></section>
    </>
  );
}
