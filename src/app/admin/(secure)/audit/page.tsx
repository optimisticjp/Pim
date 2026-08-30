import { FileText } from "lucide-react";

import { getAuditLogs, hasAdminPermission, requireAdminSession } from "@/lib/admin/data";

export default async function AdminAuditPage() {
  const session = await requireAdminSession();
  const allowed = hasAdminPermission(session, "audit.view");
  const logs = allowed ? await getAuditLogs(session) : [];
  return <div><p className="text-xs font-bold text-gold-deep">AUDIT TRAIL</p><h1 className="mt-1 font-serif text-2xl font-bold text-primary sm:text-3xl">ઓડિટ લોગ</h1><p className="mt-1 text-sm text-muted-foreground">કોણે શું બદલ્યું તેનો સુરક્ષિત ઇતિહાસ.</p>{!allowed ? <p className="mt-5 rounded-xl bg-amber-50 p-4 text-sm font-semibold text-amber-900">આ ભૂમિકા પાસે ઓડિટ લોગ જોવાની પરવાનગી નથી.</p> : <div className="mt-5 overflow-hidden rounded-2xl border border-[#dfd9d0] bg-white">{logs.length ? logs.map((log) => <article key={log.id} className="flex gap-3 border-b border-[#eee9e2] p-4 last:border-0"><div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#f3eee7] text-primary"><FileText className="size-4" /></div><div className="min-w-0"><p className="text-sm font-bold">{log.action} • {log.entity_type}</p><p className="mt-1 break-all text-xs text-muted-foreground">{log.entity_id ?? "—"}</p><p className="mt-1 text-[11px] text-[#9a8f85]">{new Intl.DateTimeFormat("gu-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(log.created_at))}</p></div></article>) : <p className="p-8 text-center text-sm text-muted-foreground">હજુ audit entries નથી.</p>}</div>}</div>;
}
