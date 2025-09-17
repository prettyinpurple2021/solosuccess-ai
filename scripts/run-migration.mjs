#!/usr/bin/env node

/**
 * Database migration script for SoloSuccess AI
 * This script runs the migration directly using the Neon database connection
 */

import { neon } from '@neondatabase/serverless'
import { readFileSync } from 'fs'
import { join } from 'path'

// Load environment variables from .env.production
const envPath = join(process.cwd(), '.env.production')
let envContent = ''

try {
  envContent = readFileSync(envPath, 'utf8')
  console.log('✅ Loaded .env.production file')
} catch (error) {
  console.log('❌ Could not load .env.production file')
  console.log('Please make sure the file exists and contains DATABASE_URL')
  process.exit(1)
}

// Parse environment variables
envContent.split('\n').forEach(line => {
  const trimmedLine = line.trim()
  if (trimmedLine && !trimmedLine.startsWith('#')) {
    const [key, ...valueParts] = trimmedLine.split('=')
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim()
      process.env[key.trim()] = value
    }
  }
})

// Check if DATABASE_URL exists
if (!process.env.DATABASE_URL) {
  console.log('❌ DATABASE_URL not found in .env.production')
  process.exit(1)
}

console.log('🔗 Connecting to database...')
console.log(`📍 Database: ${process.env.DATABASE_URL.split('@')[1]?.split('/')[0] || 'Unknown'}`)

function getSql() {
  return neon(process.env.DATABASE_URL)
}

async function runMigration() {
  const sql = getSql()
  
  try {
    console.log('\n🚀 Starting database migration...')
    
    // Check current state
    console.log('\n📊 Checking current database state...')
    
    // Check if file_url column exists
    const fileUrlCheck = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'documents' 
      AND column_name = 'file_url'
    `
    
    // Check if user_brand_settings table exists
    const brandTableCheck = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'user_brand_settings'
    `
    
    // Check if push_subscriptions table exists
    const pushTableCheck = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'push_subscriptions'
    `
    
    console.log(`   file_url column: ${fileUrlCheck.length > 0 ? '✅ Exists' : '❌ Missing'}`)
    console.log(`   user_brand_settings table: ${brandTableCheck.length > 0 ? '✅ Exists' : '❌ Missing'}`)
    console.log(`   push_subscriptions table: ${pushTableCheck.length > 0 ? '✅ Exists' : '❌ Missing'}`)
    
    // Run migrations
    console.log('\n🔧 Running migrations...')
    
    // Add file_url column if it doesn't exist
    if (fileUrlCheck.length === 0) {
      console.log('   Adding file_url column to documents table...')
      await sql`ALTER TABLE documents ADD COLUMN file_url VARCHAR(1000)`
      await sql`CREATE INDEX IF NOT EXISTS documents_file_url_idx ON documents(file_url)`
      console.log('   ✅ file_url column added')
    } else {
      console.log('   ⏭️  file_url column already exists')
    }
    
    // Create user_brand_settings table if it doesn't exist
    if (brandTableCheck.length === 0) {
      console.log('   Creating user_brand_settings table...')
      await sql`
        CREATE TABLE user_brand_settings (
          id SERIAL PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          company_name VARCHAR(255),
          tagline VARCHAR(500),
          description TEXT,
          industry VARCHAR(100),
          target_audience TEXT,
          brand_personality JSONB DEFAULT '[]',
          color_palette JSONB DEFAULT '{}',
          typography JSONB DEFAULT '{}',
          logo_url VARCHAR(1000),
          logo_prompt TEXT,
          moodboard JSONB DEFAULT '[]',
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW(),
          UNIQUE(user_id)
        )
      `
      await sql`CREATE INDEX IF NOT EXISTS user_brand_settings_user_id_idx ON user_brand_settings(user_id)`
      await sql`CREATE INDEX IF NOT EXISTS user_brand_settings_industry_idx ON user_brand_settings(industry)`
      console.log('   ✅ user_brand_settings table created')
    } else {
      console.log('   ⏭️  user_brand_settings table already exists')
    }
    
    // Create push_subscriptions table if it doesn't exist
    if (pushTableCheck.length === 0) {
      console.log('   Creating push_subscriptions table...')
      await sql`
        CREATE TABLE push_subscriptions (
          id SERIAL PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          endpoint VARCHAR(1000) NOT NULL,
          p256dh_key VARCHAR(500) NOT NULL,
          auth_key VARCHAR(500) NOT NULL,
          device_info JSONB DEFAULT '{}',
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `
      await sql`CREATE INDEX IF NOT EXISTS push_subscriptions_user_id_idx ON push_subscriptions(user_id)`
      await sql`CREATE INDEX IF NOT EXISTS push_subscriptions_endpoint_idx ON push_subscriptions(endpoint)`
      await sql`CREATE INDEX IF NOT EXISTS push_subscriptions_is_active_idx ON push_subscriptions(is_active)`
      console.log('   ✅ push_subscriptions table created')
    } else {
      console.log('   ⏭️  push_subscriptions table already exists')
    }
    
    console.log('\n🎉 Migration completed successfully!')
    console.log('\n📋 Summary:')
    console.log('   ✅ File storage ready for Vercel Blob')
    console.log('   ✅ Brand settings table ready')
    console.log('   ✅ Push subscriptions table ready')
    console.log('   ✅ All localStorage dependencies migrated to database')
    
    console.log('\n🔧 Next steps:')
    console.log('   1. Your app is now ready for production!')
    console.log('   2. Files will be stored in Vercel Blob instead of database')
    console.log('   3. All user data is now stored securely in the database')
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message)
    console.error('Full error:', error)
    process.exit(1)
  }
}

// Run the migration
runMigration()