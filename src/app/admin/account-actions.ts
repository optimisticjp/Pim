"use server";

import { redirect } from "next/navigation";

import { requireAdminSession } from "@/lib/admin/data";
import {
  clearAdminSession,
  getAdminAccessToken,
  signInWithPassword,
  signOut,
  SupabaseHttpError,
  updateAuthPassword,
} from "@/lib/supabase/server";

export async function changePasswordAction(formData: FormData): Promise<never> {
  const session = await requireAdminSession();
  const token = await getAdminAccessToken();
  if (!token || !session.user?.email) redirect("/admin/login");

  const currentPassword = String(formData.get("current_password") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm_password") ?? "");

  if (!currentPassword || !password || !confirm) redirect("/admin/account?error=missing");
  if (password.length < 10 || password.length > 128) redirect("/admin/account?error=length");
  if (password !== confirm) redirect("/admin/account?error=match");
  if (password === currentPassword) redirect("/admin/account?error=same");

  let verificationToken = "";
  try {
    const verified = await signInWithPassword(session.user.email, currentPassword);
    verificationToken = verified.access_token;
  } catch (error) {
    if (error instanceof SupabaseHttpError && (error.status === 400 || error.status === 401)) {
      redirect("/admin/account?error=current");
    }
    throw error;
  }

  try {
    await updateAuthPassword(token, password);
  } catch (error) {
    if (error instanceof SupabaseHttpError && (error.status === 400 || error.status === 422)) {
      redirect("/admin/account?error=update");
    }
    throw error;
  }

  await signOut(token);
  if (verificationToken && verificationToken !== token) await signOut(verificationToken);
  await clearAdminSession();
  redirect("/admin/login?notice=password");
}
