#!/usr/bin/env node

/**
 * Database Check Script
 * Directly checks what tables exist in the database
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

async function checkDatabase() {
  try {
    console.log('🔍 Checking database contents...')
    
    // List all tables
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `
    
    console.log('\n📊 All Tables in Database:')
    tables.forEach(table => {
      console.log(`   ✅ ${table.table_name}`)
    })
    
    // Check specific tables we're looking for
    const targetTables = ['chat_conversations', 'chat_messages', 'competitor_activities']
    console.log('\n🎯 Target Tables Status:')
    
    for (const tableName of targetTables) {
      const exists = tables.some(t => t.table_name === tableName)
      console.log(`   ${tableName}: ${exists ? '✅ Exists' : '❌ Missing'}`)
    }
    
    // Check if there are any errors in the database
    console.log('\n🔍 Checking for any database errors...')
    
    // Try to query a simple table to make sure connection works
    try {
      const result = await sql`SELECT 1 as test`
      console.log('   ✅ Database connection is working')
    } catch (error) {
      console.log('   ❌ Database connection error:', error.message)
    }
    
  } catch (error) {
    console.error('❌ Database check failed:', error.message)
    process.exit(1)
  }
}

checkDatabase()
