# Product specification

## Public website

### `/`
Homepage: invocation, hero, four principles, current priorities, YouTube, featured branches, seva, digital heritage paths.

### `/parampara`
Organization introduction, founder journey, core principles, present guidance and future heritage archive structure.

### `/ashrams`
Search/filter directory covering all branch names available in the legacy list. Only verified branches show sourced phone/address data.

### `/activities`
Gau seva, medical camps, gurukul/sanskar, annakshetra/samuh bhiksha, environment and sevak/yuvak mandal.

### `/satsang`
Official channel uploads playlist, live-player slot and future category/search taxonomy.

### `/publications`
Veda Rahasya reader and archive foundation.

### `/events`
Event system concept. Real dates are not invented. Future D1 records drive homepage, branch pages, sharing and archive automatically.

### `/contact`
Main Surat contact plus inquiry/seva form.

## Admin preview

### `/admin/login`
Explains Cloudflare Access production model and provides preview entry.

### `/admin/dashboard`
Operational overview and launch checklist.

### `/admin/inquiries`
Browser-working inquiry inbox with status changes and CSV export.

### `/admin/events`
Browser-working add/delete preview for event content.

### `/admin/ashrams`
Directory audit table showing verified vs incomplete information.

### `/admin/publications`
Migration view for Veda Rahasya PDFs and future R2 uploader.

## Backend target

The UI is deliberately database-shaped even before D1 is connected. `schema.sql` contains the first production schema.

- Cloudflare Access authenticates committee members.
- D1 stores events, branches, submissions, publication metadata, roles and audit log.
- R2 stores approved PDFs, images and posters.
- Turnstile protects forms.
- Server routes validate all input.
- UI role scopes can restrict a branch manager to a branch if needed.
