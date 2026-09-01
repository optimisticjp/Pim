import type { Metadata } from "next";
import { Suspense } from "react";
import { HeartHandshake, UsersRound } from "lucide-react";

import { ParticipationForm } from "@/components/forms/participation-form";
import { getPublicAshrams } from "@/lib/operations/public-data";

export const metadata: Metadata = {
  title: "સેવા અને સહભાગિતા રસ નોંધણી | શ્રી માધવાનંદ આશ્રમ",
  description: "સેવા, યુવા જોડાણ અથવા આશ્રમ સહભાગિતા માટે તમારી રસ નોંધણી મોકલો.",
};

export default async function ParticipationPage() {
  const ashrams = (await getPublicAshrams()).map((ashram) => ({
    id: ashram.id,
    nameGu: ashram.name_gu,
    localityGu: ashram.city_gu,
  }));

  return <>
    <section className="border-b border-border bg-[#f4eee5]">
      <div className="container-site py-12 sm:py-16">
        <div className="max-w-4xl">
          <div className="flex items-center gap-2 text-primary"><HeartHandshake className="size-5" /><p className="eyebrow">સહભાગિતા</p></div>
          <h1 className="display-title mt-4 text-primary">સેવા અને આશ્રમ પરિવાર સાથે જોડાવા રસ નોંધાવો</h1>
          <p className="body-large mt-5 max-w-3xl">સેવા, યુવા જોડાણ અથવા માત્ર વધુ માહિતી માટે તમારી વિગતો મોકલો. પસંદ કરેલો આશ્રમ હોય તો નોંધ તેની કાર્યક્ષેત્રવાળી એડમિન ટીમ સુધી પહોંચશે.</p>
        </div>
      </div>
    </section>

    <section className="section-pad">
      <div className="container-site grid gap-7 lg:grid-cols-[.72fr_1.28fr] lg:items-start">
        <aside className="rounded-3xl border border-border bg-surface p-6">
          <UsersRound className="size-7 text-sacred-green" />
          <h2 className="mt-4 font-serif text-2xl font-bold text-primary">આ ફોર્મ શે માટે છે?</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">આ રસ નોંધણી છે. સેવા ફાળવણી, યુવક મંડળ સભ્યપદ અથવા અન્ય નિમણૂકની ખાતરી આપતી નથી. સમિતિ જરૂરી હોય ત્યારે આપેલી સંપર્ક વિગતો પર સંપર્ક કરી શકે છે.</p>
        </aside>
        <Suspense fallback={<div className="card-sacred min-h-[360px] p-6 text-sm text-muted-foreground">ફોર્મ તૈયાર થઈ રહ્યું છે…</div>}>
          <ParticipationForm ashrams={ashrams} />
        </Suspense>
      </div>
    </section>
  </>;
}
