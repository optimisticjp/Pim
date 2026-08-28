import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, HeartHandshake, Landmark, Sparkles, UsersRound } from "lucide-react";

import { SevaCard } from "@/components/cards/seva-card";
import { ParticipationForm } from "@/components/forms/participation-form";
import { SectionHeading } from "@/components/ui/section-heading";
import { ashrams, sevaActivities } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "સેવા અને યુવક મંડળ | શ્રી માધવાનંદ આશ્રમ",
  description: "આશ્રમ પરિવારની સેવા પ્રવૃત્તિઓ જાણો અને સેવા અથવા યુવક મંડળ સાથે જોડાવા માટે આપનો રસ નોંધાવો.",
};

const participationChoices = [
  { title: "સેવા પ્રવૃત્તિમાં સહયોગ", copy: "ગૌ સેવા, આરોગ્ય, અન્ન સેવા, પર્યાવરણ, સંસ્કાર અથવા કાર્યક્રમ સહયોગ જેવા રસ જણાવો." },
  { title: "કુશળતા દ્વારા સહયોગ", copy: "આપની મીડિયા અથવા ડિજિટલ કુશળતા ઉપયોગી થઈ શકે તેમ હોય તો રસ તરીકે જણાવો; આ કોઈ અલગ વિભાગ કે નિશ્ચિત સેવા નથી." },
  { title: "નજીકના આશ્રમ સાથે જોડાણ", copy: "પસંદગીનો આશ્રમ જણાવો અથવા પસંદગી ખાલી રાખો. ઉપલબ્ધ માર્ગદર્શન માટે સંપર્ક થઈ શકે છે." },
];

export default function ActivitiesPage() {
  return <>
    <section className="border-b border-border bg-[#e8eee8]"><div className="container-site py-12 sm:py-16 lg:grid lg:grid-cols-[1.08fr_.92fr] lg:items-end lg:gap-12"><div><div className="eyebrow text-[#31574f]">સેવા એટલે સાધના</div><h1 className="display-title mt-4 text-[#21433d]">સેવા દ્વારા સમાજ સાથે, સંસ્કાર દ્વારા નવી પેઢી સાથે જોડાણ</h1></div><div className="mt-5 lg:mt-0"><p className="body-large">ભક્તિ, જવાબદારી અને સામૂહિક ભાવ સાથે આશ્રમ પરિવારની સેવાયાત્રા જાણો. આપ કઈ રીતે સહયોગ આપવા ઇચ્છો છો તે સરળતાથી જણાવો.</p><div className="mt-6 flex flex-col gap-3 sm:flex-row"><Link href="?track=seva#join" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 font-bold text-white">સેવા માટે જોડાઓ <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link><Link href="?track=youth#join" className="inline-flex min-h-12 items-center justify-center rounded-full border border-primary/30 px-5 font-bold text-primary">યુવા જોડાણ</Link></div></div></div></section>

    <section className="section-pad"><div className="container-site"><SectionHeading eyebrow="આશ્રમની સેવાયાત્રા" title="સમાજકલ્યાણ સાથે આધ્યાત્મિક ભાવ" description="આશ્રમ પરિવાર સાથે જોડાયેલી સેવા પ્રવૃત્તિઓ ભક્તિભાવને જવાબદાર કાર્ય અને સમાજ જોડાણ સુધી લઈ જાય છે." /><div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{sevaActivities.map((activity) => <SevaCard key={activity.id} activity={activity} />)}</div></div></section>

    <section className="border-y border-border/70 bg-surface section-pad"><div className="container-site"><SectionHeading eyebrow="જોડાવાનો માર્ગ" title="આપ કેવી રીતે સેવા આપી શકો?" description="આપના રસ અને અનુકૂળતા જણાવવાથી આશ્રમને આપ કઈ રીતે સહયોગ આપવા ઇચ્છો છો તે સમજવામાં મદદ મળે છે." /><div className="mt-8 grid gap-4 md:grid-cols-3">{participationChoices.map((item, index) => <article key={item.title} className="rounded-[1.25rem] border border-border bg-background p-5 sm:p-6"><div className="grid h-10 w-10 place-items-center rounded-full bg-primary/8 font-serif font-bold text-primary">{index + 1}</div><h3 className="mt-4 font-serif text-xl font-bold text-primary">{item.title}</h3><p className="mt-2 text-[14px] leading-7 text-muted-foreground">{item.copy}</p></article>)}</div></div></section>

    <section className="section-pad"><div className="container-site rounded-[1.6rem] bg-[#294c45] p-6 text-white sm:p-9 lg:grid lg:grid-cols-[.7fr_1.3fr] lg:items-center lg:gap-12"><div className="flex items-center gap-3"><UsersRound className="h-8 w-8 text-[#f1bd67]" aria-hidden="true" /><div className="eyebrow text-[#f1bd67]">નવી પેઢીની ભાગીદારી</div></div><div className="mt-6 lg:mt-0"><h2 className="font-serif text-3xl font-bold sm:text-4xl">સેવક અને યુવક મંડળ</h2><p className="mt-4 max-w-3xl text-[16px] leading-8 text-[#dfebe7]">સેવા, સંસ્કાર, સામૂહિક જોડાણ અને કાર્યક્રમ સહયોગ દ્વારા નવી પેઢી આશ્રમ પરિવાર સાથે જોડાઈ શકે છે. રસ નોંધાવવાથી આપની પસંદગી સમજવામાં મદદ મળે છે; તે ઔપચારિક સભ્યપદ અથવા નિશ્ચિત કાર્યક્રમની ખાતરી નથી.</p><Link href="?track=youth#join" className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#fff4e5] px-5 font-bold text-primary">યુવા જોડાણ માટે રસ દર્શાવો <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></div></div></section>

    <section id="join" className="scroll-mt-24 border-y border-border bg-[#f4eadc] section-pad"><div className="container-site grid gap-8 lg:grid-cols-[.68fr_1.32fr] lg:gap-12"><div><div className="sticky top-28"><Sparkles className="h-6 w-6 text-gold-deep" aria-hidden="true" /><SectionHeading eyebrow="રસ નોંધણી" title="સેવા અને યુવા જોડાણ" description="માત્ર જરૂરી વિગતો, આપના રસ અને પસંદગીનો આશ્રમ જણાવો. ફોર્મ મોકલવાથી સેવા ફાળવણી કે સભ્યપદ આપમેળે નક્કી થતું નથી." /><div className="mt-6 rounded-2xl border border-[#d8c2a5] bg-[#fffaf1] p-5"><h3 className="font-serif text-lg font-bold text-primary">સત્તાવાર રીતે જોડાવા માટે</h3><p className="mt-2 text-[14px] leading-7 text-muted-foreground">હાલ ઑનલાઇન નોંધણી આશ્રમ સમિતિ સાથે જોડાયેલી નથી. ચકાસેલી સંપર્ક વિગતો દ્વારા મુખ્ય આશ્રમનો ફોન પર સંપર્ક કરો.</p></div></div></div><Suspense fallback={<div className="card-sacred min-h-[720px] animate-pulse" />}><ParticipationForm ashrams={ashrams.map(({ id, nameGu, localityGu }) => ({ id, nameGu, localityGu }))} /></Suspense></div></section>

    <section className="section-pad"><div className="container-site grid gap-5 lg:grid-cols-2"><div className="card-sacred p-6 sm:p-8"><Landmark className="h-6 w-6 text-sacred-green" aria-hidden="true" /><h2 className="mt-4 font-serif text-2xl font-bold text-primary">નજીકના આશ્રમ સાથે જોડાઓ</h2><p className="mt-3 leading-7 text-muted-foreground">આશ્રમ સૂચિમાં ઉપલબ્ધ અને ચકાસેલી સંપર્ક વિગતો જુઓ. રસ નોંધમાં આશ્રમ પસંદ ન કરો તો પણ ફોર્મ માન્ય છે.</p><Link href="/ashrams" className="mt-5 inline-flex min-h-12 items-center gap-2 font-bold text-primary">આશ્રમ શોધો <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></div><div className="rounded-[1.25rem] bg-primary p-6 text-white sm:p-8"><HeartHandshake className="h-6 w-6 text-[#f1bd67]" aria-hidden="true" /><h2 className="mt-4 font-serif text-2xl font-bold">હજુ પ્રશ્ન છે?</h2><p className="mt-3 leading-7 text-[#eadbd0]">સેવા, પ્રકાશન અથવા અન્ય સામાન્ય માર્ગદર્શન માટે સંપર્ક ફોર્મ દ્વારા સંદેશ મોકલો.</p><Link href="/contact?type=seva" className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#fff4e5] px-5 font-bold text-primary">સંપર્ક કરો <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></div></div></section>
  </>;
}
