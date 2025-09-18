import { unifiedBriefcase } from '@/lib/unified-briefcase'
import { logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth } from '@/lib/logger'

async function initializeDatabase() {
  try {
    logInfo('Initializing unified briefcase database...')
    await unifiedBriefcase.initialize()
    logInfo('Database initialized successfully!')
  } catch (error) {
    logError('Failed to initialize database:', error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  initializeDatabase()
}

export default initializeDatabase