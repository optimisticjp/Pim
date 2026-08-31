import { Archive, Landmark, RotateCcw, Trash2 } from "lucide-react";

import { archiveOperationalRecordAction, permanentDeleteAction, restoreOperationalRecordAction, saveAshramProfileAction } from "@/app/admin/operations/actions";
import { hasAdminPermission, requireAdminSession } from "@/lib/admin/data";
import { getAdminAshrams } from "@/lib/operations/admin-data";

export const metadata={title:"આશ્રમ વ્યવસ્થા"};

function AshramForm({ item }: { item?: Awaited<ReturnType<typeof getAdminAshrams>>[number] }) {
  return <form action={saveAshramProfileAction} className="mt-4 grid gap-3 sm:grid-cols-2">
    {item?<input type="hidden" name="id" value={item.id}/>:null}
    <input className="field" name="name_gu" placeholder="આશ્રમનું નામ" defaultValue={item?.name_gu??""} required/>
    <input className="field" name="slug" placeholder="slug" defaultValue={item?.slug??""} required/>
    <input className="field" name="city_gu" placeholder="શહેર" defaultValue={item?.city_gu??""} required/>
    <input className="field" name="state_gu" placeholder="રાજ્ય" defaultValue={item?.state_gu??""}/>
    <textarea className="field min-h-24 sm:col-span-2" name="full_address" placeholder="પૂર્ણ સરનામું" defaultValue={item?.full_address??""}/>
    <input className="field" name="office_phone" placeholder="ઓફિસ ફોન" defaultValue={item?.office_phone??""}/>
    <input className="field" name="map_url" placeholder="Google Map URL" defaultValue={item?.map_url??""}/>
    <input className="field" name="manager_name" placeholder="જવાબદાર વ્યક્તિ" defaultValue={item?.manager_name??""}/>
    <input className="field" name="manager_mobile" placeholder="જવાબદાર મોબાઇલ" defaultValue={item?.manager_mobile??""}/>
    <textarea className="field min-h-28 sm:col-span-2" name="rules_md" placeholder="આશ્રમ / ઉતારા નિયમો" defaultValue={item?.rules_md??""}/>
    <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" name="accepts_stays" defaultChecked={item?.accepts_stays??false}/> ઉતારો ઉપલબ્ધ</label>
    <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" name="verified" defaultChecked={item?.verified??false}/> સમિતિ દ્વારા ચકાસેલ</label>
    <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" name="published" defaultChecked={item?.published??false}/> જાહેર વેબસાઇટ પર પ્રકાશિત</label>
    <button className="min-h-11 rounded-xl bg-primary px-4 font-bold text-white">{item?"ફેરફાર સાચવો":"આશ્રમ ઉમેરો"}</button>
  </form>;
}

export default async function AdminAshramsPage(){
  const session=await requireAdminSession();
  const rows=await getAdminAshrams(session);
  const manage=hasAdminPermission(session,"ashrams.manage")||Boolean(session.profile?.is_super_admin);
  const superAdmin=Boolean(session.profile?.is_super_admin);
  return <div>
    <p className="text-xs font-bold text-gold-deep">ASHRAM DIRECTORY</p>
    <h1 className="mt-1 font-serif text-2xl font-bold text-primary sm:text-3xl">આશ્રમ માહિતી સંભાળો</h1>
    <p className="mt-1 text-sm text-muted-foreground">અહીં કરેલો ફેરફાર પ્રકાશિત હોય તો જાહેર આશ્રમ યાદીમાં દેખાશે. Draft/Archived માહિતી જાહેરમાં દેખાતી નથી.</p>

    {manage?<details className="mt-5 rounded-2xl border border-border bg-white p-4"><summary className="cursor-pointer font-bold text-primary">+ નવો આશ્રમ ઉમેરો</summary><AshramForm/></details>:null}

    <section className="mt-7">
      <div className="flex items-center gap-2"><Landmark className="size-5 text-primary"/><h2 className="font-serif text-xl font-bold text-primary">આશ્રમો ({rows.length})</h2></div>
      <div className="mt-3 grid gap-4 lg:grid-cols-2">{rows.map(item=><article key={item.id} className={`rounded-2xl border bg-white p-4 ${item.archived_at?"border-dashed border-[#cbbfb2] opacity-75":"border-border"}`}>
        <div className="flex items-start justify-between gap-3"><div><h3 className="font-serif text-xl font-bold text-primary">{item.name_gu}</h3><p className="mt-1 text-sm text-muted-foreground">{item.city_gu}{item.state_gu?` • ${item.state_gu}`:""}</p><p className="mt-1 text-xs font-bold">{item.archived_at?"Archived":item.published?"પ્રકાશિત":"Draft"}{item.verified?" • ચકાસેલ":""}</p></div></div>
        {manage&&!item.archived_at?<details className="mt-4 rounded-xl bg-[#f8f4ee] p-3"><summary className="cursor-pointer text-sm font-bold text-primary">Edit</summary><AshramForm item={item}/></details>:null}
        {manage?<div className="mt-4 flex flex-wrap gap-2">{item.archived_at?<form action={restoreOperationalRecordAction}><input type="hidden" name="table" value="ashram_profiles"/><input type="hidden" name="id" value={item.id}/><button className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-border px-3 text-sm font-bold text-primary"><RotateCcw className="size-4"/>Restore</button></form>:<form action={archiveOperationalRecordAction}><input type="hidden" name="table" value="ashram_profiles"/><input type="hidden" name="id" value={item.id}/><button className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-border px-3 text-sm font-bold text-muted-foreground"><Archive className="size-4"/>Archive</button></form>}{superAdmin?<form action={permanentDeleteAction}><input type="hidden" name="table" value="ashram_profiles"/><input type="hidden" name="id" value={item.id}/><button className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-red-200 px-3 text-sm font-bold text-red-700"><Trash2 className="size-4"/>કાયમી કાઢો</button></form>:null}</div>:null}
      </article>)}</div>
    </section>
  </div>;
}
