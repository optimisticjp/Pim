# Prompt for Claude Code Web after the first preview

Use this after you have opened the repository in Claude Code Web/Codespaces and viewed the current UI.

```text
You are the senior product designer and full-stack engineer responsible for polishing this existing Shree Madhavanand Ashram repository. Do not scaffold a new app. Read CLAUDE.md, docs/DESIGN_SYSTEM.md, docs/PRODUCT_SPEC.md, docs/CONTENT_SOURCES.md and the existing code first. Use the installed skills selectively, especially frontend-design, ui-ux-pro-max, design-system, site-architecture, copywriting/humanizer, accessibility, owasp-security and SEO skills.

Goal: improve the existing product without losing its Gujarati-first “quiet ashram editorial” identity. Preserve the Temple Maroon / Ashram Sand / restrained Kesariya / Sacred Green token system unless there is a clear accessibility reason to adjust a value.

Work in this order:
1. Run the app and inspect every public page at 360, 390, 768, 1024 and 1440 widths.
2. Fix all wrapping, spacing, navigation, focus, contrast and overflow issues.
3. Critique the visual hierarchy. Improve typography, rhythm, card composition and section transitions where they are weaker than the homepage direction. Do not make the site louder or more decorative.
4. Preserve the Madhav Rekha signature and temple-arch visual grammar. If adding motion, keep it restrained and respect reduced motion.
5. Audit all Gujarati copy for natural, dignified Gujarati. Do not invent religious history, quotations, honorifics, addresses, bank details or dates. Treat docs/CONTENT_SOURCES.md as the factual boundary unless I provide new committee-approved information.
6. Inspect the official YouTube integration. Keep YouTube as video host. Improve lightweight loading and live-state handling without loading many iframes on initial page render.
7. Improve the ashram directory UX for older mobile users: search, regional filters, tap-to-call, directions and empty states.
8. Improve the Veda Rahasya archive UX and prepare the data model for R2 originals without breaking current preview PDFs.
9. Review admin preview UX. Keep the demo workflow functional, but do not present it as production security.
10. Run npm run typecheck, npm run lint and npm run build. Fix every error.
11. Run a security review of route handlers and document the exact steps still required before committee production use.
12. Run vinext compatibility checks and configure the current Cloudflare Workers deployment path only after the ordinary Next.js build is clean.

Return a concise change log, remaining committee-content questions, and exact deployment steps. Make actual code changes, not just recommendations.
```
