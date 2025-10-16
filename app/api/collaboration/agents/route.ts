/**
 * Collaboration Agents API
 * Handles listing and managing AI agents for collaboration
 */

import { logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth } from '@/lib/logger'
import { NextRequest, NextResponse } from 'next/server'
import { CollaborationHub } from '@/lib/collaboration-hub'
import { verifyAuth } from '@/lib/auth-server'

// Edge runtime enabled after refactoring to jose and Neon HTTP
export const runtime = 'edge'


// Initialize collaboration hub
const collaborationHub = new CollaborationHub()


// Edge Runtime disabled due to Node.js dependency incompatibility

/**
 * GET /api/collaboration/agents
 * List all available AI agents
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const { user, error: authError } = await verifyAuth()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') // available, busy, offline
    const specialization = searchParams.get('specialization')
    const capability = searchParams.get('capability')

    // Get all agents
    let agents = collaborationHub.getAvailableAgents()

    // Add busy and offline agents if no status filter or status includes them
    if (!status || status !== 'available') {
      // For now, all agents from getAvailableAgents are available
      // In a real implementation, we'd get all agents and filter by status
    }

    // Filter by specialization if provided
    if (specialization) {
      agents = agents.filter(agent => 
        agent.specializations.some(spec => 
          spec.toLowerCase().includes(specialization.toLowerCase())
        )
      )
    }

    // Filter by capability if provided
    if (capability) {
      agents = agents.filter(agent =>
        agent.capabilities.some(cap =>
          cap.toLowerCase().includes(capability.toLowerCase())
        )
      )
    }

    // Transform agents for API response
    const agentList = agents.map(agent => ({
      id: agent.id,
      name: agent.name,
      displayName: agent.displayName,
      description: agent.description,
      capabilities: agent.capabilities,
      specializations: agent.specializations,
      personality: agent.personality,
      accentColor: agent.accentColor,
      status: agent.status,
      currentSessions: agent.currentSessions,
      maxConcurrentSessions: agent.maxConcurrentSessions,
      responseTimeMs: agent.responseTimeMs,
      availability: {
        isAvailable: agent.status === 'available',
        currentLoad: agent.currentSessions.length,
        capacity: agent.maxConcurrentSessions,
        utilizationPercent: Math.round((agent.currentSessions.length / agent.maxConcurrentSessions) * 100)
      }
    }))

    // Get collaboration hub statistics
    const hubStats = collaborationHub.getStats()

    return NextResponse.json({
      success: true,
      data: {
        agents: agentList,
        summary: {
          total: agentList.length,
          available: agentList.filter(a => a.status === 'available').length,
          busy: agentList.filter(a => a.status === 'busy').length,
          offline: agentList.filter(a => a.status === 'offline').length
        },
        hubStats
      },
      message: 'Agents retrieved successfully'
    })

  } catch (error) {
    logError('Error retrieving agents:', error)

    return NextResponse.json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve agents'
    }, { status: 500 })
  }
}