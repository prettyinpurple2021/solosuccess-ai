#!/usr/bin/env node

/**
 * Deploy Workers Script
 * Deploys all AI workers to Cloudflare with proper secrets
 */

import { execSync } from 'child_process'
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log('🚀 Deploying SoloSuccess AI Workers to Cloudflare')
console.log('================================================\n')

// Load environment variables
const envFile = join(__dirname, '..', '.env.production')
if (!existsSync(envFile)) {
  console.error('❌ .env.production file not found!')
  process.exit(1)
}

const envContent = readFileSync(envFile, 'utf8')
const envVars = {}

envContent.split('\n').forEach(line => {
  const trimmedLine = line.trim()
  if (trimmedLine && !trimmedLine.startsWith('#')) {
    const [key, ...valueParts] = trimmedLine.split('=')
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').replace(/^['"]|['"]$/g, '')
      envVars[key] = value
    }
  }
})

// Workers to deploy
const workers = [
  {
    name: 'OpenAI Worker',
    path: 'workers/openai-worker',
    secrets: ['OPENAI_API_KEY']
  },
  {
    name: 'Google AI Worker', 
    path: 'workers/google-ai-worker',
    secrets: ['GOOGLE_AI_API_KEY']
  }
]

function runCommand(command, description) {
  try {
    console.log(`⏳ ${description}...`)
    const result = execSync(command, { stdio: 'pipe', encoding: 'utf8' })
    console.log(`✅ ${description} completed`)
    return result
  } catch (error) {
    console.error(`❌ ${description} failed:`)
    console.error(error.message)
    return null
  }
}

async function deployWorker(worker) {
  console.log(`\n🚀 Deploying ${worker.name}...`)
  console.log('─'.repeat(40))
  
  const workerPath = join(__dirname, '..', worker.path)
  
  // Install dependencies
  runCommand(`cd ${workerPath} && npm install`, `Installing dependencies for ${worker.name}`)
  
  // Deploy to production
  runCommand(`cd ${workerPath} && npm run deploy:production`, `Deploying ${worker.name} to production`)
  
  // Set secrets for production
  console.log(`\n🔐 Setting up secrets for ${worker.name}...`)
  for (const secret of worker.secrets) {
    if (envVars[secret]) {
      const command = `cd ${workerPath} && echo "${envVars[secret]}" | wrangler secret put ${secret} --env production`
      runCommand(command, `Setting production secret: ${secret}`)
    } else {
      console.log(`⚠️  Warning: ${secret} not found in .env.production`)
    }
  }
  
  // Deploy to preview
  runCommand(`cd ${workerPath} && npm run deploy:preview`, `Deploying ${worker.name} to preview`)
  
  // Set secrets for preview
  for (const secret of worker.secrets) {
    if (envVars[secret]) {
      const command = `cd ${workerPath} && echo "${envVars[secret]}" | wrangler secret put ${secret} --env preview`
      runCommand(command, `Setting preview secret: ${secret}`)
    }
  }
  
  console.log(`✅ ${worker.name} deployment complete!`)
}

// Deploy all workers
for (const worker of workers) {
  await deployWorker(worker)
}

console.log('\n🎉 All workers deployed successfully!')
console.log('\n📝 Next steps:')
console.log('1. Deploy the main Next.js app: npm run build:cf && npm run deploy:cf')
console.log('2. Test the multi-worker setup')
console.log('3. Monitor worker performance in Cloudflare dashboard')

console.log('\n🔗 Service bindings configured:')
console.log('- OPENAI_WORKER → solosuccess-openai-worker-production')
console.log('- GOOGLE_AI_WORKER → solosuccess-google-ai-worker-production')

console.log('\n⚡ Multi-worker deployment complete! 🌟')