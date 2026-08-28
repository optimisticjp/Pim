import { ExternalLink, Headphones, Radio, Search } from "lucide-react";
import { YouTubeMark } from "@/components/icons/youtube-mark";
import { SectionHeading } from "@/components/ui/section-heading";
import { youtubeChannel, youtubeChannelId } from "@/lib/site-data";

export const metadata = { title: "સત્સંગ અને પ્રવચન" };

const themes = [
  ["ગુરુ ગીતા", "ગુરુ તત્ત્વ, પાઠ અને વ્યાખ્યા"],
  ["શ્રીમદ્ ભાગવત કથા", "કથા શ્રેણી અને જ્ઞાનયજ્ઞ"],
  ["ચાતુર્માસ", "વિશેષ સત્સંગ અને પ્રસંગો"],
  ["સંતવાણી અને ભજન", "ભક્તિ, સ્તોત્ર અને સ્મરણ"],
  ["નિર્વાણ જયંતિ", "સ્મૃતિપ્રસંગ અને પ્રવચન"],
  ["દૈનિક નિત્યકર્મ", "પાઠ, ઉપાસના અને નિયમિત પ્રસારણ"],
];

export default function SatsangPage() {
  const uploads = `UU${youtubeChannelId.slice(2)}`;
  return (
    <>
      <section className="bg-[#31131a] text-[#f7ecdf]">
        <div className="container-site section-pad grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div>
            <div className="text-[12px] font-bold tracking-[.08em] text-[#e6ad56]">પ્રવચન અને સત્સંગ</div>
            <h1 className="display-title mt-5 text-white">એક જ સ્થાનેથી લાઇવ અને તાજા સત્સંગ સુધી પહોંચો.</h1>
            <p className="mt-6 text-[17px] leading-8 text-[#d8c7bb]">વિડિયો વેબસાઇટ પર ફરી અપલોડ નહીં કરીએ. અધિકૃત YouTube ચેનલ જ મૂળ સ્રોત રહેશે, જેથી ઝડપી લોડિંગ, એક જ archive અને સરળ શેરિંગ રહે.</p>
            <a href={youtubeChannel} target="_blank" rel="noreferrer" className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#fff3e3] px-5 font-bold text-primary"><YouTubeMark className="h-4 w-4" /> અધિકૃત ચેનલ ખોલો <ExternalLink className="h-3.5 w-3.5" /></a>
          </div>
          <div className="overflow-hidden rounded-[1.4rem] border border-white/12 bg-black shadow-2xl">
            <div className="aspect-video"><iframe className="h-full w-full" src={`https://www.youtube-nocookie.com/embed/videoseries?list=${uploads}`} title="શ્રી માધવાનંદ આશ્રમ YouTube અપલોડ્સ" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div>
          </div>
        </div>
      </section>

      <section className="section-pad bg-surface">
        <div className="container-site grid gap-6 lg:grid-cols-2">
          <div className="card-sacred overflow-hidden">
            <div className="flex items-center justify-between bg-primary px-5 py-4 text-primary-foreground"><strong>લાઇવ સત્સંગ</strong><Radio className="h-5 w-5" /></div>
            <div className="aspect-video bg-black"><iframe className="h-full w-full" src={`https://www.youtube-nocookie.com/embed/live_stream?channel=${youtubeChannelId}`} title="લાઇવ સત્સંગ" loading="lazy" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /></div>
            <p className="px-5 py-4 text-[12px] leading-6 text-muted-foreground">હાલ લાઇવ પ્રસારણ ન હોય તો તાજા અપલોડ્સ માટે ઉપરનો વિડિયો વિભાગ ઉપયોગી રહેશે. લાઇવ સ્થિતિ મળતાં આ cardને આપમેળે દેખાડવાની વ્યવસ્થા જોડાઈ શકે.</p>
          </div>
          <div className="card-sacred p-6 sm:p-8">
            <Headphones className="h-7 w-7 text-gold-deep" />
            <h2 className="mt-5 font-serif text-3xl font-bold text-primary">સાંભળવા માટે શાંતિપૂર્ણ અનુભવ</h2>
            <p className="mt-4 text-[14px] leading-7 text-muted-foreground">હોમપેજ પર ભારે iframe ભરવાના બદલે થંબનેલ/હળવા cards રાખવાની દિશા છે. સંપૂર્ણ player માત્ર અહીં અથવા click પછી ખૂલે, જેથી વૃદ્ધ મોબાઇલ ઉપકરણો પર પણ સાઇટ ઝડપી રહે.</p>
            <div className="mt-6 rounded-xl bg-surface-soft p-4 text-[13px] leading-6 text-[#5d514a]"><strong className="text-primary">આગળનો અનુભવ:</strong> વિડિયો filter, Swamishri filter, વર્ષ, વિષય અને “ફક્ત audio સાંભળો” જેવી સુવિધાથી મોટું archive પણ સરળ રહેશે.</div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-site">
          <SectionHeading eyebrow="વિષય પ્રમાણે શોધ" title="ભક્તને YouTubeમાં ખોવાવું નહીં પડે" description="ચેનલમાં અનેક વર્ષોની સામગ્રી હોવાથી વેબસાઇટનું કામ વિડિયો ‘હોસ્ટ’ કરવું નહીં, તેને સમજદારીથી ગોઠવવું છે." />
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {themes.map(([title, copy]) => <div key={title} className="card-sacred flex items-start gap-4 p-5"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/8 text-primary"><Search className="h-4 w-4" /></div><div><h3 className="font-serif text-lg font-bold text-primary">{title}</h3><p className="mt-1 text-[13px] leading-6 text-muted-foreground">{copy}</p></div></div>)}
          </div>
        </div>
      </section>
    </>
  );
}
