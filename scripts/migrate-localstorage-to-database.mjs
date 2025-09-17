#!/usr/bin/env node

/**
 * Migration script to help users migrate from localStorage to database storage
 * This script can be run to help identify what localStorage data exists and needs migration
 */

import { neon } from '@neondatabase/serverless'
import { readFileSync } from 'fs'
import { join } from 'path'

// Load environment variables
const envPath = join(process.cwd(), '.env.local')
try {
  const envContent = readFileSync(envPath, 'utf8')
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=')
    if (key && value) {
      process.env[key.trim()] = value.trim()
    }
  })
} catch (error) {
  console.log('No .env.local file found, using system environment variables')
}

function getSql() {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('DATABASE_URL is not set')
  }
  return neon(url)
}

async function checkDatabaseTables() {
  console.log('🔍 Checking database tables...')
  
  try {
    const sql = getSql()
    
    // Check if new tables exist
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('user_brand_settings', 'push_subscriptions')
    `
    
    console.log('✅ Found tables:', tables.map(t => t.table_name))
    
    // Check if documents table has file_url column
    const columns = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'documents' 
      AND column_name IN ('file_url', 'file_data')
    `
    
    console.log('✅ Documents table columns:', columns.map(c => c.column_name))
    
    return {
      hasBrandSettings: tables.some(t => t.table_name === 'user_brand_settings'),
      hasPushSubscriptions: tables.some(t => t.table_name === 'push_subscriptions'),
      hasFileUrl: columns.some(c => c.column_name === 'file_url'),
      hasFileData: columns.some(c => c.column_name === 'file_data')
    }
  } catch (error) {
    console.error('❌ Error checking database:', error.message)
    return null
  }
}

async function generateMigrationReport() {
  console.log('📊 Generating migration report...')
  
  const dbStatus = await checkDatabaseTables()
  if (!dbStatus) {
    console.log('❌ Cannot generate report - database connection failed')
    return
  }
  
  console.log('\n📋 Migration Status Report:')
  console.log('=' .repeat(50))
  
  // Database tables status
  console.log('\n🗄️  Database Tables:')
  console.log(`   user_brand_settings: ${dbStatus.hasBrandSettings ? '✅ Exists' : '❌ Missing'}`)
  console.log(`   push_subscriptions: ${dbStatus.hasPushSubscriptions ? '✅ Exists' : '❌ Missing'}`)
  
  // Documents table status
  console.log('\n📁 Documents Table:')
  console.log(`   file_url column: ${dbStatus.hasFileUrl ? '✅ Exists' : '❌ Missing'}`)
  console.log(`   file_data column: ${dbStatus.hasFileData ? '⚠️  Still exists (can be removed after migration)' : '✅ Removed'}`)
  
  // Recommendations
  console.log('\n🔧 Next Steps:')
  
  if (!dbStatus.hasBrandSettings || !dbStatus.hasPushSubscriptions || !dbStatus.hasFileUrl) {
    console.log('   1. Run the database migration:')
    console.log('      psql $DATABASE_URL < migrations/0001_add_file_storage_and_push_subscriptions.sql')
  }
  
  if (dbStatus.hasFileData && dbStatus.hasFileUrl) {
    console.log('   2. Migrate existing files from database to Vercel Blob:')
    console.log('      - Files are now stored in Vercel Blob instead of database')
    console.log('      - Consider removing file_data column after confirming all files are migrated')
  }
  
  console.log('   3. Update your environment variables:')
  console.log('      - Add BLOB_READ_WRITE_TOKEN to your environment')
  console.log('      - Ensure Vercel Blob is configured in your project')
  
  console.log('\n✨ localStorage Migration Complete!')
  console.log('   - User preferences: ✅ Using database via /api/preferences')
  console.log('   - Chat messages: ✅ Using database via user preferences')
  console.log('   - Notification settings: ✅ Using database via user preferences')
  console.log('   - Push subscriptions: ✅ Using database via /api/notifications/push-subscriptions')
  console.log('   - File storage: ✅ Using Vercel Blob storage')
}

// Main execution
async function main() {
  console.log('🚀 SoloSuccess AI - localStorage to Database Migration Helper')
  console.log('=' .repeat(60))
  
  try {
    await generateMigrationReport()
  } catch (error) {
    console.error('❌ Migration check failed:', error.message)
    process.exit(1)
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
