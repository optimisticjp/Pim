"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasAdminPermission, requireAdminSession } from "@/lib/admin/data";
import { getAdminAccessToken, supabaseRest } from "@/lib/supabase/server";

const str=(fd:FormData,n:string,max=2000)=>{const v=String(fd.get(n)??"").trim();return v?v.slice(0,max):null};
const bool=(fd:FormData,n:string)=>fd.get(n)==="on"||fd.get(n)==="true";
async function ctx(permission?:string){const s=await requireAdminSession();if(permission&&!hasAdminPermission(s,permission))throw new Error("Permission denied");const token=await getAdminAccessToken();if(!token)redirect("/admin/login");return{s,token};}
const invalidate=(...paths:string[])=>paths.forEach(p=>revalidatePath(p));

async function upsert(table:string,id:string|null,record:Record<string,unknown>,token:string){if(id)await supabaseRest(`${table}?id=eq.${encodeURIComponent(id)}`,token,{method:"PATCH",body:JSON.stringify(record),prefer:"return=minimal"});else await supabaseRest(table,token,{method:"POST",body:JSON.stringify(record),prefer:"return=minimal"});}

export async function saveProgrammeCentreAction(fd:FormData){
  const{s,token}=await ctx("programmes.manage");
  const id=str(fd,"id",40),canPublish=hasAdminPermission(s,"programmes.publish")||Boolean(s.profile?.is_super_admin),requestedPublished=bool(fd,"published");
  if(requestedPublished&&!canPublish)throw new Error("Publish permission required");
  const record:Record<string,unknown>={kind:str(fd,"kind",20),title_gu:str(fd,"title_gu",200),ashram_id:str(fd,"ashram_id",40),address_gu:str(fd,"address_gu",1000),city_gu:str(fd,"city_gu",160),contact_name:str(fd,"contact_name",160),contact_mobile:str(fd,"contact_mobile",30),map_url:str(fd,"map_url",1000),schedule_text:str(fd,"schedule_text",500),age_range_text:str(fd,"age_range_text",160),notes:str(fd,"notes",1000),sort_order:Number(str(fd,"sort_order",5)??100),archived_at:null};
  if(canPublish)record.published=requestedPublished;
  else if(!id)record.published=false;
  await upsert("programme_centres",id,record,token);invalidate("/admin/programmes","/programmes");
}
export async function archiveProgrammeCentreAction(fd:FormData){const{token}=await ctx("programmes.manage");const id=str(fd,"id",40);if(id)await supabaseRest(`programme_centres?id=eq.${id}`,token,{method:"PATCH",body:JSON.stringify({archived_at:new Date().toISOString(),published:false}),prefer:"return=minimal"});invalidate("/admin/programmes","/programmes");}
export async function restoreProgrammeCentreAction(fd:FormData){const{token}=await ctx("programmes.manage");const id=str(fd,"id",40);if(id)await supabaseRest(`programme_centres?id=eq.${id}`,token,{method:"PATCH",body:JSON.stringify({archived_at:null,published:false}),prefer:"return=minimal"});invalidate("/admin/programmes","/programmes");}

export async function saveCircularAction(fd:FormData){
  const{s,token}=await ctx("programmes.manage");
  const id=str(fd,"id",40),canPublish=hasAdminPermission(s,"programmes.publish")||Boolean(s.profile?.is_super_admin),requestedPublished=bool(fd,"published");
  if(requestedPublished&&!canPublish)throw new Error("Publish permission required");
  const record:Record<string,unknown>={title_gu:str(fd,"title_gu",240),category:str(fd,"category",40),description_gu:str(fd,"description_gu",1500),image_url:str(fd,"image_url",1000),pdf_url:str(fd,"pdf_url",1000),valid_from:str(fd,"valid_from",10),valid_until:str(fd,"valid_until",10),archived_at:null};
  if(canPublish){record.published=requestedPublished;record.published_at=requestedPublished?new Date().toISOString():null;}
  else if(!id){record.published=false;record.published_at=null;}
  await upsert("programme_circulars",id,record,token);invalidate("/admin/programmes","/programmes");
}
export async function archiveCircularAction(fd:FormData){const{token}=await ctx("programmes.manage");const id=str(fd,"id",40);if(id)await supabaseRest(`programme_circulars?id=eq.${id}`,token,{method:"PATCH",body:JSON.stringify({archived_at:new Date().toISOString(),published:false}),prefer:"return=minimal"});invalidate("/admin/programmes","/programmes");}
export async function restoreCircularAction(fd:FormData){const{token}=await ctx("programmes.manage");const id=str(fd,"id",40);if(id)await supabaseRest(`programme_circulars?id=eq.${id}`,token,{method:"PATCH",body:JSON.stringify({archived_at:null,published:false,published_at:null}),prefer:"return=minimal"});invalidate("/admin/programmes","/programmes");}

export async function saveTithiAction(fd:FormData){
  const{s,token}=await ctx("events.manage");
  const id=str(fd,"id",40),canPublish=hasAdminPermission(s,"events.publish")||Boolean(s.profile?.is_super_admin),requestedStatus=str(fd,"status",20)??"draft";
  if(!["draft","published"].includes(requestedStatus))throw new Error("Invalid event status");
  if(requestedStatus==="published"&&!canPublish)throw new Error("Publish permission required");
  const record:Record<string,unknown>={title_gu:str(fd,"title_gu",240),programme_type:str(fd,"programme_type",30),programme_date:str(fd,"programme_date",10),weekday_gu:str(fd,"weekday_gu",40),tithi_name_gu:str(fd,"tithi_name_gu",120),tithi_number:str(fd,"tithi_number",40),swamiji_name:str(fd,"swamiji_name",240),village_city_gu:str(fd,"village_city_gu",200),venue_gu:str(fd,"venue_gu",300),map_url:str(fd,"map_url",1000),details_gu:str(fd,"details_gu",2000),image_url:str(fd,"image_url",1000),pdf_url:str(fd,"pdf_url",1000),ashram_id:str(fd,"ashram_id",40)};
  if(canPublish)record.status=requestedStatus;
  else if(!id)record.status="draft";
  await upsert("tithi_programmes",id,record,token);invalidate("/admin/programmes","/programmes","/events","/");
}
export async function setTithiStatusAction(fd:FormData){const{s,token}=await ctx("events.manage");const id=str(fd,"id",40),status=str(fd,"status",20);if(!id||!status||!["draft","published","archived"].includes(status))return;if(status==="published"&&!hasAdminPermission(s,"events.publish")&&!s.profile?.is_super_admin)throw new Error("Publish permission required");await supabaseRest(`tithi_programmes?id=eq.${encodeURIComponent(id)}`,token,{method:"PATCH",body:JSON.stringify({status}),prefer:"return=minimal"});invalidate("/admin/programmes","/programmes","/events","/");}

export async function saveSevaCategoryAction(fd:FormData){const{token}=await ctx("seva.manage");await upsert("seva_categories",str(fd,"id",40),{slug:str(fd,"slug",120),title_gu:str(fd,"title_gu",200),description_gu:str(fd,"description_gu",1200),published:bool(fd,"published"),sort_order:Number(str(fd,"sort_order",5)??100),archived_at:null},token);invalidate("/admin/seva","/seva");}
export async function saveSevaActivityAction(fd:FormData){const{token}=await ctx("seva.manage");await upsert("seva_activities",str(fd,"id",40),{category_id:str(fd,"category_id",40),title_gu:str(fd,"title_gu",240),summary_gu:str(fd,"summary_gu",1000),details_gu:str(fd,"details_gu",4000),ashram_id:str(fd,"ashram_id",40),activity_date:str(fd,"activity_date",10),metric_label_gu:str(fd,"metric_label_gu",160),metric_value:str(fd,"metric_value",160),cover_url:str(fd,"cover_url",1000),published:bool(fd,"published"),archived_at:null},token);invalidate("/admin/seva","/seva");}
export async function archiveOperationalRecordAction(fd:FormData){const table=str(fd,"table",80);const id=str(fd,"id",40);const allowed:Record<string,string>={programme_centres:"programmes.manage",programme_circulars:"programmes.manage",seva_categories:"seva.manage",seva_activities:"seva.manage",ashram_profiles:"ashrams.manage",rooms:"ashrams.manage"};if(!table||!id||!allowed[table])return;const{token}=await ctx(allowed[table]);const patch:Record<string,unknown>={archived_at:new Date().toISOString()};if(["programme_centres","programme_circulars","seva_categories","seva_activities","ashram_profiles"].includes(table))patch.published=false;await supabaseRest(`${table}?id=eq.${id}`,token,{method:"PATCH",body:JSON.stringify(patch),prefer:"return=minimal"});invalidate("/admin/programmes","/admin/seva","/admin/stays","/admin/ashrams","/programmes","/seva","/stay","/ashrams");}
export async function restoreOperationalRecordAction(fd:FormData){const table=str(fd,"table",80);const id=str(fd,"id",40);const allowed:Record<string,string>={programme_centres:"programmes.manage",programme_circulars:"programmes.manage",seva_categories:"seva.manage",seva_activities:"seva.manage",ashram_profiles:"ashrams.manage",rooms:"ashrams.manage"};if(!table||!id||!allowed[table])return;const{token}=await ctx(allowed[table]);await supabaseRest(`${table}?id=eq.${id}`,token,{method:"PATCH",body:JSON.stringify({archived_at:null}),prefer:"return=minimal"});invalidate("/admin/programmes","/admin/seva","/admin/stays","/admin/ashrams","/programmes","/seva","/stay","/ashrams");}

export async function reviewVolunteerAction(fd:FormData){const{s,token}=await ctx("volunteer.review");const id=str(fd,"id",40),status=str(fd,"status",30);if(!id||!status)return;await supabaseRest(`volunteer_applications?id=eq.${id}`,token,{method:"PATCH",body:JSON.stringify({status,review_note:str(fd,"review_note",1000),reviewed_by:s.profile?.id,reviewed_at:new Date().toISOString()}),prefer:"return=minimal"});invalidate("/admin/seva","/admin/inbox");}

export async function saveAshramProfileAction(fd:FormData){const{token}=await ctx("ashrams.manage");await upsert("ashram_profiles",str(fd,"id",40),{slug:str(fd,"slug",120),name_gu:str(fd,"name_gu",240),city_gu:str(fd,"city_gu",160),state_gu:str(fd,"state_gu",160),full_address:str(fd,"full_address",1200),office_phone:str(fd,"office_phone",40),manager_name:str(fd,"manager_name",160),manager_mobile:str(fd,"manager_mobile",40),map_url:str(fd,"map_url",1000),rules_md:str(fd,"rules_md",5000),accepts_stays:bool(fd,"accepts_stays"),published:bool(fd,"published"),verified:bool(fd,"verified"),archived_at:null},token);invalidate("/admin/ashrams","/admin/stays","/ashrams","/stay","/");}
export async function saveRoomTypeAction(fd:FormData){const{token}=await ctx("ashrams.manage");await upsert("room_types",str(fd,"id",40),{ashram_id:str(fd,"ashram_id",40),name_gu:str(fd,"name_gu",160),capacity:Number(str(fd,"capacity",4)??1),notes:str(fd,"notes",500),active:bool(fd,"active")},token);invalidate("/admin/stays/rooms");}
export async function saveRoomAction(fd:FormData){const{token}=await ctx("ashrams.manage");await upsert("rooms",str(fd,"id",40),{ashram_id:str(fd,"ashram_id",40),room_type_id:str(fd,"room_type_id",40),room_number:str(fd,"room_number",80),floor_label:str(fd,"floor_label",80),capacity:Number(str(fd,"capacity",4)??1),notes:str(fd,"notes",500),active:bool(fd,"active"),archived_at:null},token);invalidate("/admin/stays/rooms");}

export async function reviewStayAction(fd:FormData){const{s,token}=await ctx("stays.review");const id=str(fd,"id",40),status=str(fd,"status",30);if(!id||!status)return;await supabaseRest(`stay_requests?id=eq.${id}`,token,{method:"PATCH",body:JSON.stringify({status,admin_note:str(fd,"admin_note",1500),assigned_to:str(fd,"assigned_to",40)??s.profile?.id}),prefer:"return=minimal"});invalidate("/admin/stays","/admin/inbox",`/admin/stays/${id}`);}
export async function assignRoomAction(fd:FormData){const{token}=await ctx("stays.assign_room");const stay=str(fd,"stay_request_id",40),room=str(fd,"room_id",40);if(!stay||!room)return;await supabaseRest("rpc/assign_stay_room",token,{method:"POST",body:JSON.stringify({target_stay_request_id:stay,target_room_id:room}),prefer:"return=representation"});invalidate("/admin/stays",`/admin/stays/${stay}`);}
export async function releaseRoomAction(fd:FormData){const{token}=await ctx("stays.assign_room");const assignment=str(fd,"assignment_id",40),stay=str(fd,"stay_request_id",40);if(!assignment)return;await supabaseRest("rpc/release_stay_room",token,{method:"POST",body:JSON.stringify({target_assignment_id:assignment})});invalidate("/admin/stays",stay?`/admin/stays/${stay}`:"/admin/stays");}

export async function permanentDeleteAction(fd:FormData){const{s,token}=await ctx();if(!s.profile?.is_super_admin)throw new Error("Super Admin required");const table=str(fd,"table",80),id=str(fd,"id",40);const allowed=new Set(["programme_centres","programme_circulars","tithi_programmes","seva_categories","seva_activities","volunteer_applications","ashram_profiles","room_types","rooms","room_blocks","stay_requests","stay_guests","stay_meal_requirements","room_assignments","booking_documents"]);if(!table||!id||!allowed.has(table))return;await supabaseRest(`${table}?id=eq.${id}`,token,{method:"DELETE",prefer:"return=minimal"});invalidate("/admin/programmes","/admin/seva","/admin/stays","/admin/ashrams","/admin/inbox","/programmes","/events","/seva","/ashrams","/stay","/");}
