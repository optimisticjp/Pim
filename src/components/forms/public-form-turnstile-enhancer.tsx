"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import type { PublicFormType } from "@/lib/public-form-gateway";

type TurnstileApi={render:(container:HTMLElement,options:Record<string,unknown>)=>string;remove:(widgetId:string)=>void};
declare global{interface Window{turnstile?:TurnstileApi}}

const routeActions:Record<string,PublicFormType[]>={
  "/membership":["membership"],
  "/donation":["donation"],
  "/stay":["stay"],
  "/volunteer":["volunteer"],
  "/veda-rahasya/membership":["veda_subscription"],
  "/veda-rahasya/services":["veda_change","veda_article"],
};

let loader:Promise<void>|null=null;
function loadTurnstile(){
  if(window.turnstile)return Promise.resolve();
  if(loader)return loader;
  loader=new Promise((resolve,reject)=>{
    const existing=document.querySelector<HTMLScriptElement>('script[data-pim-turnstile="true"]');
    if(existing){existing.addEventListener("load",()=>resolve(),{once:true});existing.addEventListener("error",()=>reject(new Error("Turnstile failed to load")),{once:true});return;}
    const script=document.createElement("script");script.src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";script.async=true;script.defer=true;script.dataset.pimTurnstile="true";script.onload=()=>resolve();script.onerror=()=>reject(new Error("Turnstile failed to load"));document.head.appendChild(script);
  });
  return loader;
}

export function PublicFormTurnstileEnhancer(){
  const pathname=usePathname();
  const siteKey=process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim()??"";
  useEffect(()=>{
    const actions=routeActions[pathname]??[];
    if(!siteKey||!actions.length)return;
    const forms=Array.from(document.querySelectorAll<HTMLFormElement>("main form")).slice(0,actions.length);
    if(forms.length!==actions.length)return;
    let active=true;const widgetIds:string[]=[];const cleanups:Array<()=>void>=[];
    void loadTurnstile().then(()=>{
      if(!active||!window.turnstile)return;
      forms.forEach((form,index)=>{
        const action=actions[index];const submit=form.querySelector<HTMLButtonElement>('button[type="submit"],button:not([type])');
        if(!action||!submit)return;
        const previousDisabled=submit.disabled;submit.disabled=true;
        const input=document.createElement("input");input.type="hidden";input.name="cf-turnstile-response";
        const wrapper=document.createElement("div");wrapper.className="my-4";wrapper.dataset.pimTurnstileSlot=action;
        const message=document.createElement("p");message.className="mt-2 text-xs font-semibold text-red-700";message.hidden=true;message.textContent="માનવ ચકાસણી પૂર્ણ થઈ નથી. કૃપા કરીને ફરી પ્રયાસ કરો.";
        const mount=document.createElement("div");wrapper.append(mount,message);form.insertBefore(wrapper,submit);form.appendChild(input);
        const widgetId=window.turnstile!.render(mount,{sitekey:siteKey,action,theme:"light",size:"flexible",callback:(token:string)=>{input.value=token;message.hidden=true;submit.disabled=previousDisabled;},"expired-callback":()=>{input.value="";submit.disabled=true;},"error-callback":()=>{input.value="";submit.disabled=true;message.hidden=false;}});
        widgetIds.push(widgetId);cleanups.push(()=>{wrapper.remove();input.remove();submit.disabled=previousDisabled;});
      });
    }).catch(()=>{forms.forEach(form=>{const submit=form.querySelector<HTMLButtonElement>('button[type="submit"],button:not([type])');if(submit)submit.disabled=true;});});
    return()=>{active=false;widgetIds.forEach(id=>window.turnstile?.remove(id));cleanups.forEach(fn=>fn());};
  },[pathname,siteKey]);
  return null;
}
