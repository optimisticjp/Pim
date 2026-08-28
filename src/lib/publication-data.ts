import { publications } from "@/lib/site-data";
import type { Publication, PublicationKind } from "@/lib/types";

// Repository boundary: D1 and R2 can replace this seed-backed implementation
// without changing archive or reader components.
export function getPublications(): Publication[] {
  return publications.filter((publication) => publication.verified);
}

export function getPublicationBySlug(slug: string): Publication | undefined {
  return getPublications().find((publication) => publication.slug === slug);
}

export function getVedaRahasyaIssues(): Publication[] {
  return getPublications()
    .filter((publication) => publication.kind === "veda-rahasya")
    .sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
}

export function getPublicationYears(): number[] {
  return Array.from(new Set(getPublications().flatMap(({ year }) => year === undefined ? [] : [year])))
    .sort((a, b) => b - a);
}

export function getFeaturedPublications(): Publication[] {
  return getPublications().filter((publication) => publication.featured);
}

export function getPublicationKinds(): PublicationKind[] {
  return Array.from(new Set(getPublications().map(({ kind }) => kind)));
}

export function getRelatedPublications(publication: Publication): Publication[] {
  if (publication.year === undefined) return [];
  return getPublications().filter((candidate) =>
    candidate.id !== publication.id && candidate.kind === publication.kind && candidate.year === publication.year,
  );
}
