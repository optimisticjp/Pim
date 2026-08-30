import { supabasePublicRpc } from "@/lib/supabase/public";
export type VedaIssue={id:string;issue_date:string;issue_year:number;issue_month:number;title_gu:string;pdf_url:string|null;cover_url:string|null};
export async function getPublicVedaIssues():Promise<VedaIssue[]>{try{return await supabasePublicRpc<VedaIssue[]>("list_public_veda_issues",{})}catch{return []}}
