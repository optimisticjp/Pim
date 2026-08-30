import Link from "next/link";
import { ArrowLeft, CheckCircle2, Phone, Users } from "lucide-react";
import { notFound } from "next/navigation";

import { approveMembershipApplicationAction, reviewMembershipApplicationAction } from "@/app/admin/members/actions";
import { hasAdminPermission, requireAdminSession } from "@/lib/admin/data";
import { getMembershipApplication } from "@/lib/membership/admin-data";

const genderLabel: Record<string,string> = { male:"પુરૂષ", female:"સ્ત્રી", other:"અન્ય", prefer_not_to_say:"જણાવવું નથી" };
const statusLabel: Record<string,string> = { submitted:"નવી અરજી", reviewing:"તપાસમાં", needs_changes:"સુધારો જરૂરી", approved:"મંજૂર", rejected:"નામંજૂર" };

export default async function MembershipApplicationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireAdminSession();
  const application = await getMembershipApplication(session,id);
  if (!application) notFound();
  const canReview = hasAdminPermission(session,"membership.review");
  const canApprove = hasAdminPermission(session,"membership.approve");
  const family = application.membership_application_members ?? [];
  const fullName = [application.first_name,application.father_name,application.surname].filter(Boolean).join(" ");
  return <div><Link href="/admin/members" className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-primary"><ArrowLeft className="size-4" /> સભ્યપદ યાદી</Link>
    <div className="mt-3 rounded-3xl border border-[#dfd9d0] bg-white p-5 shadow-sm sm:p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold text-gold-deep">{application.application_number}</p><h1 className="mt-1 font-serif text-2xl font-bold text-primary sm:text-3xl">{fullName}</h1><p className="mt-1 text-sm text-muted-foreground">{application.native_village} • ઉંમર {application.age} • {genderLabel[application.gender] ?? application.gender}</p></div><span className="rounded-full bg-[#f3eee7] px-3 py-1.5 text-xs font-bold">{statusLabel[application.status] ?? application.status}</span></div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-[#f8f5f0] p-3"><p className="text-[11px] font-bold text-muted-foreground">મોબાઇલ</p><a href={`tel:${application.mobile}`} className="mt-1 inline-flex items-center gap-2 font-bold text-primary"><Phone className="size-4" />{application.mobile}</a></div><div className="rounded-xl bg-[#f8f5f0] p-3"><p className="text-[11px] font-bold text-muted-foreground">અભ્યાસ / વ્યવસાય</p><p className="mt-1 font-semibold">{application.education || "—"} {application.occupation ? `• ${application.occupation}` : ""}</p></div><div className="rounded-xl bg-[#f8f5f0] p-3 sm:col-span-2"><p className="text-[11px] font-bold text-muted-foreground">એડ્રેસ</p><p className="mt-1 font-semibold leading-7">{application.full_address}</p></div></div>
      {application.review_note ? <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm"><strong>સમિતિ નોંધ:</strong> {application.review_note}</div> : null}
    </div>

    <section className="mt-5 rounded-3xl border border-[#dfd9d0] bg-white p-5 sm:p-6"><div className="flex items-center gap-2"><Users className="size-5 text-primary" /><h2 className="font-serif text-xl font-bold text-primary">પરિવારના સભ્યો ({family.length})</h2></div><div className="mt-4 space-y-2">{family.length ? family.sort((a,b)=>a.member_order-b.member_order).map((member) => <div key={member.id} className="rounded-xl bg-[#f8f5f0] p-3"><p className="font-bold">{member.member_order}. {[member.first_name,member.father_name,member.surname].filter(Boolean).join(" ")}</p><p className="mt-1 text-xs text-muted-foreground">{member.relationship || "સંબંધ —"} {member.age != null ? `• ઉંમર ${member.age}` : ""} {member.mobile ? `• ${member.mobile}` : ""} {member.blood_group ? `• ${member.blood_group}` : ""}</p></div>) : <p className="text-sm text-muted-foreground">અલગ પરિવાર સભ્ય ઉમેરાયેલ નથી.</p>}</div></section>

    {(canReview || canApprove) && application.status !== "approved" ? <section className="mt-5 rounded-3xl border border-[#dfd9d0] bg-white p-5 sm:p-6"><h2 className="font-serif text-xl font-bold text-primary">અરજી પર કાર્યવાહી</h2>{canReview ? <form action={reviewMembershipApplicationAction} className="mt-4 grid gap-3 sm:grid-cols-[180px_1fr_auto]"><input type="hidden" name="id" value={application.id} /><select className="field" name="status" defaultValue={application.status === "submitted" ? "reviewing" : application.status}><option value="reviewing">તપાસમાં</option><option value="needs_changes">સુધારો જરૂરી</option><option value="rejected">નામંજૂર</option></select><input className="field" name="note" placeholder="સમિતિ નોંધ / જરૂરી સુધારો" defaultValue={application.review_note ?? ""} /><button className="min-h-12 rounded-xl bg-[#eee7de] px-4 font-bold text-primary">સ્થિતિ સાચવો</button></form> : null}{canApprove ? <form action={approveMembershipApplicationAction} className="mt-4"><input type="hidden" name="id" value={application.id} /><button className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-sacred-green px-5 font-bold text-white"><CheckCircle2 className="size-4" /> તપાસ પૂર્ણ — સત્તાવાર સભ્યપદ મંજૂર કરો</button></form> : null}</section> : null}
    {application.status === "approved" ? <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm font-semibold text-emerald-950">આ અરજી મંજૂર થઈ ગઈ છે અને સત્તાવાર પરિવાર/સભ્યપદ રેકોર્ડ બનાવાયો છે.</div> : null}
  </div>;
}
