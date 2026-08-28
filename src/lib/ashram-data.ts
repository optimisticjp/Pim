import { ashrams } from "@/lib/site-data";
import type { Ashram, AshramRegion } from "@/lib/types";

// Repository boundary: a future D1 implementation can replace these functions
// without changing the directory or branch-page components.
export function getAshrams(): Ashram[] {
  return ashrams;
}

export function getAshramBySlug(slug: string): Ashram | undefined {
  return ashrams.find((ashram) => ashram.slug === slug);
}

export function getAshramById(id: string): Ashram | undefined {
  return ashrams.find((ashram) => ashram.id === id && ashram.verified);
}

export function getAshramRegions(): AshramRegion[] {
  return Array.from(new Set(ashrams.map((ashram) => ashram.region)));
}

export function getFeaturedAshrams(): Ashram[] {
  return ashrams.filter((ashram) => ashram.featured && ashram.verified);
}

// "મારી નજીકનું આશ્રમ" should be enabled only after committee-verified
// coordinates exist for enough records; latitude/longitude are already typed.
