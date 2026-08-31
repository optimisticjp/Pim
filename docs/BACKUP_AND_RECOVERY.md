# Pim backup, retention, and recovery

## Why Pim keeps its own off-site backup

The current Supabase organization is on the Free plan. Supabase recommends Free projects regularly export their database and keep an off-site copy. Pim therefore ships a scheduled GitHub Actions workflow that creates a Supabase-safe logical backup and stores it in a **private Cloudflare R2 bucket**.

Do not replace the Supabase CLI dump with a raw whole-database `pg_dump`. Supabase CLI applies platform-specific filtering to avoid managed-schema and reserved-role restore failures.

References:
- https://supabase.com/docs/guides/platform/backups
- https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore
- https://supabase.com/docs/reference/cli/supabase-db-dump

## What the scheduled backup contains

`.github/workflows/production-maintenance.yml` uses pinned Supabase CLI `2.116.0` to create:

- `roles.sql`
- `schema.sql`
- `data.sql`
- `history_schema.sql`
- `history_data.sql`
- SHA-256 checksums
- a small non-secret manifest

The SQL files are packed into `pim-supabase-backup.tar.gz` before upload.

Retention in R2:

- 7 daily backup sets
- 4 weekly backup sets
- 6 monthly backup sets

A backup set is stored under a timestamped prefix such as `backups/daily/20260831T021700Z/`.

## Important: database backup is not a file-storage backup

Supabase database backups contain database records and Storage metadata, but **do not restore deleted Storage objects**. Pim therefore treats private booking ID documents as short-lived operational data instead of permanent archive material.

When a stay is marked `checked_out`:

1. outstanding private upload tokens are revoked;
2. active booking documents are scheduled for deletion using the configured retention period;
3. the cleanup Edge Function removes expired files from the private Storage bucket;
4. the database record is retained only as scrubbed operational metadata (`deleted_at`, retention reason); the original filename, MIME detail, size, and storage key are removed/scrubbed.

The Super Admin controls the retention period from `/admin/ops` (1–90 days). The initial system default is 7 days and is operational configuration, not a committee policy statement.

## External setup required once

The repository intentionally contains no database password, R2 credential, service-role key, or maintenance token.

### 1. Create a private R2 backup bucket

In Cloudflare Dashboard:

1. Open **R2 Object Storage**.
2. Create a bucket, for example `pim-private-backups`.
3. Keep public access disabled.
4. Create an R2 API token restricted to **Object Read & Write** for only this backup bucket.
5. Record the Account ID, Access Key ID, and Secret Access Key privately.

### 2. Get a Supabase Session Pooler connection string

In Supabase **Pim → Connect**, copy the **Session pooler** connection string (port 5432). Use the database password and SSL. Store the complete URI only as a GitHub Actions secret.

Do not put this connection string in `.env.example`, source code, screenshots, issues, PR comments, or chat.

### 3. Create a maintenance token

Generate a random token locally, for example:

```bash
openssl rand -hex 32
```

Store the same value in both places below. Do not commit or share it.

- Supabase **Edge Functions → Secrets** as `OPS_MAINTENANCE_TOKEN`
- GitHub repository **Settings → Secrets and variables → Actions** as `OPS_MAINTENANCE_TOKEN`

The cleanup Edge Function can also be run manually by an authenticated Super Admin, so scheduled cleanup simply skips safely until this token exists.

### 4. Add GitHub Actions secrets

Add these repository Actions secrets:

```text
SUPABASE_DB_BACKUP_URL
R2_ACCOUNT_ID
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_BACKUP_BUCKET
OPS_MAINTENANCE_TOKEN
```

The workflow checks configuration first. Missing secrets produce warnings and a safe skip rather than a false backup or a red scheduled build.

## First activation test

After all secrets are configured:

1. Open GitHub **Actions → Production maintenance**.
2. Choose **Run workflow**.
3. Confirm both jobs finish successfully.
4. In R2, verify a new `backups/daily/<timestamp>/` prefix contains:
   - `pim-supabase-backup.tar.gz`
   - `pim-supabase-backup.tar.gz.sha256`
   - `manifest.txt`
5. Open `/admin/ops` and verify the document cleanup run timestamp/status.

Do not consider backups active merely because the workflow file exists. The first successful manual run plus a visible R2 object is the activation proof.

## Recovery procedure

A restore is an incident operation. Never test restoration directly against the live Pim database.

### 1. Select and verify a backup

Download the chosen archive and checksum from the private R2 bucket, then verify:

```bash
sha256sum -c pim-supabase-backup.tar.gz.sha256
mkdir pim-restore
 tar -xzf pim-supabase-backup.tar.gz -C pim-restore
cd pim-restore
sha256sum -c checksums.sha256
```

If any checksum fails, stop and choose another backup.

### 2. Restore into a disposable Supabase project first

Create a new test Supabase project and enable any non-default extensions used by Pim. Get its Session pooler connection string as `TARGET_DB_URL`.

Follow Supabase's current restore instructions. A representative sequence is:

```bash
psql \
  --single-transaction \
  --variable ON_ERROR_STOP=1 \
  --file roles.sql \
  --file schema.sql \
  --command 'SET session_replication_role = replica' \
  --file data.sql \
  --dbname "$TARGET_DB_URL"
```

Restore migration history separately only when required for the recovery target:

```bash
psql \
  --single-transaction \
  --variable ON_ERROR_STOP=1 \
  --file history_schema.sql \
  --file history_data.sql \
  --dbname "$TARGET_DB_URL"
```

Re-deploy Edge Functions from `supabase/functions/` and reconfigure secrets in the target project. Storage objects, SMTP/provider settings, API keys, custom domains, and external R2 media are separate recovery concerns.

### 3. Validate before any production cutover

At minimum verify:

- admin authentication can be re-established;
- `admin_profiles`, roles, and permission assignments are present;
- membership and household counts are plausible;
- stay requests and room assignments are present;
- Veda/cash/receipt records are present;
- RLS prevents anonymous/private data access;
- Turnstile gateway and Edge Function secrets are reconfigured;
- expected Edge Functions are deployed;
- public pages read correctly from restored data.

Only after a disposable restore succeeds should a real production recovery be planned with a maintenance window.

## Monthly operational check

Once a month, the Super Admin or technical maintainer should verify:

- the newest daily R2 backup is less than 48 hours old;
- daily/weekly/monthly retention is pruning correctly;
- a checksum verifies on a downloaded archive;
- document cleanup has no repeated failed runs;
- private booking documents do not remain indefinitely after checkout;
- GitHub Actions and Supabase Security Advisor have no new unexplained failures.

A periodic restore drill to a disposable project is stronger evidence than merely seeing backup files.
