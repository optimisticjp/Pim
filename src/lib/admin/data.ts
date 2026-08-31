import { redirect } from "next/navigation";

import type { AdminProfile, AdminSession, AuditLog, InboxItem, PermissionRecord, RoleRecord } from "@/lib/admin/types";
import { getSupabaseRuntimeConfig } from "@/lib/supabase/config";
import { getAdminAccessToken, getAuthUser, SupabaseHttpError, supabaseRest } from "@/lib/supabase/server";

type AssignmentRow = {
  scope_type: string;
  scope_key: string | null;
  roles: null | { code: string; name_gu: string; role_permissions: Array<{ permission_code: string }> };
};

export function hasAdminPermission(session: AdminSession, permission: string): boolean {
  return Boolean(session.profile?.is_super_admin || session.permissions.includes("*") || session.permissions.includes(permission));
}

export async function getAdminSession(): Promise<AdminSession> {
  if (!getSupabaseRuntimeConfig()) return { configured: false, authenticated: false, user: null, profile: null, permissions: [] };
  const accessToken = await getAdminAccessToken();
  if (!accessToken) return { configured: true, authenticated: false, user: null, profile: null, permissions: [] };
  try {
    const user = await getAuthUser(accessToken);
    const profiles = await supabaseRest<AdminProfile[]>(`admin_profiles?select=*&id=eq.${encodeURIComponent(user.id)}&limit=1`, accessToken);
    const profile = profiles[0] ?? null;
    if (!profile || profile.status !== "active") return { configured: true, authenticated: true, user, profile, permissions: [] };
    if (profile.is_super_admin) return { configured: true, authenticated: true, user, profile, permissions: ["*"] };
    const assignments = await supabaseRest<AssignmentRow[]>(`admin_role_assignments?select=scope_type,scope_key,roles(code,name_gu,role_permissions(permission_code))&admin_id=eq.${encodeURIComponent(user.id)}`, accessToken);
    const permissions = [...new Set(assignments.flatMap((assignment) => assignment.roles?.role_permissions.map((item) => item.permission_code) ?? []))];
    return { configured: true, authenticated: true, user, profile, permissions };
  } catch (error) {
    if (error instanceof SupabaseHttpError && (error.status === 401 || error.status === 403)) return { configured: true, authenticated: false, user: null, profile: null, permissions: [] };
    throw error;
  }
}

export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (session.configured && (!session.authenticated || !session.profile || session.profile.status !== "active")) redirect("/admin/login");
  return session;
}

export async function getInboxItems(session: AdminSession, limit = 50): Promise<InboxItem[]> {
  if (!hasAdminPermission(session, "inbox.view")) return [];
  const token = await getAdminAccessToken(); if (!token) return [];
  return supabaseRest<InboxItem[]>(`inbox_items?select=*&trashed_at=is.null&order=created_at.desc&limit=${Math.min(100, Math.max(1, limit))}`, token);
}
export async function getRoles(session: AdminSession): Promise<RoleRecord[]> { if (!session.profile) return []; const token=await getAdminAccessToken(); if(!token)return[]; return supabaseRest<RoleRecord[]>("roles?select=*&is_archived=eq.false&order=name_gu.asc",token); }
export async function getPermissions(session: AdminSession): Promise<PermissionRecord[]> { if(!session.profile)return[];const token=await getAdminAccessToken();if(!token)return[];return supabaseRest<PermissionRecord[]>("permissions?select=*&order=module.asc,code.asc",token); }
export async function getRolePermissionCodes(session: AdminSession): Promise<Record<string,string[]>> { if(!session.profile)return{};const token=await getAdminAccessToken();if(!token)return{};const rows=await supabaseRest<Array<{role_id:string;permission_code:string}>>("role_permissions?select=role_id,permission_code",token);return rows.reduce<Record<string,string[]>>((acc,row)=>{(acc[row.role_id]??=[]).push(row.permission_code);return acc;},{}); }
export async function getAdminProfiles(session: AdminSession): Promise<AdminProfile[]> { if(!hasAdminPermission(session,"admin.view")&&!session.profile?.is_super_admin)return session.profile?[session.profile]:[];const token=await getAdminAccessToken();if(!token)return[];return supabaseRest<AdminProfile[]>("admin_profiles?select=*&order=display_name.asc",token); }
export async function getAdminAssignments(session: AdminSession): Promise<Array<{id:string;admin_id:string;role_id:string;scope_type:string;scope_key:string|null}>> { if(!session.profile)return[];const token=await getAdminAccessToken();if(!token)return[];return supabaseRest("admin_role_assignments?select=id,admin_id,role_id,scope_type,scope_key",token); }
export async function getAuditLogs(session: AdminSession, limit=80):Promise<AuditLog[]>{if(!hasAdminPermission(session,"audit.view"))return[];const token=await getAdminAccessToken();if(!token)return[];return supabaseRest<AuditLog[]>(`audit_logs?select=*&order=created_at.desc&limit=${Math.min(100,Math.max(1,limit))}`,token);}
