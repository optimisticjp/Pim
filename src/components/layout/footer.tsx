import Link from "next/link";
import { ExternalLink, MapPin, Phone } from "lucide-react";
import { YouTubeMark } from "@/components/icons/youtube-mark";
import { BrandMark } from "@/components/ui/brand-mark";
import { navItems, siteName, youtubeChannel } from "@/lib/site-data";

const serviceLinks=[{href:"/programmes",label:"સત્સંગ / શિબિર"},{href:"/seva",label:"સેવા પ્રવૃત્તિ"},{href:"/forms",label:"ફોર્મ"},{href:"/membership",label:"સભ્યપદ"},{href:"/volunteer",label:"સ્વયંસેવક"},{href:"/stay",label:"ઉતારા / રૂમ"}];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#32151b] pb-24 text-[#f7eadc] md:pb-0">
      <div className="container-site grid gap-10 py-14 lg:grid-cols-[1.2fr_.8fr_.8fr_.9fr] lg:gap-12">
        <div><div className="flex items-center gap-3"><BrandMark className="bg-[#4a1b25] text-[#f2bd66]" /><div><div className="font-serif text-xl font-bold">{siteName}</div><div className="mt-1 text-xs text-[#c9b9ad]">જય સચ્ચિદાનંદ • ૐ નમો નારાયણ</div></div></div><p className="mt-5 max-w-xl text-[15px] leading-7 text-[#d9cbbf]">વેદ-ઉપનિષદના જ્ઞાન, ગુરુભક્તિ અને સેવાભાવને નવી પેઢી સુધી પ્રેમપૂર્વક પહોંચાડતું ડિજિટલ ધામ.</p></div>
        <div><h2 className="text-base font-bold text-white">ઝડપી કડીઓ</h2><div className="mt-4 grid gap-y-2 text-[14px] text-[#d9cbbf]">{navItems.slice(0,6).map((item) => <Link key={item.href} href={item.href} className="py-1 hover:text-white">{item.label}</Link>)}</div></div>
        <div><h2 className="text-base font-bold text-white">સેવા અને ફોર્મ</h2><div className="mt-4 grid gap-y-2 text-[14px] text-[#d9cbbf]">{serviceLinks.map(item=><Link key={item.href} href={item.href} className="py-1 hover:text-white">{item.label}</Link>)}</div></div>
        <div><h2 className="text-base font-bold text-white">મુખ્ય આશ્રમ</h2><div className="mt-4 space-y-3 text-[14px] leading-6 text-[#d9cbbf]"><p className="flex gap-2"><MapPin className="mt-1 h-4 w-4 shrink-0 text-[#e4ae58]" />ઉદયનગર-૧, કતારગામ રોડ, સુરત — ૩૯૫૦૦૪</p><a href="tel:+912612534610" className="flex items-center gap-2 hover:text-white"><Phone className="h-4 w-4 text-[#e4ae58]" />+91 261 2534610</a><a href={youtubeChannel} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white"><YouTubeMark className="h-4 w-4 text-[#e4ae58]" />YouTube સત્સંગ <ExternalLink className="h-3.5 w-3.5" /></a></div></div>
      </div><div className="border-t border-white/10"><div className="container-site flex flex-col gap-2 py-5 text-[12px] text-[#b9a99e] sm:flex-row sm:items-center sm:justify-between"><span>© ૨૦૨૬ શ્રી માધવાનંદ આશ્રમ. સર્વ હક્ક સુરક્ષિત.</span><span>આધ્યાત્મિક ગરિમા સાથે સરળ, ઝડપી અને સૌ માટે સુલભ.</span></div></div>
    </footer>
  );
}
