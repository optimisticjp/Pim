import Link from "next/link";
import { ArrowRight, BookOpen, Clock3, Sparkles } from "lucide-react";

import { MadhavRekha } from "@/components/ui/madhav-rekha";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata = { title: "ગુરુપરંપરા અને પરિચય" };

export default function ParamparaPage() {
  return (
    <>
      <section className="border-b border-border bg-[#f3e7d6]">
        <div className="container-site section-pad grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div>
            <div className="eyebrow">પરિચય અને પરંપરા</div>
            <h1 className="display-title mt-5 text-primary-strong">ગુરુપરંપરા એટલે જ્ઞાનનો વારસો, જીવનમાં ઉતારવાની જવાબદારી.</h1>
            <p className="body-large mt-6">શ્રી માધવાનંદજી મહારાજથી શરૂ થયેલી આશરે બે સદી જૂની પરંપરાને વેદ-ઉપનિષદના જ્ઞાન, સાધના, ભક્તિ અને સેવાભાવ સાથે સમજાવતો વિભાગ.</p>
          </div>
          <div className="arch-frame pattern-jali border border-primary/15 bg-primary p-6 pt-20 text-primary-foreground sm:p-8 sm:pt-24">
            <div className="rounded-2xl border border-white/12 bg-[#551821]/80 p-6">
              <div className="text-[12px] font-bold tracking-[.08em] text-[#efbd6b]">ગુરુવાણીનો મૂળ ભાવ</div>
              <blockquote className="mt-4 font-serif text-2xl font-semibold leading-relaxed">જ્ઞાન, ભક્તિ અને સેવા જીવનમાં ઉતરે ત્યારે પરંપરા જીવંત રહે છે.</blockquote>
              <p className="mt-4 text-[12px] leading-6 text-[#d9c8bd]">આ સ્થાન પર સમિતિ દ્વારા મંજૂર ગુરુવાણી, શ્લોક અથવા આશ્રમનો મુખ્ય સંદેશ રજૂ કરી શકાય.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad bg-surface">
        <div className="container-site">
          <SectionHeading eyebrow="મૂળ યાત્રા" title="શ્રી માધવાનંદજી મહારાજની આધ્યાત્મિક શોધ" description="ઉપલબ્ધ આશ્રમ દસ્તાવેજોમાં દર્શાવાયેલી મુખ્ય વિગતોને સરળ અને ગૌરવપૂર્ણ રીતે રજૂ કરતો પરિચય." />
          <div className="mt-10 grid gap-5 lg:grid-cols-4">
            {[
              { icon: Sparkles, title: "ઘરત્યાગ", value: "૧૨ વર્ષની વયે", copy: "ઉપલબ્ધ વર્ણન મુજબ શ્રી માધવાનંદજી મહારાજે નાની વયે જ ઘરત્યાગ કરીને આધ્યાત્મિક માર્ગ સ્વીકાર્યો." },
              { icon: Clock3, title: "કાશીમાં અભ્યાસ", value: "૧૨ વર્ષ", copy: "કાશીમાં રહી વેદ, ઉપનિષદ અને તત્ત્વજ્ઞાનના મર્મનું વિગતવાર અધ્યયન કર્યું હોવાનો ઉલ્લેખ મળે છે." },
              { icon: BookOpen, title: "જ્ઞાનની દિશા", value: "વેદ • ઉપનિષદ", copy: "પરંપરાનો આધ્યાત્મિક આધાર વેદાંત, સ્વાધ્યાય, ગુરુભક્તિ અને સાધનાને કેન્દ્રમાં રાખે છે." },
              { icon: Sparkles, title: "અવિરત પરંપરા", value: "આશરે ૨૦૦ વર્ષ", copy: "આ પરંપરા ગુજરાત અને ભારતના અનેક આશ્રમ કેન્દ્રો અને સેવક મંડળો સુધી વિસ્તરી છે." },
            ].map(({ icon: Icon, title, value, copy }) => (
              <article key={title} className="card-sacred p-6">
                <Icon className="h-6 w-6 text-gold-deep" />
                <div className="mt-5 text-[12px] font-bold text-muted-foreground">{title}</div>
                <div className="mt-1 font-serif text-2xl font-bold text-primary">{value}</div>
                <p className="mt-3 text-[13px] leading-6 text-muted-foreground">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-site">
          <SectionHeading eyebrow="જીવનમાં ઉતરતી પરંપરા" title="ધર્મ, ભક્તિ, જ્ઞાન અને વૈરાગ્ય" description="ગુરુપરંપરાનો ડિજિટલ પરિચય ત્યારે જ જીવંત લાગે, જ્યારે મૂલ્યોને સ્પષ્ટ અને રોજિંદા જીવન સાથે જોડીને સમજાવી શકાય." align="center" />
          <div className="mt-10"><MadhavRekha /></div>
        </div>
      </section>

      <section className="section-pad bg-[#3a161d] text-[#f5e9dc]">
        <div className="container-site grid gap-8 lg:grid-cols-[1fr_.9fr] lg:items-center">
          <div>
            <div className="text-[12px] font-bold tracking-[.08em] text-[#e3ab55]">આજનું માર્ગદર્શન</div>
            <h2 className="section-title mt-4 text-white">પરંપરા સમય સાથે આગળ વધે, મૂળ સાથે જોડાયેલી રહે.</h2>
            <p className="mt-5 max-w-2xl text-[16px] leading-8 text-[#d8c7bb]">ઉપલબ્ધ સંશોધન નોંધો વર્તમાન માર્ગદર્શનને પરમ પૂજ્ય શ્રી ૧૦૦૮ મહામંડલેશ્વર સ્વામી શ્રી જગદીશાનંદ સાગરજી મહારાજ સાથે જોડે છે. આ વિભાગમાં સમિતિ દ્વારા મંજૂર જીવનપરિચય, સંદેશ અને સંબંધિત સત્સંગ ગોઠવી શકાય.</p>
          </div>
          <div className="rounded-2xl border border-white/12 bg-white/5 p-6 sm:p-7">
            <div className="text-[12px] font-bold text-[#e3ab55]">આ વિભાગ આગળ કેવી રીતે વધશે?</div>
            <ul className="mt-4 space-y-3 text-[14px] leading-7 text-[#dbcbbf]">
              <li>• દરેક ગુરુ/સ્વામીજી માટે ચકાસેલ જીવનપરિચય</li>
              <li>• સંબંધિત પ્રવચન, પ્રકાશન અને ફોટો સંગ્રહ</li>
              <li>• ઐતિહાસિક પત્રો માટે ડિજિટલ archive</li>
              <li>• વર્ષ અને પ્રસંગ આધારિત timeline</li>
            </ul>
            <Link href="/publications" className="mt-6 inline-flex items-center gap-2 font-bold text-[#f2bd66]">વારસાગત પ્રકાશન જુઓ <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
