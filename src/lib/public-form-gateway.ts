import { getSupabaseRuntimeConfig } from "@/lib/supabase/config";
import { supabasePublicRpc } from "@/lib/supabase/public";
import { getTurnstileSiteKey } from "@/lib/turnstile-config";

export type PublicFormType = "membership" | "donation" | "stay" | "volunteer" | "veda_subscription" | "veda_change" | "veda_article" | "contact_preview" | "participation_preview";

export class PublicFormGatewayError extends Error {
  constructor(message:string,public readonly status:number){super(message);}
}

export function isTurnstileConfigured(){return Boolean(getTurnstileSiteKey());}

export async function submitProtectedPublicForm<T>(formType:PublicFormType,payload:Record<string,unknown>,turnstileToken:string):Promise<T>{
  const config=getSupabaseRuntimeConfig();
  if(!config)throw new PublicFormGatewayError("Backend is not configured",503);
  const token=turnstileToken.trim();
  if(!token||token.length>2048)throw new PublicFormGatewayError("Verification required",400);
  const response=await fetch(`${config.url}/functions/v1/public-form-submit`,{
    method:"POST",
    headers:{
      apikey:config.publishableKey,
      authorization:`Bearer ${config.publishableKey}`,
      "content-type":"application/json",
    },
    body:JSON.stringify({form_type:formType,payload,turnstile_token:token}),
    cache:"no-store",
  });
  const text=await response.text();let body:unknown=text;
  if(text){try{body=JSON.parse(text);}catch{/* keep text */}}
  if(!response.ok){const message=typeof body==="object"&&body&&"error" in body?String((body as {error:unknown}).error):`Submission failed (${response.status})`;throw new PublicFormGatewayError(message,response.status);}
  const wrapped=body as {data?:T};
  return wrapped.data as T;
}

// The current Pim worker has a public Turnstile site key configured in code, so
// normal production submissions use the protected Edge gateway. The fallback is
// retained only for local/temporary builds where the site key is explicitly blanked.
export async function submitPublicForm<T>(formType:PublicFormType,rpcName:string,payload:Record<string,unknown>,formData:FormData):Promise<T>{
  if(!isTurnstileConfigured())return supabasePublicRpc<T>(rpcName,{payload});
  const token=String(formData.get("cf-turnstile-response")??"");
  return submitProtectedPublicForm<T>(formType,payload,token);
}
