"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdminSession } from "@/lib/admin/data";
import { getSupabaseRuntimeConfig } from "@/lib/supabase/config";
import { getAdminAccessToken, supabaseRest } from "@/lib/supabase/server";

const SETUP_URL = "https://pim.essanciaonline.workers.dev/admin/setup";

async function superAdminContext() {
  const session = await requireAdminSession();
  if (!session.profile?.is_super_admin) throw new Error("Super Admin required");
  const token = await getAdminAccessToken();
  const config = getSupabaseRuntimeConfig();
  if (!token) redirect("/admin/login");
  if (!config) throw new Error("Supabase is not configured");
  return { session, token, config };
}

export async function inviteAdminAction(formData: FormData): Promise<void> {
  const { token, config } = await superAdminContext();

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const displayName = String(formData.get("display_name") ?? "").trim();
  const roleId = String(formData.get("role_id") ?? "").trim();
  const scopeType = String(formData.get("scope_type") ?? "global");
  let scopeKey = String(formData.get("scope_key") ?? "").trim() || null;

  if (!email || !displayName || !["global", "ashram"].includes(scopeType)) return;
  if (scopeType === "global") scopeKey = null;
  if (scopeType === "ashram") {
    if (!scopeKey) throw new Error("Ashram scope required");
    const rows = await supabaseRest<Array<{ slug: string }>>(
      "ashram_profiles?select=slug&slug=eq." + encodeURIComponent(scopeKey) + "&archived_at=is.null&limit=1",
      token,
    );
    if (!rows.length) throw new Error("Invalid Ashram scope");
  }

  const response = await fetch(config.url + "/functions/v1/invite-admin", {
    method: "POST",
    headers: {
      apikey: config.publishableKey,
      Authorization: "Bearer " + token,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      email,
      display_name: displayName,
      role_id: roleId || null,
      scope_type: scopeType,
      scope_key: scopeKey,
      redirect_to: SETUP_URL,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({})) as { error?: string };
    throw new Error(payload.error || "Admin invite failed");
  }

  revalidatePath("/admin/team");
}

export async function deleteAdminAction(formData: FormData): Promise<void> {
  const { token, config } = await superAdminContext();
  const adminId = String(formData.get("admin_id") ?? "").trim();
  if (!adminId) return;

  const response = await fetch(config.url + "/functions/v1/admin-team", {
    method: "POST",
    headers: {
      apikey: config.publishableKey,
      Authorization: "Bearer " + token,
      "content-type": "application/json",
    },
    body: JSON.stringify({ action: "delete_staff", target_id: adminId }),
    cache: "no-store",
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({})) as { error?: string };
    throw new Error(payload.error || "Staff removal failed");
  }

  revalidatePath("/admin/team");
}
