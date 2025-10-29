// Centralized agent metadata loader — imports static meta.json files from `public/agents`.
// This file intentionally imports the JSON so that components can synchronously read image paths
// without doing runtime fetches. If you later add sizes or webp variants, update the meta files.

import roxy from '../public/agents/roxy/meta.json'
import blaze from '../public/agents/blaze/meta.json'
import echo from '../public/agents/echo/meta.json'
import glitch from '../public/agents/glitch/meta.json'
import lumi from '../public/agents/lumi/meta.json'
import vex from '../public/agents/vex/meta.json'
import lexi from '../public/agents/lexi/meta.json'
import nova from '../public/agents/nova/meta.json'

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

export function getAgentMeta(agentId: string): AgentMeta | null {
  return agentMetaMap[agentId] || null
}

export default agentMetaMap
