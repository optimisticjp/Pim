"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasAdminPermission,requireAdminSession } from "@/lib/admin/data";
import { getAdminAccessToken,supabaseRest } from "@/lib/supabase/server";
const x=(fd:FormData,n:string,m=1000)=>{const v=String(fd.get(n)??"").trim();return v?v.slice(0,m):null};
async function ctx(p:string){const s=await requireAdminSession();if(!hasAdminPermission(s,p))throw new Error("Permission denied");const t=await getAdminAccessToken();if(!t)redirect("/admin/login");return t}
export async function recordCashAction(fd:FormData){const t=await ctx("cash.record");const amount=Number(x(fd,"amount",30));if(!Number.isFinite(amount)||amount<=0)return;await supabaseRest("rpc/record_cash_received",t,{method:"POST",body:JSON.stringify({target_reference_type:x(fd,"reference_type",30),target_reference_id:x(fd,"reference_id",50),target_payer_name:x(fd,"payer_name",160),target_mobile:x(fd,"mobile",30),target_amount:amount,target_purpose_gu:x(fd,"purpose_gu",500),target_ashram_id:x(fd,"ashram_id",40),target_note:x(fd,"note",1000)}),prefer:"return=representation"});revalidatePath("/admin/cash");revalidatePath("/admin/veda");revalidatePath("/admin/inbox")}
export async function issueReceiptAction(fd:FormData){const t=await ctx("receipts.issue");const id=x(fd,"cash_transaction_id",40);if(!id)return;await supabaseRest("rpc/issue_cash_receipt",t,{method:"POST",body:JSON.stringify({target_cash_transaction_id:id}),prefer:"return=representation"});revalidatePath("/admin/cash");revalidatePath("/admin/veda");revalidatePath("/admin/inbox")}
