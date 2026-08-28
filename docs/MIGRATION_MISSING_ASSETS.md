# Migration retrieval and missing-asset log

Audit date: 2026-08-28.

| URL / request | Result | Public impact | Follow-up |
|---|---|---|---|
| `https://sachchidanandmadhavanand.org/` | CONNECT tunnel failed, proxy response 403 | No current-site content newly migrated | Re-run from network-enabled environment |
| Current-site `/robots.txt` and `/sitemap.xml` | CONNECT tunnel failed, proxy response 403 | Navigation inventory unavailable | Re-run controlled audit script |
| `https://omshreemadhavanandji.org/home.php` | CONNECT tunnel failed, proxy response 403 | No new heritage media downloaded | Re-run from network-enabled environment |
| `http://omshreemadhavanandji.org/home.php` | HTTP 403 `Forbidden` | HTTP fallback unavailable | Do not bypass access controls |
| Legacy `/robots.txt` and `/sitemap.xml` | CONNECT tunnel failed, proxy response 403 | Full archive inventory unavailable | Re-run controlled audit script |
| Web browsing service | 401 Unauthorized | Search-index fallback unavailable | Use authenticated browsing environment |

The three repository-known PDF URLs remain public links but could not be live-checked here. The UI does not reference any newly discovered image, audio, or document URL, so no new broken media is knowingly shipped.
