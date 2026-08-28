# Using 21st.dev Components in This Starter

[21st.dev](https://21st.dev) is a marketplace of React + Tailwind UI components (built in the shadcn/ui tradition). This starter is intentionally **21st.dev / shadcn-compatible**, so you can drop components in with minimal friction:

- A `cn()` helper at `@/lib/utils` (clsx + tailwind-merge) — the exact import most components expect.
- CSS-variable **design tokens** (`background`, `foreground`, `primary`, `muted`, `border`, `ring`, `card`, …) in `src/app/globals.css`, matching shadcn's token names.
- Tailwind v4 with class-based dark mode (`.dark`).
- Components organized under `src/components/ui`, `src/components/layout`, `src/components/sections`.

This guide is the repeatable workflow for bringing an external component in **cleanly** — keeping it fast, accessible, on-brand, and mobile-safe.

> **Golden rule:** paste nothing you haven't read. Treat every external component as a draft to adapt, not a black box to trust.

---

## 1. Choose a component

1. Browse [21st.dev](https://21st.dev) and find a component that matches the *structure* you need (navbar, hero, pricing, testimonial grid, etc.). Prioritize structure over decoration — you will re-skin it with this project's tokens anyway.
2. Prefer components that are:
   - **Mostly static** (few or no client-side effects).
   - **Token-friendly** — already using semantic classes like `bg-background`, `text-muted-foreground` rather than hard-coded `bg-white`, `text-gray-500`.
   - **Light on dependencies** — no animation/canvas/3D library unless the effect is core to the design.
3. Be skeptical of components that lead with heavy motion, parallax, autoplay video, cursor followers, or WebGL. They demo well and ship poorly. If the *content* is what you need, keep the markup and drop the spectacle (see §5).

---

## 2. Paste the command or source into Claude Code Web

You will usually have one of two things: a **CLI command** or a **source snippet**.

### Option A — the shadcn/21st CLI command

21st.dev components often come with a command like:

```bash
npx shadcn@latest add "https://21st.dev/r/<author>/<component>"
```

In Claude Code Web, paste the command and ask Claude to run it. Then **ask Claude to summarize what it wrote**: which files were created under `src/components/ui`, and which dependencies (if any) were added to `package.json`. The CLI writes files to disk — always review the diff before continuing.

> If a component relies on `class-variance-authority` (cva), the shadcn CLI will add it. This starter ships without cva to keep dependencies minimal; installing it when a pasted component needs it is fine — just do it deliberately (see §3).

### Option B — paste the raw source

If you have the JSX/TSX source, paste it into the chat and tell Claude where it should live, e.g. *"Add this as `src/components/sections/feature-carousel.tsx` and wire it into the homepage."* Then walk through §3–§6 before using it.

Either way, **read the component top to bottom** before it ships. Look for: imports, `"use client"`, external network calls, inline styles, and hard-coded colors.

---

## 3. Inspect dependencies

Before accepting new packages, find out exactly what the component pulls in.

1. **Scan the imports** at the top of the file. Anything not from `react`, `next/*`, `@/*`, `lucide-react`, `motion/react`, `clsx`, or `tailwind-merge` is a **new dependency** to evaluate.
2. **Ask before installing.** For each new package, decide:
   - Is it essential to the component's *function*, or only its *decoration*?
   - Is it actively maintained and reasonably sized? Check on [npm](https://www.npmjs.com) / [Bundlephobia](https://bundlephobia.com).
   - Can a lighter primitive already in this repo do the job? (e.g. native `<details>` instead of an accordion library; CSS transition instead of an animation lib.)
3. **Watch for duplicate animation libraries.** This starter standardizes on **`motion`** (imported as `motion/react`). If a component imports `framer-motion`, rewrite the imports to `motion/react` (the API is the same) rather than installing a second animation runtime.
4. **Install intentionally**, one line, and note it:

   ```bash
   npm install <package>
   ```

5. Re-run `npm run build` after adding anything. A dependency that breaks the build or balloons the bundle is a dependency to remove.

---

## 4. Adapt it to the project design tokens

The goal: the component should look like it was always part of this project, and should respond to light/dark mode automatically.

Replace hard-coded colors with **semantic token utilities**:

| Replace hard-coded… | With token utility |
|---|---|
| `bg-white`, `bg-black`, `bg-gray-950` | `bg-background`, `bg-card` |
| `text-black`, `text-gray-900` | `text-foreground` |
| `text-gray-500`, `text-gray-400` | `text-muted-foreground` |
| `bg-blue-600` (brand action) | `bg-primary` + `text-primary-foreground` |
| `border-gray-200`, `border-gray-800` | `border-border` |
| focus rings `ring-blue-500` | `ring-ring` |
| `rounded-[10px]` | `rounded-lg` (driven by `--radius`) |

Then:

- **Delete `dark:` overrides that duplicate tokens.** With semantic tokens, `bg-background` is already correct in both themes — a paired `dark:bg-neutral-900` is redundant and can fight the tokens. Keep `dark:` only for genuinely theme-specific tweaks.
- **Reuse this repo's primitives** where they fit: wrap content in `<Container>`/`<Section>`, use `<Button>` / `buttonVariants()`, `<Heading>`, and `<Card>` so spacing and typography stay consistent.
- **Re-theming is centralized.** You never edit tokens inside a component — change brand colors once in `src/app/globals.css` and every adapted component follows.

Ask Claude: *"Rewrite this component to use our design tokens from globals.css, remove redundant `dark:` classes, and use our Container/Section/Button primitives where appropriate."*

---

## 5. Remove unnecessary effects

Most performance and accessibility problems in pasted components come from effects you didn't need. Strip aggressively:

- **Downgrade decoration to CSS.** A hover scale or color change does not need JavaScript — use a Tailwind `transition-colors`/`transition-transform` class. Reserve `motion/react` for genuinely expressive, one-off moments, and keep it isolated to a small leaf Client Component (see `src/components/ui/fade-in.tsx`).
- **Delete what this starter deliberately avoids:** Lenis/smooth-scroll hijacking, heavy parallax, mouse-follow/spotlight effects, autoplay video, animated gradient canvases, and any external tracking/analytics snippets.
- **Cut `"use client"` when you can.** If, after removing effects, a component has no state, effects, or event handlers, delete the `"use client"` directive so it renders as a Server Component. Push interactivity down into the smallest possible child.
- **Replace stock imagery.** Swap `<img src="https://images.unsplash.com/…">` and remote avatars for neutral placeholders (text initials, `lucide-react` icons, or your own `/public` assets). No external image hosts.
- **Always gate motion on preference.** Any remaining animation must respect `prefers-reduced-motion`: use `useReducedMotion()` from `motion/react` in JS animations, or `motion-reduce:transition-none` / `motion-reduce:animate-none` on CSS ones. The global rule in `globals.css` is a safety net, not a substitute.

Ask Claude: *"Strip this to the essentials — remove parallax/smooth-scroll/autoplay, convert hover effects to CSS, keep it a Server Component if possible, and make any animation respect reduced motion."*

---

## 6. Verify mobile behavior, accessibility, and performance

Do not consider a pasted component "done" until it passes these checks.

### Mobile (the most common failure)
- Test at **360px and 390px** widths. There must be **no horizontal scroll**.
- Common overflow causes: fixed pixel widths, `w-screen`, `100vw` inside padded containers, `whitespace-nowrap` on long text, oversized headings. Prefer `w-full`, `max-w-*`, fluid `text-*` scales, and add `min-w-0` on flex children that hold text.
- Tap targets should be at least ~40px; stack multi-column layouts to a single column on small screens.

### Accessibility
- **Keyboard:** every interactive element must be reachable by Tab and operable by Enter/Space, with a visible focus ring (`focus-visible:ring-2 ring-ring`).
- **Semantics:** real `<button>`/`<a>` elements, correct heading order (one `<h1>` per page), `alt` text on meaningful images, `aria-label` on icon-only buttons.
- **Overlays** (menus, dialogs): close on `Escape`, lock background scroll, and mark hidden content `inert` / `aria-hidden` so it leaves the tab order — see `src/components/layout/mobile-menu.tsx`.
- **Reduced motion:** toggle "Reduce motion" in your OS and confirm animations quiet down.

### Performance
- Run `npm run build` and check the route sizes. A large jump in First Load JS after adding a component means it dragged in a heavy dependency — investigate.
- Keep Server Components the default; confirm you didn't turn a whole page into a Client Component to satisfy one interactive widget.
- Confirm no new render-blocking external requests (fonts, scripts, images) were introduced.

### Quick verification loop in Claude Code Web

```
1. npm run lint     # style/correctness
2. npm run build    # types + bundle sizes
3. Ask Claude to review the component at 360px for overflow and to confirm
   keyboard focus + reduced-motion behavior.
```

Only after all three are green is the component ready to keep.

---

## Reference: what this starter provides

- **Tokens & theme:** `src/app/globals.css`
- **`cn()` helper:** `src/lib/utils.ts`
- **Motion presets + reduced-motion:** `src/lib/motion.ts`, `src/lib/use-reduced-motion.ts`, `src/components/ui/fade-in.tsx`
- **Primitives:** `src/components/ui/` (button, heading, container, section, card, accordion)
- **Layout:** `src/components/layout/` (navbar, mobile-menu, footer)
- **Section shells:** `src/components/sections/` (hero, card-grid, faq, pricing-table, testimonials)

Match these patterns and pasted components will feel native.
