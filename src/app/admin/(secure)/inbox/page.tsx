import { Archive, Inbox, Phone, UserRound } from "lucide-react";

import { archiveInboxAction, assignInboxAction, updateInboxStatusAction } from "@/app/admin/actions";
import { categoryLabel, statusLabel } from "@/lib/admin/labels";
import { getAdminProfiles, getInboxItems, hasAdminPermission, requireAdminSession } from "@/lib/admin/data";

const statusOptions = ["new", "reviewing", "pending", "documents_required", "approved", "assigned", "cash_pending", "cash_received", "receipt_issued", "completed", "cancelled", "rejected"];

export default async function AdminInboxPage() {
  const session = await requireAdminSession();
  const [items, admins] = await Promise.all([getInboxItems(session), getAdminProfiles(session)]);
  const active = items.filter((item) => !item.archived_at);
  const canUpdate = hasAdminPermission(session, "inbox.update");
  const canAssign = hasAdminPermission(session, "inbox.assign");
  const canArchive = hasAdminPermission(session, "inbox.archive");

  return <div><div className="flex items-end justify-between gap-3"><div><p className="text-xs font-bold text-gold-deep">UNIFIED INBOX</p><h1 className="mt-1 font-serif text-2xl font-bold text-primary sm:text-3xl">આવેલ અરજીઓ</h1><p className="mt-1 text-sm text-muted-foreground">રૂમ, સભ્યપદ, સ્વયંસેવક અને અન્ય વિનંતીઓ માટે એક જ queue.</p></div><span className="rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-white">{active.length}</span></div>

    <div className="mt-5 space-y-3">{active.length ? active.map((item) => <article id={item.id} key={item.id} className="scroll-mt-20 rounded-2xl border border-[#dfd9d0] bg-white p-4 shadow-sm"><div className="flex gap-3"><div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#f4eee5] text-primary"><Inbox className="size-[18px]" /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="font-bold leading-6">{item.title}</h2><span className="rounded-full bg-[#f3eee6] px-2 py-0.5 text-[10px] font-bold">{statusLabel(item.status)}</span>{item.priority !== "normal" ? <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-bold text-orange-800">{item.priority === "urgent" ? "તાત્કાલિક" : "પ્રાથમિક"}</span> : null}</div><p className="mt-1 text-xs text-muted-foreground">{categoryLabel(item.category)} {item.ashram_key ? `• ${item.ashram_key}` : ""}</p></div></div>

      {(item.contact_name || item.contact_mobile) ? <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-[#665c54]">{item.contact_name ? <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#f8f5f0] px-2.5 py-1.5"><UserRound className="size-3.5" />{item.contact_name}</span> : null}{item.contact_mobile ? <a href={`tel:${item.contact_mobile}`} className="inline-flex items-center gap-1.5 rounded-lg bg-[#f8f5f0] px-2.5 py-1.5 text-primary"><Phone className="size-3.5" />{item.contact_mobile}</a> : null}</div> : null}

      {(canUpdate || canAssign || canArchive) ? <div className="mt-4 grid gap-2 border-t border-[#eee9e1] pt-3 sm:grid-cols-[1fr_1fr_auto]">{canUpdate ? <form action={updateInboxStatusAction} className="flex gap-2"><input type="hidden" name="id" value={item.id} /><select className="field !min-h-10 !py-1.5 text-xs" name="status" defaultValue={item.status}>{statusOptions.map((status) => <option key={status} value={status}>{statusLabel(status)}</option>)}</select><button className="min-h-10 rounded-xl bg-[#eee7de] px-3 text-xs font-bold text-primary" type="submit">સાચવો</button></form> : <span />}{canAssign ? <form action={assignInboxAction} className="flex gap-2"><input type="hidden" name="id" value={item.id} /><select className="field !min-h-10 !py-1.5 text-xs" name="admin_id" defaultValue={item.assigned_to ?? ""}><option value="">Unassigned</option>{admins.filter((admin) => admin.status === "active").map((admin) => <option key={admin.id} value={admin.id}>{admin.display_name}</option>)}</select><button className="min-h-10 rounded-xl bg-[#eee7de] px-3 text-xs font-bold text-primary" type="submit">સોંપો</button></form> : <span />}{canArchive ? <form action={archiveInboxAction}><input type="hidden" name="id" value={item.id} /><button className="flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-[#ddd4c9] px-3 text-xs font-bold text-[#675b52]" type="submit"><Archive className="size-3.5" /> આર્કાઇવ</button></form> : null}</div> : null}
    </article>) : <div className="rounded-2xl border border-dashed border-[#d8d0c5] bg-white/70 p-10 text-center"><Inbox className="mx-auto size-8 text-[#b9ac9b]" /><p className="mt-3 font-bold">ઇનબોક્સ ખાલી છે</p><p className="mt-1 text-sm text-muted-foreground">ફોર્મ modules live થતા અરજીઓ અહીં આવશે.</p></div>}</div>
  </div>;
}
