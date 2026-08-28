# Madhavanand heritage migration inventory

Audit date: 2026-08-28. This is the master provenance ledger for source-derived staging content. Public presentation does not imply launch verification.

## Retrieval result

Both source hosts were attempted through HTTPS, HTTP where appropriate, `robots.txt`, `sitemap.xml`, direct page requests, `curl`, and the repository-safe audit script. In this workspace the outbound CONNECT proxy returned `403` for HTTPS and `Forbidden` for legacy HTTP. The browsing service was also unavailable (`401 Unauthorized`). Consequently, this pass **does not claim a fresh crawl** and does not invent records from either inaccessible host.

The repository's already documented records remain usable as `verified-legacy` or `review-required`; the source layer is ready for a later fresh crawl. Known junk links, train schedules, old app promotions, themes, PHP, scripts, vendor assets, and third-party artwork are excluded by policy.

## Inventory

| Source website | Source page / direct asset | Type | Title | Related person / Ashram / event | Date | Language | Media | Migrated | Public | Review | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Legacy | `https://omshreemadhavanandji.org/home.php` | person / history | શ્રી માધવાનંદજી મહારાજ | શ્રી માધવાનંદજી મહારાજ | historical | Gujarati/English | text | yes | yes, `/parampara`, `/heritage` | yes | Repository source notes: age 12 departure and about 12 years of study in Kashi. |
| Legacy | same | history | આશરે બે સદીનો જાહેર ઉલ્લેખ | Parampara | historical | Gujarati/English | text | yes | yes | yes | Preserve “approximately”; no exact founding year asserted. |
| Legacy | `content/pub_vedarahasya/Ved-Rahasya-June-2017.pdf` | publication / pdf | વેદ રહસ્ય — જૂન ૨૦૧૭ | publication | 2017-06 | Gujarati | PDF | linked remotely | yes | yes | Already present in verified repository data; move approved original to R2 later. |
| Legacy | `content/pub_vedarahasya/Ved-Rahasya-May-2016.pdf` | publication / pdf | વેદ રહસ્ય — મે ૨૦૧૬ | publication | 2016-05 | Gujarati | PDF | linked remotely | yes | yes | Availability could not be rechecked in this environment. |
| Legacy | `content/pub_vedarahasya/Ved-Rahasya-July-2014.pdf` | publication / pdf | વેદ રહસ્ય — જુલાઈ ૨૦૧૪ | publication | 2014-07 | Gujarati | PDF | linked remotely | yes | yes | Availability could not be rechecked in this environment. |
| Repository owner source | `https://www.youtube.com/@SachchidanandMadhavanand/` | video / contact | અધિકૃત સત્સંગ ચેનલ | Satsang | current | Gujarati | YouTube channel | linked | yes | yes | Channel ownership remains a committee launch check. |
| Current | `https://sachchidanandmadhavanand.org/` | other | Current-site crawl placeholder | — | 2026-08-28 attempt | — | — | no | no | required | CONNECT proxy 403; no content attributed to this source. |

## Source conflicts and protected fields

No new source conflict could be established because neither host returned content. Existing repository contact details were retained unchanged. In particular, the Akru PIN remains omitted from public seed data pending review; the legacy note reports `392258`, which appears inconsistent with current postal geography.

| Field | Legacy | Current | Repository | Action |
|---|---|---|---|---|
| Akru PIN | `392258` in existing source notes | unavailable | intentionally omitted from public address | Retain omission; committee review required. |
| Current guidance | unavailable in fresh retrieval | unavailable | owner research names શ્રી ૧૦૦૮ મહામંડલેશ્વર સ્વામી શ્રી જગદીશાનંદ સાગરજી મહારાજ | Keep prototype-review-required; do not promote to verified. |

## Next controlled harvest

Run `node scripts/audit-legacy-content.mjs` in a network-enabled environment, store its JSON output as an audit artifact, then review identity and rights before downloading. Prioritize current leadership/contact/social information from the current site and Guru portraits, letters, galleries, Veda Rahasya, audio, and event archives from the legacy site.
