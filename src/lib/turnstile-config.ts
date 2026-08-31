// Cloudflare Turnstile site keys are public browser identifiers, not secrets.
// Keep the current Pim worker key as a safe build-time fallback so Cloudflare
// deployments do not depend on NEXT_PUBLIC env injection. A build environment
// variable can still override it later when the widget/site changes.
export const DEFAULT_TURNSTILE_SITE_KEY = "0x4AAAAAAEi03KmAez_s-c2j";

export function getTurnstileSiteKey(): string {
  return process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || DEFAULT_TURNSTILE_SITE_KEY;
}
