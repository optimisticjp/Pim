# Backend architecture

The production backend is being introduced in controlled phases. Supabase Postgres/Auth/RLS is the system of record; Cloudflare R2 will hold approved public media and private compliance documents. Resend is intentionally deferred until the production domain is connected.

## Phase 1 — live

The Pim Supabase project has the first foundation migrations applied:

- invite-only admin profiles backed by `auth.users`
- one Super Admin plus delegated role assignments
- granular permissions and optional global/Ashram/module scopes
- unified inbox primitives
- internal notes and status history
- in-app notifications
- database-enforced audit ledger for critical admin records
- archive/trash foundations
- RLS on every exposed foundation table

The web app uses only the Supabase project URL and publishable key. It does **not** require or expose the service-role key.

RBAC helper functions live in a non-exposed `private` Postgres schema. Public-table policies can use them, but they are not available as public PostgREST RPC endpoints.

## Admin access

An Auth user is not an admin merely because they can authenticate. They must also have an active row in `public.admin_profiles`. The first Super Admin will be bound explicitly after the committee confirms which login owns the account.

## Financial rule

The organization accepts cash only. Future modules will use states such as `cash_pending`, `cash_received`, and `receipt_issued`; there is no online payment gateway in scope.

## Files

Git remains code/data only. Public archive media and private Aadhaar/identity files move to separate R2 storage classes in a later phase. Private documents must never be made public or mixed with public gallery media.

## Notifications

Phase 1 uses in-app notifications and dashboard queues. Email delivery is added only after the production domain is connected.

## Security checks

Supabase security advisors were run after the foundation migrations. Project-owned RBAC helper warnings were eliminated by moving them out of the exposed schema. A remaining advisor warning references Supabase's existing `public.rls_auto_enable()` helper rather than application-owned functions.
