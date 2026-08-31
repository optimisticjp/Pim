import type { AdminSession } from "@/lib/admin/types";
import { hasAdminPermission } from "@/lib/admin/data";
import { getAdminAccessToken, supabaseRest } from "@/lib/supabase/server";

export type CmsGuruProfile={id:string;slug:string;name_gu:string;source_title_en:string|null;qualification_gu:string|null;portrait_url:string|null;source_url:string|null;source_status:string;lineage_order:number|null;featured:boolean;published:boolean;archived_at:string|null};
export type CmsGuruChapter={id:string;guru_profile_id:string;slug:string;title_gu:string;summary_gu:string|null;body_md:string|null;sort_order:number;status:string;source_url:string|null;review_required:boolean};
export type HeritageDocument={id:string;kind:string;title_gu:string;description_gu:string|null;document_date:string|null;date_label_gu:string|null;file_url:string|null;image_url:string|null;source_url:string|null;status:string;sort_order:number};
export type MediaFolder={id:string;parent_id:string|null;slug:string;title_gu:string;category:string;description_gu:string|null;sort_order:number;published:boolean;archived_at:string|null};
export type MediaAsset={id:string;folder_id:string|null;title_gu:string;media_type:string;asset_url:string;thumbnail_url:string|null;mime_type:string|null;duration_seconds:number|null;source_url:string|null;source_label:string|null;sort_order:number;published:boolean;archived_at:string|null};

async function list<T>(session:AdminSession,permission:string,path:string):Promise<T[]>{if(!hasAdminPermission(session,permission)&&!session.profile?.is_super_admin)return[];const token=await getAdminAccessToken();if(!token)return[];return supabaseRest<T[]>(path,token);}
export const getCmsGuruProfiles=(s:AdminSession)=>list<CmsGuruProfile>(s,"guru.view","guru_profiles?select=*&order=lineage_order.asc.nullslast,created_at.asc");
export const getCmsGuruChapters=(s:AdminSession)=>list<CmsGuruChapter>(s,"guru.view","guru_chapters?select=*&order=guru_profile_id.asc,sort_order.asc");
export const getHeritageDocuments=(s:AdminSession)=>list<HeritageDocument>(s,"heritage.manage","heritage_documents?select=*&order=sort_order.asc,document_date.asc.nullslast");
export const getMediaFolders=(s:AdminSession)=>list<MediaFolder>(s,"media.view","media_folders?select=*&order=sort_order.asc,title_gu.asc");
export const getMediaAssets=(s:AdminSession)=>list<MediaAsset>(s,"media.view","media_assets?select=*&order=sort_order.asc,title_gu.asc");
