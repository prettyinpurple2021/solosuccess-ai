import { logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth } from '@/lib/logger'
import { NextResponse} from 'next/server'
import { getTeamMemberConfig } from '@/lib/ai-config'


export const runtime = 'nodejs'

export async function GET() {
  try {
    // Simple connectivity test without external API calls
    const envChecks = {
      nodeEnv: process.env.NODE_ENV,
      hasOpenAiKey: !!process.env.OPENAI_API_KEY,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasEncryptionKey: !!process.env.ENCRYPTION_KEY,
      timestamp: new Date().toISOString()
    }

    // Perform a minimal AI call to verify connectivity
    const { model, systemPrompt } = getTeamMemberConfig('roxy')
    const userPrompt = 'Say hello as Roxy in one concise sentence.'
    const ai = await model.generate({
      model: model.modelId || (model as any),
      input: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      maxTokens: 80,
      temperature: 0.2
    } as any)

    const text = (ai?.outputText || ai?.text || '').toString()

    return NextResponse.json({
      status: 'success',
      agent: 'Roxy',
      response: text,
      message: 'AI service connectivity test successful!',
      environmentChecks: envChecks,
      testType: 'live_provider'
    })
  } catch (error) {
    logError('AI test error:', error)
    return NextResponse.json(
      { 
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'AI service connectivity test failed'
      },
      { status: 500 }
    )
  }
}
