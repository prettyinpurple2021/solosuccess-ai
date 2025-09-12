import { generateText, streamText } from "ai"
import { openai } from "@ai-sdk/openai"
import { anthropic } from "@ai-sdk/anthropic"
import { google } from "@ai-sdk/google"
import { SimpleTrainingCollector } from "./training/simple-training-collector"

export interface AgentCapabilities {
  frameworks: string[]
  specializations: string[]
  tools: string[]
  collaborationStyle: "leader" | "supporter" | "analyst" | "executor"
}

export interface AgentMemory {
  userId: string
  context: Record<string, any>
  preferences: Record<string, any>
  history: Array<{
    timestamp: Date
    interaction: string
    outcome: string
    learning: string
  }>
  relationships: Record<string, {
    agentId: string
    collaborationHistory: any[]
    trustLevel: number
    specialization: string
  }>
}

export interface AgentTask {
  id: string
  type: string
  priority: "low" | "medium" | "high" | "critical"
  assignedTo: string
  dependencies: string[]
  context: Record<string, any>
  expectedOutcome: string
  deadline?: Date
  status: "pending" | "in_progress" | "completed" | "blocked"
}

export interface AgentResponse {
  content: string
  confidence: number
  reasoning: string
  suggestedActions: string[]
  collaborationRequests: Array<{
    agentId: string
    request: string
    priority: string
  }>
  followUpTasks: AgentTask[]
}

export abstract class CustomAgent {
  public readonly id: string
  public readonly name: string
  public readonly capabilities: AgentCapabilities
  protected memory: AgentMemory
  protected model: any
  protected systemPrompt: string
  protected trainingCollector: SimpleTrainingCollector

  constructor(
    id: string,
    name: string,
    capabilities: AgentCapabilities,
    userId: string,
    model: any,
    systemPrompt: string
  ) {
    this.id = id
    this.name = name
    this.capabilities = capabilities
    this.model = model
    this.systemPrompt = systemPrompt
    this.trainingCollector = SimpleTrainingCollector.getInstance()
    this.memory = {
      userId,
      context: {},
      preferences: {},
      history: [],
      relationships: {}
    }
  }

  // Core agent methods
  abstract processRequest(request: string, context?: Record<string, any>): Promise<AgentResponse>
  abstract collaborateWith(agentId: string, request: string): Promise<AgentResponse>

  // Memory management
  updateMemory(updates: Partial<AgentMemory>): void {
    this.memory = { ...this.memory, ...updates }
  }

  getMemory(): AgentMemory {
    return this.memory
  }

  // Context building
  protected buildContext(userContext?: Record<string, any>): string {
    const baseContext = `
AGENT IDENTITY: ${this.name} (${this.id})
CAPABILITIES: ${this.capabilities.frameworks.join(", ")}
SPECIALIZATIONS: ${this.capabilities.specializations.join(", ")}
COLLABORATION STYLE: ${this.capabilities.collaborationStyle}

USER CONTEXT: ${JSON.stringify(this.memory.context)}
PREFERENCES: ${JSON.stringify(this.memory.preferences)}
RECENT HISTORY: ${this.memory.history.slice(-3).map(h => h.interaction).join(", ")}

${userContext ? `CURRENT REQUEST CONTEXT: ${JSON.stringify(userContext)}` : ""}
`

    return baseContext
  }

  // Relationship management
  updateRelationship(agentId: string, interaction: any, outcome: any): void {
    if (!this.memory.relationships[agentId]) {
      this.memory.relationships[agentId] = {
        agentId,
        collaborationHistory: [],
        trustLevel: 0.5,
        specialization: ""
      }
    }

    const relationship = this.memory.relationships[agentId]
    relationship.collaborationHistory.push({
      timestamp: new Date(),
      interaction,
      outcome
    })

    // Update trust level based on collaboration success
    if (outcome.success) {
      relationship.trustLevel = Math.min(1.0, relationship.trustLevel + 0.1)
    } else {
      relationship.trustLevel = Math.max(0.0, relationship.trustLevel - 0.05)
    }
  }

  // Task management
  createTask(
    type: string,
    priority: "low" | "medium" | "high" | "critical",
    context: Record<string, any>,
    expectedOutcome: string,
    deadline?: Date
  ): AgentTask {
    return {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      priority,
      assignedTo: this.id,
      dependencies: [],
      context,
      expectedOutcome,
      deadline,
      status: "pending"
    }
  }

  // Response generation with structured output
  protected async generateStructuredResponse(
    prompt: string,
    context: string
  ): Promise<AgentResponse> {
    const fullPrompt = `${this.systemPrompt}

${context}

${prompt}

Please respond with:
1. Your analysis and recommendations
2. Your confidence level (0-1)
3. Your reasoning process
4. Suggested next actions
5. Any collaboration requests to other agents
6. Follow-up tasks you should handle

Be specific, actionable, and maintain your ${this.name} personality.`

    try {
      const { text } = await generateText({
        model: this.model,
        prompt: fullPrompt,
        temperature: 0.7,
        maxTokens: 1000
      })

      // Parse the response (in a real implementation, you'd want more robust parsing)
      const lines = text.split('\n').filter(line => line.trim())
      const content = lines.join('\n')
      
      return {
        content,
        confidence: 0.8, // Default confidence
        reasoning: "Generated using custom agent logic",
        suggestedActions: ["Review the response", "Ask for clarification if needed"],
        collaborationRequests: [],
        followUpTasks: []
      }
    } catch (error) {
      console.error(`Error generating response for ${this.name}:`, error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      const errorStack = error instanceof Error ? error.stack : 'No stack trace'
      
      return {
        content: `I apologize, but I encountered an error processing your request: ${errorMessage}`,
        confidence: 0.1,
        reasoning: `Error occurred during response generation: ${errorMessage}. Stack: ${errorStack}`,
        suggestedActions: ["Try rephrasing your request", "Check if the service is available"],
        collaborationRequests: [],
        followUpTasks: []
      }
    }
  }

  // Learning from interactions (optional override)
  async learnFromInteraction(interaction: any, outcome: any): Promise<void> {
    this.memory.history.push({
      timestamp: new Date(),
      interaction: JSON.stringify(interaction),
      outcome: JSON.stringify(outcome),
      learning: this.extractLearning(interaction, outcome)
    })

    // Keep only last 100 interactions to manage memory
    if (this.memory.history.length > 100) {
      this.memory.history = this.memory.history.slice(-100)
    }
  }

  // Record training data for analytics and fine-tuning
  async recordTrainingData(
    userMessage: string,
    agentResponse: AgentResponse,
    context: Record<string, any>,
    responseTime: number,
    success: boolean = true
  ): Promise<void> {
    try {
      await this.trainingCollector.recordInteraction({
        userId: this.memory.userId,
        agentId: this.id,
        userMessage,
        agentResponse: agentResponse.content,
        context,
        success,
        responseTime,
        confidence: agentResponse.confidence,
        collaborationRequests: agentResponse.collaborationRequests.map(req => req.request),
        followUpTasks: agentResponse.followUpTasks.map(task => task.expectedOutcome),
        metadata: {
          model: this.model?.modelId || 'unknown',
          temperature: 0.7,
          maxTokens: 1000,
          framework: this.capabilities.frameworks[0] || 'general',
          specialization: this.capabilities.specializations[0] || 'general'
        }
      })
    } catch (error) {
      console.error(`Error recording training data for ${this.name}:`, error)
      // Don't throw - training data recording shouldn't break the main flow
    }
  }

  protected extractLearning(interaction: any, outcome: any): string {
    // Simple learning extraction - can be enhanced with more sophisticated ML
    if (outcome.success) {
      return `Successful interaction pattern: ${interaction.type || 'general'}`
    } else {
      return `Failed interaction pattern: ${interaction.type || 'general'} - ${outcome.error || 'unknown error'}`
    }
  }
}
