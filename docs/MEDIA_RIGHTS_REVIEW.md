# Media rights review

Audit date: 2026-08-28. Technical availability and identity mapping do not replace organizational permission for primary-domain publication.

| Asset group | Source | Local use | Review still required |
|---|---|---|---|
| 17 named Guru portraits | Legacy `about_us.php` listing | Validated remote source URL; R2 migration pending | identity, rights, approved originals |
| 6 flagship Ashram exteriors | Legacy homepage/Ashram paths | Validated remote source URL; R2 migration pending | caption, rights, newer alternatives |
| 46 Veda Rahasya PDFs | Legacy publication archive | Remote links only | rights and future approved R2 originals |
| Official YouTube channel | Current/repository channel handle | External channel link | confirm continuing ownership |

Original asset URLs, source pages, and related entities are preserved in `src/data/migration-media.json`; `localPath` is intentionally `null` until the dedicated R2 pass. No AI-generated substitute portrait, stock devotional image, copied theme asset, or invented historical scan is used.

## Binary storage policy

High-value approved media will be migrated from source URLs to Cloudflare R2 in a dedicated media-storage pass. Git is intentionally not being used as the permanent binary media store. Until that pass, the staging UI uses the validated organizational source URLs recorded in the migration manifest.
