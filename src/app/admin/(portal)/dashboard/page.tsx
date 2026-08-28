import Link from "next/link";
import { ArrowRight, BookOpenText, CalendarDays, ClipboardList, Landmark, MessageSquareText, TrendingUp } from "lucide-react";
import { ashrams, events, publications } from "@/lib/site-data";

export const metadata = { title: "Admin Dashboard" };

export default function DashboardPage() {
  const stats = [
    { label: "આશ્રમ શાખાઓ", value: ashrams.length, icon: Landmark, href: "/admin/ashrams" },
    { label: "કાર્યક્રમ records", value: events.length, icon: CalendarDays, href: "/admin/events" },
    { label: "પ્રકાશન preview", value: publications.length, icon: BookOpenText, href: "/admin/publications" },
    { label: "નવા ફોર્મ", value: "Live", icon: ClipboardList, href: "/admin/inquiries" },
  ];
  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><div className="text-[12px] font-bold text-gold-deep">કમિટી પોર્ટલ</div><h1 className="mt-1 font-serif text-3xl font-bold text-primary">નમસ્કાર. આજે શું સંભાળવું છે?</h1></div><div className="inline-flex items-center gap-2 text-[12px] font-semibold text-sacred-green"><TrendingUp className="h-4 w-4" /> Preview data layer active</div></div>
      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(({ label, value, icon: Icon, href }) => <Link key={label} href={href} className="rounded-2xl border border-[#decfbf] bg-[#fffaf3] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><div className="flex items-center justify-between"><Icon className="h-5 w-5 text-gold-deep" /><ArrowRight className="h-4 w-4 text-muted-foreground" /></div><div className="mt-5 font-serif text-3xl font-bold text-primary">{value}</div><div className="mt-1 text-[12px] font-bold text-muted-foreground">{label}</div></Link>)}</div>
      <div className="mt-7 grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <section className="rounded-2xl border border-[#decfbf] bg-[#fffaf3] p-5 sm:p-6"><div className="flex items-center justify-between"><div><div className="text-[11px] font-bold text-gold-deep">INBOX WORKFLOW</div><h2 className="mt-1 font-serif text-2xl font-bold text-primary">ફોર્મ → જવાબ → પૂર્ણ</h2></div><MessageSquareText className="h-6 w-6 text-primary" /></div><p className="mt-4 text-[13px] leading-7 text-muted-foreground">જાહેર contact/seva form મોકલો અને પછી “ફોર્મ ઇનબોક્સ” ખોલો. આ જ browserમાં submission તરત દેખાશે. D1 જોડાયા બાદ આ workflow બધા committee users માટે shared થશે.</p><Link href="/admin/inquiries" className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-full bg-primary px-4 text-[12px] font-bold text-primary-foreground">ઇનબોક્સ ખોલો <ArrowRight className="h-3.5 w-3.5" /></Link></section>
        <section className="rounded-2xl border border-[#decfbf] bg-[#3a171e] p-5 text-[#f4e8dc] sm:p-6"><div className="text-[11px] font-bold text-[#e5ae58]">PRODUCTION CHECKLIST</div><h2 className="mt-2 font-serif text-2xl font-bold text-white">Launch પહેલાં ચાર કડક પગલાં</h2><ul className="mt-4 space-y-3 text-[13px] leading-6 text-[#d7c6ba]"><li>01 • Cloudflare Accessથી /admin સુરક્ષિત</li><li>02 • D1 migrations અને role permissions</li><li>03 • R2 media upload validation</li><li>04 • Turnstile + audit log + backup policy</li></ul></section>
      </div>
    </div>
  );
}
