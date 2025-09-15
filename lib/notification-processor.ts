import { notificationJobQueue } from './notification-job-queue'

// Job processor configuration
const PROCESSOR_CONFIG = {
  // Check for jobs every 30 seconds
  intervalMs: 30000,
  // Auto-start processor in production
  autoStart: process.env.NODE_ENV === 'production',
  // Enable verbose logging
  enableLogging: true
}

let processorStarted = false

/**
 * Initialize and start the notification job processor
 */
export async function initializeNotificationProcessor(): Promise<void> {
  if (processorStarted) {
    console.log('Notification processor already started')
    return
  }

  try {
    // Initialize the job queue
    await notificationJobQueue.initialize()
    
    // Start the processor
    notificationJobQueue.startProcessor(PROCESSOR_CONFIG.intervalMs)
    
    processorStarted = true
    
    if (PROCESSOR_CONFIG.enableLogging) {
      console.log('✅ Notification job processor initialized and started')
      console.log(`   - Interval: ${PROCESSOR_CONFIG.intervalMs / 1000}s`)
      console.log(`   - Environment: ${process.env.NODE_ENV}`)
      
      // Log initial stats
      const stats = await notificationJobQueue.getStats()
      console.log(`   - Pending jobs: ${stats.pending}`)
      console.log(`   - Processing jobs: ${stats.processing}`)
      console.log(`   - Total jobs: ${stats.total}`)
    }

    // Set up cleanup job (runs once per day)
    if (process.env.NODE_ENV === 'production') {
      setInterval(async () => {
        try {
          const deletedCount = await notificationJobQueue.cleanup(30)
          if (deletedCount > 0 && PROCESSOR_CONFIG.enableLogging) {
            console.log(`🧹 Cleaned up ${deletedCount} old notification jobs`)
          }
        } catch (error) {
          console.error('Error during job cleanup:', error)
        }
      }, 24 * 60 * 60 * 1000) // 24 hours
    }

  } catch (error) {
    console.error('❌ Failed to initialize notification processor:', error)
    throw error
  }
}

/**
 * Stop the notification job processor
 */
export function stopNotificationProcessor(): void {
  notificationJobQueue.stopProcessor()
  processorStarted = false
  console.log('🛑 Notification job processor stopped')
}

/**
 * Get processor status
 */
export function getProcessorStatus(): { started: boolean, config: typeof PROCESSOR_CONFIG } {
  return {
    started: processorStarted,
    config: PROCESSOR_CONFIG
  }
}

// Auto-start in production
if (PROCESSOR_CONFIG.autoStart && typeof window === 'undefined') {
  // Only run on server-side
  initializeNotificationProcessor().catch(error => {
    console.error('Failed to auto-start notification processor:', error)
  })
}