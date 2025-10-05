#!/usr/bin/env node

/**
 * Cloudflare Secrets Setup Script
 * Sets up all required secrets in Cloudflare Workers for production deployment
 * Run: node scripts/setup-cloudflare-secrets.mjs
 */

import { readFileSync, existsSync } from 'fs'
import { execSync } from 'child_process'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log('🔐 Setting up Cloudflare secrets for production deployment...')

// Load environment variables from .env.production
const envFile = join(__dirname, '..', '.env.production')
if (!existsSync(envFile)) {
  console.error('❌ .env.production file not found!')
  console.log('Please ensure .env.production exists with all required variables.')
  process.exit(1)
}

const envContent = readFileSync(envFile, 'utf8')
const envVars = {}

// Parse environment variables
envContent.split('\n').forEach(line => {
  const trimmedLine = line.trim()
  if (trimmedLine && !trimmedLine.startsWith('#')) {
    const [key, ...valueParts] = trimmedLine.split('=')
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').replace(/^['"]|['"]$/g, '') // Remove quotes
      envVars[key] = value
    }
  }
})

// Define secrets that should be stored in Cloudflare (not public vars)
const SECRETS = [
  'DATABASE_URL',
  'JWT_SECRET', 
  'BETTER_AUTH_SECRET',
  'GITHUB_CLIENT_SECRET',
  'RESEND_API_KEY',
  'OPENAI_API_KEY',
  'ANTHROPIC_API_KEY',
  'GOOGLE_AI_API_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'CLOUDFLARE_API_TOKEN',
  'SENTRY_DSN'
]

// Define public variables (non-secret, set in wrangler.toml)
const PUBLIC_VARS = [
  'NODE_ENV',
  'NEXT_PUBLIC_APP_URL',
  'NEXT_PUBLIC_SITE_URL',
  'FROM_EMAIL',
  'CUSTOM_DOMAINS',
  'NEXT_PUBLIC_PERFORMANCE_MONITOR',
  'NEXT_PUBLIC_DISABLE_EXIT_INTENT',
  'GITHUB_CLIENT_ID',
  'STRIPE_PUBLISHABLE_KEY',
  'CLOUDFLARE_ACCOUNT_ID',
  'CLOUDFLARE_ZONE_ID'
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

// Check if wrangler is installed
try {
  execSync('wrangler --version', { stdio: 'pipe' })
} catch (error) {
  console.error('❌ Wrangler CLI not found. Please install with: npm install -g wrangler')
  process.exit(1)
}

console.log('📋 Found environment variables:', Object.keys(envVars).length)

// Set production secrets
console.log('\n🏭 Setting up PRODUCTION environment secrets...')
SECRETS.forEach(secretName => {
  if (envVars[secretName]) {
    const command = `echo "${envVars[secretName]}" | wrangler pages secret put ${secretName} --env production`
    runCommand(command, `Setting production secret: ${secretName}`)
  } else {
    console.log(`⚠️  Warning: ${secretName} not found in .env.production`)
  }
})

// Set preview secrets (can be same as production for most cases)
console.log('\n🔄 Setting up PREVIEW environment secrets...')
SECRETS.forEach(secretName => {
  if (envVars[secretName]) {
    const command = `echo "${envVars[secretName]}" | wrangler pages secret put ${secretName} --env preview`
    runCommand(command, `Setting preview secret: ${secretName}`)
  }
})

console.log('\n📋 Public variables (set in wrangler.toml):')
PUBLIC_VARS.forEach(varName => {
  if (envVars[varName]) {
    console.log(`✅ ${varName}=${envVars[varName]}`)
  } else {
    console.log(`⚠️  ${varName}: Not set`)
  }
})

console.log('\n🎉 Cloudflare secrets setup completed!')
console.log('\n📝 Next steps:')
console.log('1. Verify secrets with: wrangler pages secret list --env production')
console.log('2. Test deployment with: npm run build:cf')
console.log('3. Preview deployment with: npm run preview:cf')
console.log('4. Deploy to production with: npm run deploy:cf')

console.log('\n⚠️  SECURITY REMINDER:')
console.log('- Remove plaintext secrets from .env files before committing to Git')
console.log('- Use environment-specific secret rotation procedures')
console.log('- Monitor Cloudflare audit logs for secret access')