"use server";
import { redirect } from "next/navigation";
import { submitPublicForm } from "@/lib/public-form-gateway";

const value=(fd:FormData,name:string,max=500)=>{const v=String(fd.get(name)??"").trim();return v?v.slice(0,max):null;};
export async function submitVolunteerAction(formData:FormData):Promise<never>{
  if(value(formData,"website",100)) redirect("/volunteer?submitted=received");
  const payload={full_name:value(formData,"full_name",160),mobile:value(formData,"mobile",24),full_address:value(formData,"full_address",1000),age:value(formData,"age",3),available_from:value(formData,"available_from",10),available_until:value(formData,"available_until",10),time_slot:value(formData,"time_slot",80),preferred_ashram_id:value(formData,"preferred_ashram_id",40),preferred_seva:formData.getAll("preferred_seva").map(String).slice(0,12),skills:value(formData,"skills",500),notes:value(formData,"notes",500)};
  let number="";try{const rows=await submitPublicForm<Array<{application_id:string;application_number:string}>>("volunteer","submit_volunteer_application",payload,formData);number=rows[0]?.application_number??"";}catch{redirect("/volunteer?error=submit");}
  redirect(`/volunteer?submitted=${encodeURIComponent(number||"received")}`);
}
