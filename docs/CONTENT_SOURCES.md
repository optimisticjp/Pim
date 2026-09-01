# Content sources and verification notes

This file separates externally recheckable legacy/public information from editorial copy created for the redesign. Committee review is still an organizational approval step and is not implied merely because a legacy page can be fetched or an Admin record is published.

## Organization and history

- Legacy organization site: https://www.omshreemadhavanandji.org/
- Legacy home/about material states the organization is a socio-spiritual Hindu organization rooted in the Vedas and Upanishads, founded by Swami Shree Madhavanandji Maharaj around 200 years ago.
- Legacy material states Swami Shree Madhavanandji left home at age 12 and spent 12 years in Kashi studying Vedas and Upanishads.
- Project research notes supplied by the owner identify current guidance under Shree 1008 Mahamandleshwar Swami Shree Jagdishanand Sagarji Maharaj. This title and all leadership copy require committee confirmation before launch.

Published Guru records can retain a source status such as `legacy-source-review-required`. Public rendering must not describe those records as committee-verified unless that separate review has actually been completed.

## Ashram directory

Legacy contact data represented in the canonical Admin records:

- Surat: Udaynagar-1, Katargam Road, Surat, Gujarat 395004. +91 0261 2534610.
- Chanod: Dayarampuri, Ta. Dabhoi, Dist. Vadodara, Gujarat 391105. +91 02663 233362.
- Sughad, Gandhinagar: Indira Bridge, near Narmada Main Canal, Koba Circle, Sughad, Gandhinagar 382424. +91 079 23276151.
- Bhavnagar: 1085 Patel Park, New Aerodrum Road, Bhavnagar, Gujarat 364001. +91 0278 2201399.
- Akru: Ta. Dhandhuka, Dist. Ahmedabad, Gujarat, legacy listing PIN 392258. +91 02713 232633. Verify the PIN before launch because it appears inconsistent with modern district postal coding.
- Haridwar: Daksheswar Road, Jagjitpur, Kankhal, Haridwar, Uttarakhand 249408. +91 01334 246675.

Other branch names may be migrated only as directory names from the legacy branch list. No phone/address is invented for them.

### External recheck — 2026-09-01

The legacy Surat, Chanod, Sughad and Haridwar Ashram detail pages and the legacy Contact page were fetchable again during the final parity audit. They continue to support the addresses/phones above. The legacy Contact page displays Chanod phone `+91 02663 23336`, while the dedicated Chanod detail page displays `+91 02663 233362`; the canonical Admin record follows the dedicated detail page. This discrepancy remains documented rather than silently normalized as committee-approved fact.

The live canonical Ashram records currently mark Surat, Chanod, Sughad, Bhavnagar, Akru and Haridwar as `verified=true`. Published Prayagraj and Ujjain records are `verified=false` and contain no invented address or phone.

## Yuvak Mandal legacy directory

The legacy Surat Yuvak Mandal page was fetchable on 2026-09-01 and lists Surat, Mumbai, Sughad and Bhavnagar. The four corresponding records remain in `src/lib/migration/mandal-data.ts` as source evidence. The other generated legacy detail URLs could not all be independently re-fetched during this audit, and there is no canonical Admin Yuvak Mandal model.

For that reason `/activities` does not render the legacy Yuvak Mandal directory. Reintroduce a public directory only after committee review and either an approved canonical Admin model or another explicitly approved source-of-truth design.

## Publications

Legacy public PDFs are referenced remotely for preview. Before production, obtain committee-approved original PDF files and migrate them to Cloudflare R2.

The current archive contains only the three legacy URLs already present in project data: June 2017, May 2016 and July 2014. No cover image, author, page count or publication date has been asserted for these records. Their remote availability should be rechecked with the committee before launch.

### Future full-text search

Full-text search is intentionally deferred until approved source files are available. The planned pipeline is: approved PDF in R2 → Gujarati text extraction (OCR only where required) → normalized page-level text in a searchable index → topic query → issue-and-page results linked back to the stable publication page. Editors must review extraction quality before an issue becomes searchable. The current interface searches metadata only; it does not search inside PDFs.

## YouTube

Official channel supplied by project owner:
https://www.youtube.com/@SachchidanandMadhavanand/

Indexed channel ID used by the current embed:
UCSG8rbkV8b4z-bmm9wLwuTA

Verify channel ownership with the committee before launch.

## Donations

No bank account, UPI or 80G claim is included in the public seed content. Add those only after receiving written, current trust details.
