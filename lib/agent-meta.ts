// Centralized agent metadata loader — imports static meta.json files from `public/agents`.
// Components may import this module to get canonical per-agent metadata (image path, alt text).
// Keep the exports minimal: `AgentMeta`, `agentMetaMap`, and `getAgentMeta(id)`.

import fs from 'fs'
import path from 'path'

export interface AgentMeta {
  image: string
  alt?: string
  sizes?: Record<string, any>
}

// Load agent metadata dynamically from public/agents directory.
// This works at build time and runtime, avoiding static import issues.
function loadAgentMetaMap(): Record<string, AgentMeta> {
  try {
    if (typeof window !== 'undefined') return {}
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
  } catch (e) {
    return {}
  }
}

// Cache the loaded metadata
const agentMetaMap: Record<string, AgentMeta> = loadAgentMetaMap()

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
