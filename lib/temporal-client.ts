import { Connection, Client } from '@temporalio/client'

// Singleton pattern for Temporal client
let connection: Connection | null = null
let client: Client | null = null

export async function getTemporalClient(): Promise<Client> {
  if (!client) {
    if (!connection) {
      connection = await Connection.connect({
        address: process.env.TEMPORAL_ADDRESS || 'localhost:7233',
        // Add TLS configuration if needed for production
        // tls: {
        //   clientCertPair: {
        //     crt: Buffer.from(process.env.TEMPORAL_CLIENT_CERT || ''),
        //     key: Buffer.from(process.env.TEMPORAL_CLIENT_KEY || ''),
        //   },
        // },
      })
    }

    client = new Client({
      connection,
      namespace: process.env.TEMPORAL_NAMESPACE || 'default',
    })
  }

  return client
}

export async function startWorkflow<T extends any[], R>(
  workflowType: string,
  args: T,
  options: {
    workflowId: string
    taskQueue: string
    retryPolicy?: any
    executionTimeout?: string
    runTimeout?: string
  }
) {
  const client = await getTemporalClient()
  
  const handle = await client.workflow.start(workflowType, {
    args,
    taskQueue: options.taskQueue,
    workflowId: options.workflowId,
    retryPolicy: options.retryPolicy || {
      initialInterval: '1s',
      backoffCoefficient: 2.0,
      maximumInterval: '100s',
      maximumAttempts: 3,
    },
    executionTimeout: options.executionTimeout || '1h',
    runTimeout: options.runTimeout || '30m',
  })

  return handle
}

export async function getWorkflowStatus(workflowId: string) {
  const client = await getTemporalClient()
  const handle = client.workflow.getHandle(workflowId)
  
  try {
    const status = await handle.describe()
    return {
      workflowId,
      status: status.status.name,
      startTime: status.startTime,
      executionTime: status.executionTime,
      closeTime: status.closeTime,
    }
  } catch (error) {
    console.error('Error getting workflow status:', error)
    throw error
  }
}

export async function getWorkflowResult<T>(workflowId: string): Promise<T | null> {
  const client = await getTemporalClient()
  const handle = client.workflow.getHandle(workflowId)
  
  try {
    const status = await handle.describe()
    if (status.status.name === 'COMPLETED') {
      return await handle.result()
    }
    return null
  } catch (error) {
    console.error('Error getting workflow result:', error)
    throw error
  }
}

export async function signalWorkflow(workflowId: string, signalName: string, args: any[]) {
  const client = await getTemporalClient()
  const handle = client.workflow.getHandle(workflowId)
  
  try {
    await handle.signal(signalName, ...args)
    return { success: true }
  } catch (error) {
    console.error('Error signaling workflow:', error)
    throw error
  }
}

export async function queryWorkflow<T>(workflowId: string, queryName: string, args: any[] = []): Promise<T> {
  const client = await getTemporalClient()
  const handle = client.workflow.getHandle(workflowId)
  
  try {
    return await handle.query(queryName, ...args)
  } catch (error) {
    console.error('Error querying workflow:', error)
    throw error
  }
}

// Helper function to close the connection (useful for cleanup)
export async function closeTemporalConnection() {
  if (connection) {
    await connection.close()
    connection = null
    client = null
  }
}

// Workflow ID generators
export function generateWorkflowId(prefix: string, userId: string, suffix?: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substr(2, 9)
  return `${prefix}-${userId}-${timestamp}${suffix ? `-${suffix}` : ''}-${random}`
}

// Common workflow configurations
export const WORKFLOW_CONFIGS = {
  ONBOARDING: {
    taskQueue: 'soloboss-tasks',
    executionTimeout: '30m',
    runTimeout: '15m',
  },
  INTELLIGENCE: {
    taskQueue: 'soloboss-tasks',
    executionTimeout: '1h',
    runTimeout: '30m',
  },
  BRIEFING: {
    taskQueue: 'soloboss-tasks',
    executionTimeout: '20m',
    runTimeout: '10m',
  },
  GOAL_TRACKING: {
    taskQueue: 'soloboss-tasks',
    executionTimeout: '15m',
    runTimeout: '5m',
  },
} as const
