# શ્રી માધવાનંદ આશ્રમ વેબ પ્લેટફોર્મ

Gujarati-first public website and committee Admin portal for **Shree Madhavanand Ashram / Sachchidanand Madhavanand Parivar**.

## Current architecture

- Next.js application deployed to Cloudflare Workers through vinext.
- Supabase is the canonical database/Auth backend for Admin-managed content and operational workflows.
- Public pages read published records through constrained public RPCs; Admin pages use authenticated, RLS-protected access.
- Public submissions use protected server/Edge-function gateways with Cloudflare Turnstile where configured.
- Contact and Participation persist to Admin Inbox; Membership, Stay, Volunteer, Donation and Veda workflows persist to their canonical tables and also feed Inbox as appropriate.
- In-app Admin notifications are generated from new Inbox arrivals according to active Admin `inbox.view` permission and Ashram scope.
- Sensitive Stay documents use private storage, temporary upload tokens and short-lived signed viewing URLs.
- Audit/RBAC, report exports, cash/receipt workflows, publishing/archive behavior and Super Admin Ops are database-enforced rather than browser-local demo state.

Legacy files under migration/prototype areas are source/reference material unless a current route explicitly imports them. See `docs/PROTOTYPE_CONTENT.md` for the boundary.

## Functional testing

Use **`docs/TESTING.md`** as the end-to-end runbook. It covers the required dependency order and expected results for:

- Admin login, team, roles and scoped RBAC
- Ashrams and public visibility
- Rooms, Stays, meals and private documents
- Programmes/events and Seva
- Contact, Participation, Membership and Volunteer submissions
- Donation → cash → receipt
- Veda subscription/change/article/issue workflows
- Guru, Heritage and Media publishing
- Inbox + Notifications
- Reports/CSV, Audit and Super Admin Ops

Do not seed fake production data through SQL. Create clearly labelled synthetic test records through the real UI, verify the full downstream workflow, then archive/clean them up using authorized controls.

## Public routes worth smoke-testing

- `/`
- `/ashrams`
- `/events`
- `/programmes`
- `/seva`
- `/activities`
- `/parampara`
- `/heritage`
- `/heritage/letters`
- `/heritage/gallery`
- `/satsang`
- `/downloads`
- `/publications`
- `/veda-rahasya`
- `/forms`
- `/contact`
- `/participation`
- `/membership`
- `/volunteer`
- `/stay`
- `/donation`
- `/veda-rahasya/membership`
- `/veda-rahasya/services`

Admin entry point: `/admin/login`.

## Local development

Copy the public Supabase values from the intended environment into a local `.env.local` using `.env.example` as the shape. Never commit private keys or secrets.

```bash
npm ci
npm run dev
```

For the Cloudflare/vinext development path:

```bash
npm run dev:vinext
```

## Required validation before merge

```bash
npm ci
npm run typecheck
npm run lint
npm run build
```

Changes intended for production should also pass the Cloudflare Workers preview for the exact pull-request head, then the same validation and production Workers build on the exact merged `main` commit.

## Data/content integrity

Do not invent phone numbers, bank details, historical claims, honorifics, committee approvals, or operational records. `published=true` controls public visibility; it does not automatically mean legacy provenance has received committee verification.

See:

- `docs/CONTENT_SOURCES.md` — source/provenance notes
- `docs/PROTOTYPE_CONTENT.md` — canonical runtime vs migration/reference boundary
- `docs/TESTING.md` — functional test plan
- `docs/BACKUP_AND_RECOVERY.md` — backup/restore setup and procedure
- `docs/DEPLOYMENT.md` — deployment notes
