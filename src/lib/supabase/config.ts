export type SupabaseRuntimeConfig = {
  url: string;
  publishableKey: string;
};

export function getSupabaseRuntimeConfig(): SupabaseRuntimeConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/\/$/, "");
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!url || !publishableKey) return null;
  return { url, publishableKey };
}
