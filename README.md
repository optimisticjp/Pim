# શ્રી માધવાનંદ આશ્રમ વેબ પ્લેટફોર્મ

Gujarati-first redesign and committee portal preview for **Shree Madhavanand Ashram / Sachchidanand Madhavanand Parivar**.

## What is included

- Fully responsive public website for mobile, tablet and desktop
- Gujarati navigation, devotional/editorial design system and accessibility baseline
- Guruparampara/about experience
- Searchable directory covering 50+ legacy branch names
- Verified legacy contact details only where sourced
- YouTube uploads + live embed for the official channel
- Veda Rahasya digital-library preview using real legacy public PDFs
- Events and seva sections
- Contact/seva form with a working browser-preview inbox flow
- Committee admin preview with dashboard, inquiry status workflow, CSV export, event CRUD preview, branch audit view and publication migration view
- `schema.sql` for the planned Cloudflare D1 backend
- SEO metadata, sitemap, robots and web manifest
- Project-specific `CLAUDE.md`
- The supplied Claude web-builder skill library retained under `.claude/skills/` and `.agents/skills/`

## Codespaces preview

```bash
npm install
npm run dev
```

Then open the forwarded browser port.

Useful preview URLs:

- `/` public homepage
- `/ashrams` searchable branch directory
- `/satsang` YouTube experience
- `/publications` Veda Rahasya reader
- `/contact` working preview form
- `/admin/login` committee admin preview

Submit a public contact form and then open `/admin/inquiries` in the same browser. The entry appears using localStorage so the product workflow can be evaluated before infrastructure is connected.

## Validation

```bash
npm run typecheck
npm run lint
npm run build
```

## Cloudflare direction

As of August 2026, Cloudflare recommends **vinext on Cloudflare Workers** for new Next.js full-stack deployments. See `docs/DEPLOYMENT.md` before connecting production hosting.

## Data integrity

Do not invent phone numbers, bank details, historical claims or honorifics. See `docs/CONTENT_SOURCES.md` and obtain committee approval before production launch.
