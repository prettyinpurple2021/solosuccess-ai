// Centralized agent metadata loader — provides agent metadata with fallbacks.
// Components may import this module to get canonical per-agent metadata (image path, alt text).
// Keep the exports minimal: `AgentMeta`, `agentMetaMap`, and `getAgentMeta(id)`.

export interface AgentMeta {
  image: string
  alt?: string
  sizes?: Record<string, any>
}

// Fallback metadata for agents - optimized images in /public/images/optimized/agents/
const fallbackAgentMeta: Record<string, AgentMeta> = {
  roxy: {
    image: '/images/optimized/agents/roxy.jpg',
    alt: 'Roxy - Executive Assistant & Strategic Planner',
  },
  blaze: {
    image: '/images/optimized/agents/blaze.jpg',
    alt: 'Blaze - Growth & Sales Strategist',
  },
  echo: {
    image: '/images/optimized/agents/echo.jpg',
    alt: 'Echo - Marketing & Brand Strategist',
  },
  glitch: {
    image: '/images/optimized/agents/glitch.jpg',
    alt: 'Glitch - Tech & Systems Architect',
  },
  lumi: {
    image: '/images/optimized/agents/lumi.jpg',
    alt: 'Lumi - Compliance & Legal Guardian',
  },
  vex: {
    image: '/images/optimized/agents/vex.jpg',
    alt: 'Vex - Technical Development Lead',
  },
  lexi: {
    image: '/images/optimized/agents/lexi.jpg',
    alt: 'Lexi - Analytics & Insights Specialist',
  },
  nova: {
    image: '/images/optimized/agents/nova.jpg',
    alt: 'Nova - Product Innovation Strategist',
  },
}

export const agentMetaMap: Record<string, AgentMeta> = fallbackAgentMeta

export function getAgentMeta(agentId: string): AgentMeta | null {
  return agentMetaMap[agentId] ?? null
}

export function getAgentImage(agentId: string): string {
  const meta = getAgentMeta(agentId)
  if (meta?.image) return meta.image
  // Fallback to legacy images directory pattern
  return `/images/agents/${agentId}.png`
}

export default agentMetaMap

