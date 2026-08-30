import { getAdminAccessToken, supabaseRest } from "@/lib/supabase/server";
import { hasAdminPermission } from "@/lib/admin/data";
import type { AdminSession } from "@/lib/admin/types";

export type MembershipFamilyMember = {
  id: string; member_order: number; relationship: string | null; first_name: string; father_name: string | null; surname: string | null;
  age: number | null; gender: string | null; education: string | null; occupation: string | null; mobile: string | null; blood_group: string | null; native_village: string | null;
};

export type MembershipApplication = {
  id: string; application_number: string; first_name: string; father_name: string | null; surname: string | null; full_address: string;
  education: string | null; mobile: string; occupation: string | null; native_village: string; blood_group: string | null; gender: string; age: number;
  family_member_count: number; status: string; review_note: string | null; reviewed_by: string | null; reviewed_at: string | null; submitted_at: string; approved_household_id: string | null;
  membership_application_members?: MembershipFamilyMember[];
};

export type MembershipRecord = { id: string; membership_number: string; household_id: string; status: string; started_at: string; ended_at: string | null };

export async function getMembershipApplications(session: AdminSession, limit = 100): Promise<MembershipApplication[]> {
  if (!hasAdminPermission(session, "membership.view")) return [];
  const token = await getAdminAccessToken(); if (!token) return [];
  return supabaseRest<MembershipApplication[]>(`membership_applications?select=*&order=submitted_at.desc&limit=${Math.min(limit,100)}`, token);
}

export async function getMembershipApplication(session: AdminSession, id: string): Promise<MembershipApplication | null> {
  if (!hasAdminPermission(session, "membership.view")) return null;
  const token = await getAdminAccessToken(); if (!token) return null;
  const rows = await supabaseRest<MembershipApplication[]>(`membership_applications?select=*,membership_application_members(*)&id=eq.${encodeURIComponent(id)}&limit=1`, token);
  return rows[0] ?? null;
}

export async function getMembershipRecords(session: AdminSession, limit = 100): Promise<MembershipRecord[]> {
  if (!hasAdminPermission(session, "membership.view")) return [];
  const token = await getAdminAccessToken(); if (!token) return [];
  return supabaseRest<MembershipRecord[]>(`memberships?select=id,membership_number,household_id,status,started_at,ended_at&order=created_at.desc&limit=${Math.min(limit,100)}`, token);
}
