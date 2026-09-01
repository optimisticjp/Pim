# Deployment and validation

The application is a Next.js/vinext application deployed on **Cloudflare Workers** with **Supabase** as the canonical Auth/database backend. D1/browser-local preview storage is not the production architecture.

## Runtime components

- Website + Next.js route handlers: Cloudflare Workers
- Canonical structured data + Admin Auth/RLS/RPCs: Supabase
- Protected public form gateway: Supabase Edge Functions + Cloudflare Turnstile
- Private Stay documents: private Supabase Storage bucket with temporary upload tokens and short-lived signed access
- Public media/PDF URLs: records managed by the Media/Veda CMS; do not assume a second local store
- Video: official YouTube channel plus Media-library metadata where applicable
- Off-site logical database backup: repository workflow + private Cloudflare R2 when the required external secrets are configured; see `BACKUP_AND_RECOVERY.md`

## Local development

Use `.env.example` as the shape for public browser-safe values. Do not commit service-role keys, database passwords, R2 credentials, Turnstile secrets, or other private credentials.

```bash
npm ci
npm run dev
```

Vinext/Workers local path:

```bash
npm run dev:vinext
```

## Pull-request merge gate

Every production change should be validated on the **exact pull-request head SHA**:

```bash
npm ci
npm run typecheck
npm run lint
npm run build
```

In addition, require the Cloudflare Workers preview build for that exact head to succeed before merging. If the PR head changes, repeat the gate on the new head rather than relying on an older green run.

Database schema changes must be applied through a Supabase migration and committed under `supabase/migrations/` with the exact live migration version/name so repository and production history remain aligned.

## Merge and production gate

Merge with an expected-head lock where supported. After merge:

1. Confirm `refs/heads/main` points to the expected merge commit.
2. Confirm the repository Quality checks run is green on that exact `main` SHA.
3. Confirm the Cloudflare `Workers Builds: pim` production check is green on that exact `main` SHA and records a production Version ID.
4. For database changes, re-list live Supabase migrations and confirm the committed migration version exists exactly once.
5. For Edge Function changes, read back the deployed function/version and confirm the intended source is active.

Do not describe a deployment as complete based only on a local build or an earlier branch preview.

## Public form configuration

The public form surfaces use Turnstile actions mapped in `src/components/forms/public-form-turnstile-enhancer.tsx`. Current protected routes include Membership, Donation, Stay, Volunteer, Veda subscription/services, Contact and Participation.

Turnstile secret values live in Supabase Edge Function secrets, not repository environment files. The browser site key is public by design.

## Functional validation

After deployment, use `TESTING.md` for the complete end-to-end feature matrix. In particular, verify both sides of every publication boundary (Published visible; Draft/Unpublished/Archived hidden), and verify public submissions reach their canonical Admin workflow rather than a browser-local/demo store.

## DNS / primary domain

The repository sitemap targets `https://sachchidanandmadhavanand.org`. DNS/domain cutover is an external infrastructure operation and should only be changed deliberately after the Worker production build and functional smoke checks are green.
