import { Banknote, BedDouble, Download, Soup, Users, UserRoundCheck, BookOpenText, DoorOpen } from "lucide-react";
import { hasAdminPermission, requireAdminSession } from "@/lib/admin/data";
import { getAdminAccessToken, supabaseRest } from "@/lib/supabase/server";

type Ashram={slug:string;name_gu:string;city_gu:string};
const reports=[
  {type:"stays",title:"યાત્રિક / ઉતારા યાદી",description:"અરજી, સંપર્ક, તારીખ, સભ્યો, રૂમ અને ભોજન.",permission:"stays.view",Icon:BedDouble},
  {type:"kitchen",title:"રસોડું / પ્રસાદ Headcount",description:"દિવસ અને આશ્રમ પ્રમાણે નાસ્તો, બપોર અને રાત્રિ સંખ્યા.",permission:"stays.view",Icon:Soup},
  {type:"rooms",title:"રૂમ Occupancy",description:"હાલ ફાળવાયેલા રૂમ અને રહેવાની તારીખો.",permission:"stays.view",Icon:DoorOpen},
  {type:"members",title:"સભ્યપદ અરજીઓ",description:"પરિવાર અને સભ્યપદ અરજી export. સંવેદનશીલ દસ્તાવેજો નહીં.",permission:"membership.view",Icon:Users},
  {type:"volunteers",title:"સ્વયંસેવક યાદી",description:"ઉપલબ્ધતા, આશ્રમ અને સેવા પસંદગી.",permission:"volunteer.view",Icon:UserRoundCheck},
  {type:"veda",title:"વેદ રહસ્ય Subscribers",description:"સબ્સ્ક્રાઇબર પોસ્ટલ વિગતો. PAN export થતું નથી.",permission:"veda.view",Icon:BookOpenText},
  {type:"cash",title:"નકદ અને રસીદ",description:"પ્રાપ્ત નકદ, હેતુ અને જારી થયેલી રસીદો.",permission:"cash.record|receipts.issue",Icon:Banknote},
] as const;

export default async function ReportsPage(){
 const session=await requireAdminSession();
 if(!hasAdminPermission(session,"exports.run"))return <div className="rounded-2xl border border-dashed bg-white p-8 text-center text-sm text-muted-foreground">આ એડમિનને Export પરવાનગી આપવામાં આવી નથી.</div>;
 const token=await getAdminAccessToken();
 const ashrams=token?await supabaseRest<Ashram[]>("ashram_profiles?select=slug,name_gu,city_gu&archived_at=is.null&order=name_gu.asc",token).catch(()=>[]):[];
 const allowed=reports.filter(r=>r.permission.split("|").some(p=>hasAdminPermission(session,p)));
 return <div><p className="text-xs font-bold text-gold-deep">REPORTS & EXPORTS</p><h1 className="mt-1 font-serif text-2xl font-bold text-primary sm:text-3xl">રિપોર્ટ અને Excel-compatible CSV</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">તમારી role/scope જેટલો જ data export થશે. Ashram-scoped admin માટે અન્ય આશ્રમનો data database જ આપતું નથી. Aadhaar, PAN, storage keys અને upload tokens કોઈ exportમાં નથી.</p>
 <section className="mt-5 rounded-2xl border border-[#ded6ca] bg-white p-4 shadow-sm"><h2 className="font-bold text-primary">સામાન્ય Filter</h2><p className="mt-1 text-xs text-muted-foreground">દરેક cardમાં filter ફરી ભરી શકાય છે. તારીખ ખાલી રાખો તો ઉપલબ્ધ તમામ records.</p></section>
 <div className="mt-4 grid gap-3 lg:grid-cols-2">{allowed.map(({type,title,description,Icon})=><form key={type} action="/api/admin/exports" method="get" className="rounded-2xl border border-[#dfd9d0] bg-white p-4 shadow-sm"><input type="hidden" name="type" value={type}/><div className="flex gap-3"><div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#f3eee7] text-primary"><Icon className="size-5"/></div><div className="min-w-0"><h2 className="font-bold text-primary">{title}</h2><p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p></div></div><div className="mt-4 grid gap-2 sm:grid-cols-2"><label className="grid gap-1 text-xs font-bold">તારીખથી<input className="field !min-h-10 text-xs" type="date" name="from"/></label><label className="grid gap-1 text-xs font-bold">તારીખ સુધી<input className="field !min-h-10 text-xs" type="date" name="to"/></label>{type!=="members"&&type!=="veda"?<label className="grid gap-1 text-xs font-bold sm:col-span-2">આશ્રમ<select className="field !min-h-10 text-xs" name="ashram"><option value="">બધા ઉપલબ્ધ આશ્રમ</option>{ashrams.map(a=><option value={a.slug} key={a.slug}>{a.name_gu}</option>)}</select></label>:null}</div><button className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white"><Download className="size-4"/> CSV Download</button></form>)}</div>
 <div className="mt-5 rounded-2xl bg-[#fff8ec] p-4 text-xs leading-6 text-muted-foreground"><strong className="text-primary">રસોડું report:</strong> approved, room_assigned અને checked_in requests જ આવતીકાલ/આગામી ભોજન આયોજનમાં ગણાય છે. Cancelled/rejected/checked-out records operational headcountમાં ગણાતા નથી.</div></div>;
}
