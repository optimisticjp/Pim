# Prototype content boundary

The staging public site intentionally renders a mature, populated experience on normal routes. Synthetic editorial records are centralized in `src/lib/prototype-content.ts`; records carry `prototype: true` or, for current guidance, `prototypeReviewRequired: true`. These flags are internal and are never public badges.

## Verified foundation

`src/lib/site-data.ts` retains verified Ashram contacts and the three legacy Veda Rahasya PDF records. The historical statements on `/parampara` are limited to the public source notes in `docs/CONTENT_SOURCES.md`: Vedic/Upanishadic roots, association with Swami Shree Madhavanandji Maharaj, the approximately two-century public description, leaving home at age 12, and approximately 12 years of Veda/Upanishad study in Kashi.

## Prototype datasets and pages

- `prototypeEvents`: public `/events`, event details, and up to three homepage cards. Dates, programme descriptions, statuses, and associations are staging content.
- `prototypePublications`: `/publications` and their internal detail introductions. No nonexistent PDF or download link is rendered.
- `paramparaLife`, `heritageModules`, and `currentGuidance`: the editorial modules on `/parampara`. The leadership title comes from owner research notes and requires committee confirmation.
- Existing unverified Satsang series in `src/lib/site-data.ts` provide six content pathways while the official YouTube uploads facade remains the canonical playable media surface.
- Ashram names and verified contacts remain source data. No synthetic address or phone is added.

## Source-derived migration layer

`src/lib/migration/heritage-data.ts` contains source-traceable heritage records and wraps the three repository-known legacy publication records with provenance. `src/data/migration-media.json` is the machine-readable asset ledger. These records are not prototype records, but their historical wording and remote files still require committee launch review. `/heritage` presents only this documented subset; it does not imply that the inaccessible source sites were freshly verified.

Status vocabulary is centralized in `src/lib/types.ts`: `verified-current`, `verified-legacy`, `source-derived`, `prototype`, and `review-required`.

## Before primary-domain launch

- [ ] Remove or replace prototype events.
- [ ] Verify all dates.
- [ ] Verify Guru titles.
- [ ] Verify leadership.
- [ ] Verify Ashram facilities.
- [ ] Verify branch programmes.
- [ ] Verify publication metadata.
- [ ] Verify photos.
- [ ] Verify contact numbers.
- [ ] Verify external URLs.
- [ ] Remove preview form wording after the backend is real.
