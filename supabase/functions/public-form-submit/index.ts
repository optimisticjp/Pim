import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

type FormType = "membership" | "donation" | "stay" | "volunteer" | "veda_subscription" | "veda_change" | "veda_article" | "contact_preview" | "participation_preview";
type TurnstileResult = { success?: boolean; action?: string; hostname?: string; "error-codes"?: string[] };

const rpcByForm: Partial<Record<FormType,string>> = {
  membership:"submit_membership_application",
  donation:"submit_donation_intent",
  stay:"submit_stay_request",
  volunteer:"submit_volunteer_application",
  veda_subscription:"submit_veda_subscription",
  veda_change:"submit_veda_change_request",
  veda_article:"submit_veda_article",
};
const allowedForms = new Set<FormType>([...Object.keys(rpcByForm) as FormType[],"contact_preview","participation_preview"]);
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store","x-content-type-options":"nosniff"}});

async function sha256(value:string){const digest=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value));return Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,"0")).join("");}
function normalizeSubject(payload:Record<string,unknown>){const raw=String(payload.mobile??payload.phone??payload.article_mobile??"").toLowerCase().replace(/\s+/g,"").slice(0,80);return raw||JSON.stringify(payload).slice(0,500);}

Deno.serve(async(req:Request)=>{
  if(req.method!=="POST")return json({error:"Method not allowed"},405);
  const length=Number(req.headers.get("content-length")??0);if(length>100_000)return json({error:"Request too large"},413);
  const supabaseUrl=Deno.env.get("SUPABASE_URL");const serviceKey=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");const turnstileSecret=Deno.env.get("TURNSTILE_SECRET_KEY");
  if(!supabaseUrl||!serviceKey||!turnstileSecret)return json({error:"Public form verification is not configured"},503);
  let raw="";try{raw=await req.text();}catch{return json({error:"Invalid request"},400);}if(raw.length>100_000)return json({error:"Request too large"},413);
  let body:Record<string,unknown>;try{body=JSON.parse(raw) as Record<string,unknown>;}catch{return json({error:"Invalid JSON"},400);}
  const formType=String(body.form_type??"") as FormType;const payload=(body.payload&&typeof body.payload==="object"&&!Array.isArray(body.payload)?body.payload:{}) as Record<string,unknown>;const token=String(body.turnstile_token??"").trim();
  if(!allowedForms.has(formType)||!token||token.length>2048)return json({error:"Verification required"},400);

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

  if(formType==="contact_preview"||formType==="participation_preview")return json({ok:true,mode:"preview",receivedAt:new Date().toISOString()});
  const rpc=rpcByForm[formType];if(!rpc)return json({error:"Unsupported form"},400);
  const {data,error}=await service.rpc(rpc,{payload});
  if(error)return json({error:"Submission could not be saved"},422);
  return json({ok:true,data});
});
