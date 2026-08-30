"use server";

import { redirect } from "next/navigation";

import type { AdminProfile } from "@/lib/admin/types";
import { getSupabaseRuntimeConfig } from "@/lib/supabase/config";
import { setAdminSession, signInWithPassword, signOut, SupabaseHttpError, supabaseRest } from "@/lib/supabase/server";

export async function loginAction(formData: FormData): Promise<never> {
  if (!getSupabaseRuntimeConfig()) redirect("/admin/login?error=configuration");

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) redirect("/admin/login?error=missing");

  try {
    const tokens = await signInWithPassword(email, password);
    const profiles = await supabaseRest<AdminProfile[]>(
      `admin_profiles?select=*&id=eq.${encodeURIComponent(tokens.user.id)}&limit=1`,
      tokens.access_token,
    );
    const profile = profiles[0];
    if (!profile || profile.status !== "active") {
      await signOut(tokens.access_token);
      redirect("/admin/login?error=access");
    }
    await setAdminSession(tokens);
  } catch (error) {
    if (error instanceof SupabaseHttpError && (error.status === 400 || error.status === 401)) {
      redirect("/admin/login?error=invalid");
    }
    throw error;
  }

  redirect("/admin");
}
