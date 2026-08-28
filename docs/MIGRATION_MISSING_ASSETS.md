# Migration retrieval and missing-asset log

Audit date: 2026-08-28. See `src/data/source-crawl.json` and `src/data/source-assets-check.json` for the complete machine-readable results.

## Crawl failures

The bounded crawl completed 160 distinct pages (60 current, 100 legacy) and recorded 24 failures. The current host returned HTTP 503 intermittently for 22 attempted pages after sustained bounded crawling. The current `/publication` and `/download` paths returned HTTP 404; their working equivalents are `/publications` and the discoverable download/audio content pages. Failures remain in the manifest rather than being silently omitted.

## Validated assets

- All 17 Guru portrait URLs remain distinct remote staging records.
- All 46 legacy Veda Rahasya PDFs returned valid PDF content.
- Six flagship legacy Ashram exterior photographs remain available, with stronger current image sets recorded for Surat, Chanod, Sughad, Akru, and Haridwar.
- Nineteen historical letter scans are recorded remotely and grouped into ten letter records.
- Twelve source-named photo albums and 42 individual historical YouTube IDs are structured.
- Seven real Books & Magazines records retain their covers; their legacy download-handler URLs returned HTML and are therefore not exposed as PDF buttons.

## Deferred or unavailable

- Direct YouTube checks were blocked by the environment CONNECT proxy; IDs were extracted from successfully retrieved organizational video-list HTML.
- Some current-host PDF/audio checks received transient HTTP 503 responses during validation and remain documented rather than promoted as confirmed downloads.
- Large PDFs, audio, scans, and images remain remote. High-value approved media will move to Cloudflare R2 in the dedicated storage pass; Git remains text-only.
