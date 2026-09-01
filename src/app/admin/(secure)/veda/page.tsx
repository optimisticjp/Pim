import { Archive, BookOpenText, FilePenLine, RotateCcw, Trash2, UserPlus } from "lucide-react";

import {
  activateVedaAction,
  archiveVedaIssueAction,
  permanentDeleteVedaIssueAction,
  restoreVedaIssueAction,
  reviewVedaApplicationAction,
  reviewVedaArticleAction,
  reviewVedaChangeAction,
  saveVedaIssueAction,
} from "@/app/admin/veda/actions";
import { hasAdminPermission } from "@/lib/admin/data";
import { getVedaAdminData, type AdminVedaIssue } from "@/lib/veda/admin-data";

function IssueForm({ item, canPublish }: { item?: AdminVedaIssue; canPublish: boolean }) {
  return <form action={saveVedaIssueAction} className="mt-3 grid gap-3 sm:grid-cols-2">
    {item ? <input type="hidden" name="id" value={item.id} /> : null}
    <label className="text-sm font-bold">અંક તારીખ<input className="field mt-1" type="date" name="issue_date" defaultValue={item?.issue_date ?? ""} required /></label>
    <label className="text-sm font-bold">ગુજરાતી શીર્ષક<input className="field mt-1" name="title_gu" defaultValue={item?.title_gu ?? "વેદ રહસ્ય"} required /></label>
    <label className="text-sm font-bold">PDF URL<input className="field mt-1" name="pdf_url" defaultValue={item?.pdf_url ?? ""} placeholder="https://…pdf" /></label>
    <label className="text-sm font-bold">Cover URL<input className="field mt-1" name="cover_url" defaultValue={item?.cover_url ?? ""} placeholder="https://…" /></label>
    <label className="text-sm font-bold sm:col-span-2">Source URL<input className="field mt-1" name="source_url" defaultValue={item?.source_url ?? ""} placeholder="મૂળ / ચકાસણી સ્રોત" /></label>
    {canPublish ? <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" name="published" defaultChecked={item?.published ?? false} /> જાહેર વેબસાઇટ પર પ્રકાશિત</label> : <p className="text-xs text-muted-foreground">આ ભૂમિકા issue edit કરી શકે છે, પરંતુ Publish/Unpublish નહીં.</p>}
    <button className="min-h-11 rounded-xl bg-primary px-4 font-bold text-white">{item ? "ફેરફાર સાચવો" : "અંક ઉમેરો"}</button>
  </form>;
}

export default async function Page() {
  const { s, apps, changes, articles, issues } = await getVedaAdminData();
  const superAdmin = Boolean(s.profile?.is_super_admin);
  const canSub = hasAdminPermission(s, "veda.subscriptions.manage") || superAdmin;
  const canApprove = hasAdminPermission(s, "veda.approve") || superAdmin;
  const canEdit = hasAdminPermission(s, "veda.editorial.manage") || superAdmin;
  const canIssues = hasAdminPermission(s, "veda.issues.manage") || superAdmin;
  const canPublish = hasAdminPermission(s, "veda.issues.publish") || superAdmin;

  return <div>
    <p className="text-xs font-bold text-gold-deep">VEDA RAHASYA</p>
    <h1 className="mt-1 font-serif text-3xl font-bold text-primary">વેદ રહસ્ય વ્યવસ્થા</h1>
    <p className="mt-2 text-sm text-muted-foreground">અહીં Publish કરેલા PDF અંક જ `/veda-rahasya` અને `/publications` પર દેખાય છે. Draft/Archived અંક જાહેરમાં દેખાતા નથી.</p>

    <div className="mt-5 grid grid-cols-3 gap-3">
      <div className="rounded-2xl border bg-white p-4"><UserPlus className="size-5 text-primary" /><b className="mt-2 block text-2xl">{apps.length}</b><span className="text-xs text-muted-foreground">સભ્ય અરજીઓ</span></div>
      <div className="rounded-2xl border bg-white p-4"><FilePenLine className="size-5 text-primary" /><b className="mt-2 block text-2xl">{changes.length + articles.length}</b><span className="text-xs text-muted-foreground">સુધારા / લેખ</span></div>
      <div className="rounded-2xl border bg-white p-4"><BookOpenText className="size-5 text-primary" /><b className="mt-2 block text-2xl">{issues.length}</b><span className="text-xs text-muted-foreground">ડિજિટલ અંક</span></div>
    </div>

    <section className="mt-7">
      <h2 className="font-serif text-xl font-bold text-primary">Subscription applications</h2>
      <div className="mt-3 space-y-2">{apps.map(a => <article key={a.id} className="rounded-2xl border bg-white p-4">
        <div className="flex justify-between gap-3"><div><b>{a.full_name}</b><p className="text-xs text-muted-foreground">{a.application_number} • {a.mobile} • {a.status}</p></div>{canApprove && a.status === "cash_received" ? <form action={activateVedaAction}><input type="hidden" name="id" value={a.id} /><button className="rounded-xl bg-primary px-3 py-2 text-xs font-bold text-white">Activate</button></form> : null}</div>
        {canSub ? <form action={reviewVedaApplicationAction} className="mt-3 flex gap-2"><input type="hidden" name="id" value={a.id} /><select className="field !min-h-10 text-xs" name="status" defaultValue={a.status}><option value="reviewing">Reviewing</option><option value="cash_pending">Cash Pending</option><option value="rejected">Rejected</option><option value="cancelled">Cancelled</option></select><input className="field !min-h-10 text-xs" name="review_note" placeholder="નોંધ" /><button className="rounded-xl bg-[#eee7de] px-3 text-xs font-bold">સાચવો</button></form> : null}
      </article>)}</div>
    </section>

    <section className="mt-7 grid gap-5 lg:grid-cols-2">
      <div><h2 className="font-serif text-xl font-bold text-primary">Subscriber સુધારા</h2><div className="mt-3 space-y-2">{changes.slice(0, 20).map(r => <article className="rounded-xl border bg-white p-3 text-sm" key={r.id}><b>{r.request_number}</b><p className="text-xs text-muted-foreground">{r.mobile} • {r.change_type} • {r.status}</p>{canSub ? <form action={reviewVedaChangeAction} className="mt-2 flex gap-2"><input type="hidden" name="id" value={r.id} /><select className="field !min-h-9 text-xs" name="status" defaultValue={r.status}><option value="reviewing">Reviewing</option><option value="approved">Approved</option><option value="completed">Completed</option><option value="rejected">Rejected</option></select><button className="rounded-xl bg-[#eee7de] px-3 text-xs font-bold">Update</button></form> : null}</article>)}</div></div>
      <div><h2 className="font-serif text-xl font-bold text-primary">Editorial queue</h2><div className="mt-3 space-y-2">{articles.slice(0, 20).map(r => <article className="rounded-xl border bg-white p-3 text-sm" key={r.id}><b>{r.title}</b><p className="text-xs text-muted-foreground">{r.author_name} • {r.submission_number} • {r.status}</p>{canEdit ? <form action={reviewVedaArticleAction} className="mt-2 flex gap-2"><input type="hidden" name="id" value={r.id} /><select className="field !min-h-9 text-xs" name="status" defaultValue={r.status}><option value="under_review">Under review</option><option value="changes_requested">Changes</option><option value="accepted">Accepted</option><option value="published">Published</option><option value="rejected">Rejected</option></select><button className="rounded-xl bg-[#eee7de] px-3 text-xs font-bold">Update</button></form> : null}</article>)}</div></div>
    </section>

    {canIssues ? <section className="mt-8">
      <div className="flex items-center gap-2"><BookOpenText className="size-5 text-primary" /><h2 className="font-serif text-xl font-bold text-primary">PDF અંક સંચાલન</h2></div>
      <details className="mt-3 rounded-2xl border bg-white p-4"><summary className="cursor-pointer font-bold text-primary">+ નવો ડિજિટલ અંક</summary><IssueForm canPublish={canPublish} /></details>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{issues.map(issue => <article key={issue.id} className={`rounded-2xl border bg-white p-4 ${issue.archived_at ? "border-dashed opacity-70" : ""}`}>
        <p className="text-xs font-bold text-gold-deep">{issue.issue_date}</p>
        <h3 className="mt-1 font-serif text-lg font-bold text-primary">{issue.title_gu}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{issue.archived_at ? "Archived" : issue.published ? "Published" : "Draft"}</p>
        {!issue.archived_at ? <details className="mt-3 rounded-xl bg-[#f8f4ee] p-3"><summary className="cursor-pointer text-sm font-bold text-primary">Edit</summary><IssueForm item={issue} canPublish={canPublish} /></details> : null}
        <div className="mt-3 flex flex-wrap gap-2">
          {issue.archived_at ? <form action={restoreVedaIssueAction}><input type="hidden" name="id" value={issue.id} /><button className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-border px-3 text-xs font-bold"><RotateCcw className="size-4" />Restore</button></form> : canPublish ? <form action={archiveVedaIssueAction}><input type="hidden" name="id" value={issue.id} /><button className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-border px-3 text-xs font-bold text-muted-foreground"><Archive className="size-4" />Archive</button></form> : null}
          {superAdmin ? <form action={permanentDeleteVedaIssueAction}><input type="hidden" name="id" value={issue.id} /><button className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-red-200 px-3 text-xs font-bold text-red-700"><Trash2 className="size-4" />Delete</button></form> : null}
        </div>
      </article>)}</div>
    </section> : null}
  </div>;
}
