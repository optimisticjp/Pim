"use client";

import { useEffect, useRef, useState } from "react";

import type { PublicFormType } from "@/lib/public-form-gateway";

type TurnstileApi={render:(container:HTMLElement,options:Record<string,unknown>)=>string;remove:(widgetId:string)=>void};
declare global{interface Window{turnstile?:TurnstileApi}}

let loader:Promise<void>|null=null;
function loadTurnstile(){
  if(typeof window==="undefined")return Promise.resolve();
  if(window.turnstile)return Promise.resolve();
  if(loader)return loader;
  loader=new Promise((resolve,reject)=>{
    const existing=document.querySelector<HTMLScriptElement>('script[data-pim-turnstile="true"]');
    if(existing){existing.addEventListener("load",()=>resolve(),{once:true});existing.addEventListener("error",()=>reject(new Error("Turnstile failed to load")),{once:true});return;}
    const script=document.createElement("script");script.src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";script.async=true;script.defer=true;script.dataset.pimTurnstile="true";script.onload=()=>resolve();script.onerror=()=>reject(new Error("Turnstile failed to load"));document.head.appendChild(script);
  });
  return loader;
}

export function TurnstileField({action,onTokenChange}:{action:PublicFormType;onTokenChange?:(token:string)=>void}){
  const siteKey=process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim()??"";
  const hostRef=useRef<HTMLDivElement>(null);const widgetId=useRef<string|null>(null);const[token,setToken]=useState("");const[failed,setFailed]=useState(false);
  useEffect(()=>{if(!siteKey||!hostRef.current)return;let active=true;void loadTurnstile().then(()=>{if(!active||!hostRef.current||!window.turnstile)return;widgetId.current=window.turnstile.render(hostRef.current,{sitekey:siteKey,action,theme:"light",size:"flexible",callback:(value:string)=>{setToken(value);onTokenChange?.(value);},"expired-callback":()=>{setToken("");onTokenChange?.("");},"error-callback":()=>{setToken("");setFailed(true);onTokenChange?.("");}});}).catch(()=>setFailed(true));return()=>{active=false;if(widgetId.current&&window.turnstile){window.turnstile.remove(widgetId.current);widgetId.current=null;}};},[action,onTokenChange,siteKey]);
  if(!siteKey)return <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-semibold text-amber-900">માનવ ચકાસણી હજી સક્રિય નથી. સત્તાવાર Turnstile configuration પછી આ ફોર્મ સુરક્ષિત રીતે મોકલી શકાશે.</div>;
  return <div className="space-y-2"><div ref={hostRef}/><input type="hidden" name="cf-turnstile-response" value={token} readOnly/>{failed?<p className="text-xs font-semibold text-red-700">માનવ ચકાસણી લોડ થઈ નથી. કૃપા કરીને પાનું ફરી ખોલીને પ્રયાસ કરો.</p>:null}</div>;
}
