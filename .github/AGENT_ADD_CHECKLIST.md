# 1-Page: How to add a new AI agent (production-ready)

Follow these exact steps to add a new agent without introducing placeholders or mock code.

1) Add system config
- File: `lib/ai-config.ts`
- Add a new entry to `teamMemberModels`:
  - `model`: pick a real model from `@ai-sdk/openai` or `@ai-sdk/anthropic` (no fake strings)
  - `systemPrompt`: fully-written system instructions that explain responsibilities, tone, and required frameworks

2) Add personality & local context
- File: `lib/ai-personality-system.ts`
- Add a new `AgentPersonality` object with `basePersonality`, `moodAdaptations`, `timeBasedGreetings`, `achievementCelebrations`, and `contextualResponses`.

3) Wire the agent into the chat route
- File: `app/api/chat/route.ts`
- Ensure the new agent id is recognized by feature gating and the agent personality mapping.
- Add tracking via `trackAgentAccess(user.id, '<agentId>')` when the agent is used.

4) Add UI assets (optional but required for production UX)
- Folder: `public/agents/<agentId>/`
  - Add avatar images (web-optimized PNG/JPEG, 2 sizes), and a short JSON file `meta.json` with name/description.
- Add a small component in `components/ai/` if needed to display agent info.

5) Add tests
- Unit: create a Jest test in `test/` that asserts the agent prompt exists and `getTeamMemberConfig('<agentId>')` returns the entry.
- Integration: add a test that posts to `app/api/chat/route.ts` with a test user and verifies the route accepts the agent id and returns a streaming response (or status 200 when using a dev fallback). Use mocked AI responses for tests.

6) Update docs & .env.example
- If the agent requires new env vars (special keys, external services), update `.env.example` and `README.md`.
- Add the agent to `.github/copilot-instructions.md` and to `ONBOARDING_FOR_NONTECH.md` if it changes end-user behavior.

7) Acceptance criteria (must pass before merge)
- No placeholder prompts or demo text remain in the agent's systemPrompt.
- Unit + integration tests added and passing locally.
- The agent is tracked in usage metrics (`trackAgentAccess`) and is gated by subscription tier if necessary.
- Avatars/assets exist in `public/agents/<agentId>` and are referenced by the UI.

8) If the agent requires new DB schema
- Update `db/schema.ts`, then run:
```powershell
npm run db:generate
npm run db:push
```
- Add the migration files and include them in the PR.

9) Notes & best practices
- Use a real model in `lib/ai-config.ts` (e.g., `openai('gpt-4o')`) — do not invent model strings.
- Keep system prompts explicit about legal disclaimers when providing legal/medical/financial suggestions.
- Keep personality text behaviour-focused (not secret tokens or keys).

If you want, I will produce a tiny test scaffold for one new agent (Roxy-like) so you can see a working example — no demo text, only production-ready wiring.