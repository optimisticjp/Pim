# Prototype and source-derived content boundary

The public runtime now treats Supabase as the canonical source for Admin-managed content and operational workflows. Legacy/prototype modules may remain in the repository as migration inputs or reference material, but they must not become a second runtime source for a module that Admin manages.

## Canonical runtime sources

The following public surfaces now read the same live Supabase records that their Admin modules manage:

- Events and Programmes: programme centres, circulars, and Tithi/programme records.
- Ashrams and Stay: published Ashram profiles and live `accepts_stays` availability.
- Seva: published Seva categories and activities; child activities are hidden when their category is hidden.
- Guru Parampara: published Guru profiles and chapters.
- Heritage: published Heritage documents.
- Media: published folders/assets power Downloads, Heritage Gallery, and historical Satsang collections. Folder visibility is hierarchical.
- Veda Rahasya and Publications: published Veda issue records.
- Contact and Participation: protected public submissions persist to the Admin Inbox rather than a browser/demo store.

Public contact details that identify the Surat Ashram are also resolved from the published Ashram record instead of a duplicated hard-coded address/phone.

## Repository-only prototype and migration material

`src/lib/prototype-content.ts`, legacy static data helpers, and `src/lib/migration/` remain migration/reference material unless a current route explicitly imports them. They are not authoritative for modules listed above.

The source-derived migration layer contains historical material collected from documented organizational sources. Records marked `source-derived` or `review-required` still require committee review for wording, dates, remote files, and links before primary-domain launch, even where the data has subsequently been seeded into Supabase.

Status vocabulary is centralized in `src/lib/types.ts`: `verified-current`, `verified-legacy`, `source-derived`, `prototype`, and `review-required`.

## Remaining non-canonical public material

- The Satsang series list in `src/lib/site-data.ts` is navigation taxonomy only. It links into the official YouTube channel; it is not the source for the Admin Media library or historical collection records.
- `/activities` still shows four source-derived Yuvak Mandal links from `src/lib/migration/mandal-data.ts`. Those records are explicitly `reviewRequired: true`. There is currently no canonical Admin Yuvak Mandal module, so they must be committee-reviewed (or given an approved canonical model) before primary-domain launch.

## Before primary-domain launch

- [x] Replace prototype Events with live Admin-managed programme/Tithi data.
- [x] Replace prototype Publications with live Veda issue data.
- [x] Move historical Media collections to the live Media library and enforce archive/unpublish parity.
- [x] Make Contact/Participation submissions persist through the protected backend to Admin Inbox.
- [x] Remove public preview-only form wording after the backend became real.
- [x] Remove duplicated public Surat contact details in favor of the live Ashram record.
- [ ] Committee-review the source-derived Yuvak Mandal links/cities or approve a canonical Admin model.
- [ ] Verify historical dates and Guru titles.
- [ ] Verify leadership wording.
- [ ] Verify Ashram facilities and contact numbers in the Admin records.
- [ ] Verify branch programme details.
- [ ] Verify photos and remaining external URLs.
