import type { AdminSession } from "@/lib/admin/types";
import { getAdminAccessToken, supabaseRest } from "@/lib/supabase/server";

export type ProductionOpsStatus={
  retention_days:number;
  scheduled_documents:number;
  expired_documents:number;
  last_cleanup_at:string|null;
  last_cleanup_status:string|null;
  last_cleanup_processed:number|null;
  last_cleanup_failed:number|null;
};

export async function getProductionOpsStatus(session:AdminSession):Promise<ProductionOpsStatus|null>{
  if(!session.profile?.is_super_admin)return null;
  const token=await getAdminAccessToken();
  if(!token)return null;
  const rows=await supabaseRest<ProductionOpsStatus[]>("rpc/get_production_ops_status",token,{method:"POST",body:"{}"});
  return rows[0]??null;
}
