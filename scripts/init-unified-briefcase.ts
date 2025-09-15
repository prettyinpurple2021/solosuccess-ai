import { unifiedBriefcase } from '@/lib/unified-briefcase'

async function initializeDatabase() {
  try {
    console.log('Initializing unified briefcase database...')
    await unifiedBriefcase.initialize()
    console.log('Database initialized successfully!')
  } catch (error) {
    console.error('Failed to initialize database:', error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  initializeDatabase()
}

export default initializeDatabase