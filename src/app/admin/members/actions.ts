"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { hasAdminPermission, requireAdminSession } from "@/lib/admin/data";
import { getAdminAccessToken, supabaseRest } from "@/lib/supabase/server";

async function context(permission: string) {
  const session = await requireAdminSession();
  if (!hasAdminPermission(session, permission)) throw new Error("Permission denied");
  const token = await getAdminAccessToken();
  if (!token) redirect("/admin/login");
  return token;
}

export async function reviewMembershipApplicationAction(formData: FormData): Promise<void> {
  const token = await context("membership.review");
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  const note = String(formData.get("note") ?? "").trim() || null;
  if (!id || !["reviewing","needs_changes","rejected"].includes(status)) return;
  await supabaseRest("rpc/review_membership_application", token, { method: "POST", body: JSON.stringify({ target_application_id: id, next_status: status, note }), prefer: "return=representation" });
  revalidatePath("/admin"); revalidatePath("/admin/inbox"); revalidatePath("/admin/members"); revalidatePath(`/admin/members/${id}`);
}

export async function approveMembershipApplicationAction(formData: FormData): Promise<void> {
  const token = await context("membership.approve");
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await supabaseRest("rpc/approve_membership_application", token, { method: "POST", body: JSON.stringify({ target_application_id: id }), prefer: "return=representation" });
  revalidatePath("/admin"); revalidatePath("/admin/inbox"); revalidatePath("/admin/members"); revalidatePath(`/admin/members/${id}`);
}

export async function updateMembershipStatusAction(formData: FormData): Promise<void> {
  const token = await context("membership.manage");
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !["active","inactive","archived"].includes(status)) return;
  await supabaseRest(`memberships?id=eq.${encodeURIComponent(id)}`, token, { method: "PATCH", body: JSON.stringify({ status, ended_at: status === "active" ? null : new Date().toISOString().slice(0,10) }), prefer: "return=minimal" });
  revalidatePath("/admin/members");
}
