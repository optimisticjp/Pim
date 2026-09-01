# End-to-end feature testing

This runbook is for functional testing of the current Supabase-backed production-style application. It deliberately avoids seed/demo/localStorage data: create clearly labelled test records through the real public/Admin UI, verify the downstream workflow, then archive or clean them up through the same authorized workflow.

## Before testing

1. Use an active Admin account. Keep at least one Super Admin available for role, destructive cleanup, sensitive-document deletion, and Ops checks.
2. For RBAC testing, use a separate non-Super-Admin account. Assign only the role/scope needed for each scenario; do not weaken the Super Admin account to simulate restricted access.
3. Prefix editable test content with `[TEST]` where the field permits it. For public-person forms, use obviously synthetic testing contact details that do not belong to a real person.
4. Complete Cloudflare Turnstile normally on protected public forms. Do not bypass the public submission gateway.
5. Do not enter real PAN/Aadhaar/identity documents during testing. For the private-document flow, use a harmless test PDF/JPG/PNG containing only test text.
6. Prefer Archive/Cancel/Reject after verification. Use permanent deletion only where a Super Admin control explicitly exists and only for records created by the test.

## Recommended order

Several workflows depend on earlier setup. Running the sections in this order avoids false failures.

### 1. Authentication, team and RBAC

Admin: `/admin/login`, `/admin/team`, `/admin/roles`, `/admin/audit`

- Sign in with an active Admin account and confirm logout/login.
- Invite or use a second Admin account for restricted-role testing.
- Assign a stock role globally and verify its allowed modules.
- Assign an Ashram-scoped role and verify records from another Ashram are not visible/editable.
- Remove the assignment and verify access is removed.
- Confirm role/team mutations appear in Audit where the relevant operation is audited.

Expected: Super Admin bypass remains available; non-Super-Admin access follows explicit permission + scope grants.

### 2. Ashram publishing and public directory

Admin: `/admin/ashrams`
Public: `/ashrams`, `/ashrams/[slug]`, `/contact`, `/stay`, `/volunteer`, `/participation`

- Create or edit a test Ashram record only if needed; otherwise use an existing published Ashram.
- Verify Publish/Unpublish changes public visibility.
- Verify Surat contact information on `/contact` follows the live Surat Ashram record.
- Verify only published Ashrams appear as choices on public workflows.
- Verify `accepts_stays` controls whether an Ashram is offered on `/stay`.

Do not change verified organizational addresses/phones merely to create test data. Use a separate `[TEST]` record if an edit test is necessary.

### 3. Room inventory prerequisite

Admin: `/admin/stays/rooms`

The database intentionally ships with no fake room inventory. Before testing room assignment:

- Create a `[TEST]` room type for one Ashram.
- Create one or more `[TEST]` rooms with known capacities.
- Keep them active through the stay tests below.

Expected: room assignment later only offers active, non-archived rooms in the selected Ashram with sufficient capacity.

### 4. Programmes and events

Admin: `/admin/programmes`
Public: `/programmes`, `/events`, homepage upcoming-programme section

- Create a `[TEST]` programme centre and verify its publish state.
- Create a `[TEST]` circular with a valid date window; verify expired/hidden circulars do not appear publicly.
- Create a future `[TEST]` Tithi/programme and publish it.
- Verify it appears on `/events`, `/programmes`, and the homepage when applicable.
- Unpublish/archive it and verify it disappears from public lists.

### 5. Seva content and volunteer workflow

Admin: `/admin/seva`
Public: `/seva`, `/activities`, `/volunteer`

Content path:
- Create a `[TEST]` Seva category and `[TEST]` activity.
- Publish both and verify the public activity appears.
- Hide/archive the parent category and verify the child activity no longer leaks publicly.

Submission path:
- Submit `/volunteer` with synthetic test details.
- Verify an Inbox item is created with the appropriate Ashram scope when selected.
- Review the volunteer application in Admin Seva and move it through available statuses.
- Verify a corresponding Admin notification is created for admins allowed to view that Inbox item.

### 6. General participation workflow

Public: `/participation` (also linked from `/forms`)
Admin: `/admin/inbox`, `/admin/notifications`

- Test `seva`, `youth`, `both`, and `information` tracks as needed.
- Submit once without an Ashram and once with a specific published Ashram.
- Verify the submission persists to Admin Inbox.
- For an Ashram-scoped Admin, verify only the matching scoped submission is visible.
- Verify eligible admins receive an in-app notification.
- Test notification read/unread, Mark all read, and Archive controls.

Expected: the Participation form is a real Inbox workflow; it does not create a separate Yuvak Mandal content store.

### 7. Contact workflow

Public: `/contact`
Admin: `/admin/inbox`, `/admin/notifications`

- Submit a synthetic contact message through Turnstile.
- Verify a persisted reference/success state is returned.
- Verify the Inbox item is global rather than Ashram-scoped unless the form explicitly supplies scope.
- Verify eligible global Inbox viewers receive a notification.
- Change Inbox status, assign it, archive/restore it, and add any supported internal workflow notes.

### 8. Membership → household/member workflow

Public: `/membership`
Admin: `/admin/inbox`, `/admin/members`, `/admin/members/[id]`

- Submit a membership application with one or more synthetic family members.
- Verify the Inbox item and notification.
- Open the application in Admin Members.
- Move it through review states.
- Approve it using the dedicated approval workflow.
- Verify official Household, People and Membership records are created only after approval.
- Change the official membership status between active/inactive/archived as permitted.

Expected: submission alone never creates an official member record.

### 9. Stay → room → meals → private documents

Public: `/stay`, `/stay/documents`
Admin: `/admin/stays`, `/admin/stays/[id]`, `/admin/stays/rooms`

- Submit a future stay request to an Ashram with `accepts_stays=true`.
- Include synthetic guests and optional meal counts.
- Verify Inbox + notification and the Admin Stay detail.
- Exercise review statuses such as reviewing/documents_required/approved as appropriate.
- Assign one of the `[TEST]` rooms created earlier; verify insufficient-capacity/wrong-Ashram rooms are not offered.
- Verify status can proceed through room_assigned, checked_in and checked_out.
- Release/reassign the room where appropriate.
- Verify meal requirements feed the kitchen report for operational stay statuses.

Private-document path:
- From the stay detail, create a temporary upload token if the account has `sensitive_docs.manage`.
- Open `/stay/documents?token=...` and upload only a harmless test PDF/JPG/PNG.
- Verify a user with `sensitive_docs.view` can request a short-lived signed view URL.
- Verify a user without sensitive-document permission cannot view it.
- Use Super Admin deletion/retention cleanup only on the harmless test document.

### 10. Donation → cash → receipt

Public: `/donation`
Admin: `/admin/inbox`, `/admin/cash`, `/admin/receipts/[id]`

- Submit a synthetic donation intent. This is a cash-intent workflow; there is no online-payment claim.
- Verify it enters Inbox/Notifications and Cash Pending.
- Record a small clearly test-labelled cash amount in Admin Cash.
- Issue a receipt.
- Open the receipt detail and verify the receipt number, payer, amount and purpose match the transaction.
- Verify the cash/receipt report after data exists.

Do not record a real payment unless it actually occurred; test values should be clearly synthetic and cleaned up according to the authorized controls.

### 11. Veda Rahasya workflows

Public: `/veda-rahasya`, `/publications`, `/veda-rahasya/membership`, `/veda-rahasya/services`
Admin: `/admin/veda`, `/admin/cash`

Issue publishing:
- Create a `[TEST]` issue with test URLs or leave optional media fields blank where allowed.
- Verify Draft is private, Published appears publicly, Archive removes it, Restore returns it to Admin.

Subscription:
- Submit a synthetic Veda subscription application (do not use a real PAN).
- Review it to Cash Pending.
- Record cash in `/admin/cash`.
- Verify it becomes eligible for activation, then activate it.
- Verify the official subscriber record is created.

Change request / article:
- Submit both public forms in `/veda-rahasya/services`.
- Verify Inbox/Notifications and the Admin queues.
- Exercise the available review/status transitions.

### 12. Guru Parampara

Admin: `/admin/heritage`
Public: `/parampara`, `/parampara/[slug]`

- Create a `[TEST]` Guru profile and chapter if permitted by the test plan.
- Keep historical claims generic/test-only; do not invent real titles/dates.
- Publish and verify public visibility.
- Unpublish/archive the parent and verify chapters do not remain publicly visible.
- Test a manage-without-publish role and verify editing does not silently change publication state.

### 13. Heritage documents

Admin: `/admin/heritage`
Public: `/heritage`, `/heritage/letters`, `/heritage/gallery`

- Create `[TEST]` records for the supported heritage kinds.
- Verify Draft vs Published visibility.
- Archive and confirm public removal.
- Restore/edit as supported.

### 14. Media library

Admin: `/admin/media`
Public: `/downloads`, `/heritage/gallery`, `/satsang`

- Create a `[TEST]` parent folder, child folder, and one harmless media asset.
- Publish the tree and verify the appropriate public surface.
- Hide/archive the parent and verify published descendants do not leak publicly.
- For historical Satsang collections, verify only currently published Media folders/assets drive the collection cards/counts.

### 15. Inbox operations and notifications

Admin: `/admin/inbox`, `/admin/quick-add`, `/admin/notifications`

- Create a `[TEST]` Quick Add Inbox item within the tester's permitted scope.
- Verify an Ashram-scoped Admin cannot create or see an item outside their assigned Ashram.
- Exercise assignment, status changes, archive/restore and trash controls according to permissions.
- Verify every newly inserted Inbox item creates notifications only for active admins who can view that scope.
- Verify one admin cannot update another admin's notification through the UI/RLS boundary.

### 16. Reports / CSV

Admin: `/admin/reports`

Run this after the workflows above have real test records.

- Stays report: verify selected date/Ashram and room assignment.
- Kitchen report: verify only approved/room_assigned/checked_in stays contribute meal headcount.
- Room occupancy: verify active assignments and date overlap.
- Membership applications: verify application export; no sensitive document fields.
- Volunteers: verify Ashram and date filtering.
- Veda subscribers: verify subscriber postal data; PAN is excluded.
- Cash/receipts: verify transaction and receipt fields.
- Open the CSV in spreadsheet software and verify values beginning with formula characters are escaped rather than executed.
- Repeat with an Ashram-scoped Admin and verify data outside that scope is absent.

### 17. Audit log

Admin: `/admin/audit`

After representative create/edit/publish/review/cash/RBAC actions, verify Audit contains the expected actor/action/entity trail. Sensitive values should remain redacted where the schema/workflow is designed to redact them.

### 18. Super Admin Ops

Admin: `/admin/ops`

- Verify non-Super-Admins are redirected/denied.
- Inspect current private-document retention.
- Changing retention is functional but affects real cleanup scheduling; only change it deliberately and restore the intended value afterwards.
- Manual cleanup should only purge private documents whose retention deadline has actually passed.
- Backup activation is external infrastructure configuration. The UI intentionally does not claim backups are active merely because the workflow exists; follow `docs/BACKUP_AND_RECOVERY.md` for configuration/restore testing.

## Public smoke list

After the Admin/content tests, smoke these routes on the deployed Worker:

`/`, `/ashrams`, `/events`, `/programmes`, `/seva`, `/activities`, `/parampara`, `/heritage`, `/heritage/letters`, `/heritage/gallery`, `/satsang`, `/downloads`, `/publications`, `/veda-rahasya`, `/forms`, `/contact`, `/participation`, `/membership`, `/volunteer`, `/stay`, `/donation`, `/veda-rahasya/membership`, `/veda-rahasya/services`.

For every Admin-managed public module, verify both sides of the visibility boundary: a published record appears; a draft/unpublished/archived record does not.

## Known non-functional-testing dependencies

These are not software blockers for feature testing and must not be faked in code:

- Committee confirmation of historical Guru titles/dates and leadership wording.
- Organizational sign-off for some Ashram facilities/contact content.
- Committee review of branch programme details, photos and remaining external URLs.
- Yuvak Mandal legacy records remain migration/source evidence only; there is no canonical Admin Yuvak module.
- Supabase Auth leaked-password protection is an account/project setting outside the repository and should be enabled in Supabase when available for the plan/configuration in use.
- Off-site database backup requires the external GitHub/Cloudflare secrets described in `docs/BACKUP_AND_RECOVERY.md`.

## Definition of a passing test cycle

A feature is not considered passed merely because its form submits. For each workflow verify: input validation → persisted canonical record → correct Admin visibility/RBAC → review/edit/publish action → expected public or downstream effect → audit/notification where applicable → cleanup/archive behavior.
