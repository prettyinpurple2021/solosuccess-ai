#!/usr/bin/env node

/**
 * Check Competitor Profiles Table Structure
 */

import { neon } from '@neondatabase/serverless'
import { readFileSync } from 'fs'
import { join } from 'path'

// Load environment variables
const envPath = join(process.cwd(), '.env.production')
let envContent = ''

try {
  envContent = readFileSync(envPath, 'utf8')
} catch (error) {
  console.log('❌ Could not load .env.production file')
  process.exit(1)
}

// Parse environment variables
envContent.split('\n').forEach(line => {
  const trimmedLine = line.trim()
  if (trimmedLine && !trimmedLine.startsWith('#')) {
    const [key, ...valueParts] = trimmedLine.split('=')
    if (key && valueParts.length > 0) {
      let value = valueParts.join('=').trim()
      // Remove surrounding quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }
      process.env[key.trim()] = value
    }
  }
})

if (!process.env.DATABASE_URL) {
  console.log('❌ DATABASE_URL not found')
  process.exit(1)
}

const sql = neon(process.env.DATABASE_URL)

async function checkCompetitorProfiles() {
  try {
    console.log('🔍 Checking competitor_profiles table structure...')
    
    // Get competitor_profiles table structure
    const columns = await sql`
      SELECT column_name, data_type, character_maximum_length, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'competitor_profiles' 
      AND table_schema = 'public'
      ORDER BY ordinal_position
    `
    
    console.log('\n📊 Competitor Profiles Table Structure:')
    columns.forEach(col => {
      console.log(`   ${col.column_name}: ${col.data_type}${col.character_maximum_length ? `(${col.character_maximum_length})` : ''} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'}`)
    })
    
    // Check if there are any existing competitor profiles
    const profileCount = await sql`SELECT COUNT(*) as count FROM competitor_profiles`
    console.log(`\n🏢 Total competitor profiles in database: ${profileCount[0].count}`)
    
    if (profileCount[0].count > 0) {
      // Get a sample competitor profile ID
      const sampleProfile = await sql`SELECT id FROM competitor_profiles LIMIT 1`
      console.log(`📝 Sample competitor profile ID: ${sampleProfile[0].id}`)
      console.log(`📝 Sample competitor profile ID type: ${typeof sampleProfile[0].id}`)
    }
    
  } catch (error) {
    console.error('❌ Check failed:', error.message)
    process.exit(1)
  }
}

checkCompetitorProfiles()
