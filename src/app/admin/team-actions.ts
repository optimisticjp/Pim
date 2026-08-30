"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/admin/data";
import { getSupabaseRuntimeConfig } from "@/lib/supabase/config";
import { getAdminAccessToken } from "@/lib/supabase/server";

export async function inviteAdminAction(formData: FormData): Promise<void> {
  const session = await requireAdminSession();
  if (!session.profile?.is_super_admin) throw new Error("Super Admin required");
  const token = await getAdminAccessToken();
  const config = getSupabaseRuntimeConfig();
  if (!token) redirect("/admin/login");
  if (!config) throw new Error("Supabase is not configured");

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const displayName = String(formData.get("display_name") ?? "").trim();
  const roleId = String(formData.get("role_id") ?? "").trim();
  const scopeType = String(formData.get("scope_type") ?? "global");
  const scopeKey = String(formData.get("scope_key") ?? "").trim();
  if (!email || !displayName) return;

  const response = await fetch(`${config.url}/functions/v1/invite-admin`, {
    method: "POST",
    headers: { apikey: config.publishableKey, Authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify({ email, display_name: displayName, role_id: roleId || null, scope_type: scopeType, scope_key: scopeKey || null }),
    cache: "no-store",
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({})) as { error?: string };
    throw new Error(payload.error || "Admin invite failed");
  }
  revalidatePath("/admin/team");
}
