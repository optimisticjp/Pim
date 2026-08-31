import { supabasePublicRpc } from "@/lib/supabase/public";

export type PublicGuruProfile={id:string;slug:string;name_gu:string;source_title_en:string|null;qualification_gu:string|null;portrait_url:string|null;lineage_order:number|null;featured:boolean};
export type PublicGuruChapter={id:string;slug:string;title_gu:string;summary_gu:string|null;body_md:string|null;sort_order:number};
export type PublicHeritageDocument={id:string;kind:string;title_gu:string;description_gu:string|null;document_date:string|null;date_label_gu:string|null;file_url:string|null;image_url:string|null};
export type PublicMediaFolder={id:string;parent_id:string|null;slug:string;title_gu:string;category:string;description_gu:string|null;sort_order:number};
export type PublicMediaAsset={id:string;folder_id:string|null;title_gu:string;media_type:string;asset_url:string;thumbnail_url:string|null;mime_type:string|null;duration_seconds:number|null;sort_order:number};

async function safe<T>(name:string,body:unknown, fallback:T):Promise<T>{try{return await supabasePublicRpc<T>(name,body);}catch{return fallback;}}
export const getPublicGuruProfiles=()=>safe<PublicGuruProfile[]>("list_public_guru_profiles",{},[]);
export const getPublicGuruChapters=(slug:string)=>safe<PublicGuruChapter[]>("list_public_guru_chapters",{target_slug:slug},[]);
export const getPublicHeritageDocuments=()=>safe<PublicHeritageDocument[]>("list_public_heritage_documents",{},[]);
export const getPublicMediaFolders=()=>safe<PublicMediaFolder[]>("list_public_media_folders",{},[]);
export const getPublicMediaAssets=(folderSlug?:string)=>safe<PublicMediaAsset[]>("list_public_media_assets",{target_folder_slug:folderSlug??null},[]);
