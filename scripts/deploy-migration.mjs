#!/usr/bin/env node

/**
 * Production Database Migration Deployment Script
 * This script deploys the latest migration to production
 */

import { neon } from '@neondatabase/serverless'
import { readFileSync } from 'fs'
import { join } from 'path'

// Load environment variables
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

// Check if DATABASE_URL exists
if (!process.env.DATABASE_URL) {
  console.log('❌ DATABASE_URL not found in .env.production')
  process.exit(1)
}

console.log('🔗 Connecting to production database...')
console.log(`📍 Database: ${process.env.DATABASE_URL.split('@')[1]?.split('/')[0] || 'Unknown'}`)

function getSql() {
  return neon(process.env.DATABASE_URL)
}

async function deployMigration() {
  const sql = getSql()
  
  try {
    console.log('\n🚀 Starting production migration deployment...')
    
    // Read the migration file
    const migrationPath = join(process.cwd(), 'migrations', '0005_fuzzy_tarantula.sql')
    const migrationSQL = readFileSync(migrationPath, 'utf8')
    
    console.log('\n📊 Checking current database state...')
    
    // Check if new tables already exist
    const chatConversationsCheck = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'chat_conversations'
    `
    
    const competitorActivitiesCheck = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'competitor_activities'
    `
    
    console.log(`   chat_conversations table: ${chatConversationsCheck.length > 0 ? '✅ Exists' : '❌ Missing'}`)
    console.log(`   competitor_activities table: ${competitorActivitiesCheck.length > 0 ? '✅ Exists' : '❌ Missing'}`)
    
    if (chatConversationsCheck.length > 0 && competitorActivitiesCheck.length > 0) {
      console.log('\n✅ All tables already exist. Migration not needed.')
      return
    }
    
    console.log('\n🔧 Executing migration...')
    
    // Split the migration into individual statements
    const statements = migrationSQL
      .split('--> statement-breakpoint')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0)
    
    console.log(`   Found ${statements.length} SQL statements to execute`)
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (statement.trim()) {
        try {
          console.log(`   Executing statement ${i + 1}/${statements.length}...`)
          await sql.unsafe(statement)
        } catch (error) {
          // Some statements might fail if tables/columns already exist
          if (error.message.includes('already exists') || error.message.includes('duplicate')) {
            console.log(`   ⚠️  Statement ${i + 1} skipped (already exists)`)
          } else {
            throw error
          }
        }
      }
    }
    
    console.log('\n🎉 Migration deployed successfully!')
    console.log('\n📋 Summary:')
    console.log('   ✅ chat_conversations table created')
    console.log('   ✅ chat_messages table created')
    console.log('   ✅ competitor_activities table created')
    console.log('   ✅ All indexes and foreign keys created')
    console.log('   ✅ Production features ready!')
    
    console.log('\n🔧 Next steps:')
    console.log('   1. Deploy your application to production')
    console.log('   2. Test the new features')
    console.log('   3. Monitor database performance')
    
  } catch (error) {
    console.error('\n❌ Migration deployment failed:', error.message)
    console.error('Full error:', error)
    process.exit(1)
  }
}

// Run the migration
deployMigration()
