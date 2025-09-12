import { NextRequest, NextResponse } from "next/server"
import { AgentCollaborationSystem } from "@/lib/custom-ai-agents/agent-collaboration-system"
import { SecurityMiddleware } from "@/lib/custom-ai-agents/security/security-middleware"

// Store collaboration systems per user (in production, use Redis or database)
const userCollaborationSystems = new Map<string, AgentCollaborationSystem>()
const securityMiddleware = new SecurityMiddleware()

export async function POST(request: NextRequest) {
  try {
    const { message, agentId, context, stream = false } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Process security checks
    const securityResult = await securityMiddleware.processRequest(
      request,
      agentId || "roxy",
      "processRequest",
      "agent_chat"
    )

    if (!securityResult.success) {
      return securityResult.response || NextResponse.json(
        { error: securityResult.error },
        { status: 500 }
      )
    }

    const securityContext = securityResult.context!
    const userId = securityContext.userId

    // Get or create collaboration system for user
    let collaborationSystem = userCollaborationSystems.get(userId)
    if (!collaborationSystem) {
      collaborationSystem = new AgentCollaborationSystem(userId)
      userCollaborationSystems.set(userId, collaborationSystem)
    }

    // Process request with custom agents
    const result = await collaborationSystem.processRequest(
      message,
      { ...context, securityContext },
      agentId
    )

    if (stream) {
      // Create a streaming response
      const encoder = new TextEncoder()
      const stream = new ReadableStream({
        start(controller) {
          // Send primary response
          const primaryData = {
            type: "primary_response",
            agentId: agentId || "roxy",
            content: result.primaryResponse.content,
            confidence: result.primaryResponse.confidence,
            reasoning: result.primaryResponse.reasoning,
            suggestedActions: result.primaryResponse.suggestedActions
          }
          
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(primaryData)}\n\n`)
          )

          // Send collaboration responses
          for (const [index, response] of result.collaborationResponses.entries()) {
            const collabData = {
              type: "collaboration_response",
              index,
              content: response.content,
              confidence: response.confidence,
              reasoning: response.reasoning
            }
            
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(collabData)}\n\n`)
            )
          }

          // Send workflow if created
          if (result.workflow) {
            const workflowData = {
              type: "workflow_created",
              workflowId: result.workflow.id,
              name: result.workflow.name,
              steps: result.workflow.steps.length
            }
            
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(workflowData)}\n\n`)
            )
          }

          // End stream
          controller.enqueue(encoder.encode("data: [DONE]\n\n"))
          controller.close()
        }
      })

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      })
    }

    // Return complete response
    return NextResponse.json({
      success: true,
      primaryResponse: result.primaryResponse,
      collaborationResponses: result.collaborationResponses,
      workflow: result.workflow,
      insights: collaborationSystem.getCollaborationInsights()
    })

  } catch (error) {
    console.error("Error in custom agents API:", error)
    return NextResponse.json(
      { error: "Failed to process request with custom agents" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // For now, use a default user ID. In production, implement proper authentication
    const userId = "default-user"

    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action")

    const collaborationSystem = userCollaborationSystems.get(userId)
    if (!collaborationSystem) {
      return NextResponse.json({ 
        agents: [],
        workflows: [],
        insights: {
          totalCollaborations: 0,
          successfulCollaborations: 0,
          agentRelationships: {},
          workflowStats: { total: 0, completed: 0, failed: 0 }
        }
      })
    }

    switch (action) {
      case "agents":
        const agents = Array.from(collaborationSystem.getAllAgents().entries()).map(([id, agent]) => ({
          id,
          name: agent.name,
          capabilities: agent.capabilities,
          memory: agent.getMemory()
        }))
        return NextResponse.json({ agents })

      case "workflows":
        const workflows = Array.from(collaborationSystem.getAllWorkflows().values())
        return NextResponse.json({ workflows })

      case "insights":
        const insights = collaborationSystem.getCollaborationInsights()
        return NextResponse.json({ insights })

      default:
        return NextResponse.json({
          agents: Array.from(collaborationSystem.getAllAgents().keys()),
          workflows: Array.from(collaborationSystem.getAllWorkflows().keys()),
          insights: collaborationSystem.getCollaborationInsights()
        })
    }

  } catch (error) {
    console.error("Error in custom agents GET API:", error)
    return NextResponse.json(
      { error: "Failed to retrieve custom agents data" },
      { status: 500 }
    )
  }
}
