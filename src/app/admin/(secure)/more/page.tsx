import Link from "next/link";
import { ArrowRight, BookOpenText, CalendarDays, FileText, Inbox, Landmark, ShieldCheck, Users } from "lucide-react";

const links = [
  ["/admin/inbox", "આવેલ અરજીઓ", "બધી applications અને કામની queue", Inbox],
  ["/admin/members", "સભ્યો અને પરિવાર", "સભ્યપદ અરજી, પરિવાર અને અધિકૃત સભ્ય રેકોર્ડ", Users],
  ["/admin/ashrams", "આશ્રમો", "આશ્રમ માહિતી અને હાલનું content management", Landmark],
  ["/admin/events", "કાર્યક્રમો", "ઉત્સવ અને કાર્યક્રમો", CalendarDays],
  ["/admin/publications", "પ્રકાશનો", "વેદ રહસ્ય અને પ્રકાશન વ્યવસ્થા", BookOpenText],
  ["/admin/team", "એડમિન ટીમ", "એડમિન અને scope/role વ્યવસ્થા", Users],
  ["/admin/roles", "ભૂમિકા અને પરવાનગીઓ", "View, edit, approve, archive વગેરે નિયંત્રણ", ShieldCheck],
  ["/admin/audit", "ઓડિટ લોગ", "બદલાવનો ઇતિહાસ", FileText],
] as const;

export default function AdminMorePage() {
  return <div><p className="text-xs font-bold text-gold-deep">MODULES & SETTINGS</p><h1 className="mt-1 font-serif text-2xl font-bold text-primary sm:text-3xl">વધુ</h1><div className="mt-5 overflow-hidden rounded-2xl border border-[#dfd9d0] bg-white">{links.map(([href, title, subtitle, Icon]) => <Link key={href} href={href} className="flex min-h-[4.8rem] items-center gap-3 border-b border-[#eee9e2] px-4 py-3 last:border-0"><div className="flex size-10 items-center justify-center rounded-xl bg-[#f3eee7] text-primary"><Icon className="size-[18px]" /></div><div className="min-w-0 flex-1"><p className="font-bold">{title}</p><p className="mt-1 truncate text-xs text-muted-foreground">{subtitle}</p></div><ArrowRight className="size-4 text-[#a99a8d]" /></Link>)}</div></div>;
}
