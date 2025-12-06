import pg from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function applyMigration() {
  try {
    await client.connect();
    console.log('✅ Connected to database');

    const migrationPath = path.join(__dirname, '..', 'drizzle', '0004_social_media_connections.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('📝 Applying migration...');
    await client.query(sql);
    
    console.log('✅ Migration applied successfully!');
    console.log('✅ social_media_connections table created');
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('ℹ️  Table already exists, skipping...');
    } else {
      console.error('❌ Migration failed:', error.message);
      process.exit(1);
    }
  } finally {
    await client.end();
  }
}

applyMigration();

