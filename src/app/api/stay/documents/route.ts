import { NextResponse } from "next/server";
import { getSupabaseRuntimeConfig } from "@/lib/supabase/config";

export const runtime="edge";
export async function POST(request:Request){const config=getSupabaseRuntimeConfig();if(!config)return NextResponse.json({error:"Service unavailable"},{status:503});let form:FormData;try{form=await request.formData();}catch{return NextResponse.json({error:"Invalid form data"},{status:400});}const file=form.get("file");if(!(file instanceof File)||file.size>5*1024*1024)return NextResponse.json({error:"File must be 5 MB or smaller"},{status:413});const response=await fetch(`${config.url}/functions/v1/upload-booking-document`,{method:"POST",headers:{apikey:config.publishableKey},body:form,cache:"no-store"});const text=await response.text();return new Response(text,{status:response.status,headers:{"content-type":response.headers.get("content-type")??"application/json","cache-control":"no-store"}});}
