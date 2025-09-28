#!/usr/bin/env node

/**
 * Production Build Script
 * Ensures proper environment variables are set during build process
 */

import { spawn } from 'child_process'
import { existsSync, copyFileSync } from 'fs'
import { join } from 'path'

console.log('🚀 Starting production build process...')

// Check if build environment file exists
const buildEnvFile = '.env.production.build'
const prodEnvFile = '.env.production'

if (!existsSync(buildEnvFile)) {
  console.error(`❌ Build environment file ${buildEnvFile} not found`)
  console.log('📝 Creating build environment file from production file...')
  
  if (existsSync(prodEnvFile)) {
    copyFileSync(prodEnvFile, buildEnvFile)
    console.log(`✅ Created ${buildEnvFile} from ${prodEnvFile}`)
  } else {
    console.error(`❌ Production environment file ${prodEnvFile} not found`)
    process.exit(1)
  }
}

// Set environment variables for build
process.env.NODE_ENV = 'production'
process.env.NEXT_PHASE = 'phase-production-build'

// Load environment variables from build file
try {
  const envContent = await import('fs').then(fs => fs.readFileSync(buildEnvFile, 'utf8'))
  const envLines = envContent.split('\n')
  
  for (const line of envLines) {
    const trimmedLine = line.trim()
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...valueParts] = trimmedLine.split('=')
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=')
        process.env[key] = value
        console.log(`📋 Set ${key}=${value.substring(0, 20)}...`)
      }
    }
  }
} catch (error) {
  console.error('❌ Failed to load build environment variables:', error)
  process.exit(1)
}

// Verify critical environment variables
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET', 'NODE_ENV']
const missingVars = requiredEnvVars.filter(varName => !process.env[varName])

if (missingVars.length > 0) {
  console.error(`❌ Missing required environment variables: ${missingVars.join(', ')}`)
  process.exit(1)
}

console.log('✅ Environment variables verified')

// Run the build command
console.log('🔨 Running Next.js build...')

const buildProcess = spawn('npm', ['run', 'build'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    NODE_ENV: 'production',
    NEXT_PHASE: 'phase-production-build'
  }
})

buildProcess.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Build completed successfully!')
  } else {
    console.error(`❌ Build failed with exit code ${code}`)
    process.exit(code)
  }
})

buildProcess.on('error', (error) => {
  console.error('❌ Build process error:', error)
  process.exit(1)
})
