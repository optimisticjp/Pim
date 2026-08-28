# Claude Code — Web Builder Template

This repo is a reusable starter template for building websites, web apps, landing pages, dashboards, e-commerce stores, and marketing tools with Claude Code. It ships as a **Next.js website starter** (App Router, TypeScript, Tailwind CSS v4, Motion) and comes pre-loaded with 322 skills — 311 from 10 curated third-party sources, the 10-skill official GitHub Spec Kit workflow, and the official shadcn/ui skill — and a project constitution that governs how work is done.

---

## What This Repo Is

Use this as a foundation whenever a project involves:

- Static or dynamic websites
- Landing pages and marketing sites
- Web apps and dashboards
- E-commerce stores
- SEO-driven content sites
- Conversion-optimised tools or calculators
- Any frontend or full-stack web project

Clone or fork this template, then start building. The skills in `.claude/skills/` are available to all Claude Code sessions run inside this repo.

---

## The Next.js Starter

The repo is a working Next.js application. Build on top of it — do not scaffold a second app.

### Stack

| Layer | Choice |
|---|---|
| Framework | **Next.js 16** — App Router, `src/` directory |
| Language | **TypeScript** (strict) |
| Styling | **Tailwind CSS v4** with CSS-variable design tokens |
| Animation | **Motion** (`motion/react`) — the default runtime; add GSAP, Lenis, Three.js, etc. when the design calls for it |
| Icons | **lucide-react** |
| Utilities | **clsx** + **tailwind-merge** via `cn()` (`@/lib/utils`) |
| Package manager | **npm** · import alias `@/*` → `src/*` |

### Commands

```bash
npm install       # dependencies
npm run dev       # dev server (only when the user asks to run it)
npm run build     # production build
npm run lint      # ESLint
npm run typecheck # tsc --noEmit
```

### Layout

```
src/app/         globals.css (tokens + light/dark + reduced-motion), layout.tsx, page.tsx
src/components/  ui/ (primitives) · layout/ (navbar, mobile-menu, footer) · sections/ (hero, card-grid, faq, pricing-table, testimonials)
src/lib/         utils.ts (cn) · motion.ts (presets) · use-reduced-motion.ts
```

### Non-negotiable outcomes

Every build must deliver these, whatever tools or techniques get it there. They are validation requirements, not creative limits:

- **Excellent mobile behavior** — validated at 360px and 390px, with no horizontal overflow.
- **Fast loading** — measured (Core Web Vitals) and optimized. Performance is a target to hit, not a reason to avoid capable tools.
- **Accessibility** — WCAG 2.1 AA baseline: keyboard operable, visible focus, correct semantics, and `prefers-reduced-motion` support.
- **Security** — validate inputs and protect endpoints and form handlers; run `/owasp-security` on new server surfaces.
- **Coherent design** — a deliberate, consistent visual system (tokens, spacing, type), not ad-hoc styling.
- **Successful build, lint, and relevant tests** — `npm run build`, `npm run lint`, `npm run typecheck`, and any tests covering the change all pass.

How you meet these — which components, libraries, or techniques you reach for — is a judgement call guided by the project specification and visual direction.

### Working preferences (capability-first)

Sensible defaults that keep projects lean, to depart from freely whenever the project materially benefits:

- **Prefer the smallest suitable solution** — reach for the lightest approach that fully meets the spec, and use any component, dependency, library, or technique when it materially improves the project.
- **Server Components are preferred where suitable**, but Client Components are fully allowed wherever interaction, animation, or browser APIs require them. Push `"use client"` toward the smallest sensible boundary as a preference, not a hard rule.
- **Use any capable tool when the spec and visual direction justify it** — shadcn/ui, 21st.dev, Motion, GSAP, Lenis, Three.js, WebGL, Radix, Base UI, and others are all fair game. Prefer one primary animation runtime per project for consistency, but add more when the design calls for it.
- **Token-driven theming** — components read semantic tokens (`bg-background`, `text-muted-foreground`, `bg-primary`, `border-border`, …) from `src/app/globals.css`; re-theme there so the design stays coherent.
- **Measure, then optimize** — reach performance targets by measuring and tuning (bundle size, CWV, self-hosted fonts), not by banning creative tools up front.
- **Imported components may be substantially modified, combined, or extended**, and you may create custom components whenever registry components are not suitable.
- **Use installed skills selectively, at full capability** — bring in the skills a task genuinely needs; don't activate unrelated skills merely to increase tool usage.

### 21st.dev / shadcn workflow

The component structure and `cn()` helper are compatible with [21st.dev](https://21st.dev) and shadcn/ui. **`21ST_DEV_GUIDE.md`** walks the workflow: choose a component, review its dependencies, adapt it to the design tokens, keep the effects that serve the design, and validate mobile/accessibility/performance before shipping. Modify, combine, or extend imported components freely — they are a starting point, not a fixed artifact. When a project standardizes on Motion, aligning imports on `motion/react` keeps things consistent; additional animation or interaction libraries (GSAP, Lenis, Three.js, …) are welcome when the visual direction calls for them.

### shadcn/ui skill

The **official shadcn skill is fully installed** (`.claude/skills/shadcn/`), and the project is initialized with a `components.json` (Tailwind v4, `src/`, `@/*` aliases, CSS variables, `baseColor: neutral`, Lucide icons, components in `src/components/ui`, utility at `src/lib/utils.ts`). The skill and configuration ship with the template; **individual UI components are installed per project** — pull the ones each project needs, when it needs them.

- **Add components as the project needs them.** Use the CLI — `npx shadcn@latest add <component>` — to pull the primitives a feature calls for. Add as few or as many as the project genuinely uses; there is no cap.
- **Check the registry before hand-writing complex primitives.** For a dialog, popover, combobox, command menu, or similar, searching the registry (`npx shadcn@latest search <query>`) and previewing (`--dry-run` / `--diff` / `--view`) usually beats starting from scratch — and writing a custom component is the right move when the registry version isn't suitable.
- **Adapt imported components to the project design tokens.** shadcn components read the same semantic tokens defined in `src/app/globals.css`; restyle, extend, or combine them so the design stays coherent, and re-theme in `globals.css`.
- **Use Lucide as the default icon system** (`lucide-react`, matching `components.json`), and bring in other icon sets when a design needs them.
- **The custom `button`, `accordion`, `card`, and layout components are the starting point.** Swap in shadcn versions when they improve accessibility or composition; keep or extend the custom ones otherwise. Preview a diff before overwriting so the change is deliberate.

---

## Creative Freedom

This template is a launchpad, not a straitjacket. Its neutral defaults are a starting point — the ceiling is set by the project, not by this document.

- **Build boldly when the direction calls for it.** Claude is encouraged to create vibrant, experimental, and highly animated interfaces.
- **Advanced techniques are on the table.** Advanced motion, scroll choreography, SVG animation, masks, gradients, glass effects, shaders, 3D, WebGL, and custom interactions are all fair game when they serve the design.
- **Adapt complexity — don't delete it.** For mobile and reduced-motion users, scale the experience down gracefully (simpler motion, lighter effects, static fallbacks) rather than stripping the creative direction entirely.
- **The aesthetic and specification lead.** The selected visual direction and project spec determine the implementation; match them.
- **Performance, accessibility, and mobile quality are validation requirements, not reasons to make every project visually minimal.** Hit the bar — don't lower the ambition to hit it.
- **Reach for whatever produces the best result** — any installed skill, package, registry, or compatible external component source needed to get there.

---

## How to Use the Installed Skills

322 skills are installed under `.claude/skills/`. **Do not activate all skills blindly.** Read the task first, then invoke only the skills that are directly relevant.

To invoke a skill, type `/skill-name` in the Claude Code chat. For example:

- `/frontend-design` — layout, components, responsive patterns
- `/ui-ux-pro-max` — full UI/UX orchestration
- `/seo` — SEO strategy and on-page optimisation
- `/humanizer` — make copy sound natural and human
- `/owasp-security` — security review against OWASP Top 10
- `/write-tests` — generate a test suite
- `/create-pr` — structured pull request creation

Run `/status` or `/analyse` when you need a broad overview before diving in.

---

## Spec Kit Workflow

The official [GitHub Spec Kit](https://github.com/github/spec-kit) is installed as 10 `speckit-*` skills. **Spec Kit is the default workflow** for:

- new production websites
- new web apps
- significant features
- any work with meaningful ambiguity

### Default sequence

Run the stages in order, each via its `/speckit-<stage>` skill:

```
constitution → specify → clarify → plan → checklist → tasks → analyze → implement → converge
```

| Stage | Skill | Purpose |
|---|---|---|
| constitution | `/speckit-constitution` | Establish or amend the governing project principles |
| specify | `/speckit-specify` | Capture the feature spec: outcome, users, requirements, success criteria |
| clarify | `/speckit-clarify` | Resolve ambiguity with targeted questions before planning |
| plan | `/speckit-plan` | Produce the implementation plan and design artifacts |
| checklist | `/speckit-checklist` | Validate requirement completeness, clarity, and consistency |
| tasks | `/speckit-tasks` | Generate dependency-ordered, actionable tasks |
| analyze | `/speckit-analyze` | Cross-artifact consistency check across spec, plan, and tasks |
| implement | `/speckit-implement` | Execute the tasks |
| converge | `/speckit-converge` | Assess the build against spec/plan and append any remaining work |

### Rules

- **Very small, low-risk changes may use a leaner workflow** when the requirement is already clear — a full spec-and-plan cycle is not required for a one-line copy fix.
- **Implementation must not begin before the spec and plan are sufficiently clear.** Never run `/speckit-implement` on an ambiguous or unplanned feature.
- **Select supporting skills during the relevant Spec Kit stages, not all at once.** For example: design, frontend, and SEO skills during `specify`/`plan`; security, TDD, and testing skills during `plan`/`implement`; context, research, and memory skills throughout. Do not activate all 322 skills blindly.
- **The constitution at `.specify/memory/constitution.md` is the governing source of project principles.** Every plan must pass its Constitution Check; documented exceptions go in the plan's Complexity Tracking.

---

## Default Checklist for Any Web Task

For any website, web app, landing page, dashboard, e-commerce build, SEO project, or marketing task, consider each of the following dimensions and apply relevant skills:

| Dimension | Skills to consider |
|---|---|
| UI/UX design | `ui-ux-pro-max`, `design`, `design-system`, `banner-design`, `slides` |
| Frontend implementation | `frontend-design`, `ui-styling` |
| Copy and tone | `humanizer`, `copywriting`, `copy-editing` |
| SEO | `seo`, `seo-technical`, `seo-content`, `seo-page`, `seo-schema`, `seo-sitemap`, `seo-audit` |
| Marketing and conversion | `cro`, `marketing-plan`, `product-marketing`, `landing page` flow via `content-strategy` |
| Accessibility | Apply WCAG 2.1 AA as a baseline; reference `ui-ux-pro-max` |
| Mobile responsiveness | Validate layouts at 375px, 768px, 1280px breakpoints minimum |
| Performance | Minimise render-blocking assets; target Core Web Vitals green |
| Security | `owasp-security` before final delivery |
| Testing | `test-driven-development`, `write-tests`, `test-coverage` |
| Context and planning | `make-plan`, `context-engineering`, `plan-task`, `brainstorm` |

You do not need to apply every row to every task. Use judgement. A small copy edit does not need a full security review. A public-facing checkout flow does.

---

## Working Style

### Ask essential questions only
Before starting a large task, ask only the questions you cannot proceed without. Avoid questionnaires. One to three clarifying questions maximum, then begin.

### Plan before large edits
For any change that touches more than two files or introduces a new feature, produce a brief implementation plan first (file list, approach, order of operations) and confirm before editing.

### Test-driven development when practical
For logic-heavy code, write failing tests first, then implement. Use `/test-driven-development` or `/write-tests` to scaffold. This is especially important for form validation, API integrations, and data transforms.

### Security and quality checks before delivery
Before marking any feature complete, run `/owasp-security` on new endpoints or form handlers, and `/review-local-changes` or `/code-review` on the diff. Fix findings before handoff.

### Handoff notes after each session
At the end of each working session, produce a short summary of: what was built, what remains, known issues, and any environment or configuration steps needed to continue. Keep it in the conversation or write it to a `SESSION_NOTES.md` if the project warrants it.

---

## Skill Caveats

Some skills have external dependencies that are not bundled in this template:

- **TDD Guard** (`/tdd-guard`): Requires per-project npm install (`npm install -D tdd-guard-vitest` or equivalent). The skill guides setup but cannot run without the package.
- **Claude Mem advanced tools** (`/mem-search`, `/knowledge-agent`, `/smart-explore`, `/pathfinder`): Require a running Docker container and MCP server. See [github.com/thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) for setup.
- **Scientific and data skills**: Skills such as `scanpy`, `rdkit`, `pytorch-lightning`, `qiskit`, and others are only relevant for data-heavy or scientific projects. Do not invoke them for standard web builds.
- **API-dependent SEO skills** (`seo-dataforseo`, `seo-google`): Require environment variables for external API keys. Configure per-project before use.

---

## What Not To Do

- Do not modify files inside `.claude/skills/`. Those are upstream skill definitions and should remain untouched.
- Do not create website or project files unless explicitly asked to begin building.
- Do not invoke skills speculatively or as a way to pad responses. Only invoke a skill when it meaningfully contributes to the current task.

---

## Installed Skills Reference

322 skills are installed from 10 curated third-party sources, the official GitHub Spec Kit, and the official shadcn/ui skill. Full details are in `INSTALL_REPORT.md`.

| Source | Count | Key skills |
|---|---|---|
| UI/UX Pro Max | 7 | `ui-ux-pro-max`, `design`, `design-system`, `brand`, `slides`, `ui-styling`, `banner-design` |
| Blader Humanizer | 1 | `humanizer` |
| Frontend Design (Anthropic) | 1 | `frontend-design` |
| Claude SEO | 25 | `seo`, `seo-audit`, `seo-technical`, `seo-content`, `seo-schema`, `seo-sitemap`, + 19 more |
| Marketing Skills | 44 | `cro`, `copywriting`, `marketing-plan`, `product-marketing`, `social`, `email`, + 38 more |
| OWASP Security | 1 | `owasp-security` |
| TDD Guard | 1 | `tdd-guard` (requires npm setup) |
| Context Engineering Kit | 67 | `context-engineering`, `make-plan`, `brainstorm`, `create-pr`, `commit`, `write-tests`, + 61 more |
| Claude Scientific Skills | 147 | Scientific computing, bioinformatics, ML, quantum, data analysis (use only when relevant) |
| Claude Mem | 17 | `babysit`, `timeline-report`, `make-plan`, `version-bump`, `wowerpoint`, + memory tools |
| GitHub Spec Kit | 10 | `speckit-constitution`, `speckit-specify`, `speckit-clarify`, `speckit-plan`, `speckit-tasks`, `speckit-implement`, + 4 more |
