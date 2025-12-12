import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

if (!process.env.DATABASE_URL) {
  console.error('❌ Error: DATABASE_URL is not defined in .env.local');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function resetDatabase() {
  console.log('🗑️  Resetting database...');
  
  const client = await pool.connect();
  
  try {
    // Drop the public schema and all its contents
    await client.query('DROP SCHEMA public CASCADE;');
    // Recreate the public schema
    await client.query('CREATE SCHEMA public;');
    // Restore default permissions
    await client.query('GRANT ALL ON SCHEMA public TO postgres;');
    await client.query('GRANT ALL ON SCHEMA public TO public;');
    
    console.log('✅ Database reset successfully. Public schema recreated.');
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

resetDatabase();
