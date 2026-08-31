import { redirect } from "next/navigation";
import { ShieldCheck, Trash2 } from "lucide-react";
import { requireAdminSession } from "@/lib/admin/data";
import { getProductionOpsStatus } from "@/lib/admin/ops-data";
import { runDocumentCleanupAction, updateDocumentRetentionAction } from "@/app/admin/ops/actions";

function when(value:string|null){
  if(!value)return "હજુ ચલાવ્યું નથી";
  return new Intl.DateTimeFormat("gu-IN",{dateStyle:"medium",timeStyle:"short",timeZone:"Asia/Kolkata"}).format(new Date(value));
}

export default async function ProductionOpsPage(){
  const session=await requireAdminSession();
  if(!session.profile?.is_super_admin)redirect("/admin?error=access");
  const status=await getProductionOpsStatus(session);
  const days=status?.retention_days??7;
  return <div>
    <p className="text-xs font-bold text-gold-deep">SUPER ADMIN • OPERATIONS</p>
    <h1 className="mt-1 font-serif text-2xl font-bold text-primary sm:text-3xl">સિસ્ટમ સુરક્ષા અને બેકઅપ</h1>
    <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">ખાનગી ઓળખ દસ્તાવેજોની retention, cleanup અને off-site database backup માટેનું production control centre.</p>

    <div className="mt-5 grid gap-3 sm:grid-cols-3">
      <div className="rounded-2xl border bg-white p-4"><p className="text-xs font-bold text-muted-foreground">RETENTION</p><p className="mt-1 text-2xl font-black text-primary">{days} દિવસ</p><p className="mt-1 text-xs text-muted-foreground">Checkout પછી</p></div>
      <div className="rounded-2xl border bg-white p-4"><p className="text-xs font-bold text-muted-foreground">SCHEDULED</p><p className="mt-1 text-2xl font-black text-primary">{status?.scheduled_documents??0}</p><p className="mt-1 text-xs text-muted-foreground">ખાનગી દસ્તાવેજ</p></div>
      <div className="rounded-2xl border bg-white p-4"><p className="text-xs font-bold text-muted-foreground">DUE NOW</p><p className="mt-1 text-2xl font-black text-primary">{status?.expired_documents??0}</p><p className="mt-1 text-xs text-muted-foreground">cleanup માટે તૈયાર</p></div>
    </div>

    <section className="mt-5 rounded-3xl border border-[#cbdad1] bg-white p-5">
      <div className="flex items-center gap-2"><ShieldCheck className="size-5 text-[#355e50]"/><h2 className="font-serif text-xl font-bold text-primary">ઓળખ દસ્તાવેજ retention</h2></div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">Stay request <strong>checked out</strong> થતાં upload link તરત revoke થાય છે અને હાલના ખાનગી દસ્તાવેજને નીચેના દિવસો પછી purge માટે schedule કરવામાં આવે છે.</p>
      <form action={updateDocumentRetentionAction} className="mt-4 flex max-w-md gap-2">
        <input className="field" type="number" name="retention_days" min={1} max={90} defaultValue={days} required aria-label="Retention days"/>
        <button className="min-h-12 shrink-0 rounded-xl bg-primary px-4 font-bold text-white">દિવસ સાચવો</button>
      </form>
      <p className="mt-2 text-xs text-muted-foreground">મર્યાદા: 1–90 દિવસ. બદલાવ નવા checkout schedules માટે લાગુ પડે છે.</p>
    </section>

    <section className="mt-5 rounded-3xl border bg-white p-5">
      <div className="flex items-center gap-2"><Trash2 className="size-5 text-primary"/><h2 className="font-serif text-xl font-bold text-primary">Private document cleanup</h2></div>
      <p className="mt-2 text-sm text-muted-foreground">છેલ્લું cleanup: {when(status?.last_cleanup_at??null)}{status?.last_cleanup_status?` • ${status.last_cleanup_status}`:""}</p>
      {status?.last_cleanup_at?<p className="mt-1 text-xs text-muted-foreground">Processed {status.last_cleanup_processed??0} • Failed {status.last_cleanup_failed??0}</p>:null}
      <form action={runDocumentCleanupAction} className="mt-4"><button className="min-h-11 rounded-xl border border-primary px-4 font-bold text-primary">હમણાં cleanup ચલાવો</button></form>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">Cleanup માત્ર retention date પસાર થયેલા private files purge કરે છે. Public media files પર તેની અસર નથી.</p>
    </section>

    <section className="mt-5 rounded-3xl border bg-white p-5">
      <h2 className="font-serif text-xl font-bold text-primary">Off-site database backup</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">Repositoryમાં scheduled logical backup workflow છે. તે private Cloudflare R2 bucket માટે configure થયા પછી 7 daily, 4 weekly અને 6 monthly copies રાખશે. GitHub secrets admin websiteમાંથી વાંચી શકાતા નથી, તેથી અહીં “active” બતાવીને ખોટી ખાતરી આપવામાં આવતી નથી.</p>
      <p className="mt-3 rounded-xl bg-surface-soft p-3 text-xs leading-5 text-muted-foreground">Backup activation અને restore procedure માટે <code>docs/BACKUP_AND_RECOVERY.md</code> જુઓ.</p>
    </section>
  </div>;
}
