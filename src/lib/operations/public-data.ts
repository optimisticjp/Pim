import { supabasePublicRpc } from "@/lib/supabase/public";

export type PublicAshram = { id:string; slug:string; name_gu:string; city_gu:string; state_gu:string|null; full_address:string|null; office_phone:string|null; map_url:string|null; accepts_stays:boolean };
export type ProgrammeCentre = { id:string; kind:string; title_gu:string; ashram_id:string|null; address_gu:string; city_gu:string; contact_name:string|null; contact_mobile:string|null; map_url:string|null; schedule_text:string|null; age_range_text:string|null };
export type ProgrammeCircular = { id:string; title_gu:string; category:string; description_gu:string|null; image_url:string|null; pdf_url:string|null; valid_from:string|null; valid_until:string|null; published_at:string|null };
export type TithiProgramme = { id:string; title_gu:string; programme_type:string; programme_date:string; weekday_gu:string|null; tithi_name_gu:string|null; tithi_number:string|null; swamiji_name:string|null; village_city_gu:string; venue_gu:string|null; map_url:string|null; details_gu:string|null; image_url:string|null; pdf_url:string|null; ashram_id:string|null };
export type SevaCategory = { id:string; slug:string; title_gu:string; description_gu:string|null; sort_order:number };
export type SevaActivity = { id:string; category_id:string; title_gu:string; summary_gu:string|null; details_gu:string|null; ashram_id:string|null; activity_date:string|null; metric_label_gu:string|null; metric_value:string|null; cover_url:string|null };

async function safeList<T>(name:string): Promise<T[]> {
  try { return await supabasePublicRpc<T[]>(name, {}); } catch { return []; }
}

export const getPublicAshrams = () => safeList<PublicAshram>("list_public_ashrams");
export const getPublicProgrammeCentres = () => safeList<ProgrammeCentre>("list_public_programme_centres");
export const getPublicProgrammeCirculars = () => safeList<ProgrammeCircular>("list_public_programme_circulars");
export const getPublicTithiProgrammes = () => safeList<TithiProgramme>("list_public_tithi_programmes");
export const getPublicSevaCategories = () => safeList<SevaCategory>("list_public_seva_categories");
export const getPublicSevaActivities = () => safeList<SevaActivity>("list_public_seva_activities");
