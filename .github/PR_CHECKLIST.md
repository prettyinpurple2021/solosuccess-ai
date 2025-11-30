# PR Checklist — SoloSuccess AI

Copy this into every PR description and mark each box before requesting review.

## Local validation (required)
- [ ] Run `npm ci --legacy-peer-deps` and commit no lockfile changes unrelated to the feature.
- [ ] Run `npm test` locally and fix failing tests. Note: tests can take a while in CI — expect ~2 mins.
- [ ] Run `npm run build` (or `npm run build` in CI) and verify build completes.

## DB changes (if applicable)
- [ ] If you modified `db/schema.ts`, run `npm run db:generate` and include generated migrations.
- [ ] Do not hand-edit migration files; use `drizzle-kit` output.

## AI agents (if applicable)
- [ ] Updated `lib/ai-config.ts` with a real model and polished `systemPrompt` (no placeholders).
- [ ] Updated `lib/ai-personality-system.ts` with a matching personality object.
- [ ] Chat route (`app/api/chat/route.ts`) updated for feature-gating and `trackAgentAccess` if the agent is gated.
- [ ] Added unit and integration tests for the agent.

## Assets & UI
- [ ] Avatars and assets added under `public/agents/<agentId>/` (web-optimized images and `meta.json`).
- [ ] UI changes include accessibility checks and are responsive.

## Security & secrets
- [ ] No secrets or API keys committed.
- [ ] If new env variables are required, update `.env.example` (do not commit real keys).

## Docs & tests
- [ ] Updated `ONBOARDING_FOR_NONTECH.md` or other relevant docs for non-technical reviewers.
- [ ] Added or updated tests that cover new functionality (unit + simple integration).

## Final checks
- [ ] PR description explains why the change is needed and links to related issues.
- [ ] Add screenshots or a short demo GIF for UI changes.
- [ ] Assign reviewers and request review only after the above checks pass.

If any of the above cannot be completed (for very-low-risk cosmetic PRs), explain why in the PR description and request maintainers' guidance.