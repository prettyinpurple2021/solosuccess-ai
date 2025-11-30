import { randomUUID } from 'node:crypto'
import { ensureUpstashConfigured } from '@/lib/custom-ai-agents/job-queue'
import { getQStashClient } from '@/lib/upstash/clients'
import { logInfo } from '@/lib/logger'

function getOnboardingCallbackUrl(): string {
  const explicit = process.env.QSTASH_ONBOARDING_CALLBACK_URL
  if (explicit && explicit.length > 0) {
    return explicit
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL
  if (!appUrl) {
    throw new Error('NEXT_PUBLIC_APP_URL must be configured to derive onboarding callback URL')
  }

  return `${appUrl.replace(/\/+$/, '')}/api/workers/onboarding`
}

export interface EnqueueOnboardingInput {
  userId: string
}

export interface EnqueueOnboardingResult {
  jobId: string
}

export async function enqueueOnboardingWorkflow({
  userId,
}: EnqueueOnboardingInput): Promise<EnqueueOnboardingResult> {
  ensureUpstashConfigured()

  const jobId = randomUUID()
  const qstash = getQStashClient()
  const url = getOnboardingCallbackUrl()

  await qstash.publishJSON({
    url,
    body: { jobId, userId },
    delay: 0,
    headers: {
      'content-type': 'application/json',
    },
  })

  logInfo('Queued onboarding workflow', { jobId, userId, url })

  return { jobId }
}

