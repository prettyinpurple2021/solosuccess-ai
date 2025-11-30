#!/usr/bin/env node

/**
 * Multi-Worker Development Setup Script
 * Sets up all AI workers for local development
 */

import { spawn } from 'child_process'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log('🚀 Starting SoloSuccess AI Multi-Worker Development Environment')
console.log('================================================================\n')

// Install dependencies for all workers
const workers = [
  'openai-worker',
  'google-ai-worker',
  'competitor-worker', 
  'intelligence-worker'
]

console.log('📦 Installing dependencies for all workers...\n')

// Install dependencies for each worker
for (const worker of workers) {
  const workerPath = join(__dirname, '..', 'workers', worker)
  
  try {
    console.log(`📦 Installing dependencies for ${worker}...`)
    const install = spawn('npm', ['install'], {
      cwd: workerPath,
      stdio: 'pipe',
      shell: true
    })
    
    await new Promise((resolve, reject) => {
      install.on('close', (code) => {
        if (code === 0) {
          console.log(`✅ ${worker} dependencies installed`)
          resolve()
        } else {
          console.error(`❌ Failed to install dependencies for ${worker}`)
          reject(new Error(`npm install failed for ${worker}`))
        }
      })
      
      install.on('error', reject)
    })
  } catch (error) {
    console.error(`❌ Error installing ${worker}:`, error.message)
  }
}

console.log('\n🌟 All workers ready for development!')
console.log('\n📝 To start development:')
console.log('1. Main app with all workers: npm run dev:multi')
console.log('2. Individual worker: cd workers/[worker-name] && npm run dev')
console.log('3. Deploy worker: cd workers/[worker-name] && npm run deploy:production')

console.log('\n🔗 Worker URLs (when running locally):')
console.log('- Main App: http://localhost:8787')
console.log('- OpenAI Worker: Service binding (internal)')
console.log('- Google AI Worker: Service binding (internal)')
console.log('- Competitor Worker: Service binding (internal)')
console.log('- Intelligence Worker: Service binding (internal)')

console.log('\n⚡ Multi-worker setup complete! Happy coding! 🎉')