import { ArrowRight, BookOpenText, ExternalLink, Headphones, Radio, ScrollText, Sparkles } from "lucide-react";
import Link from "next/link";
import type { ComponentType, SVGProps } from "react";

import { YouTubeMark } from "@/components/icons/youtube-mark";
import { YouTubeFacade } from "@/components/media/youtube-facade";
import { SatsangShare } from "@/components/satsang/satsang-share";
import { getOfficialUploadsPlaylistId, getOfficialYouTubeChannel, getSatsangLiveStatus, getSatsangSeries } from "@/lib/satsang-data";
import type { SatsangCategory } from "@/lib/types";
import { historicalVideoCollections } from "@/lib/migration/video-data";

export const metadata = {
  title: "સત્સંગ મંડપ | ગુજરાતી ગુરુવાણી, પાઠ, કથા અને ભજન",
  description: "શ્રી માધવાનંદ આશ્રમનો ગુજરાતી સત્સંગ મંડપ — અધિકૃત ગુરુવાણી, ગુરુ ગીતા પાઠ, કથા, ભજન, ચાતુર્માસ અને તાજેતરના સત્સંગ સાથે જોડાઓ.",
};

const categoryDetails: Record<SatsangCategory, { icon: ComponentType<SVGProps<SVGSVGElement>>; queryGu: string }> = {
  "nitya-karma": { icon: Sparkles, queryGu: "નિત્યકર્મ" },
  "guru-gita": { icon: ScrollText, queryGu: "ગુરુ ગીતા" },
  katha: { icon: BookOpenText, queryGu: "કથા" },
  bhajan: { icon: Headphones, queryGu: "ભજન" },
  chaturmas: { icon: Radio, queryGu: "ચાતુર્માસ" },
  pravachan: { icon: YouTubeMark, queryGu: "સત્સંગ" },
  festival: { icon: Sparkles, queryGu: "ઉત્સવ" },
  other: { icon: Radio, queryGu: "સત્સંગ" },
};

export default function SatsangPage() {
  const series = getSatsangSeries();
  const uploadsPlaylistId = getOfficialUploadsPlaylistId();
  const youtubeChannel = getOfficialYouTubeChannel();
  const liveStatus = getSatsangLiveStatus();

  return (
    <main>
      <header className="relative overflow-hidden bg-[#31131a] text-[#f7ecdf]">
        <div className="pattern-jali absolute inset-y-0 right-0 hidden w-2/5 opacity-20 lg:block" aria-hidden="true" />
        <div className="container-site relative py-10 sm:py-14 lg:py-16">
          <div className="max-w-3xl">
            <p className="text-[12px] font-bold tracking-[.1em] text-[#e6ad56]">સત્સંગ મંડપ</p>
            <h1 className="mt-4 font-serif text-[2.35rem] font-bold leading-[1.12] tracking-[-.025em] text-white sm:text-5xl lg:text-[3.5rem]">જ્યાં હો ત્યાંથી સત્સંગ સાથે જોડાયેલા રહો</h1>
            <p className="mt-4 max-w-2xl text-[16px] leading-7 text-[#d8c7bb] sm:text-[18px] sm:leading-8">ગુરુવાણી, પાઠ, કથા, ભજન અને આધ્યાત્મિક સ્વાધ્યાય માટે શાંતિથી બેસો — અધિકૃત સત્સંગ અહીંથી સહેલાઈથી ખોલો.</p>
          </div>

          <section className="mt-8 border-t border-white/15 pt-6" aria-labelledby="choose-heading">
            <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-[12px] font-bold text-[#dcb985]">આજનો સ્વાધ્યાય</p><h2 id="choose-heading" className="mt-1 font-serif text-2xl font-bold text-white sm:text-3xl">આજે શું સાંભળશો?</h2></div><SatsangShare className="border-white/25 text-white hover:bg-white/10" /></div>
            <div className="mt-5 grid grid-cols-2 gap-2.5 md:grid-cols-3 lg:grid-cols-6">
              {series.map((item) => {
                const { icon: Icon, queryGu } = categoryDetails[item.category];
                const href = item.id === "latest" ? "#latest" : `${youtubeChannel}search?query=${encodeURIComponent(queryGu)}`;
                const external = item.id !== "latest";
                return <a key={item.id} href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} className="group flex min-h-[7.4rem] flex-col justify-between rounded-2xl border border-white/14 bg-white/[.055] p-3.5 transition hover:border-[#e6ad56]/55 hover:bg-white/[.09] sm:p-4">
                  <Icon className="size-5 text-[#e6ad56]" aria-hidden="true" />
                  <span><span className="block font-serif text-[16px] font-bold leading-snug text-white">{item.titleGu}</span><span className="mt-1 block text-[11px] leading-5 text-[#cdbbb0]">{item.descriptionGu}</span></span>
                </a>;
              })}
            </div>
          </section>
        </div>
      </header>

      <section id="latest" className="scroll-mt-24 border-b border-border bg-surface py-11 sm:py-16" aria-labelledby="latest-heading">
        <div className="container-site grid gap-8 lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:gap-12">
          <div>
            <p className="eyebrow">અધિકૃત પ્રકાશન</p>
            <h2 id="latest-heading" className="mt-3 font-serif text-3xl font-bold text-primary-strong sm:text-4xl">તાજેતરના સત્સંગ</h2>
            <p className="mt-3 max-w-2xl text-[16px] leading-7 text-muted-foreground">અધિકૃત ચેનલ પર પ્રકાશિત નવા પ્રવચન અને પાઠમાંથી મનગમતો સત્સંગ પસંદ કરીને જુઓ.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={youtubeChannel} target="_blank" rel="noopener noreferrer" className="tap-target inline-flex items-center gap-2 rounded-full bg-primary px-5 text-[14px] font-bold text-primary-foreground"><YouTubeMark className="size-4" />અધિકૃત ચેનલ ખોલો<ExternalLink className="size-3.5" /></a>
              <SatsangShare className="border-border-strong text-primary hover:bg-surface-soft" />
            </div>
          </div>
          <YouTubeFacade playlistId={uploadsPlaylistId} title="શ્રી માધવાનંદ આશ્રમના તાજેતરના સત્સંગ" />
        </div>
      </section>

      <section className="py-11 sm:py-16" aria-labelledby="live-heading">
        <div className="container-site grid gap-5 md:grid-cols-2">
          <article className="card-sacred relative overflow-hidden p-5 sm:p-7">
            <div className="absolute inset-y-0 right-0 w-1/3 pattern-jali opacity-35" aria-hidden="true" />
            <div className="relative"><Radio className="size-6 text-gold-deep" aria-hidden="true" /><p className="mt-4 text-[12px] font-bold text-gold-deep">લાઇવ પ્રસારણ</p><h2 id="live-heading" className="mt-1 font-serif text-2xl font-bold text-primary-strong sm:text-3xl">લાઇવ સત્સંગ જુઓ</h2><p className="mt-3 max-w-lg text-[15px] leading-7 text-muted-foreground">અધિકૃત પ્રસારણ ચાલુ હોય ત્યારે ચેનલના લાઇવ વિભાગમાં સત્સંગ જોઈ શકાશે.</p>
              {liveStatus?.isLive && liveStatus.videoId ? <a href={`https://www.youtube.com/watch?v=${liveStatus.videoId}`} target="_blank" rel="noopener noreferrer" className="tap-target mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 text-[14px] font-bold text-primary-foreground">હમણાં જુઓ<ExternalLink className="size-3.5" /></a> : <a href={`${youtubeChannel}live`} target="_blank" rel="noopener noreferrer" className="tap-target mt-5 inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface px-5 text-[14px] font-bold text-primary">લાઇવ વિભાગ ખોલો<ExternalLink className="size-3.5" /></a>}
            </div>
          </article>

          <article className="rounded-[1.4rem] border border-primary/15 bg-primary p-5 text-primary-foreground sm:p-7">
            <ScrollText className="size-6 text-[#efbd6b]" aria-hidden="true" /><p className="mt-4 text-[12px] font-bold text-[#e7bd7b]">નિત્ય પાઠ</p><h2 className="mt-1 font-serif text-2xl font-bold text-white sm:text-3xl">દૈનિક પાઠ અને ઉપાસના</h2><p className="mt-3 text-[15px] leading-7 text-primary-foreground/75">ગુરુ ગીતા, નિત્યકર્મ અને ઉપાસનાને લગતા ઉપલબ્ધ પાઠ માટે અધિકૃત સત્સંગ સંગ્રહમાં પ્રવેશ કરો.</p><a href={`${youtubeChannel}search?query=${encodeURIComponent("નિત્ય પાઠ")}`} target="_blank" rel="noopener noreferrer" className="tap-target mt-5 inline-flex items-center gap-2 rounded-full bg-primary-foreground px-5 text-[14px] font-bold text-primary">નિત્ય પાઠ શોધો<ExternalLink className="size-3.5" /></a>
          </article>
        </div>
      </section>

      <section className="border-y border-border bg-[#f1e5d3] py-11 sm:py-16" aria-labelledby="historical-heading"><div className="container-site"><p className="eyebrow">પ્રસંગ સ્મૃતિ</p><h2 id="historical-heading" className="mt-3 font-serif text-3xl font-bold text-primary-strong sm:text-4xl">ઐતિહાસિક સત્સંગ સંગ્રહ</h2><p className="mt-3 max-w-2xl leading-7 text-muted-foreground">Legacy video galleryમાં નોંધાયેલા ચાર સંગ્રહ. વ્યક્તિગત video IDs હજુ ઉપલબ્ધ નથી, તેથી playback બનાવવાને બદલે મૂળ archive સુરક્ષિત રીતે ખોલવામાં આવે છે.</p><div className="mt-8 grid gap-4 md:grid-cols-2">{historicalVideoCollections.map(item=><a key={item.id} href={item.sourceUrl} target="_blank" rel="noreferrer" className="group rounded-[1.25rem] border border-[#d0b796] bg-[#fffaf2] p-5 transition hover:border-primary/30"><YouTubeMark className="size-6 text-primary"/><h3 className="mt-5 font-serif text-xl font-bold text-primary">{item.titleGu}</h3>{item.contextGu?<p className="mt-2 text-sm text-muted-foreground">{item.contextGu}</p>:null}<span className="mt-5 inline-flex min-h-11 items-center gap-2 font-bold text-primary">{item.videoCount} વિડિયોનો સંગ્રહ <ExternalLink className="size-4"/></span></a>)}</div></div></section>

      <section className="border-y border-border bg-surface-soft py-11 sm:py-16" aria-labelledby="resources-heading">
        <div className="container-site flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl"><p className="eyebrow">વાંચન અને મનન</p><h2 id="resources-heading" className="mt-3 font-serif text-3xl font-bold text-primary-strong">સત્સંગ પછી સ્વાધ્યાય</h2><p className="mt-3 text-[16px] leading-7 text-muted-foreground">વેદ રહસ્યના ઉપલબ્ધ અંકો વાંચો અથવા સત્સંગ અને કાર્યક્રમોની માહિતી સાથે જોડાયેલા રહો.</p></div>
          <div className="flex flex-col gap-3 sm:flex-row"><Link href="/publications" className="tap-target inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 text-[14px] font-bold text-primary-foreground"><BookOpenText className="size-4" />પ્રકાશનો વાંચો</Link><Link href="/events" className="tap-target inline-flex items-center justify-center gap-2 rounded-full border border-border-strong bg-surface px-5 text-[14px] font-bold text-primary">કાર્યક્રમો જુઓ<ArrowRight className="size-4" /></Link></div>
        </div>
      </section>
    </main>
  );
}
