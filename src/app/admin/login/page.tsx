import Link from "next/link";
import { ArrowRight, KeyRound, Mail, ShieldCheck } from "lucide-react";
import { BrandMark } from "@/components/ui/brand-mark";

export const metadata = { title: "કમિટી લોગિન" };

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-screen bg-[#f4eee5] lg:grid-cols-[.9fr_1.1fr]">
      <section className="hidden bg-[#32151b] p-12 text-[#f6e9dd] lg:flex lg:flex-col lg:justify-between">
        <BrandMark className="border-[#e8b45f]/40 bg-[#461a23] text-[#e8b45f]" />
        <div className="max-w-xl"><div className="text-[12px] font-bold tracking-[.08em] text-[#e8b45f]">COMMITTEE PORTAL</div><h1 className="mt-4 font-serif text-5xl font-bold leading-tight">જાહેર વેબસાઇટ સરળ, પાછળનું સંચાલન વધુ સરળ.</h1><p className="mt-5 text-[15px] leading-8 text-[#d6c5b9]">ફોર્મ, કાર્યક્રમો, આશ્રમ શાખાઓ અને પ્રકાશનો એક જ સ્થાનેથી સંભાળવા માટેનું preview.</p></div>
        <p className="text-xs text-[#ae9a8e]">Production security: Cloudflare Access + role permissions + audit log</p>
      </section>
      <section className="grid place-items-center p-5 sm:p-8">
        <div className="w-full max-w-[470px] rounded-[1.5rem] border border-[#decfbf] bg-[#fffaf3] p-6 shadow-[0_25px_70px_rgba(59,38,28,.12)] sm:p-8">
          <div className="flex items-center gap-3"><BrandMark /><div><div className="font-serif text-xl font-bold text-primary">કમિટી લોગિન</div><div className="text-[11px] text-muted-foreground">પૂર્વદર્શન સંસ્કરણ</div></div></div>
          <div className="mt-7 rounded-xl border border-[#d7c4ad] bg-[#fff4df] p-4 text-[12px] leading-6 text-[#6f5337]"><ShieldCheck className="mr-1 inline h-4 w-4" /> આ screen UX preview છે. Productionમાં login formને બદલે Cloudflare Access પહેલેથી user verify કરશે.</div>
          <div className="mt-6 space-y-4 opacity-70">
            <label className="block text-[12px] font-bold text-[#554842]">કમિટી ઇમેઇલ<div className="relative mt-2"><Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input disabled placeholder="name@committee.org" className="min-h-12 w-full rounded-xl border border-border bg-white pl-11 pr-4" /></div></label>
            <label className="block text-[12px] font-bold text-[#554842]">પાસવર્ડ<div className="relative mt-2"><KeyRound className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input disabled type="password" value="previewonly" readOnly className="min-h-12 w-full rounded-xl border border-border bg-white pl-11 pr-4" /></div></label>
          </div>
          <Link href="/admin/dashboard" className="mt-6 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 font-bold text-primary-foreground">પૂર્વદર્શન ડેશબોર્ડ ખોલો <ArrowRight className="h-4 w-4" /></Link>
          <Link href="/" className="mt-3 flex min-h-11 items-center justify-center text-[13px] font-bold text-muted-foreground">જાહેર વેબસાઇટ પર પાછા જાઓ</Link>
        </div>
      </section>
    </main>
  );
}
