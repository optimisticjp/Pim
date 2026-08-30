import Link from "next/link";
import { AlertCircle, ArrowRight, Clock3, Inbox, PlusCircle, UserCheck } from "lucide-react";

import { categoryLabel, statusLabel } from "@/lib/admin/labels";
import { getInboxItems, requireAdminSession } from "@/lib/admin/data";

export default async function AdminDashboardPage() {
  const session = await requireAdminSession();
  const items = await getInboxItems(session, 80);
  const active = items.filter((item) => !item.archived_at);
  const newCount = active.filter((item) => item.status === "new").length;
  const mineCount = active.filter((item) => item.assigned_to === session.profile?.id).length;
  const urgentCount = active.filter((item) => item.priority === "urgent" || item.priority === "high").length;
  const cashCount = active.filter((item) => item.status === "cash_pending").length;
  const cards = [
    ["નવી અરજીઓ", newCount, Inbox, "text-primary bg-[#f5e8e7]"],
    ["મારી પાસે", mineCount, UserCheck, "text-sacred-green bg-[#e8f0ed]"],
    ["પ્રાથમિક", urgentCount, AlertCircle, "text-[#a34b17] bg-[#fff0df]"],
    ["નકદ બાકી", cashCount, Clock3, "text-[#74520d] bg-[#f8efce]"],
  ] as const;

  return <div>
    <section className="flex items-end justify-between gap-4"><div><p className="text-xs font-bold text-gold-deep">આજનું કામ</p><h1 className="mt-1 font-serif text-2xl font-bold text-primary sm:text-3xl">{session.profile?.display_name}</h1><p className="mt-1 text-sm text-muted-foreground">એક નજરમાં બાકી કામગીરી અને નવી અરજીઓ.</p></div><Link href="/admin/quick-add" className="hidden min-h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white sm:inline-flex"><PlusCircle className="size-4" /> ઉમેરો</Link></section>

    <section className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">{cards.map(([label, count, Icon, style]) => <article key={label} className="rounded-2xl border border-[#e1dbd2] bg-white p-4 shadow-sm"><div className={`flex size-9 items-center justify-center rounded-xl ${style}`}><Icon className="size-[18px]" /></div><p className="mt-3 text-2xl font-extrabold leading-none">{count}</p><p className="mt-2 text-xs font-bold text-muted-foreground">{label}</p></article>)}</section>

    <section className="mt-7"><div className="flex items-center justify-between"><h2 className="font-serif text-xl font-bold text-primary">તાજેતરની અરજીઓ</h2><Link href="/admin/inbox" className="flex items-center gap-1 text-xs font-bold text-primary">બધી જુઓ <ArrowRight className="size-3.5" /></Link></div><div className="mt-3 overflow-hidden rounded-2xl border border-[#dfd9d1] bg-white">{active.length ? active.slice(0, 7).map((item) => <Link key={item.id} href={`/admin/inbox#${item.id}`} className="flex min-h-[4.6rem] items-center gap-3 border-b border-[#eee9e2] px-4 py-3 last:border-0 hover:bg-[#fcfaf6]"><span className={`size-2.5 shrink-0 rounded-full ${item.priority === "urgent" ? "bg-red-500" : item.priority === "high" ? "bg-orange-500" : "bg-[#c8b89f]"}`} /><span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold">{item.title}</span><span className="mt-1 block truncate text-xs text-muted-foreground">{categoryLabel(item.category)} • {item.ashram_key || "સામાન્ય"}</span></span><span className="rounded-full bg-[#f3eee6] px-2.5 py-1 text-[11px] font-bold text-[#695d53]">{statusLabel(item.status)}</span></Link>) : <div className="p-8 text-center"><Inbox className="mx-auto size-7 text-[#b8aa9a]" /><p className="mt-3 text-sm font-bold">હાલ નવી અરજી નથી</p><p className="mt-1 text-xs text-muted-foreground">Public forms જોડાયા પછી અહીં live queue દેખાશે.</p></div>}</div></section>
  </div>;
}
