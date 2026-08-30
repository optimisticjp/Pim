"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { hasAdminPermission, requireAdminSession } from "@/lib/admin/data";
import type { InboxItem } from "@/lib/admin/types";
import { clearAdminSession, getAdminAccessToken, signOut, supabaseRest } from "@/lib/supabase/server";

async function actionContext(permission?: string) {
  const session = await requireAdminSession();
  if (!session.configured || !session.profile) throw new Error("Admin backend is not configured");
  if (permission && !hasAdminPermission(session, permission)) throw new Error("Permission denied");
  const token = await getAdminAccessToken();
  if (!token) redirect("/admin/login");
  return { session, token };
}

async function audit(token: string, actor: string, action: string, entityType: string, entityId: string | null, oldData?: unknown, newData?: unknown) {
  await supabaseRest("audit_logs", token, {
    method: "POST",
    prefer: "return=minimal",
    body: JSON.stringify({ actor_user_id: actor, action, entity_type: entityType, entity_id: entityId, old_data: oldData ?? null, new_data: newData ?? null }),
  });
}

export async function logoutAction(): Promise<never> {
  const token = await getAdminAccessToken();
  await signOut(token);
  await clearAdminSession();
  redirect("/admin/login");
}

export async function createInboxItemAction(formData: FormData): Promise<void> {
  const { session, token } = await actionContext("inbox.update");
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;
  const record = {
    source_type: "manual",
    category: String(formData.get("category") ?? "manual"),
    title,
    subtitle: String(formData.get("subtitle") ?? "").trim() || null,
    contact_name: String(formData.get("contact_name") ?? "").trim() || null,
    contact_mobile: String(formData.get("contact_mobile") ?? "").trim() || null,
    ashram_key: String(formData.get("ashram_key") ?? "").trim() || null,
    status: "new",
    priority: String(formData.get("priority") ?? "normal"),
  };
  const created = await supabaseRest<InboxItem[]>("inbox_items", token, { method: "POST", prefer: "return=representation", body: JSON.stringify(record) });
  await audit(token, session.profile!.id, "create", "inbox_item", created[0]?.id ?? null, null, record);
  revalidatePath("/admin");
  revalidatePath("/admin/inbox");
}

export async function updateInboxStatusAction(formData: FormData): Promise<void> {
  const { session, token } = await actionContext("inbox.update");
  const id = String(formData.get("id") ?? "");
  const toStatus = String(formData.get("status") ?? "");
  if (!id || !toStatus) return;
  const existing = await supabaseRest<InboxItem[]>(`inbox_items?select=*&id=eq.${encodeURIComponent(id)}&limit=1`, token);
  const current = existing[0];
  if (!current || current.status === toStatus) return;
  await supabaseRest(`inbox_items?id=eq.${encodeURIComponent(id)}`, token, { method: "PATCH", prefer: "return=minimal", body: JSON.stringify({ status: toStatus }) });
  await supabaseRest("status_history", token, { method: "POST", prefer: "return=minimal", body: JSON.stringify({ entity_type: "inbox_item", entity_id: id, from_status: current.status, to_status: toStatus, changed_by: session.profile!.id }) });
  await audit(token, session.profile!.id, "status_change", "inbox_item", id, { status: current.status }, { status: toStatus });
  revalidatePath("/admin");
  revalidatePath("/admin/inbox");
}

export async function archiveInboxAction(formData: FormData): Promise<void> {
  const { session, token } = await actionContext("inbox.archive");
  const id = String(formData.get("id") ?? "");
  const restore = String(formData.get("restore") ?? "") === "true";
  if (!id) return;
  await supabaseRest(`inbox_items?id=eq.${encodeURIComponent(id)}`, token, { method: "PATCH", prefer: "return=minimal", body: JSON.stringify({ archived_at: restore ? null : new Date().toISOString() }) });
  await audit(token, session.profile!.id, restore ? "restore" : "archive", "inbox_item", id);
  revalidatePath("/admin");
  revalidatePath("/admin/inbox");
}

export async function assignInboxAction(formData: FormData): Promise<void> {
  const { session, token } = await actionContext("inbox.assign");
  const id = String(formData.get("id") ?? "");
  const adminId = String(formData.get("admin_id") ?? "").trim() || null;
  if (!id) return;
  await supabaseRest(`inbox_items?id=eq.${encodeURIComponent(id)}`, token, { method: "PATCH", prefer: "return=minimal", body: JSON.stringify({ assigned_to: adminId }) });
  await audit(token, session.profile!.id, "assign", "inbox_item", id, null, { assigned_to: adminId });
  revalidatePath("/admin/inbox");
}

export async function saveRolePermissionsAction(formData: FormData): Promise<void> {
  const { session, token } = await actionContext();
  if (!session.profile?.is_super_admin) throw new Error("Super Admin required");
  const roleId = String(formData.get("role_id") ?? "");
  const permissionCodes = formData.getAll("permission").map(String);
  if (!roleId) return;
  await supabaseRest(`role_permissions?role_id=eq.${encodeURIComponent(roleId)}`, token, { method: "DELETE", prefer: "return=minimal" });
  if (permissionCodes.length) {
    await supabaseRest("role_permissions", token, { method: "POST", prefer: "return=minimal", body: JSON.stringify(permissionCodes.map((permission_code) => ({ role_id: roleId, permission_code }))) });
  }
  await audit(token, session.profile.id, "permissions_replace", "role", roleId, null, { permissions: permissionCodes });
  revalidatePath("/admin/roles");
}

export async function assignAdminRoleAction(formData: FormData): Promise<void> {
  const { session, token } = await actionContext();
  if (!session.profile?.is_super_admin) throw new Error("Super Admin required");
  const adminId = String(formData.get("admin_id") ?? "");
  const roleId = String(formData.get("role_id") ?? "");
  const scopeType = String(formData.get("scope_type") ?? "global");
  const scopeKey = String(formData.get("scope_key") ?? "").trim() || null;
  if (!adminId || !roleId) return;
  await supabaseRest("admin_role_assignments?on_conflict=admin_id,role_id,scope_type,scope_key", token, {
    method: "POST",
    prefer: "resolution=ignore-duplicates,return=minimal",
    body: JSON.stringify({ admin_id: adminId, role_id: roleId, scope_type: scopeType, scope_key: scopeKey, assigned_by: session.profile.id }),
  });
  await audit(token, session.profile.id, "role_assign", "admin_profile", adminId, null, { role_id: roleId, scope_type: scopeType, scope_key: scopeKey });
  revalidatePath("/admin/team");
}

export async function setAdminStatusAction(formData: FormData): Promise<void> {
  const { session, token } = await actionContext();
  if (!session.profile?.is_super_admin) throw new Error("Super Admin required");
  const adminId = String(formData.get("admin_id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!adminId || !["active", "suspended"].includes(status) || adminId === session.profile.id) return;
  await supabaseRest(`admin_profiles?id=eq.${encodeURIComponent(adminId)}`, token, { method: "PATCH", prefer: "return=minimal", body: JSON.stringify({ status }) });
  await audit(token, session.profile.id, "admin_status", "admin_profile", adminId, null, { status });
  revalidatePath("/admin/team");
}
