import type { Metadata } from "next";
import { ExternalLink, FileText, MapPin } from "lucide-react";
import Link from "next/link";

import { getPublicTithiProgrammes } from "@/lib/operations/public-data";

export const metadata: Metadata = {
  title: "કાર્યક્રમ પંચિકા",
  description: "સમિતિ દ્વારા પ્રકાશિત થયેલા આગામી તિથિ, પૂનમ, સત્સંગ અને વિશેષ કાર્યક્રમોની માહિતી.",
};

const kindLabel: Record<string,string> = {
  tithi: "તિથિ",
  satsang: "સત્સંગ",
  bal_shibir: "બાળ શિબિર",
  special: "વિશેષ કાર્યક્રમ",
  tour: "સ્વામીજી કાર્યક્રમ",
  poonam: "પૂનમ ઉત્સવ",
};

export default async function EventsPage() {
  const events = await getPublicTithiProgrammes();
  return <>
    <section className="border-b border-border bg-[#f5eadc]"><div className="container-site py-10 sm:py-14"><div className="max-w-3xl"><p className="eyebrow">કાર્યક્રમ પંચિકા</p><h1 className="display-title mt-4 text-primary-strong">આગામી કાર્યક્રમો અને ઉત્સવો</h1><p className="body-large mt-4">આ યાદી Admin માં સમિતિ દ્વારા પ્રકાશિત કરાયેલા એ જ કાર્યક્રમ રેકોર્ડમાંથી સીધી આવે છે.</p></div></div></section>

    <main className="section-pad"><div className="container-site">
      {events.length ? <div className="grid gap-5 lg:grid-cols-2">{events.map(event=><article key={event.id} className="card-sacred p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-3"><span className="rounded-full bg-[#f2e7d7] px-3 py-1 text-xs font-bold text-gold-deep">{kindLabel[event.programme_type]??event.programme_type}</span><time className="font-bold text-primary">{event.programme_date}</time></div><h2 className="mt-4 font-serif text-2xl font-bold text-primary-strong">{event.title_gu}</h2><p className="mt-2 text-sm leading-7 text-muted-foreground">{event.weekday_gu?`${event.weekday_gu} • `:""}{event.tithi_name_gu?`${event.tithi_name_gu} • `:""}{event.village_city_gu}{event.venue_gu?` • ${event.venue_gu}`:""}</p>{event.swamiji_name?<p className="mt-2 text-sm font-semibold text-primary">{event.swamiji_name}</p>:null}{event.details_gu?<p className="mt-4 text-[15px] leading-7 text-muted-foreground">{event.details_gu}</p>:null}<div className="mt-5 flex flex-wrap gap-2">{event.map_url?<a href={event.map_url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-4 text-sm font-bold text-white"><MapPin className="size-4"/>મેપ</a>:null}{event.pdf_url?<a href={event.pdf_url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border-strong px-4 text-sm font-bold text-primary"><FileText className="size-4"/>પરિપત્ર <ExternalLink className="size-3.5"/></a>:null}</div></article>)}</div> : <div className="rounded-2xl border border-dashed border-border p-8 text-center"><h2 className="font-serif text-2xl font-bold text-primary">હાલ કોઈ આગામી કાર્યક્રમ પ્રકાશિત નથી.</h2><p className="mt-2 text-sm text-muted-foreground">Admin માં કાર્યક્રમ Publish થયા પછી તે અહીં આપમેળે દેખાશે.</p></div>}
      <div className="mt-8 flex flex-wrap gap-3"><Link href="/programmes" className="inline-flex min-h-11 items-center rounded-full border border-border-strong px-5 font-bold text-primary">સત્સંગ કેન્દ્રો અને પરિપત્રો</Link><Link href="/contact?type=event" className="inline-flex min-h-11 items-center rounded-full bg-primary px-5 font-bold text-white">કાર્યક્રમ અંગે પૂછો</Link></div>
    </div></main>
  </>;
}
