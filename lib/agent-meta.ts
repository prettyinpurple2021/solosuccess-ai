// Centralized agent metadata loader — provides agent metadata with fallbacks.
// Components may import this module to get canonical per-agent metadata (image path, alt text).
// Keep the exports minimal: `AgentMeta`, `agentMetaMap`, and `getAgentMeta(id)`.

export interface AgentMeta {
  image: string
  alt?: string
  sizes?: Record<string, any>
}

// Fallback metadata for agents - optimized images in /public/images/optimized/agents/
// Used when dynamic loading fails or agent is not found in meta.json files
// This is client-safe and works in both server and client components
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

// Load agent metadata dynamically from public/agents directory.
// This works at build time and runtime, avoiding static import issues.
// Only runs on server-side to avoid fs module issues in client bundles
function loadAgentMetaMap(): Record<string, AgentMeta> {
  try {
    // Client-side: return empty object, use fallbacks
    if (typeof window !== 'undefined') return {}
    
    // Server-side: try to load dynamic metadata
    // Use dynamic import to avoid bundling fs in client code
    if (typeof require !== 'undefined') {
      const fs = require('fs')
      const path = require('path')
      const base = path.join(process.cwd(), 'public', 'agents')
      if (!fs.existsSync(base)) return {}
      const entries = fs.readdirSync(base, { withFileTypes: true })
      const map: Record<string, AgentMeta> = {}
      for (const dirent of entries) {
        if (!dirent.isDirectory()) continue
        const id = dirent.name
        const metaPath = path.join(base, id, 'meta.json')
        try {
          if (!fs.existsSync(metaPath)) continue
          const raw = fs.readFileSync(metaPath, { encoding: 'utf8' })
          const parsed = JSON.parse(raw)
          if (parsed && typeof parsed.image === 'string') {
            map[id] = parsed as AgentMeta
          }
        } catch (e) {
          // ignore malformed meta.json files
          continue
        }
      }
      return map
    }
    return {}
  } catch (e) {
    // If anything fails, return empty object and use fallbacks
    return {}
  }
}

// Load dynamic metadata and merge with fallback
// Dynamic loading takes precedence, fallback is used for missing agents
// For client-side, this will only use fallbacks
const loadedMeta = typeof window === 'undefined' ? loadAgentMetaMap() : {}
export const agentMetaMap: Record<string, AgentMeta> = {
  ...fallbackAgentMeta,
  ...loadedMeta,
}

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
