// Centralized agent metadata loader — imports static meta.json files from `public/agents`.
// Components may import this module to get canonical per-agent metadata (image path, alt text).
// Keep the exports minimal: `AgentMeta`, `agentMetaMap`, and `getAgentMeta(id)`.

import roxy from '../public/agents/roxy/meta.json'
import blaze from '../public/agents/blaze/meta.json'
import echo from '../public/agents/echo/meta.json'
import glitch from '../public/agents/glitch/meta.json'
import lumi from '../public/agents/lumi/meta.json'
import vex from '../public/agents/vex/meta.json'
import lexi from '../public/agents/lexi/meta.json'
import nova from '../public/agents/nova/meta.json'
import fs from 'fs'
import path from 'path'

export interface AgentMeta {
  image: string
  alt?: string
  sizes?: Record<string, any>
}

export const agentMetaMap: Record<string, AgentMeta> = {
  roxy,
  blaze,
  echo,
  glitch,
  lumi,
  vex,
  lexi,
  nova,
}

// Attempt to augment the static map with any meta.json files present under public/agents.
// This lets adding a new agent (public/agents/<id>/meta.json + images) work without
// updating this file. The dynamic loader runs only on the server (build/runtime).
function buildDynamicAgentMap(): Record<string, AgentMeta> {
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

const dynamicAgentMap = buildDynamicAgentMap()

export function getAgentMeta(agentId: string): AgentMeta | null {
  // Prefer dynamic map entries (new agents) but fall back to the compiled static map.
  return (dynamicAgentMap[agentId] as AgentMeta) ?? agentMetaMap[agentId] ?? null
}

export function getAgentImage(agentId: string): string {
  const meta = getAgentMeta(agentId)
  if (meta?.image) return meta.image
  // Fallback to legacy images directory pattern
  return `/images/agents/${agentId}.png`
}

export default agentMetaMap
