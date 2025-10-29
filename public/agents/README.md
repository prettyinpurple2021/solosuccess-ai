Agent metadata (public/agents)
===============================

This folder contains per-agent metadata JSON files used as the canonical source
for agent images and sizing. The application loads these via `lib/agent-meta.ts`
and components should prefer `getAgentMeta(agentId)` as the source of truth for
agent image URLs.

Why use these files
- Centralizes image paths and variants (small/medium/large)
- Makes it easier to swap optimized formats (webp/avif) without changing UI code
- Keeps components lean: they ask the metadata module for the right URL

Schema
------
Each agent directory should contain a `meta.json` with at minimum an `image`
property. Optional size variants are recommended.

Example `meta.json`:

```json
{
  "id": "roxy",
  "alt": "Roxy — Creative Strategist",
  "image": "/images/agents/roxy.png",
  "small": "/images/agents/roxy.png",
  "medium": "/images/agents/roxy.png",
  "large": "/images/agents/roxy.png",
  "formats": ["png", "webp"]
}
```

Recommended image sizes (suggested but flexible):
- small: 64×64 (avatars / small UI elements)
- medium: 256×256 (cards / thumbnails)
- large: 1024×1024 (hero / high-resolution needs)

Best practices
- Provide both a PNG (for compatibility) and a modern format (webp or avif) if
  you plan to do format negotiation later.
- Keep the `image` top-level property pointing to the default/medium asset.
- Use `alt` to provide an accessible description for <img> tags.

Adding a new agent
------------------
1. Add the images to `public/images/agents/` (e.g. `myagent.png`, `myagent@2x.png`).
2. Create `public/agents/<id>/meta.json` using the schema above.
3. If your repo has a static import list in `lib/agent-meta.ts`, add an import
   for your new `meta.json` there and include it in the exported map. Example:

```ts
import myagent from "../public/agents/myagent/meta.json";

export const agentMetaMap = {
  ...,
  myagent: myagent as AgentMeta,
};
```

Note: Some builds prefer dynamic metadata loading. If you change `lib/agent-meta.ts`
to load metadata dynamically, ensure the server-side build can still access the
files at build-time.

Where components should look
---------------------------
- Use the helper exported by `lib/agent-meta.ts`:

```ts
import { getAgentMeta } from "../../lib/agent-meta";
const image = getAgentMeta("roxy")?.image || "/images/agents/roxy.png";
```

This provides a safe fallback if metadata is missing.

Questions or updates
- If you want I can convert `lib/agent-meta.ts` to import metadata dynamically
  (fewer manual imports) — tell me and I'll propose an implementation.
