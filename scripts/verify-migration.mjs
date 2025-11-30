#!/usr/bin/env node

/**
 * Migration Verification Script
 * Verifies that the migration was applied successfully
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

async function verifyMigration() {
  try {
    console.log('🔍 Verifying migration...')
    
    // Check if new tables exist
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('chat_conversations', 'chat_messages', 'competitor_activities')
      ORDER BY table_name
    `
    
    console.log('\n📊 Table Status:')
    const expectedTables = ['chat_conversations', 'chat_messages', 'competitor_activities']
    
    for (const table of expectedTables) {
      const exists = tables.some(t => t.table_name === table)
      console.log(`   ${table}: ${exists ? '✅ Exists' : '❌ Missing'}`)
    }
    
    // Check indexes
    console.log('\n🔍 Index Status:')
    const indexes = await sql`
      SELECT indexname, tablename 
      FROM pg_indexes 
      WHERE tablename IN ('chat_conversations', 'chat_messages', 'competitor_activities')
      ORDER BY tablename, indexname
    `
    
    const expectedIndexes = [
      'chat_conversations_user_id_idx',
      'chat_conversations_agent_id_idx',
      'chat_messages_conversation_id_idx',
      'competitor_activities_competitor_id_idx'
    ]
    
    for (const index of expectedIndexes) {
      const exists = indexes.some(i => i.indexname === index)
      console.log(`   ${index}: ${exists ? '✅ Exists' : '❌ Missing'}`)
    }
    
    // Check foreign keys
    console.log('\n🔗 Foreign Key Status:')
    const foreignKeys = await sql`
      SELECT 
        tc.table_name, 
        kcu.column_name, 
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name 
      FROM 
        information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY' 
      AND tc.table_name IN ('chat_conversations', 'chat_messages', 'competitor_activities')
      ORDER BY tc.table_name, kcu.column_name
    `
    
    console.log(`   Found ${foreignKeys.length} foreign key constraints`)
    foreignKeys.forEach(fk => {
      console.log(`   ${fk.table_name}.${fk.column_name} → ${fk.foreign_table_name}.${fk.foreign_column_name}`)
    })
    
    console.log('\n✅ Migration verification complete!')
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message)
    process.exit(1)
  }
}

verifyMigration()
