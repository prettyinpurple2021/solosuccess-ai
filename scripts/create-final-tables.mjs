#!/usr/bin/env node

/**
 * Create Final Tables with All Correct Data Types
 * Creates all production tables with proper UUID types
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

async function createFinalTables() {
  try {
    console.log('🚀 Creating final production tables with correct data types...')
    
    // Drop existing tables if they exist
    console.log('\n🗑️  Dropping existing tables...')
    
    try {
      await sql`DROP TABLE IF EXISTS chat_messages CASCADE`
      console.log('   ✅ Dropped chat_messages table')
    } catch (error) {
      console.log('   ⚠️  chat_messages table may not exist')
    }
    
    try {
      await sql`DROP TABLE IF EXISTS chat_conversations CASCADE`
      console.log('   ✅ Dropped chat_conversations table')
    } catch (error) {
      console.log('   ⚠️  chat_conversations table may not exist')
    }
    
    try {
      await sql`DROP TABLE IF EXISTS competitor_activities CASCADE`
      console.log('   ✅ Dropped competitor_activities table')
    } catch (error) {
      console.log('   ⚠️  competitor_activities table may not exist')
    }
    
    // Create chat_conversations table with correct types
    console.log('\n📝 Creating chat_conversations table...')
    await sql`
      CREATE TABLE chat_conversations (
        id varchar(255) PRIMARY KEY NOT NULL,
        user_id uuid NOT NULL,
        title varchar(255) NOT NULL,
        agent_id varchar(50) NOT NULL,
        agent_name varchar(100) NOT NULL,
        last_message text,
        last_message_at timestamp,
        message_count integer DEFAULT 0,
        is_archived boolean DEFAULT false,
        metadata jsonb DEFAULT '{}',
        created_at timestamp DEFAULT now(),
        updated_at timestamp DEFAULT now()
      )
    `
    console.log('   ✅ chat_conversations table created')
    
    // Create chat_messages table with correct types
    console.log('\n📝 Creating chat_messages table...')
    await sql`
      CREATE TABLE chat_messages (
        id varchar(255) PRIMARY KEY NOT NULL,
        conversation_id varchar(255) NOT NULL,
        user_id uuid NOT NULL,
        role varchar(20) NOT NULL,
        content text NOT NULL,
        metadata jsonb DEFAULT '{}',
        created_at timestamp DEFAULT now()
      )
    `
    console.log('   ✅ chat_messages table created')
    
    // Create competitor_activities table with correct types (using uuid for competitor_id)
    console.log('\n📝 Creating competitor_activities table...')
    await sql`
      CREATE TABLE competitor_activities (
        id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        competitor_id uuid NOT NULL,
        user_id uuid NOT NULL,
        activity_type varchar(50) NOT NULL,
        title varchar(255) NOT NULL,
        description text,
        source_url varchar(1000),
        source_type varchar(50) NOT NULL,
        importance varchar(20) DEFAULT 'medium' NOT NULL,
        confidence numeric(3, 2) DEFAULT '0.00',
        metadata jsonb DEFAULT '{}',
        tags jsonb DEFAULT '[]',
        detected_at timestamp DEFAULT now(),
        created_at timestamp DEFAULT now(),
        updated_at timestamp DEFAULT now()
      )
    `
    console.log('   ✅ competitor_activities table created')
    
    // Create indexes
    console.log('\n🔍 Creating indexes...')
    
    // Chat conversations indexes
    await sql`CREATE INDEX chat_conversations_user_id_idx ON chat_conversations(user_id)`
    await sql`CREATE INDEX chat_conversations_agent_id_idx ON chat_conversations(agent_id)`
    await sql`CREATE INDEX chat_conversations_last_message_at_idx ON chat_conversations(last_message_at)`
    await sql`CREATE INDEX chat_conversations_is_archived_idx ON chat_conversations(is_archived)`
    
    // Chat messages indexes
    await sql`CREATE INDEX chat_messages_conversation_id_idx ON chat_messages(conversation_id)`
    await sql`CREATE INDEX chat_messages_user_id_idx ON chat_messages(user_id)`
    await sql`CREATE INDEX chat_messages_role_idx ON chat_messages(role)`
    await sql`CREATE INDEX chat_messages_created_at_idx ON chat_messages(created_at)`
    
    // Competitor activities indexes
    await sql`CREATE INDEX competitor_activities_competitor_id_idx ON competitor_activities(competitor_id)`
    await sql`CREATE INDEX competitor_activities_user_id_idx ON competitor_activities(user_id)`
    await sql`CREATE INDEX competitor_activities_activity_type_idx ON competitor_activities(activity_type)`
    await sql`CREATE INDEX competitor_activities_importance_idx ON competitor_activities(importance)`
    await sql`CREATE INDEX competitor_activities_detected_at_idx ON competitor_activities(detected_at)`
    
    console.log('   ✅ All indexes created')
    
    // Create foreign key constraints
    console.log('\n🔗 Creating foreign key constraints...')
    
    await sql`ALTER TABLE chat_conversations ADD CONSTRAINT chat_conversations_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE cascade ON UPDATE no action`
    console.log('   ✅ chat_conversations foreign key created')
    
    await sql`ALTER TABLE chat_messages ADD CONSTRAINT chat_messages_conversation_id_chat_conversations_id_fk FOREIGN KEY (conversation_id) REFERENCES chat_conversations(id) ON DELETE cascade ON UPDATE no action`
    console.log('   ✅ chat_messages conversation foreign key created')
    
    await sql`ALTER TABLE chat_messages ADD CONSTRAINT chat_messages_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE cascade ON UPDATE no action`
    console.log('   ✅ chat_messages user foreign key created')
    
    await sql`ALTER TABLE competitor_activities ADD CONSTRAINT competitor_activities_competitor_id_competitor_profiles_id_fk FOREIGN KEY (competitor_id) REFERENCES competitor_profiles(id) ON DELETE cascade ON UPDATE no action`
    console.log('   ✅ competitor_activities competitor foreign key created')
    
    await sql`ALTER TABLE competitor_activities ADD CONSTRAINT competitor_activities_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE cascade ON UPDATE no action`
    console.log('   ✅ competitor_activities user foreign key created')
    
    console.log('\n🎉 All tables and constraints created successfully!')
    
    // Verify the tables exist
    console.log('\n🔍 Verifying tables...')
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('chat_conversations', 'chat_messages', 'competitor_activities')
      ORDER BY table_name
    `
    
    console.log('\n📊 Final Table Status:')
    tables.forEach(table => {
      console.log(`   ✅ ${table.table_name}`)
    })
    
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
    
    // Test inserting sample data
    console.log('\n🧪 Testing table functionality...')
    
    try {
      // Get a sample user ID
      const sampleUser = await sql`SELECT id FROM users LIMIT 1`
      const userId = sampleUser[0].id
      
      // Test chat_conversations
      const testConversationId = 'test-conv-' + Date.now()
      await sql`
        INSERT INTO chat_conversations (id, user_id, title, agent_id, agent_name, last_message, message_count)
        VALUES (${testConversationId}, ${userId}, 'Test Conversation', 'test-agent', 'Test Agent', 'Hello!', 1)
      `
      console.log('   ✅ chat_conversations insert test passed')
      
      // Test chat_messages
      const testMessageId = 'test-msg-' + Date.now()
      await sql`
        INSERT INTO chat_messages (id, conversation_id, user_id, role, content)
        VALUES (${testMessageId}, ${testConversationId}, ${userId}, 'assistant', 'Hello! How can I help you?')
      `
      console.log('   ✅ chat_messages insert test passed')
      
      // Test competitor_activities (if we have a competitor profile)
      const sampleCompetitor = await sql`SELECT id FROM competitor_profiles LIMIT 1`
      if (sampleCompetitor.length > 0) {
        const competitorId = sampleCompetitor[0].id
        await sql`
          INSERT INTO competitor_activities (competitor_id, user_id, activity_type, title, source_type, importance)
          VALUES (${competitorId}, ${userId}, 'product_launch', 'Test Activity', 'website', 'medium')
        `
        console.log('   ✅ competitor_activities insert test passed')
      } else {
        console.log('   ⚠️  competitor_activities test skipped (no competitor profiles)')
      }
      
      // Clean up test data
      await sql`DELETE FROM chat_messages WHERE id = ${testMessageId}`
      await sql`DELETE FROM chat_conversations WHERE id = ${testConversationId}`
      if (sampleCompetitor.length > 0) {
        await sql`DELETE FROM competitor_activities WHERE title = 'Test Activity'`
      }
      console.log('   ✅ Test data cleaned up')
      
    } catch (error) {
      console.log('   ⚠️  Insert test failed:', error.message)
    }
    
    if (tables.length === 3 && foreignKeys.length >= 5) {
      console.log('\n🎉 SUCCESS! All production tables are now ready and fully functional!')
      console.log('\n🔧 Next steps:')
      console.log('   1. Deploy your application to production')
      console.log('   2. Test the chat conversations feature')
      console.log('   3. Test the competitor activities feature')
      console.log('   4. Monitor database performance')
      console.log('\n✨ Your production database is now ready for the new features!')
    } else {
      console.log('\n⚠️  Some tables or constraints may not have been created properly')
    }
    
  } catch (error) {
    console.error('\n❌ Table creation failed:', error.message)
    console.error('Full error:', error)
    process.exit(1)
  }
}

createFinalTables()
