import { AgentCollaborationSystem } from '@/lib/custom-ai-agents/agent-collaboration-system'
import {
  AgentJob,
  AgentJobError,
  AgentJobResult,
  AgentJobStatus,
  getAgentJob,
  updateAgentJob,
} from '@/lib/custom-ai-agents/job-store'
import { logError, logInfo } from '@/lib/logger'

function isTerminalStatus(status: AgentJobStatus): boolean {
  return status === 'completed' || status === 'failed'
}

export async function processAgentJob(jobId: string): Promise<AgentJob> {
  const job = await getAgentJob(jobId)
  if (!job) {
    throw new Error(`Agent job ${jobId} not found`)
  }

  if (isTerminalStatus(job.status)) {
    return job
  }

  const attempts = job.attempts + 1
  await updateAgentJob(jobId, {
    status: 'processing',
    attempts,
  })

  const system = new AgentCollaborationSystem(job.userId)

  try {
    const result = await system.processRequest(
      job.message,
      job.context,
      job.preferredAgent || job.agentId
    )

    const jobResult: AgentJobResult = {
      primaryResponse: result.primaryResponse,
      collaborationResponses: result.collaborationResponses,
      workflow: result.workflow,
    }

    const updated = await updateAgentJob(jobId, {
      status: 'completed',
      result: jobResult,
      error: undefined,
    })

    if (!updated) {
      throw new Error(`Failed to persist agent job ${jobId} completion`)
    }

    logInfo('Custom agent job completed', {
      jobId,
      userId: job.userId,
      agentId: job.agentId,
    })

    return updated
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    const jobError: AgentJobError = {
      message: err.message,
      stack: err.stack,
      name: err.name,
    }

    const updated = await updateAgentJob(jobId, {
      status: 'failed',
      error: jobError,
    })

    logError('Custom agent job failed', { jobId }, err)

    if (!updated) {
      throw new Error(`Failed to persist agent job ${jobId} failure`)
    }

    return updated
  }
}

