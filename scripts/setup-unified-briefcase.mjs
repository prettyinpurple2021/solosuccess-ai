import { neon } from '@neondatabase/serverless'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

async function main() {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set')
  }

  const sql = neon(databaseUrl)

  console.log('🚀 Setting up unified briefcase database tables...')

  try {
    // Create briefcases table
    await sql`
      CREATE TABLE IF NOT EXISTS user_briefcases (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        is_default BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `
    console.log('✅ Created user_briefcases table')

    // Create briefcase items table
    await sql`
      CREATE TABLE IF NOT EXISTS briefcase_items (
        id VARCHAR(255) PRIMARY KEY,
        briefcase_id VARCHAR(255) NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL CHECK (type IN ('avatar', 'chat', 'brand', 'template_save', 'document', 'ai_interaction')),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        content JSONB,
        blob_url TEXT,
        file_size BIGINT,
        mime_type VARCHAR(255),
        tags TEXT[] DEFAULT '{}',
        metadata JSONB DEFAULT '{}',
        is_private BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `
    console.log('✅ Created briefcase_items table')

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_user_briefcases_user_id ON user_briefcases(user_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_user_briefcases_default ON user_briefcases(user_id, is_default)`
    await sql`CREATE INDEX IF NOT EXISTS idx_briefcase_items_briefcase_id ON briefcase_items(briefcase_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_briefcase_items_user_id ON briefcase_items(user_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_briefcase_items_type ON briefcase_items(type)`
    await sql`CREATE INDEX IF NOT EXISTS idx_briefcase_items_tags ON briefcase_items USING GIN(tags)`
    
    console.log('✅ Created indexes')

    // Add updated_at triggers if they don't exist
    await sql`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ language 'plpgsql'
    `

    await sql`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_trigger 
          WHERE tgname = 'update_user_briefcases_updated_at' 
          AND tgrelid = 'user_briefcases'::regclass
        ) THEN
          CREATE TRIGGER update_user_briefcases_updated_at
            BEFORE UPDATE ON user_briefcases
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        END IF;
      END $$
    `

    await sql`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_trigger 
          WHERE tgname = 'update_briefcase_items_updated_at' 
          AND tgrelid = 'briefcase_items'::regclass
        ) THEN
          CREATE TRIGGER update_briefcase_items_updated_at
            BEFORE UPDATE ON briefcase_items
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        END IF;
      END $$
    `

    console.log('✅ Created updated_at triggers')

    console.log('🎉 Unified briefcase database setup completed successfully!')

    // Verify tables exist
    const briefcasesCount = await sql`SELECT COUNT(*) as count FROM user_briefcases`
    const itemsCount = await sql`SELECT COUNT(*) as count FROM briefcase_items`
    
    console.log(`📊 Current data:`)
    console.log(`   - Briefcases: ${briefcasesCount[0].count}`)
    console.log(`   - Items: ${itemsCount[0].count}`)

  } catch (error) {
    console.error('❌ Error setting up unified briefcase database:', error)
    process.exit(1)
  }
}

main().catch(console.error)