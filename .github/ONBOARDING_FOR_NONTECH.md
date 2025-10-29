# SoloSuccess AI — Onboarding for non-technical founders

This guide is written for you (no prior coding experience required). It explains what the repo contains, the key decisions you must make, and the minimal steps to run the app locally so you can review and launch it.

1) What this app is (short)
- A Next.js (v15) SaaS web app with 8 AI "agents" (Roxy, Blaze, Echo, Lumi, Vex, Lexi, Nova, Glitch).
- It stores users and app data in PostgreSQL (Drizzle ORM schema in `db/schema.ts`).
- AI calls are made through a worker/service-binding pattern (chat route expects an `OPENAI_WORKER` binding).
- Pricing tiers and feature gates are already modeled in the codebase.

2) Your main decisions (high level)
- Which AI provider(s) do you want to use in production? (OpenAI, Anthropic, Google)
- Which database host will you use in production? (Neon, Supabase, AWS RDS, etc.)
- Stripe keys for payments and the pricing tiers configuration.
- Real avatars & images: place them under `public/agents/` if you want them visible in the app.

3) Minimum environment setup to run the app locally (PowerShell)
- Copy the example env and fill values (I will tell you which vars are essential):
```powershell
cp .env.example .env.local
# (Open .env.local in a text editor and add your real values)
```
- Install dependencies (Windows PowerShell):
```powershell
npm ci --legacy-peer-deps
```
- Start the dev server:
```powershell
npm run dev
```
- Open your browser at http://localhost:3000

4) Essential env vars you must provide (minimum)
- DATABASE_URL — Postgres connection string
- OPENAI_API_KEY (or other AI provider keys if using Anthropic/Google)
- NEXT_PUBLIC_STACK_PROJECT_ID (project identifier used in the UI)
- JWT_SECRET — authentication secret used for session tokens
- STRIPE keys when enabling payments (STRIPE_SECRET, NEXT_PUBLIC_STRIPE_PUBLISHABLE)

5) Where agents are defined (so you can point things out or edit)
- System prompts & model selection: `lib/ai-config.ts`
- Personality & runtime prompt builder: `lib/ai-personality-system.ts`
- Chat endpoint that routes user messages to the AI worker: `app/api/chat/route.ts`
- Competitive intelligence & context: `lib/competitive-intelligence-context.ts`

6) How an agent message flows (plain English)
- User hits the chat UI → it posts to `app/api/chat/route.ts` → route checks permissions, feature gates and user tier → the route fetches agent prompts + competitive context → it forwards the request to an AI worker/service binding → the worker calls the chosen AI provider and streams the response back to the client.

7) How to review what's already written vs what is still needed
- The agents (prompts and personalities) are present as text in the repo (not placeholders). That means the "voice" and system prompt content exist.
- Runtime wiring requires service bindings and correct env vars. If you test locally without `OPENAI_WORKER`, the chat route will fail; we can add a safe dev fallback that calls the OpenAI SDK directly if you'd like.
- The database schema exists, but running it locally requires a running Postgres instance and correct `DATABASE_URL`.

8) What I will NOT do (your directive)
- No mock/demo/fake implementations will be added. If a feature is implemented, it will be real and production-grade or I will provide a clear plan for completion.
- I will not delete or silently remove code because of errors — I will fix issues properly.

9) Typical quick checks I can run for you (pick one)
- Start dev server and confirm main pages render.
- Check `app/api/chat/route.ts` for runtime errors and fix obvious bugs safely.
- Create a short checklist for adding new agents and a PR checklist for contributors (I will add both if you want).

10) How we will proceed (recommended next step)
- I will create two short, practical docs now: a 1-page "How to add an agent" checklist and a PR checklist. These will make future agent additions safe and production-ready. After that I will run a short audit and report gaps.

If anything above is confusing, tell me which line or phrase you don't understand and I will rewrite it more simply. If you're ready, I will add the agent checklist and PR checklist files now (I will not change application code without your explicit permission).