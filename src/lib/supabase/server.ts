import { cookies } from "next/headers";

import { getSupabaseRuntimeConfig } from "@/lib/supabase/config";

const ACCESS_COOKIE = "pim_admin_access";
const REFRESH_COOKIE = "pim_admin_refresh";

export type SupabaseAuthUser = {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
};

type AuthTokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: SupabaseAuthUser;
};

export class SupabaseHttpError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly payload?: unknown,
  ) {
    super(message);
  }
}

function apiHeaders(accessToken?: string, extra?: HeadersInit): Headers {
  const config = getSupabaseRuntimeConfig();
  if (!config) throw new SupabaseHttpError("Supabase is not configured", 503);

  const headers = new Headers(extra);
  headers.set("apikey", config.publishableKey);
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
  return headers;
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) return undefined as T;
  const text = await response.text();
  let payload: unknown = text;
  if (text) {
    try { payload = JSON.parse(text); } catch { /* keep text */ }
  }
  if (!response.ok) {
    const message = typeof payload === "object" && payload && "msg" in payload
      ? String((payload as { msg: unknown }).msg)
      : typeof payload === "object" && payload && "message" in payload
        ? String((payload as { message: unknown }).message)
        : `Supabase request failed (${response.status})`;
    throw new SupabaseHttpError(message, response.status, payload);
  }
  return payload as T;
}

export async function signInWithPassword(email: string, password: string): Promise<AuthTokenResponse> {
  const config = getSupabaseRuntimeConfig();
  if (!config) throw new SupabaseHttpError("Supabase is not configured", 503);
  const response = await fetch(`${config.url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: apiHeaders(undefined, { "content-type": "application/json" }),
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });
  return parseResponse<AuthTokenResponse>(response);
}

export async function getAuthUser(accessToken: string): Promise<SupabaseAuthUser> {
  const config = getSupabaseRuntimeConfig();
  if (!config) throw new SupabaseHttpError("Supabase is not configured", 503);
  const response = await fetch(`${config.url}/auth/v1/user`, {
    headers: apiHeaders(accessToken),
    cache: "no-store",
  });
  return parseResponse<SupabaseAuthUser>(response);
}

export async function signOut(accessToken: string | null): Promise<void> {
  const config = getSupabaseRuntimeConfig();
  if (!config || !accessToken) return;
  const response = await fetch(`${config.url}/auth/v1/logout`, {
    method: "POST",
    headers: apiHeaders(accessToken),
    cache: "no-store",
  });
  if (!response.ok && response.status !== 401) await parseResponse(response);
}

export async function supabaseRest<T>(
  path: string,
  accessToken: string,
  init: RequestInit & { prefer?: string } = {},
): Promise<T> {
  const config = getSupabaseRuntimeConfig();
  if (!config) throw new SupabaseHttpError("Supabase is not configured", 503);
  const headers = apiHeaders(accessToken, init.headers);
  if (init.body && !headers.has("content-type")) headers.set("content-type", "application/json");
  if (init.prefer) headers.set("Prefer", init.prefer);
  const response = await fetch(`${config.url}/rest/v1/${path.replace(/^\//, "")}`, {
    ...init,
    headers,
    cache: "no-store",
  });
  return parseResponse<T>(response);
}

export async function getAdminAccessToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(ACCESS_COOKIE)?.value ?? null;
}

export async function setAdminSession(tokens: Pick<AuthTokenResponse, "access_token" | "refresh_token" | "expires_in">): Promise<void> {
  const store = await cookies();
  const secure = process.env.NODE_ENV === "production";
  store.set(ACCESS_COOKIE, tokens.access_token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: Math.max(60, tokens.expires_in),
  });
  store.set(REFRESH_COOKIE, tokens.refresh_token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearAdminSession(): Promise<void> {
  const store = await cookies();
  store.delete(ACCESS_COOKIE);
  store.delete(REFRESH_COOKIE);
}
