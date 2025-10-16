import { logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth } from '@/lib/logger'
import { NextResponse} from 'next/server'
// AI config temporarily disabled
// import { getTeamMemberConfig } from '@/lib/ai-config'


export const runtime = 'edge'

export async function GET() {
  try {
    logWarn('AI test route temporarily using fallback response during migration')
    
    // Simple connectivity test without external API calls
    const envChecks = {
      nodeEnv: process.env.NODE_ENV,
      hasOpenAiKey: !!process.env.OPENAI_API_KEY,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasEncryptionKey: !!process.env.ENCRYPTION_KEY,
      timestamp: new Date().toISOString()
    }

    // Fallback response while AI workers are being integrated
    const fallbackResponse = "Hi! I'm Roxy, your AI assistant. The AI testing system is currently being migrated to use workers for better performance."

    return NextResponse.json({
      status: 'success',
      agent: 'Roxy',
      response: fallbackResponse,
      message: 'AI service test running with fallback response during migration!',
      environmentChecks: envChecks,
      testType: 'fallback_migration'
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
