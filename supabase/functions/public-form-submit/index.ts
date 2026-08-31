import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

type FormType = "membership" | "donation" | "stay" | "volunteer" | "veda_subscription" | "veda_change" | "veda_article" | "contact_preview" | "participation_preview";
type TurnstileResult = { success?: boolean; action?: string; hostname?: string; "error-codes"?: string[] };
type JsonObject = Record<string, unknown>;

const rpcByForm: Partial<Record<FormType,string>> = {
  membership:"submit_membership_application",
  donation:"submit_donation_intent",
  stay:"submit_stay_request",
  volunteer:"submit_volunteer_application",
  veda_subscription:"submit_veda_subscription",
  veda_change:"submit_veda_change_request",
  veda_article:"submit_veda_article",
};
const allowedForms = new Set<FormType>(["membership","donation","stay","volunteer","veda_subscription","veda_change","veda_article","contact_preview","participation_preview"]);
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store","x-content-type-options":"nosniff"}});
const isObject=(value:unknown):value is JsonObject=>Boolean(value)&&typeof value==="object"&&!Array.isArray(value);
const str=(payload:JsonObject,key:string)=>typeof payload[key]==="string"?(payload[key] as string).trim():"";
const validText=(value:string,min:number,max:number)=>value.length>=min&&value.length<=max;
const optionalText=(value:string,max:number)=>!value||value.length<=max;
const integerIn=(value:unknown,min:number,max:number)=>{const n=typeof value==="number"?value:Number(value);return Number.isInteger(n)&&n>=min&&n<=max;};
const uuidLike=(value:string)=>/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
const dateOnly=(value:string)=>/^\d{4}-\d{2}-\d{2}$/.test(value)&&!Number.isNaN(Date.parse(`${value}T00:00:00Z`));

function validateMembership(p:JsonObject){
  if(!validText(str(p,"first_name"),1,120)||!validText(str(p,"mobile"),7,24)||!validText(str(p,"native_village"),1,160)||!validText(str(p,"full_address"),5,1000))return false;
  if(!optionalText(str(p,"father_name"),120)||!optionalText(str(p,"surname"),120)||!optionalText(str(p,"education"),160)||!optionalText(str(p,"occupation"),160))return false;
  if(!integerIn(p.age,0,120))return false;
  const gender=str(p,"gender");if(!new Set(["male","female","other","prefer_not_to_say"]).has(gender))return false;
  const family=Array.isArray(p.family_members)?p.family_members:[];if(family.length>5)return false;
  return family.every((item)=>isObject(item)&&validText(str(item,"first_name"),1,120)&&optionalText(str(item,"relationship"),80)&&optionalText(str(item,"father_name"),120)&&optionalText(str(item,"surname"),120)&&(!str(item,"age")||integerIn(item.age,0,120))&&optionalText(str(item,"mobile"),24));
}
function validateDonation(p:JsonObject){
  if(!validText(str(p,"donor_name"),1,160)||!validText(str(p,"mobile"),7,30)||!optionalText(str(p,"purpose_gu"),500))return false;
  const ashram=str(p,"preferred_ashram_id");if(ashram&&!uuidLike(ashram))return false;
  const amount=str(p,"pledged_amount");if(amount){const n=Number(amount);if(!Number.isFinite(n)||n<0||n>1_000_000_000)return false;}
  return true;
}
function validateStay(p:JsonObject){
  if(!validText(str(p,"applicant_name"),1,160)||!validText(str(p,"mobile"),7,24)||!validText(str(p,"native_village"),1,160)||!validText(str(p,"full_address"),5,1000)||!uuidLike(str(p,"ashram_id")))return false;
  const checkIn=str(p,"check_in"),checkOut=str(p,"check_out");if(!dateOnly(checkIn)||!dateOnly(checkOut)||checkOut<=checkIn)return false;
  const total=Number(p.total_members);if(!Number.isInteger(total)||total<1||total>20)return false;
  const guests=Array.isArray(p.guests)?p.guests:[];if(guests.length!==total-1||guests.length>19)return false;
  if(!guests.every((item)=>isObject(item)&&validText(str(item,"full_name"),1,160)&&(!str(item,"age")||integerIn(item.age,0,120))&&optionalText(str(item,"relationship"),80)))return false;
  if(typeof p.takes_prasad!=="boolean")return false;
  for(const key of ["breakfast_count","lunch_count","dinner_count"]){if(!integerIn(p[key],0,total))return false;}
  return optionalText(str(p,"reference_name"),160);
}
function validateVolunteer(p:JsonObject){
  if(!validText(str(p,"full_name"),1,160)||!validText(str(p,"mobile"),7,24)||!validText(str(p,"full_address"),5,1000))return false;
  const age=str(p,"age");if(age&&!integerIn(age,12,100))return false;
  const a=str(p,"preferred_ashram_id");if(a&&!uuidLike(a))return false;
  const from=str(p,"available_from"),until=str(p,"available_until");if((from&&!dateOnly(from))||(until&&!dateOnly(until))||(from&&until&&until<from))return false;
  const seva=Array.isArray(p.preferred_seva)?p.preferred_seva:[];if(seva.length>12||seva.some(v=>typeof v!=="string"||v.length>80))return false;
  return optionalText(str(p,"time_slot"),80)&&optionalText(str(p,"skills"),500)&&optionalText(str(p,"notes"),500);
}
function validateVedaSubscription(p:JsonObject){
  if(!validText(str(p,"full_name"),1,160)||!validText(str(p,"mobile"),7,30)||!validText(str(p,"full_address"),5,1000)||!validText(str(p,"pincode"),3,10)||!optionalText(str(p,"village"),160))return false;
  const pan=str(p,"pan_number").toUpperCase();return !pan||/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan);
}
function validateVedaChange(p:JsonObject){
  if(!validText(str(p,"mobile"),7,30)||!new Set(["address","name","name_and_address","other"]).has(str(p,"change_type")))return false;
  return optionalText(str(p,"subscriber_number"),40)&&optionalText(str(p,"requested_name"),160)&&optionalText(str(p,"requested_address"),1000)&&optionalText(str(p,"requested_pincode"),10)&&optionalText(str(p,"note"),1000);
}
function validateVedaArticle(p:JsonObject){
  if(!validText(str(p,"author_name"),1,160)||!validText(str(p,"mobile"),7,30)||!validText(str(p,"title"),1,240)||!optionalText(str(p,"body_text"),12000)||!optionalText(str(p,"note"),1000))return false;
  const attachment=str(p,"attachment_url");if(attachment){if(attachment.length>1000)return false;try{const u=new URL(attachment);if(u.protocol!=="https:"&&u.protocol!=="http:")return false;}catch{return false;}}
  return true;
}
function validateContact(p:JsonObject){return validText(str(p,"fullName"),2,120)&&validText(str(p,"phone"),7,30)&&optionalText(str(p,"city"),120)&&validText(str(p,"message"),5,3000)&&new Set(["general","seva","event","publication"]).has(str(p,"type"));}
function validateParticipation(p:JsonObject){
  if(!validText(str(p,"fullName"),2,120)||!validText(str(p,"phone"),7,30)||!validText(str(p,"city"),2,120)||!optionalText(str(p,"message"),1500))return false;
  if(!new Set(["seva","youth","both","information"]).has(str(p,"track")))return false;
  const interests=Array.isArray(p.interests)?p.interests:[];if(interests.length>9||new Set(interests).size!==interests.length||interests.some(v=>typeof v!=="string"||v.length>40))return false;
  return optionalText(str(p,"availability"),80)&&optionalText(str(p,"ashramId"),80);
}
function validatePayload(formType:FormType,p:JsonObject){
  switch(formType){
    case "membership":return validateMembership(p);case "donation":return validateDonation(p);case "stay":return validateStay(p);case "volunteer":return validateVolunteer(p);case "veda_subscription":return validateVedaSubscription(p);case "veda_change":return validateVedaChange(p);case "veda_article":return validateVedaArticle(p);case "contact_preview":return validateContact(p);case "participation_preview":return validateParticipation(p);
  }
}

async function sha256(value:string){const digest=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value));return Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,"0")).join("");}
function normalizeSubject(payload:JsonObject){const raw=String(payload.mobile??payload.phone??payload.article_mobile??"").toLowerCase().replace(/\s+/g,"").slice(0,80);return raw||JSON.stringify(payload).slice(0,500);}

Deno.serve(async(req:Request)=>{
  if(req.method!=="POST")return json({error:"Method not allowed"},405);
  const length=Number(req.headers.get("content-length")??0);if(length>100_000)return json({error:"Request too large"},413);
  const supabaseUrl=Deno.env.get("SUPABASE_URL");const serviceKey=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");const turnstileSecret=Deno.env.get("TURNSTILE_SECRET_KEY");
  if(!supabaseUrl||!serviceKey||!turnstileSecret)return json({error:"Public form verification is not configured"},503);
  let raw="";try{raw=await req.text();}catch{return json({error:"Invalid request"},400);}if(raw.length>100_000)return json({error:"Request too large"},413);
  let body:JsonObject;try{const parsed=JSON.parse(raw);if(!isObject(parsed))return json({error:"Invalid JSON"},400);body=parsed;}catch{return json({error:"Invalid JSON"},400);}
  const formType=String(body.form_type??"") as FormType;const payload=isObject(body.payload)?body.payload:{};const token=String(body.turnstile_token??"").trim();
  if(!allowedForms.has(formType)||!token||token.length>2048)return json({error:"Verification required"},400);
  if(!validatePayload(formType,payload))return json({error:"Invalid submission"},422);

  const verifyBody=new URLSearchParams({secret:turnstileSecret,response:token});
  const verifyResponse=await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify",{method:"POST",headers:{"content-type":"application/x-www-form-urlencoded"},body:verifyBody.toString()});
  const verified=await verifyResponse.json().catch(()=>({})) as TurnstileResult;
  if(!verifyResponse.ok||!verified.success||verified.action!==formType)return json({error:"Verification failed"},403);
  const allowedHostnames=(Deno.env.get("TURNSTILE_ALLOWED_HOSTNAMES")??"").split(",").map(v=>v.trim().toLowerCase()).filter(Boolean);
  if(allowedHostnames.length&&(!verified.hostname||!allowedHostnames.includes(verified.hostname.toLowerCase())))return json({error:"Verification hostname rejected"},403);

  const service=createClient(supabaseUrl,serviceKey,{auth:{persistSession:false,autoRefreshToken:false}});
  const subjectHash=await sha256(`${formType}:${normalizeSubject(payload)}`);
  const {data:quota,error:quotaError}=await service.rpc("consume_public_form_quota",{target_form_type:formType,target_subject_hash:subjectHash});
  if(quotaError)return json({error:"Submission protection unavailable"},503);
  if(quota!==true)return json({error:"Too many submissions. Please try again later."},429);

  if(formType==="contact_preview"||formType==="participation_preview")return json({ok:true,data:{mode:"preview",receivedAt:new Date().toISOString()}});
  const rpc=rpcByForm[formType];if(!rpc)return json({error:"Unsupported form"},400);
  const {data,error}=await service.rpc(rpc,{payload});
  if(error)return json({error:"Submission could not be saved"},422);
  return json({ok:true,data});
});
