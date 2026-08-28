# Browser-only development and Cloudflare deployment

## Codespaces preview

1. Create a GitHub repository and upload/extract this project at the repository root.
2. Open **Code → Codespaces → Create codespace on main**.
3. In the browser terminal:

```bash
npm install
npm run dev
```

Open the forwarded port shown by Codespaces.

## Quality check

```bash
npm run typecheck
npm run lint
npm run build
```

## Cloudflare, current recommended direction (August 2026)

Cloudflare currently recommends **vinext on Cloudflare Workers** for new Next.js applications. Keep the ordinary Next.js app intact while checking compatibility.

In Codespaces:

```bash
npx vinext check
npx vinext init
```

Choose Cloudflare Workers when prompted. The initializer adds the Vite/vinext and Wrangler configuration needed for the Worker runtime. Test the generated vinext dev/build scripts before changing production DNS.

Use Cloudflare's Git integration/Workers Builds for the repository so merges trigger deployments.

## Production platform plan

- Website + APIs: Cloudflare Workers
- Structured content: D1
- Images/PDFs: R2
- Admin authentication: Cloudflare Access
- Public form anti-spam: Turnstile
- Videos: YouTube, embedded using privacy-enhanced mode where practical

`schema.sql` contains the intended D1 schema. The initial UI uses typed seed content and browser-local preview storage so design and committee workflows can be approved before infrastructure is connected.
