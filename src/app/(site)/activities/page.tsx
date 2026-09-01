import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink, HeartHandshake, UsersRound } from "lucide-react";

import { getPublicSevaActivities, getPublicSevaCategories } from "@/lib/operations/public-data";
import { yuvakMandals } from "@/lib/migration/mandal-data";

export const metadata: Metadata = {
  title: "સેવા અને યુવક મંડળ | શ્રી માધવાનંદ આશ્રમ",
  description: "સમિતિ દ્વારા જાહેર કરાયેલી સેવા પ્રવૃત્તિઓ અને ઉપલબ્ધ યુવક મંડળ જોડાણ.",
};

export default async function ActivitiesPage() {
  const [categories, activities] = await Promise.all([getPublicSevaCategories(), getPublicSevaActivities()]);

  return <>
    <section className="border-b border-border bg-[#e8eee8]"><div className="container-site py-12 sm:py-16"><div className="max-w-4xl"><div className="eyebrow text-[#31574f]">સેવા એટલે સાધના</div><h1 className="display-title mt-4 text-[#21433d]">સેવા દ્વારા સમાજ સાથે, સંસ્કાર દ્વારા નવી પેઢી સાથે જોડાણ</h1><p className="body-large mt-5 max-w-3xl">સમિતિ દ્વારા જાહેર કરાયેલા સેવા ક્ષેત્રો અને પ્રવૃત્તિઓ અહીં જોઈ શકાય છે. સેવા માટે જોડાવા સ્વયંસેવક ફોર્મનો ઉપયોગ કરો.</p><div className="mt-6 flex flex-wrap gap-3"><Link href="/volunteer" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-5 font-bold text-white">સેવા માટે જોડાઓ <ArrowRight className="size-4" /></Link><Link href="/seva" className="inline-flex min-h-12 items-center rounded-full border border-primary/30 px-5 font-bold text-primary">સેવા વિભાગ જુઓ</Link></div></div></div></section>

    <section className="section-pad"><div className="container-site"><div className="flex items-center gap-2"><HeartHandshake className="size-5 text-sacred-green" /><h2 className="font-serif text-3xl font-bold text-primary">સેવાના ક્ષેત્રો</h2></div>{categories.length ? <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{categories.map(category => <article key={category.id} className="card-sacred p-5"><h3 className="font-serif text-xl font-bold text-primary">{category.title_gu}</h3>{category.description_gu ? <p className="mt-2 text-sm leading-7 text-muted-foreground">{category.description_gu}</p> : null}</article>)}</div> : <p className="mt-6 rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">હાલ જાહેર માહિતી માટે કોઈ સેવા ક્ષેત્ર ઉપલબ્ધ નથી.</p>}</div></section>

    <section className="border-y border-border bg-surface section-pad"><div className="container-site"><h2 className="font-serif text-3xl font-bold text-primary">તાજેતરની સેવા પ્રવૃત્તિઓ</h2>{activities.length ? <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{activities.map(activity => <article key={activity.id} className="rounded-2xl border border-border bg-background p-5"><p className="text-xs font-bold text-gold-deep">{activity.activity_date || "સેવા પ્રવૃત્તિ"}</p><h3 className="mt-2 font-serif text-xl font-bold text-primary">{activity.title_gu}</h3>{activity.summary_gu ? <p className="mt-2 text-sm leading-7 text-muted-foreground">{activity.summary_gu}</p> : null}{activity.metric_value ? <p className="mt-4 rounded-xl bg-surface-soft p-3 font-bold text-sacred-green">{activity.metric_label_gu ? `${activity.metric_label_gu}: ` : ""}{activity.metric_value}</p> : null}</article>)}</div> : <p className="mt-6 rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">હાલ નવી સેવા પ્રવૃત્તિની જાહેર માહિતી ઉપલબ્ધ નથી.</p>}</div></section>

    <section className="section-pad"><div className="container-site rounded-[1.6rem] bg-[#294c45] p-6 text-white sm:p-9 lg:grid lg:grid-cols-[.7fr_1.3fr] lg:items-center lg:gap-12"><div className="flex items-center gap-3"><UsersRound className="size-8 text-[#f1bd67]" /><div className="eyebrow text-[#f1bd67]">નવી પેઢીની ભાગીદારી</div></div><div className="mt-6 lg:mt-0"><h2 className="font-serif text-3xl font-bold sm:text-4xl">સેવક અને યુવક મંડળ</h2><p className="mt-4 max-w-3xl text-[16px] leading-8 text-[#dfebe7]">સેવા, સંસ્કાર, સામૂહિક જોડાણ અને કાર્યક્રમ સહયોગ દ્વારા નવી પેઢી આશ્રમ પરિવાર સાથે જોડાઈ શકે છે.</p><Link href="/volunteer" className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#fff4e5] px-5 font-bold text-primary">સેવા માટે રસ નોંધાવો <ArrowRight className="size-4" /></Link></div></div></section>

    {yuvakMandals.length ? <section className="border-y border-border bg-surface section-pad"><div className="container-site"><p className="eyebrow">યુવક મંડળ</p><h2 className="mt-3 font-serif text-3xl font-bold text-primary">ઉપલબ્ધ સ્થાનિક મંડળ નોંધ</h2><div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">{yuvakMandals.map(mandal => <article key={mandal.id} className="rounded-[1.25rem] border border-border bg-background p-5"><UsersRound className="size-6 text-sacred-green" /><h3 className="mt-5 font-serif text-2xl font-bold text-primary">{mandal.cityGu}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">સંસ્કાર • સત્સંગ • સેવા • સહભાગિતા</p><a href={mandal.detailUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-11 items-center gap-2 font-bold text-primary">વધુ વિગત <ExternalLink className="size-4" /></a></article>)}</div></div></section> : null}
  </>;
}
