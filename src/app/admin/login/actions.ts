"use server";

import { redirect } from "next/navigation";

import type { AdminProfile } from "@/lib/admin/types";
import { getSupabaseRuntimeConfig } from "@/lib/supabase/config";
import {
  requestPasswordRecovery,
  setAdminSession,
  signInWithPassword,
  signOut,
  SupabaseHttpError,
  supabaseRest,
} from "@/lib/supabase/server";

const DEFAULT_SITE_URL = "https://pim.essanciaonline.workers.dev";

function getPasswordResetRedirectUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  const siteUrl = configured && /^https:\/\//i.test(configured) ? configured : DEFAULT_SITE_URL;
  return `${siteUrl}/admin/reset-password`;
}

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

export async function forgotPasswordAction(formData: FormData): Promise<never> {
  if (!getSupabaseRuntimeConfig()) redirect("/admin/forgot-password?error=configuration");

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) redirect("/admin/forgot-password?error=missing");

  try {
    await requestPasswordRecovery(email, getPasswordResetRedirectUrl());
  } catch (error) {
    if (error instanceof SupabaseHttpError && error.status === 429) {
      redirect("/admin/forgot-password?error=rate");
    }
    if (error instanceof SupabaseHttpError) {
      redirect("/admin/forgot-password?error=send");
    }
    throw error;
  }

  redirect("/admin/forgot-password?sent=1");
}
