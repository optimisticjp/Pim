import { getSupabaseRuntimeConfig } from "@/lib/supabase/config";

export class SupabasePublicError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
  }
}

export async function supabasePublicRpc<T>(functionName: string, body: unknown): Promise<T> {
  const config = getSupabaseRuntimeConfig();
  if (!config) throw new SupabasePublicError("Supabase is not configured", 503);

  const response = await fetch(`${config.url}/rest/v1/rpc/${encodeURIComponent(functionName)}`, {
    method: "POST",
    headers: {
      apikey: config.publishableKey,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const text = await response.text();
  let payload: unknown = text;
  if (text) {
    try { payload = JSON.parse(text); } catch { /* keep text */ }
  }
  if (!response.ok) {
    const message = typeof payload === "object" && payload && "message" in payload
      ? String((payload as { message: unknown }).message)
      : `Supabase request failed (${response.status})`;
    throw new SupabasePublicError(message, response.status);
  }
  return payload as T;
}
