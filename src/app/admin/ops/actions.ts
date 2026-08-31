"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/admin/data";
import { getSupabaseRuntimeConfig } from "@/lib/supabase/config";
import { getAdminAccessToken, supabaseRest } from "@/lib/supabase/server";

async function requireSuperAdmin(){
  const session=await requireAdminSession();
  if(!session.profile?.is_super_admin)throw new Error("Super Admin required");
  const token=await getAdminAccessToken();
  if(!token)throw new Error("Admin session expired");
  return token;
}

export async function updateDocumentRetentionAction(formData:FormData){
  const token=await requireSuperAdmin();
  const days=Number(formData.get("retention_days"));
  if(!Number.isInteger(days)||days<1||days>90)throw new Error("Retention must be between 1 and 90 days");
  await supabaseRest<number>("rpc/update_booking_document_retention_days",token,{method:"POST",body:JSON.stringify({target_days:days})});
  revalidatePath("/admin/ops");
}

export async function runDocumentCleanupAction(){
  const token=await requireSuperAdmin();
  const config=getSupabaseRuntimeConfig();
  if(!config)throw new Error("Backend is not configured");
  const response=await fetch(`${config.url}/functions/v1/cleanup-booking-documents`,{
    method:"POST",
    headers:{apikey:config.publishableKey,authorization:`Bearer ${token}`},
    cache:"no-store",
  });
  if(!response.ok)throw new Error("Private document cleanup could not complete");
  revalidatePath("/admin/ops");
  revalidatePath("/admin/stays");
}
