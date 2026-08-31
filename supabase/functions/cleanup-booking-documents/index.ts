import { createClient } from "npm:@supabase/supabase-js@2";

type ExpiredDocument={id:string;storage_provider:string;storage_key:string};
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store","x-content-type-options":"nosniff"}});

async function sameSecret(a:string,b:string){
  if(!a||!b)return false;
  const enc=new TextEncoder();
  const [ha,hb]=await Promise.all([
    crypto.subtle.digest("SHA-256",enc.encode(a)),
    crypto.subtle.digest("SHA-256",enc.encode(b)),
  ]);
  const aa=new Uint8Array(ha),bb=new Uint8Array(hb);let diff=aa.length^bb.length;
  for(let i=0;i<Math.min(aa.length,bb.length);i++)diff|=aa[i]^bb[i];
  return diff===0;
}

Deno.serve(async(req:Request)=>{
  if(req.method!=="POST")return json({error:"Method not allowed"},405);
  const url=Deno.env.get("SUPABASE_URL");
  const anonKey=Deno.env.get("SUPABASE_ANON_KEY");
  const serviceKey=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if(!url||!anonKey||!serviceKey)return json({error:"Maintenance service is not configured"},503);

  let authorized=false;
  const auth=req.headers.get("authorization")??"";
  if(auth.startsWith("Bearer ")){
    const userClient=createClient(url,anonKey,{global:{headers:{Authorization:auth}},auth:{persistSession:false,autoRefreshToken:false}});
    const {data:userData}=await userClient.auth.getUser();
    if(userData.user){
      const {data:profile}=await userClient.from("admin_profiles").select("is_super_admin,status").eq("id",userData.user.id).maybeSingle();
      authorized=Boolean(profile?.is_super_admin&&profile.status==="active");
    }
  }
  if(!authorized){
    const configured=(Deno.env.get("OPS_MAINTENANCE_TOKEN")??"").trim();
    const supplied=(req.headers.get("x-ops-maintenance-token")??"").trim();
    authorized=await sameSecret(configured,supplied);
  }
  if(!authorized)return json({error:"Super Admin or maintenance authorization required"},403);

  const service=createClient(url,serviceKey,{auth:{persistSession:false,autoRefreshToken:false}});
  const {data:run,error:runError}=await service.from("ops_maintenance_runs").insert({kind:"document_cleanup",status:"running"}).select("id").single();
  if(runError||!run?.id)return json({error:"Could not start maintenance run"},500);

  let processed=0,failed=0;
  try{
    const {data:docs,error:listError}=await service.from("booking_documents")
      .select("id,storage_provider,storage_key")
      .is("deleted_at",null)
      .not("delete_after","is",null)
      .lte("delete_after",new Date().toISOString())
      .order("delete_after",{ascending:true})
      .limit(100);
    if(listError)throw listError;

    for(const doc of (docs??[]) as ExpiredDocument[]){
      if(doc.storage_provider!=="supabase"){failed++;continue;}
      const {error:removeError}=await service.storage.from("booking-documents-private").remove([doc.storage_key]);
      if(removeError){failed++;continue;}
      const {error:updateError}=await service.from("booking_documents").update({
        storage_key:`purged/${doc.id}`,
        original_filename:null,
        mime_type:null,
        size_bytes:null,
        deleted_at:new Date().toISOString(),
        deletion_reason:"retention",
      }).eq("id",doc.id).is("deleted_at",null);
      if(updateError){failed++;continue;}
      processed++;
    }

    const status=failed===0?"success":processed>0?"partial":"failed";
    await service.from("ops_maintenance_runs").update({status,completed_at:new Date().toISOString(),processed_count:processed,failed_count:failed,note:"Private booking-document retention cleanup"}).eq("id",run.id);
    return json({ok:failed===0,processed,failed,status});
  }catch{
    await service.from("ops_maintenance_runs").update({status:"failed",completed_at:new Date().toISOString(),processed_count:processed,failed_count:failed+1,note:"Cleanup run failed before completion"}).eq("id",run.id);
    return json({error:"Document cleanup could not complete"},500);
  }
});
