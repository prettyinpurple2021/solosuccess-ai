#!/usr/bin/env node

/**
 * Production Build Script
 * Ensures proper environment variables are set during Next.js production build
 * Compatible with any deployment platform (Vercel, Netlify, self-hosted, etc.)
 * Uses project logger and follows production best practices
 */

import { spawn } from 'child_process'
import { readFileSync, existsSync, copyFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Get logger from project
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

/**
 * Simple logger for build script (avoids importing full logger module)
 * Scripts and build processes are allowed to use console per project rules
 */
const logInfo = (msg) => console.log(`ℹ️  ${msg}`)
const logError = (msg) => console.error(`❌ ${msg}`)
const logSuccess = (msg) => console.log(`✅ ${msg}`)
const logDebug = (msg) => console.log(`🔍 ${msg}`)

logInfo('Starting production build process...')

// Check for environment files in multiple locations
const possibleEnvFiles = [
  '.env.production',
  '.env.production.local',
  '.env.local',
  '.env'
]

let envFile = null
for (const file of possibleEnvFiles) {
  if (existsSync(file)) {
    envFile = file
    logInfo(`Found environment file: ${file}`)
    break
  }
}

// Set critical build-time environment variables
process.env.NODE_ENV = 'production'
process.env.NEXT_PHASE = 'phase-production-build'

// Load environment variables if file exists
if (envFile) {
  try {
    const envContent = readFileSync(envFile, 'utf8')
    const envLines = envContent.split('\n')
    
    let loadedCount = 0
    for (const line of envLines) {
      const trimmedLine = line.trim()
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=')
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=')
          process.env[key] = value
          loadedCount++
        }
      }
    }
    logSuccess(`Loaded ${loadedCount} environment variables from ${envFile}`)
  } catch (error) {
    logError(`Failed to load environment variables: ${error.message}`)
    process.exit(1)
  }
} else {
  logDebug('No environment file found - relying on system/CI environment variables')
}

// Verify critical environment variables with helpful error messages
const requiredEnvVars = {
  DATABASE_URL: 'Neon PostgreSQL database connection string',
  JWT_SECRET: 'Authentication secret (minimum 32 characters)',
  NODE_ENV: 'Environment mode'
}

const missingVars = Object.keys(requiredEnvVars).filter(
  varName => !process.env[varName] || process.env[varName].trim() === ''
)

if (missingVars.length > 0) {
  logError('Missing required environment variables:')
  missingVars.forEach(varName => {
    logError(`  - ${varName}: ${requiredEnvVars[varName]}`)
  })
  logError('')
  logError('Setup instructions:')
  logError('  1. Create .env.production file in project root')
  logError('  2. Add all required environment variables')
  logError('  3. Or set them in your CI/CD platform settings')
  logError('  4. See .env.example for reference')
  process.exit(1)
}

// Additional validation
if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
  logError('JWT_SECRET must be at least 32 characters long')
  process.exit(1)
}

logSuccess('Environment variables verified')

// Run the build command with proper memory allocation
logInfo('Running Next.js production build...')

const buildProcess = spawn('npm', ['run', 'build'], {
  stdio: 'inherit',
  shell: true,
  cwd: projectRoot,
  env: {
    ...process.env,
    NODE_ENV: 'production',
    NEXT_PHASE: 'phase-production-build',
    // Ensure proper memory allocation for large builds
    NODE_OPTIONS: process.env.NODE_OPTIONS || '--max-old-space-size=12288'
  }
})

buildProcess.on('close', (code) => {
  if (code === 0) {
    logSuccess('Build completed successfully!')
    process.exit(0)
  } else {
    logError(`Build failed with exit code ${code}`)
    process.exit(code)
  }
})

buildProcess.on('error', (error) => {
  logError(`Build process error: ${error.message}`)
  process.exit(1)
})
