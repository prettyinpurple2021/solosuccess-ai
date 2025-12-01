#!/usr/bin/env node

import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  console.error('Missing DATABASE_URL in .env.local')
  process.exit(1)
}

async function tableExists(client, name) {
  const { rows } = await client.query(
    `SELECT EXISTS (
       SELECT FROM information_schema.tables
       WHERE table_schema = 'public' AND table_name = $1
     ) AS exists`,
    [name]
  )
  return Boolean(rows?.[0]?.exists)
}

async function getColumnType(client, table, column) {
  const { rows } = await client.query(
    `SELECT data_type FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = $1 AND column_name = $2`,
    [table, column]
  )
  return rows?.[0]?.data_type || null
}

async function main() {
  const pool = new Pool({ connectionString: DATABASE_URL, ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false })
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    // Ensure document_folders exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS document_folders (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        parent_id INTEGER REFERENCES document_folders(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        color VARCHAR(7) DEFAULT '#8B5CF6',
        icon VARCHAR(50),
        is_default BOOLEAN DEFAULT FALSE,
        file_count INTEGER DEFAULT 0,
        total_size INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS document_folders_user_id_idx ON document_folders(user_id);
      CREATE INDEX IF NOT EXISTS document_folders_parent_id_idx ON document_folders(parent_id);
      CREATE INDEX IF NOT EXISTS document_folders_name_idx ON document_folders(name);
    `)

    // Add folder_id to documents if missing, and FK
    const docsExists = await tableExists(client, 'documents')
    if (docsExists) {
      await client.query(`ALTER TABLE documents ADD COLUMN IF NOT EXISTS folder_id INTEGER`)
      // Add FK if not present
      const { rows: cons } = await client.query(`
        SELECT constraint_name FROM information_schema.table_constraints
        WHERE table_name='documents' AND constraint_type='FOREIGN KEY'`)
      const hasFolderFk = cons.some(r => String(r.constraint_name).includes('folder') || String(r.constraint_name).includes('documents_folder_id'))
      if (!hasFolderFk) {
        await client.query(`ALTER TABLE documents
          ADD CONSTRAINT documents_folder_id_fkey
          FOREIGN KEY (folder_id) REFERENCES document_folders(id) ON DELETE SET NULL`)
      }
    }

    // Ensure document_activity exists with matching document_id type
    const docsIdType = docsExists ? (await getColumnType(client, 'documents', 'id')) : 'varchar'
    // Map Postgres information_schema data_type to a column type
    let docIdColumnType = 'VARCHAR(255)'
    if (docsIdType === 'uuid') docIdColumnType = 'UUID'
    if (docsIdType === 'text') docIdColumnType = 'TEXT'

    await client.query(`
      CREATE TABLE IF NOT EXISTS document_activity (
        id SERIAL PRIMARY KEY,
        document_id ${docIdColumnType} NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
        user_id VARCHAR(255) NOT NULL,
        action VARCHAR(50) NOT NULL,
        details JSONB DEFAULT '{}',
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS document_activity_document_id_idx ON document_activity(document_id);
      CREATE INDEX IF NOT EXISTS document_activity_user_id_idx ON document_activity(user_id);
      CREATE INDEX IF NOT EXISTS document_activity_action_idx ON document_activity(action);
      CREATE INDEX IF NOT EXISTS document_activity_created_at_idx ON document_activity(created_at);
    `)

    await client.query('COMMIT')
    console.log('✅ Briefcase tables ensured (document_folders, document_activity)')
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('❌ Failed ensuring briefcase tables:', err.message)
    process.exitCode = 1
  } finally {
    client.release()
    await pool.end()
  }
}

main()


