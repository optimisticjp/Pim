# Claude Code — Shree Madhavanand Ashram

This repository is the working source for the Gujarati-first digital home of **Shree Madhavanand Ashram / Sachchidanand Madhavanand Parivar**. Build on this application. Do not scaffold a second application.

## Product principle

> આધુનિકતા આધ્યાત્મિક ગરિમાને ઢાંકે નહીં. દરેક પાનું શાંતિ, પરંપરા, જ્ઞાન અને સેવા અનુભવાવે.

The public site must feel like entering a calm ashram courtyard, not a commercial temple template. Gujarati is the primary language. English support can be added later without restructuring the data model.

## Audience

1. Gujarati-speaking devotees, including older mobile users.
2. Families arriving from WhatsApp links to find events, satsang, locations and contact details.
3. Youth and sevaks who want to participate.
4. Committee members managing information in the admin portal.
5. Overseas devotees who may later need English.

## Stack

- Next.js 16 App Router, TypeScript strict mode
- Tailwind CSS v4 + project CSS design tokens
- Lucide React icons
- Motion only for restrained, purposeful animation
- Public content currently runs from typed seed data
- Preview admin currently uses browser localStorage so workflows can be tested before the real database is connected
- Production target: Cloudflare Workers. As of August 2026 Cloudflare recommends the vinext path for new Next.js Workers deployments.
- Planned backend: Cloudflare D1 for structured data, R2 for media/PDFs, Cloudflare Access for committee authentication, Turnstile for public forms

## Non-negotiable design rules

- Gujarati-first interface and content.
- Use the project palette and token system. Do not introduce random colors.
- Do not make the site a wall of saffron, gradients, glowing Om graphics, autoplay bhajans or bouncing religious icons.
- Real approved photographs may be added later. Do not invent or substitute saint portraits.
- Use generous spacing, strong typography, subtle temple-architecture geometry and editorial hierarchy.
- Buttons say exactly what happens: `સત્સંગ જુઓ`, `દિશા મેળવો`, `ફોર્મ મોકલો`.
- Minimum practical body size: 16px; favor 17–18px for long Gujarati reading.
- Touch targets at least 44px high.
- Mobile must work cleanly at 360px and 390px. No horizontal overflow.
- Tablet layouts must be intentionally designed, not merely stretched mobile.
- Respect `prefers-reduced-motion`.
- WCAG 2.1 AA baseline: semantic headings, visible focus, keyboard navigation, accessible labels.

## Content integrity

Religious and historical content is sensitive institutional material.

- Never invent history, titles, lineage, dates, quotations, bank details, phone numbers or addresses.
- Keep honorifics exactly as approved by the committee.
- Source notes live in `docs/CONTENT_SOURCES.md`.
- Data marked `verified: false` may be displayed as directory coverage but should not receive invented contact details.
- Donation/bank details must remain unpublished until committee-approved values are supplied.
- Do not copy executable code, tracking scripts or unknown HTML from the legacy site.

## Data architecture

Public pages consume typed records from `src/lib/site-data.ts`. Components should depend on those types rather than hard-coded repeated content. When D1 is connected, replace the repository layer without redesigning the pages.

Expected entities:

- ashrams
- saints / guru-parampara profiles
- events
- publications and Veda Rahasya issues
- activities / seva categories
- videos
- galleries / media
- announcements
- form submissions
- committee roles
- audit log
- settings

## Admin preview and production security

The current admin is an intentionally visible **preview UX** using browser storage. It is not production authentication.

Before production committee use:

1. Put `/admin/*` behind Cloudflare Access.
2. Add committee role records in D1.
3. Connect CRUD screens to server-side D1 routes.
4. Keep R2 uploads server-controlled and validate MIME type, extension and file size.
5. Add Turnstile to public forms.
6. Log create/update/archive actions to `audit_log`.
7. Do not expose secrets through `NEXT_PUBLIC_*` variables.

## Claude skills to use selectively

The attached template's skill library is retained under `.claude/skills/`. Useful skills for this project include:

- `/frontend-design`
- `/ui-ux-pro-max`
- `/design-system`
- `/site-architecture`
- `/copywriting` and `/humanizer`
- `/owasp-security`
- `/seo`, `/seo-schema`, `/seo-sitemap`, `/seo-images`
- `/accessibility` if available
- `/shadcn` when a robust interactive primitive is genuinely useful

Do not activate unrelated skills just because they exist.

## Quality gates before merge

Run:

```bash
npm run typecheck
npm run lint
npm run build
```

Also manually inspect:

- 360px mobile
- 390px mobile
- 768px tablet
- 1024px tablet/desktop crossover
- 1440px desktop
- keyboard-only navigation
- reduced-motion behavior
- Gujarati wrapping in headings, cards and buttons

## Deployment

See `docs/DEPLOYMENT.md`. Do not use the old `@cloudflare/next-on-pages` instructions for a new full-stack deployment. Keep normal `next dev` working in Codespaces while vinext compatibility is introduced for Cloudflare Workers.
