/**
 * Workflow Engine - Core system for smart workflow automation
 * Handles workflow creation, execution, and management with visual builder support
 */

import { logger, logError, logInfo } from '@/lib/logger'
import { z } from 'zod'

// Workflow Types
export const WorkflowNodeSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['trigger', 'action', 'condition', 'delay', 'webhook', 'ai_task', 'email', 'notification']),
  name: z.string(),
  description: z.string().optional(),
  position: z.object({
    x: z.number(),
    y: z.number()
  }),
  config: z.record(z.any()),
  inputs: z.array(z.string()).default([]),
  outputs: z.array(z.string()).default([]),
  status: z.enum(['pending', 'running', 'completed', 'failed', 'skipped']).default('pending'),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const WorkflowEdgeSchema = z.object({
  id: z.string().uuid(),
  source: z.string().uuid(),
  target: z.string().uuid(),
  sourceHandle: z.string().optional(),
  targetHandle: z.string().optional(),
  condition: z.string().optional(), // For conditional edges
  label: z.string().optional(),
  animated: z.boolean().default(false)
})

export const WorkflowSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  version: z.string().default('1.0.0'),
  status: z.enum(['draft', 'active', 'paused', 'archived']).default('draft'),
  triggerType: z.enum(['manual', 'scheduled', 'webhook', 'event', 'ai_trigger']),
  triggerConfig: z.record(z.any()),
  nodes: z.array(WorkflowNodeSchema),
  edges: z.array(WorkflowEdgeSchema),
  variables: z.record(z.any()).default({}),
  settings: z.object({
    timeout: z.number().default(300000), // 5 minutes
    retryAttempts: z.number().default(3),
    retryDelay: z.number().default(5000),
    parallelExecution: z.boolean().default(true),
    errorHandling: z.enum(['stop', 'continue', 'rollback']).default('stop')
  }),
  metadata: z.object({
    createdBy: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    lastExecuted: z.date().optional(),
    executionCount: z.number().default(0),
    successRate: z.number().default(0),
    averageExecutionTime: z.number().default(0)
  })
})

export type WorkflowNode = z.infer<typeof WorkflowNodeSchema>
export type WorkflowEdge = z.infer<typeof WorkflowEdgeSchema>
export type Workflow = z.infer<typeof WorkflowSchema>

// Execution Types
export interface WorkflowExecution {
  id: string
  workflowId: string
  status: 'running' | 'completed' | 'failed' | 'cancelled'
  startedAt: Date
  completedAt?: Date
  nodeResults: Map<string, unknown>
  variables: Record<string, unknown>
  error?: string
  executionTime: number
}

// Node Types
export interface NodeType {
  id: string
  name: string
  description: string
  category: 'trigger' | 'action' | 'logic' | 'communication' | 'ai'
  icon: string
  color: string
  inputs: NodePort[]
  outputs: NodePort[]
  configSchema: z.ZodSchema
  execute: (config: unknown, context: ExecutionContext) => Promise<unknown>
}

interface NodePort {
  id: string
  name: string
  type: 'string' | 'number' | 'boolean' | 'object' | 'array'
  required: boolean
}

interface ExecutionContext {
  workflowId: string
  executionId: string
  variables: Record<string, unknown>
  nodeResults: Map<string, unknown>
  logger: typeof logger
}

/**
 * Workflow Engine Class
 */
export class WorkflowEngine {
  private workflows: Map<string, Workflow> = new Map()
  private executions: Map<string, WorkflowExecution> = new Map()
  private nodeTypes: Map<string, NodeType> = new Map()
  private eventListeners: Map<string, ((event: unknown) => void)[]> = new Map()

  constructor() {
    this.initializeNodeTypes()
    logInfo('Workflow Engine initialized')
  }

  /**
   * Initialize built-in node types
   */
  private initializeNodeTypes(): void {
    // Trigger Nodes
    this.registerNodeType({
      id: 'manual_trigger',
      name: 'Manual Trigger',
      description: 'Start workflow manually',
      category: 'trigger',
      icon: 'Play',
      color: '#10B981',
      inputs: [],
      outputs: [{ id: 'output', name: 'Trigger', type: 'object', required: true }],
      configSchema: z.object({
        title: z.string().default('Manual Trigger'),
        description: z.string().optional()
      }),
      execute: async (_config, _context) => {
        logInfo('Manual trigger executed', { workflowId: _context.workflowId })
        return { triggered: true, timestamp: new Date().toISOString() }
      }
    })

    this.registerNodeType({
      id: 'scheduled_trigger',
      name: 'Scheduled Trigger',
      description: 'Start workflow on schedule',
      category: 'trigger',
      icon: 'Clock',
      color: '#3B82F6',
      inputs: [],
      outputs: [{ id: 'output', name: 'Schedule', type: 'object', required: true }],
      configSchema: z.object({
        schedule: z.string().default('0 9 * * *'), // Cron expression
        timezone: z.string().default('UTC'),
        enabled: z.boolean().default(true)
      }),
      execute: async (config: unknown, _context) => {
        const configTyped = config as { schedule: string; timezone: string; enabled: boolean }
        logInfo('Scheduled trigger executed', { schedule: configTyped.schedule })
        return { scheduled: true, timestamp: new Date().toISOString() }
      }
    })

    this.registerNodeType({
      id: 'webhook_trigger',
      name: 'Webhook Trigger',
      description: 'Start workflow via webhook',
      category: 'trigger',
      icon: 'Webhook',
      color: '#8B5CF6',
      inputs: [],
      outputs: [{ id: 'output', name: 'Webhook Data', type: 'object', required: true }],
      configSchema: z.object({
        path: z.string().default('/webhook'),
        method: z.enum(['GET', 'POST', 'PUT', 'DELETE']).default('POST'),
        authentication: z.enum(['none', 'bearer', 'basic']).default('none'),
        secret: z.string().optional()
      }),
      execute: async (config: unknown, _context) => {
        const configTyped = config as { path: string; method: string; authentication: string; secret?: string }
        logInfo('Webhook trigger executed', { path: configTyped.path })
        return { webhook: true, timestamp: new Date().toISOString() }
      }
    })

    // Action Nodes
    this.registerNodeType({
      id: 'send_email',
      name: 'Send Email',
      description: 'Send email notification',
      category: 'communication',
      icon: 'Mail',
      color: '#F59E0B',
      inputs: [{ id: 'input', name: 'Data', type: 'object', required: true }],
      outputs: [{ id: 'output', name: 'Result', type: 'object', required: true }],
      configSchema: z.object({
        to: z.string().email(),
        subject: z.string(),
        template: z.string().optional(),
        variables: z.record(z.any()).optional()
      }),
      execute: async (config: unknown, _context) => {
        const configTyped = config as { to: string; subject: string; template?: string; variables?: Record<string, unknown> }
        logInfo('Sending email', { to: configTyped.to, subject: configTyped.subject })
        // Simulate email sending
        await new Promise(resolve => setTimeout(resolve, 1000))
        return { sent: true, messageId: crypto.randomUUID() }
      }
    })

    this.registerNodeType({
      id: 'ai_task',
      name: 'AI Task',
      description: 'Execute AI-powered task',
      category: 'ai',
      icon: 'Brain',
      color: '#EC4899',
      inputs: [{ id: 'input', name: 'Input Data', type: 'object', required: true }],
      outputs: [{ id: 'output', name: 'AI Result', type: 'object', required: true }],
      configSchema: z.object({
        task: z.enum(['analyze', 'generate', 'summarize', 'translate', 'classify']),
        prompt: z.string(),
        model: z.string().default('gpt-4'),
        temperature: z.number().min(0).max(2).default(0.7)
      }),
      execute: async (config: unknown, _context) => {
        const configTyped = config as { task: string; prompt: string; model: string; temperature: number }
        logInfo('Executing AI task', { task: configTyped.task, model: configTyped.model })
        // Simulate AI processing
        await new Promise(resolve => setTimeout(resolve, 2000))
        return { 
          result: `AI ${configTyped.task} completed`,
          confidence: Math.random() * 0.4 + 0.6,
          processingTime: 2000
        }
      }
    })

    this.registerNodeType({
      id: 'delay',
      name: 'Delay',
      description: 'Wait for specified time',
      category: 'action',
      icon: 'Timer',
      color: '#6B7280',
      inputs: [{ id: 'input', name: 'Input', type: 'object', required: true }],
      outputs: [{ id: 'output', name: 'Output', type: 'object', required: true }],
      configSchema: z.object({
        duration: z.number().min(0).default(5000), // milliseconds
        unit: z.enum(['milliseconds', 'seconds', 'minutes', 'hours']).default('milliseconds')
      }),
      execute: async (config: unknown, _context) => {
        const configTyped = config as { duration: number; unit: string }
        const duration = configTyped.unit === 'seconds' ? configTyped.duration * 1000 :
                        configTyped.unit === 'minutes' ? configTyped.duration * 60000 :
                        configTyped.unit === 'hours' ? configTyped.duration * 3600000 :
                        configTyped.duration
        
        logInfo('Delay node executing', { duration })
        await new Promise(resolve => setTimeout(resolve, duration))
        return { delayed: true, duration }
      }
    })

    // Logic Nodes
    this.registerNodeType({
      id: 'condition',
      name: 'Condition',
      description: 'Conditional branching',
      category: 'logic',
      icon: 'GitBranch',
      color: '#EF4444',
      inputs: [{ id: 'input', name: 'Input', type: 'object', required: true }],
      outputs: [
        { id: 'true', name: 'True', type: 'object', required: true },
        { id: 'false', name: 'False', type: 'object', required: true }
      ],
      configSchema: z.object({
        condition: z.string(), // JavaScript expression
        variable: z.string().optional()
      }),
      execute: async (config: unknown, _context) => {
        const configTyped = config as { condition: string; variable?: string }
        try {
          // Simple condition evaluation - in production, use a proper expression evaluator
          // For now, we'll just return a mock result to avoid security issues
          logInfo('Condition evaluated', { condition: configTyped.condition })
          return { condition: configTyped.condition, result: true }
        } catch (error) {
          logError('Condition evaluation failed:', error instanceof Error ? error : new Error(String(error)))
          throw new Error(`Condition evaluation failed: ${error}`)
        }
      }
    })

    // Data Processing Nodes
    this.registerNodeType({
      id: 'transform_data',
      name: 'Transform Data',
      description: 'Transform input data',
      category: 'action',
      icon: 'RefreshCw',
      color: '#10B981',
      inputs: [{ id: 'input', name: 'Input Data', type: 'object', required: true }],
      outputs: [{ id: 'output', name: 'Transformed Data', type: 'object', required: true }],
      configSchema: z.object({
        transformation: z.enum(['map', 'filter', 'reduce', 'sort', 'custom']),
        expression: z.string().optional()
      }),
      execute: async (config: unknown, _context) => {
        const configTyped = config as { transformation: string; expression?: string }
        logInfo('Transforming data', { transformation: configTyped.transformation })
        // Simulate data transformation
        await new Promise(resolve => setTimeout(resolve, 500))
        return { transformed: true, transformation: configTyped.transformation }
      }
    })
  }

  /**
   * Register a new node type
   */
  registerNodeType(nodeType: NodeType): void {
    this.nodeTypes.set(nodeType.id, nodeType)
    logInfo('Node type registered', { id: nodeType.id, name: nodeType.name })
  }

  /**
   * Create a new workflow
   */
  async createWorkflow(workflowData: Omit<Workflow, 'id' | 'metadata'>): Promise<Workflow> {
    const workflow: Workflow = {
      ...workflowData,
      id: crypto.randomUUID(),
      metadata: {
        createdBy: 'system', // TODO: Get from auth context
        createdAt: new Date(),
        updatedAt: new Date(),
        executionCount: 0,
        successRate: 0,
        averageExecutionTime: 0
      }
    }

    // Validate workflow
    const validatedWorkflow = WorkflowSchema.parse(workflow)
    this.workflows.set(workflow.id, validatedWorkflow)

    this.emitEvent('workflow_created', { workflowId: workflow.id })
    logInfo('Workflow created', { workflowId: workflow.id, name: workflow.name })

    return validatedWorkflow
  }

  /**
   * Update an existing workflow
   */
  async updateWorkflow(workflowId: string, updates: Partial<Workflow>): Promise<Workflow> {
    const workflow = this.workflows.get(workflowId)
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`)
    }

    const updatedWorkflow = {
      ...workflow,
      ...updates,
      metadata: {
        ...workflow.metadata,
        updatedAt: new Date()
      }
    }

    const validatedWorkflow = WorkflowSchema.parse(updatedWorkflow)
    this.workflows.set(workflowId, validatedWorkflow)

    this.emitEvent('workflow_updated', { workflowId })
    logInfo('Workflow updated', { workflowId })

    return validatedWorkflow
  }

  /**
   * Execute a workflow
   */
  async executeWorkflow(workflowId: string, inputData: Record<string, unknown> = {}): Promise<WorkflowExecution> {
    const workflow = this.workflows.get(workflowId)
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`)
    }

    const executionId = crypto.randomUUID()
    const execution: WorkflowExecution = {
      id: executionId,
      workflowId,
      status: 'running',
      startedAt: new Date(),
      nodeResults: new Map(),
      variables: { ...workflow.variables, ...inputData },
      executionTime: 0
    }

    this.executions.set(executionId, execution)

    try {
      logInfo('Starting workflow execution', { workflowId, executionId })
      
      // Find trigger nodes
      const triggerNodes = workflow.nodes.filter(node => node.type === 'trigger')
      if (triggerNodes.length === 0) {
        throw new Error('No trigger nodes found in workflow')
      }

      // Execute workflow nodes in topological order
      await this.executeNodes(workflow, execution)

      execution.status = 'completed'
      execution.completedAt = new Date()
      execution.executionTime = execution.completedAt.getTime() - execution.startedAt.getTime()

      // Update workflow statistics
      this.updateWorkflowStats(workflow, execution)

      this.emitEvent('workflow_completed', { workflowId, executionId })
      logInfo('Workflow execution completed', { workflowId, executionId, executionTime: execution.executionTime })

    } catch (error) {
      execution.status = 'failed'
      execution.error = error instanceof Error ? error.message : 'Unknown error'
      execution.completedAt = new Date()
      execution.executionTime = execution.completedAt.getTime() - execution.startedAt.getTime()

      this.emitEvent('workflow_failed', { workflowId, executionId, error: execution.error })
      logError('Workflow execution failed:', error instanceof Error ? error : new Error(String(error)))
    }

    return execution
  }

  /**
   * Execute workflow nodes in correct order
   */
  private async executeNodes(workflow: Workflow, execution: WorkflowExecution): Promise<void> {
    const executedNodes = new Set<string>()
    const pendingNodes = new Set(workflow.nodes.map(node => node.id))

    // Start with trigger nodes
    const triggerNodes = workflow.nodes.filter(node => node.type === 'trigger')
    
    for (const triggerNode of triggerNodes) {
      await this.executeNode(workflow, triggerNode, execution, executedNodes)
    }

    // Execute remaining nodes in topological order
    while (pendingNodes.size > executedNodes.size) {
      let progressMade = false

      for (const nodeId of pendingNodes) {
        if (executedNodes.has(nodeId)) continue

        const node = workflow.nodes.find(n => n.id === nodeId)
        if (!node) continue

        // Check if all input dependencies are satisfied
        const inputEdges = workflow.edges.filter(edge => edge.target === nodeId)
        const dependenciesSatisfied = inputEdges.every(edge => executedNodes.has(edge.source))

        if (dependenciesSatisfied) {
          await this.executeNode(workflow, node, execution, executedNodes)
          progressMade = true
        }
      }

      if (!progressMade) {
        throw new Error('Workflow has circular dependencies or unreachable nodes')
      }
    }
  }

  /**
   * Execute a single node
   */
  private async executeNode(
    workflow: Workflow, 
    node: WorkflowNode, 
    execution: WorkflowExecution, 
    executedNodes: Set<string>
  ): Promise<void> {
    const nodeType = this.nodeTypes.get(node.type)
    if (!nodeType) {
      throw new Error(`Unknown node type: ${node.type}`)
    }

    try {
      logInfo('Executing node', { nodeId: node.id, nodeType: node.type })

      // Prepare execution context
      const context: ExecutionContext = {
        workflowId: workflow.id,
        executionId: execution.id,
        variables: execution.variables,
        nodeResults: execution.nodeResults,
        logger
      }

      // Get input data from connected nodes
      const inputEdges = workflow.edges.filter(edge => edge.target === node.id)
      const _inputData = inputEdges.length > 0 ? 
        execution.nodeResults.get(inputEdges[0].source) : 
        execution.variables

      // Execute the node
      const result = await nodeType.execute(node.config, context)
      
      // Store the result
      execution.nodeResults.set(node.id, result)
      executedNodes.add(node.id)

      logInfo('Node execution completed', { nodeId: node.id, result })

    } catch (error) {
      logError('Node execution failed:', error instanceof Error ? error : new Error(String(error)))
      throw new Error(`Node ${node.name} execution failed: ${error}`)
    }
  }

  /**
   * Update workflow statistics
   */
  private updateWorkflowStats(workflow: Workflow, execution: WorkflowExecution): void {
    const metadata = workflow.metadata
    metadata.executionCount++
    metadata.lastExecuted = execution.completedAt!

    if (execution.status === 'completed') {
      const successCount = (metadata.successRate * (metadata.executionCount - 1)) + 1
      metadata.successRate = successCount / metadata.executionCount
    } else {
      const successCount = metadata.successRate * (metadata.executionCount - 1)
      metadata.successRate = successCount / metadata.executionCount
    }

    metadata.averageExecutionTime = 
      (metadata.averageExecutionTime * (metadata.executionCount - 1) + execution.executionTime) / 
      metadata.executionCount

    workflow.metadata = metadata
    this.workflows.set(workflow.id, workflow)
  }

  /**
   * Get workflow by ID
   */
  getWorkflow(workflowId: string): Workflow | undefined {
    return this.workflows.get(workflowId)
  }

  /**
   * Get all workflows
   */
  getAllWorkflows(): Workflow[] {
    return Array.from(this.workflows.values())
  }

  /**
   * Get workflows by user
   */
  getWorkflowsByUser(userId: string): Workflow[] {
    return Array.from(this.workflows.values())
      .filter(workflow => workflow.metadata.createdBy === userId)
  }

  /**
   * Get execution by ID
   */
  getExecution(executionId: string): WorkflowExecution | undefined {
    return this.executions.get(executionId)
  }

  /**
   * Get executions for a workflow
   */
  getWorkflowExecutions(workflowId: string): WorkflowExecution[] {
    return Array.from(this.executions.values())
      .filter(execution => execution.workflowId === workflowId)
      .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())
  }

  /**
   * Get available node types
   */
  getNodeTypes(): NodeType[] {
    return Array.from(this.nodeTypes.values())
  }

  /**
   * Get node type by ID
   */
  getNodeType(nodeTypeId: string): NodeType | undefined {
    return this.nodeTypes.get(nodeTypeId)
  }

  /**
   * Delete workflow
   */
  async deleteWorkflow(workflowId: string): Promise<boolean> {
    const workflow = this.workflows.get(workflowId)
    if (!workflow) {
      return false
    }

    this.workflows.delete(workflowId)
    this.emitEvent('workflow_deleted', { workflowId })
    logInfo('Workflow deleted', { workflowId })

    return true
  }

  /**
   * Event system
   */
  on(event: string, callback: (data: unknown) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, [])
    }
    this.eventListeners.get(event)!.push(callback)
  }

  private emitEvent(event: string, data: unknown): void {
    const listeners = this.eventListeners.get(event) || []
    listeners.forEach(callback => {
      try {
        callback(data)
      } catch (error) {
        logError(`Error in event listener for ${event}:`, error instanceof Error ? error : new Error(String(error)))
      }
    })
  }

  /**
   * Get workflow engine statistics
   */
  getStats(): {
    totalWorkflows: number
    activeWorkflows: number
    totalExecutions: number
    successfulExecutions: number
    averageExecutionTime: number
  } {
    const workflows = Array.from(this.workflows.values())
    const executions = Array.from(this.executions.values())

    const activeWorkflows = workflows.filter(w => w.status === 'active').length
    const successfulExecutions = executions.filter(e => e.status === 'completed').length
    const averageExecutionTime = executions.length > 0 ? 
      executions.reduce((sum, e) => sum + e.executionTime, 0) / executions.length : 0

    return {
      totalWorkflows: workflows.length,
      activeWorkflows,
      totalExecutions: executions.length,
      successfulExecutions,
      averageExecutionTime
    }
  }
}

// Export singleton instance
export const workflowEngine = new WorkflowEngine()
