import { getTeamMemberConfig } from '../lib/ai-config'
import { agentPersonalities } from '../lib/ai-personality-system'

describe('Agent configs and personalities', () => {
  const agents = [
    'roxy',
    'blaze',
    'echo',
    'lumi',
    'vex',
    'lexi',
    'nova',
    'glitch',
  ]

  test.each(agents)('%s has a team member config', (agentId) => {
    const cfg = getTeamMemberConfig(agentId)
    expect(cfg).toBeDefined()
    expect(cfg.systemPrompt).toBeTruthy()
    expect(cfg.model).toBeTruthy()
  })

  test.each(agents)('%s has a personality object', (agentId) => {
    const p = (agentPersonalities as any)[agentId]
    expect(p).toBeDefined()
    // Check main personality keys exist
    expect(p.basePersonality).toBeTruthy()
    expect(p.timeBasedGreetings).toBeDefined()
    expect(p.moodAdaptations).toBeDefined()
    expect(Array.isArray(p.achievementCelebrations)).toBe(true)
  })
})
