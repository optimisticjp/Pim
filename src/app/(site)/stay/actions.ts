"use server";
import { redirect } from "next/navigation";
import { submitPublicForm } from "@/lib/public-form-gateway";
const val=(fd:FormData,n:string,max=500)=>{const v=String(fd.get(n)??"").trim();return v?v.slice(0,max):null;};
export async function submitStayRequestAction(formData:FormData):Promise<never>{
  if(val(formData,"website",100)) redirect("/stay?submitted=received");
  const guestCount=Math.max(0,Math.min(19,Number(formData.get("guest_count")??0)||0));
  const guests=Array.from({length:guestCount},(_,i)=>({full_name:val(formData,`guest_${i}_full_name`,160),age:val(formData,`guest_${i}_age`,3),relationship:val(formData,`guest_${i}_relationship`,80)})).filter(g=>g.full_name);
  const takesPrasad=formData.get("takes_prasad")==="yes";
  const payload={applicant_name:val(formData,"applicant_name",160),mobile:val(formData,"mobile",24),native_village:val(formData,"native_village",160),full_address:val(formData,"full_address",1000),reference_name:val(formData,"reference_name",160),ashram_id:val(formData,"ashram_id",40),check_in:val(formData,"check_in",10),check_out:val(formData,"check_out",10),total_members:guestCount+1,takes_prasad:takesPrasad,breakfast_count:takesPrasad?val(formData,"breakfast_count",2):"0",lunch_count:takesPrasad?val(formData,"lunch_count",2):"0",dinner_count:takesPrasad?val(formData,"dinner_count",2):"0",guests};
  let number="";try{const rows=await submitPublicForm<Array<{request_id:string;request_number:string}>>("stay","submit_stay_request",payload,formData);number=rows[0]?.request_number??"";}catch{redirect("/stay?error=submit");}
  redirect(`/stay?submitted=${encodeURIComponent(number||"received")}`);
}
