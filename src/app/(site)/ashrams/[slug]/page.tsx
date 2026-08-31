import { ArrowLeft, MapPin, Phone, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getPublicAshrams } from "@/lib/operations/public-data";

type Props={params:Promise<{slug:string}>};

export async function generateMetadata({params}:Props):Promise<Metadata>{const{slug}=await params;const rows=await getPublicAshrams();const ashram=rows.find(a=>a.slug===slug);return ashram?{title:ashram.name_gu,description:`${ashram.city_gu} ખાતે ${ashram.name_gu}ની સમિતિ દ્વારા પ્રકાશિત માહિતી.`}:{};}

export default async function AshramDetailPage({params}:Props){
  const{slug}=await params;
  const rows=await getPublicAshrams();
  const ashram=rows.find(a=>a.slug===slug);
  if(!ashram)notFound();
  return <main>
    <header className="border-b border-border bg-surface-soft"><div className="container-site py-9 sm:py-14"><Link href="/ashrams" className="tap-target inline-flex items-center gap-2 text-sm font-bold text-primary"><ArrowLeft className="size-4"/>આશ્રમ યાદીમાં પાછા જાઓ</Link><p className="eyebrow mt-5">સમિતિ દ્વારા પ્રકાશિત આશ્રમ</p><h1 className="mt-3 max-w-4xl font-serif text-4xl font-bold leading-tight text-primary-strong sm:text-5xl">{ashram.name_gu}</h1><p className="mt-3 text-[17px] text-muted-foreground">{ashram.city_gu}{ashram.state_gu?` • ${ashram.state_gu}`:""}</p><p className="mt-4 inline-flex items-center gap-2 rounded-full bg-sacred-green/10 px-3 py-1.5 text-[13px] font-bold text-sacred-green"><ShieldCheck className="size-4"/>પ્રકાશિત માહિતી</p></div></header>
    <section className="container-site py-10 sm:py-14"><div className="grid max-w-4xl gap-5 md:grid-cols-2"><article className="card-sacred p-5 sm:p-6"><MapPin className="size-5 text-gold-deep"/><h2 className="mt-3 font-serif text-2xl font-bold text-primary-strong">સરનામું</h2><p className="mt-2 leading-7 text-muted-foreground">{ashram.full_address||[ashram.city_gu,ashram.state_gu].filter(Boolean).join(", ")}</p>{ashram.map_url?<a href={ashram.map_url} target="_blank" rel="noopener noreferrer" className="tap-target mt-5 inline-flex items-center rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Google Maps દિશા</a>:null}</article><article className="card-sacred p-5 sm:p-6"><Phone className="size-5 text-gold-deep"/><h2 className="mt-3 font-serif text-2xl font-bold text-primary-strong">સંપર્ક</h2>{ashram.office_phone?<><a href={`tel:${ashram.office_phone.replace(/[^+\d]/g,"")}`} className="tap-target mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"><Phone className="size-4"/>ફોન કરો</a><p className="mt-2 text-sm text-muted-foreground">{ashram.office_phone}</p></>:<p className="mt-2 text-muted-foreground">હાલ જાહેર સંપર્ક નંબર ઉપલબ્ધ નથી.</p>}{ashram.accepts_stays?<p className="mt-4 rounded-xl bg-[#edf4ef] p-3 text-sm font-bold text-sacred-green">આ આશ્રમ માટે ઉતારા અરજી ઉપલબ્ધ છે.</p>:null}</article></div></section>
  </main>;
}
