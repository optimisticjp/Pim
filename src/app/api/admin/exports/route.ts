import { hasAdminPermission, requireAdminSession } from "@/lib/admin/data";
import { getAdminAccessToken, supabaseRest } from "@/lib/supabase/server";

type Ashram={id:string;slug:string;name_gu:string};
type Stay={id:string;request_number:string;applicant_name:string;mobile:string;native_village:string;full_address:string;ashram_id:string;check_in:string;check_out:string;total_members:number;status:string;breakfast_count:number;lunch_count:number;dinner_count:number};
type Assignment={id:string;stay_request_id:string;room_id:string;released_at:string|null};
type Room={id:string;ashram_id:string;room_number:string;capacity:number};
type Meal={stay_request_id:string;meal_date:string;breakfast_count:number;lunch_count:number;dinner_count:number};
type Membership={application_number:string;first_name:string;father_name:string|null;surname:string|null;mobile:string;native_village:string;full_address:string;education:string|null;occupation:string|null;blood_group:string|null;gender:string;age:number;family_member_count:number;status:string;submitted_at:string};
type Volunteer={application_number:string;full_name:string;mobile:string;full_address:string;age:number|null;available_from:string|null;available_until:string|null;time_slot:string|null;preferred_ashram_id:string|null;preferred_seva:string[]|null;skills:string|null;status:string;submitted_at:string};
type VedaSubscriber={subscriber_number:string;full_name:string;mobile:string;village:string|null;full_address:string;pincode:string;status:string;started_at:string;ended_at:string|null};
type Cash={id:string;reference_type:string;reference_id:string|null;payer_name:string;mobile:string|null;amount:number|string;purpose_gu:string;ashram_id:string|null;received_at:string;note:string|null;voided_at:string|null};
type Receipt={cash_transaction_id:string;receipt_number:string;status:string;issued_at:string};

const formula=/^[=+\-@]/;
function csvCell(value:unknown){let text=value==null?"":Array.isArray(value)?value.join(" | "):String(value);if(formula.test(text))text=`'${text}`;return `"${text.replaceAll('"','""')}"`;}
function csv(headers:string[],rows:unknown[][]){return "\ufeff"+[headers,...rows].map(row=>row.map(csvCell).join(",")).join("\r\n");}
function inRange(value:string|null,from:string,to:string){if(!value)return true;const day=value.slice(0,10);return(!from||day>=from)&&(!to||day<=to);}
function filename(type:string){return `pim-${type}-${new Date().toISOString().slice(0,10)}.csv`;}
function download(type:string,headers:string[],rows:unknown[][]){return new Response(csv(headers,rows),{headers:{"content-type":"text/csv; charset=utf-8","content-disposition":`attachment; filename="${filename(type)}"`,`cache-control`:"private, no-store"}});}
function denied(){return Response.json({error:"Export permission denied"},{status:403});}

export async function GET(request:Request){
 const session=await requireAdminSession();
 if(!hasAdminPermission(session,"exports.run"))return denied();
 const token=await getAdminAccessToken();if(!token)return denied();
 const url=new URL(request.url);const type=url.searchParams.get("type")??"stays";const from=url.searchParams.get("from")??"";const to=url.searchParams.get("to")??"";const ashramSlug=url.searchParams.get("ashram")??"";const status=url.searchParams.get("status")??"";
 const ashrams=await supabaseRest<Ashram[]>("ashram_profiles?select=id,slug,name_gu&archived_at=is.null&order=name_gu.asc",token);const ashramById=new Map(ashrams.map(a=>[a.id,a]));const requestedAshram=ashrams.find(a=>a.slug===ashramSlug);
 const matchesAshram=(id:string|null)=>!ashramSlug||Boolean(requestedAshram&&id===requestedAshram.id);

 if(["stays","kitchen","rooms"].includes(type)){
   if(!hasAdminPermission(session,"stays.view"))return denied();
   const stays=await supabaseRest<Stay[]>("stay_requests?select=id,request_number,applicant_name,mobile,native_village,full_address,ashram_id,check_in,check_out,total_members,status,breakfast_count,lunch_count,dinner_count&order=check_in.asc&limit=5000",token);
   const filtered=stays.filter(s=>matchesAshram(s.ashram_id)&&(!status||s.status===status)&&inRange(s.check_in,from,to));const stayById=new Map(filtered.map(s=>[s.id,s]));
   if(type==="stays"){
     const [assignments,rooms]=await Promise.all([supabaseRest<Assignment[]>("room_assignments?select=id,stay_request_id,room_id,released_at&limit=5000",token),supabaseRest<Room[]>("rooms?select=id,ashram_id,room_number,capacity&limit=5000",token)]);const roomById=new Map(rooms.map(r=>[r.id,r]));const roomFor=new Map(assignments.filter(a=>!a.released_at).map(a=>[a.stay_request_id,roomById.get(a.room_id)?.room_number??""]));
     return download("pilgrim-stays",["Request No","Ashram","Applicant","Mobile","Native Village","Address","Check In","Check Out","Members","Status","Room","Breakfast","Lunch","Dinner"],filtered.map(s=>[s.request_number,ashramById.get(s.ashram_id)?.name_gu??"",s.applicant_name,s.mobile,s.native_village,s.full_address,s.check_in,s.check_out,s.total_members,s.status,roomFor.get(s.id)??"",s.breakfast_count,s.lunch_count,s.dinner_count]));
   }
   if(type==="kitchen"){
     const meals=await supabaseRest<Meal[]>("stay_meal_requirements?select=stay_request_id,meal_date,breakfast_count,lunch_count,dinner_count&order=meal_date.asc&limit=10000",token);const active=new Set(["approved","room_assigned","checked_in"]);const totals=new Map<string,{date:string;ashram:string;breakfast:number;lunch:number;dinner:number}>();
     for(const m of meals){const s=stayById.get(m.stay_request_id);if(!s||!active.has(s.status)||!inRange(m.meal_date,from,to))continue;const a=ashramById.get(s.ashram_id);if(!a)continue;const key=`${m.meal_date}|${a.id}`;const row=totals.get(key)??{date:m.meal_date,ashram:a.name_gu,breakfast:0,lunch:0,dinner:0};row.breakfast+=m.breakfast_count;row.lunch+=m.lunch_count;row.dinner+=m.dinner_count;totals.set(key,row);}
     return download("kitchen-headcount",["Date","Ashram","Breakfast","Lunch","Dinner"],[...totals.values()].sort((a,b)=>a.date.localeCompare(b.date)).map(r=>[r.date,r.ashram,r.breakfast,r.lunch,r.dinner]));
   }
   const [assignments,rooms]=await Promise.all([supabaseRest<Assignment[]>("room_assignments?select=id,stay_request_id,room_id,released_at&released_at=is.null&limit=5000",token),supabaseRest<Room[]>("rooms?select=id,ashram_id,room_number,capacity&limit=5000",token)]);const roomById=new Map(rooms.map(r=>[r.id,r]));
   return download("room-occupancy",["Ashram","Room","Capacity","Request No","Applicant","Check In","Check Out","Members","Status"],assignments.flatMap(a=>{const s=stayById.get(a.stay_request_id),r=roomById.get(a.room_id);if(!s||!r)return[];return [[ashramById.get(s.ashram_id)?.name_gu??"",r.room_number,r.capacity,s.request_number,s.applicant_name,s.check_in,s.check_out,s.total_members,s.status]];}));
 }

 if(type==="members"){
   if(!hasAdminPermission(session,"membership.view"))return denied();const rows=await supabaseRest<Membership[]>("membership_applications?select=application_number,first_name,father_name,surname,mobile,native_village,full_address,education,occupation,blood_group,gender,age,family_member_count,status,submitted_at&order=submitted_at.desc&limit=5000",token);const filtered=rows.filter(r=>(!status||r.status===status)&&inRange(r.submitted_at,from,to));return download("membership-applications",["Application No","Name","Father Name","Surname","Mobile","Native Village","Address","Education","Occupation","Blood Group","Gender","Age","Family Members","Status","Submitted"],filtered.map(r=>[r.application_number,r.first_name,r.father_name,r.surname,r.mobile,r.native_village,r.full_address,r.education,r.occupation,r.blood_group,r.gender,r.age,r.family_member_count,r.status,r.submitted_at]));
 }
 if(type==="volunteers"){
   if(!hasAdminPermission(session,"volunteer.view"))return denied();const rows=await supabaseRest<Volunteer[]>("volunteer_applications?select=application_number,full_name,mobile,full_address,age,available_from,available_until,time_slot,preferred_ashram_id,preferred_seva,skills,status,submitted_at&order=submitted_at.desc&limit=5000",token);const filtered=rows.filter(r=>matchesAshram(r.preferred_ashram_id)&&(!status||r.status===status)&&inRange(r.submitted_at,from,to));return download("volunteers",["Application No","Name","Mobile","Address","Age","Available From","Available Until","Time Slot","Ashram","Preferred Seva","Skills","Status","Submitted"],filtered.map(r=>[r.application_number,r.full_name,r.mobile,r.full_address,r.age,r.available_from,r.available_until,r.time_slot,r.preferred_ashram_id?ashramById.get(r.preferred_ashram_id)?.name_gu??"":"",r.preferred_seva,r.skills,r.status,r.submitted_at]));
 }
 if(type==="veda"){
   if(!hasAdminPermission(session,"veda.view"))return denied();const rows=await supabaseRest<VedaSubscriber[]>("veda_subscribers?select=subscriber_number,full_name,mobile,village,full_address,pincode,status,started_at,ended_at&order=created_at.desc&limit=5000",token);return download("veda-subscribers",["Subscriber No","Name","Mobile","Village","Address","PIN Code","Status","Started","Ended"],rows.filter(r=>!status||r.status===status).map(r=>[r.subscriber_number,r.full_name,r.mobile,r.village,r.full_address,r.pincode,r.status,r.started_at,r.ended_at]));
 }
 if(type==="cash"){
   if(!hasAdminPermission(session,"cash.record")&&!hasAdminPermission(session,"receipts.issue"))return denied();const [rows,receipts]=await Promise.all([supabaseRest<Cash[]>("cash_transactions?select=id,reference_type,reference_id,payer_name,mobile,amount,purpose_gu,ashram_id,received_at,note,voided_at&order=received_at.desc&limit=5000",token),supabaseRest<Receipt[]>("receipts?select=cash_transaction_id,receipt_number,status,issued_at&limit=5000",token)]);const receiptByCash=new Map(receipts.map(r=>[r.cash_transaction_id,r]));const filtered=rows.filter(r=>matchesAshram(r.ashram_id)&&inRange(r.received_at,from,to));return download("cash-receipts",["Received Date","Ashram","Payer","Mobile","Amount","Purpose","Reference Type","Reference ID","Receipt No","Receipt Status","Note","Voided"],filtered.map(r=>{const rec=receiptByCash.get(r.id);return[r.received_at,r.ashram_id?ashramById.get(r.ashram_id)?.name_gu??"":"Global",r.payer_name,r.mobile,r.amount,r.purpose_gu,r.reference_type,r.reference_id,rec?.receipt_number??"",rec?.status??"",r.note,r.voided_at?"Yes":"No"];}));
 }
 return Response.json({error:"Unknown export type"},{status:400});
}
