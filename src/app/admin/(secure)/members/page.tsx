import Link from "next/link";
import { ArrowRight, CheckCircle2, Users } from "lucide-react";

import { hasAdminPermission, requireAdminSession } from "@/lib/admin/data";
import { getMembershipApplications, getMembershipRecords } from "@/lib/membership/admin-data";
import { updateMembershipStatusAction } from "@/app/admin/members/actions";

const statusLabel: Record<string,string> = { submitted:"નવી", reviewing:"તપાસમાં", needs_changes:"સુધારો જરૂરી", approved:"મંજૂર", rejected:"નામંજૂર", active:"સક્રિય", inactive:"નિષ્ક્રિય", archived:"આર્કાઇવ" };

export default async function AdminMembersPage() {
  const session = await requireAdminSession();
  const allowed = hasAdminPermission(session,"membership.view");
  const [applications,memberships] = allowed ? await Promise.all([getMembershipApplications(session),getMembershipRecords(session)]) : [[],[]];
  const canManage = hasAdminPermission(session,"membership.manage");
  const pending = applications.filter((item) => !["approved","rejected"].includes(item.status));
  return <div><div className="flex items-end justify-between gap-3"><div><p className="text-xs font-bold text-gold-deep">MEMBERS & HOUSEHOLDS</p><h1 className="mt-1 font-serif text-2xl font-bold text-primary sm:text-3xl">સભ્યપદ વ્યવસ્થા</h1><p className="mt-1 text-sm text-muted-foreground">અરજી પહેલા તપાસાય છે; મંજૂરી પછી જ સત્તાવાર સભ્ય અને પરિવાર રેકોર્ડ બને છે.</p></div><span className="rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-white">{pending.length} બાકી</span></div>
    {!allowed ? <div className="mt-5 rounded-2xl bg-amber-50 p-5 text-sm font-semibold text-amber-900">આ ભૂમિકા પાસે સભ્યપદ રેકોર્ડ જોવાની પરવાનગી નથી.</div> : <>
      <section className="mt-6"><h2 className="font-serif text-xl font-bold text-primary">આવેલી અરજીઓ</h2><div className="mt-3 space-y-3">{applications.length ? applications.map((app) => <Link href={`/admin/members/${app.id}`} key={app.id} className="flex min-h-20 items-center gap-3 rounded-2xl border border-[#dfd9d0] bg-white p-4 shadow-sm"><div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#f3eee7] text-primary"><Users className="size-5" /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="font-bold">{[app.first_name,app.father_name,app.surname].filter(Boolean).join(" ")}</p><span className="rounded-full bg-[#f3eee7] px-2 py-0.5 text-[10px] font-bold">{statusLabel[app.status] ?? app.status}</span></div><p className="mt-1 text-xs text-muted-foreground">{app.application_number} • {app.native_village} • પરિવાર +{app.family_member_count}</p></div><ArrowRight className="size-4 text-[#a99a8d]" /></Link>) : <div className="rounded-2xl border border-dashed border-[#d8d0c5] bg-white/70 p-8 text-center text-sm text-muted-foreground">હજુ કોઈ સભ્યપદ અરજી નથી.</div>}</div></section>
      <section className="mt-8"><div className="flex items-center gap-2"><CheckCircle2 className="size-5 text-sacred-green" /><h2 className="font-serif text-xl font-bold text-primary">સત્તાવાર સભ્યપદ</h2></div><div className="mt-3 overflow-hidden rounded-2xl border border-[#dfd9d0] bg-white">{memberships.length ? memberships.map((member) => <div key={member.id} className="flex flex-wrap items-center gap-3 border-b border-[#eee9e2] p-4 last:border-0"><div className="min-w-0 flex-1"><p className="font-bold text-primary">{member.membership_number}</p><p className="mt-1 text-xs text-muted-foreground">પરિવાર: {member.household_id.slice(0,8)} • શરૂ: {member.started_at}</p></div>{canManage ? <form action={updateMembershipStatusAction} className="flex gap-2"><input type="hidden" name="id" value={member.id} /><select className="field !min-h-10 !w-auto !py-1.5 text-xs" name="status" defaultValue={member.status}><option value="active">સક્રિય</option><option value="inactive">નિષ્ક્રિય</option><option value="archived">આર્કાઇવ</option></select><button className="min-h-10 rounded-xl bg-[#eee7de] px-3 text-xs font-bold text-primary">સાચવો</button></form> : <span className="rounded-full bg-[#f3eee7] px-2.5 py-1 text-xs font-bold">{statusLabel[member.status] ?? member.status}</span>}</div>) : <p className="p-6 text-sm text-muted-foreground">હજુ સત્તાવાર સભ્યપદ બનાવાયું નથી.</p>}</div></section>
    </>}
  </div>;
}
