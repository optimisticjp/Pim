"use server";
import { redirect } from "next/navigation";
import { submitPublicForm } from "@/lib/public-form-gateway";
const v=(fd:FormData,n:string,m=500)=>{const x=String(fd.get(n)??"").trim();return x?x.slice(0,m):null};
export async function submitDonationIntentAction(fd:FormData):Promise<never>{
 if(v(fd,"website",100)) redirect("/donation?submitted=received");
 const payload={donor_name:v(fd,"donor_name",160),mobile:v(fd,"mobile",30),purpose_gu:v(fd,"purpose_gu",500),pledged_amount:v(fd,"pledged_amount",20),preferred_ashram_id:v(fd,"preferred_ashram_id",40)};
 try{const r=await submitPublicForm<Array<{intent_id:string;intent_number:string}>>("donation","submit_donation_intent",payload,fd);redirect(`/donation?submitted=${encodeURIComponent(r[0]?.intent_number??"received")}`)}catch{redirect("/donation?error=submit")}
}
