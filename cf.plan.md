# Cloudflare Pages + Workers Deployment Plan (SoloSuccess AI)

## Goals
- Deploy the Next.js app to Cloudflare Pages with server-side code running on the Workers edge runtime.
- Standardize database access on Neon Postgres over HTTP using Drizzle (`drizzle-orm/neon-http`), removing Node `pg` usage and `runtime = 'nodejs'` flags.
- Production-ready configuration: environment variables, compatibility date, cache/headers, logging/observability, CI/CD.
- Prepare a follow-up milestone for a separate Worker using Cloudflare Workflows, callable from the app.

References:
- Workers platform overview: https://developers.cloudflare.com/workers/
- Pages platform overview and CI: https://developers.cloudflare.com/pages/
- Durable orchestration (future milestone): https://developers.cloudflare.com/workflows/

---

## Target Architecture
- Next.js (app router) on Cloudflare Pages using `@cloudflare/next-on-pages` to compile SSR/route handlers into Pages Functions (Workers runtime).
- Database: Neon Postgres via `@neondatabase/serverless` + `drizzle-orm/neon-http` (HTTP fetch-based driver compatible with Workers).
- Static assets: Served via Pages CDN; long-lived caching with immutable hashing.
- Observability: Cloudflare Pages/Workers logs and analytics; optional Logpush/Sentry integration.
- Future: Separate Worker for Workflows (long-running jobs, retries, waits) invoked via service binding or HTTP.

---

## Codebase Changes (Edge-safe and production quality)

### 1) Remove Node `pg` and Node-only runtime flags
- Replace all `import { Pool } from 'pg'` usage in API routes with calls through a single Edge-safe DB client.
- Delete or deprecate `lib/neon/server.ts` and `lib/neon/client.ts` (Node sockets). Keep/standardize on `lib/database-client.ts` (already uses `drizzle-orm/neon-http`).
- In affected API routes, remove `export const runtime = 'nodejs'` and add:
```ts
export const runtime = 'edge'
```
- Known impacted files (non-exhaustive, will verify all routes):
  - `app/api/compliance/scan/route.ts`
  - `app/api/compliance/policies/route.ts`
  - `app/api/compliance/consent/route.ts`
  - Any other routes importing `pg` or setting `runtime = 'nodejs'`.

### 2) Standardize DB access via Drizzle + Neon
- Use `lib/database-client.ts` `getDb()` everywhere. Example route handler pattern:
```ts
export const runtime = 'edge'
import { getDb } from '@/lib/database-client'

export async function GET() {
  const db = getDb()
  // ... drizzle query here
}
```
- Ensure `db/schema.ts` is the single schema source-of-truth; avoid raw SQL in route handlers except for migrations/maintenance scripts.

### 3) Make build-time safe
- Keep lazy DB initialization (already present in `getDb()`) to prevent build-time connects during `next-on-pages` compilation.
- Avoid any `fs`, `net`, or Node-only APIs in server code. Prefer Web APIs supported by Workers.

### 4) Logging and errors (production only)
- Ensure `lib/logger` emits structured logs (JSON) and never calls `console.*` directly outside the logger. Use severity fields, request IDs, and user/session IDs when available.
- Map logger output to Workers logs. Consider Logpush or Sentry later via Workers integration.

---

## Cloudflare Pages Integration with `@cloudflare/next-on-pages`

### 1) Add tooling
- Dev dependency: `@cloudflare/next-on-pages`.
- Package scripts:
```json
{
  "scripts": {
    "build:cf": "npx @cloudflare/next-on-pages@latest build",
    "preview:cf": "npx @cloudflare/next-on-pages@latest preview"
  }
}
```

### 2) Project settings in Cloudflare Pages
- Connect Git repo to Pages.
- Production branch: `main`.
- Build command: `npx @cloudflare/next-on-pages@latest build`.
- Build output directory: `.vercel/output/static`.
- Functions directory: `.vercel/output/functions`.
- Compatibility date: set at project level to a recent stable date (for example `2025-08-01`) and keep updated per Workers guidance.
- Node/PNPM/NPM versions: use defaults provided by Pages build image or set explicitly to LTS.

### 3) Environment variables and secrets
- Define server-only secrets in Pages Project → Settings → Environment variables (e.g. `DATABASE_URL`, API keys). Do not commit secrets.
- Client-exposed vars must be prefixed with `NEXT_PUBLIC_` and not contain secrets.
- Verify that `process.env.*` usages align with Next-on-Pages expectations. Keep secrets server-only.

### 4) Caching and headers
- Let Next handle static file hashing. For dynamic routes, configure cache where safe (e.g., public GET endpoints for non-personalized content). Use `Cache-Control` headers from route handlers where relevant.
- Respect user privacy and GDPR: no caching of personalized responses.

### 5) Local dev and preview
- Local: `npm run preview:cf` (uses Miniflare) to validate runtime, envs, and routing.
- Preview deployments: auto on PRs via Pages, review logs and function traces.

Docs: Workers overview, Pages, and Compatibility Dates live under Workers/Pages docs: https://developers.cloudflare.com/workers/, https://developers.cloudflare.com/pages/.

---

## Database Migrations (outside Pages build)
- Do not run DB migrations during the Pages build.
- Use a CI pipeline (e.g., GitHub Actions) to run Drizzle migrations against Neon before/alongside promotions to production. Prefer `drizzle-kit` or direct Drizzle migrator over `pg` Pool.
- Add idempotency and rollback steps; restrict DB creds used by CI per least-privilege.

---

## Observability and Security
- Logging: Structured logs via `lib/logger`. Review in Pages build logs and Workers logs; consider Logpush/Sentry later.
- Metrics: Use Cloudflare Analytics and Query Builder for Workers when needed.
- Security headers: Ensure `app/headers` or middleware sets CSP, HSTS, Referrer-Policy, X-Content-Type-Options, Permissions-Policy, COOP/COEP where applicable.
- PII handling: Avoid logging secrets or PII; redact at the logger layer.

Docs: Workers logs and analytics under Workers docs. See platform overviews: https://developers.cloudflare.com/workers/, https://developers.cloudflare.com/pages/.

---

## Future Milestone: Workflows Worker (separate Worker)
- Create a new Worker dedicated to long-running or multi-step tasks (email drips, Stripe sync, AI batch jobs).
- Implement with Workflows SDK and bind it to the Pages project via service binding or HTTP call. Example configuration pattern from docs:
```json
{
  "name": "solosuccess-workflows",
  "main": "src/index.ts",
  "compatibility_date": "2025-08-01",
  "workflows": [
    { "name": "checkout-workflow", "binding": "CHECKOUT", "class_name": "CheckoutWorkflow" }
  ]
}
```
- Call Workflows from the app using service binding or fetch with auth.
- Add observability: retries, step names, metrics, and alerts.

Docs: https://developers.cloudflare.com/workflows/

---

## Rollout and Validation
- Enable preview deployments; validate SSR/ISR, API routes, and DB connectivity in Preview.
- Run e2e tests against the Preview URL.
- Promote to production after checks pass.
- Maintain a rollback path (revert commit) and separate environment vars for Preview vs Production in Pages.

---

## Acceptance Criteria
- No API routes rely on Node `pg` or `runtime = 'nodejs'`.
- Successful `@cloudflare/next-on-pages` build on CI and Cloudflare Pages.
- Edge runtime verified in Preview; DB reads/writes succeed against Neon.
- Structured logs present; no `console.*` outside logger; no secrets in logs.
- Workflows milestone captured for a dedicated Worker (not yet executed here).

---

## To-dos

- [x] Remove nodejs runtime flags; set edge runtime in all routes (154 files updated)
- [x] Refactor all Node pg usages to Drizzle+Neon HTTP client (jose for JWT)
- [x] Standardize on lib/database-client.ts and remove lib/neon/* (deleted Node pg clients)
- [x] Add @cloudflare/next-on-pages and scripts build:cf, preview:cf (already present)
- [x] Configure Pages build, output dirs, functions, compatibility date (wrangler.toml updated)
- [x] Set security headers and safe cache-control in middleware (CSP, HSTS, X-Frame-Options, etc.)
- [x] Ensure structured logging via lib/logger; remove console.* (only 5 acceptable uses in background tasks)
- [ ] Configure DATABASE_URL and secrets in Pages project settings (see CLOUDFLARE_PAGES_CONFIG.md)
- [ ] Add CI step to run Drizzle migrations against Neon
- [ ] Run preview build and validate SSR/API/DB connectivity
- [ ] Plan separate Worker with Workflows for long-running jobs

