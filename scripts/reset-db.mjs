import postgres from 'postgres';
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

const sql = postgres(process.env.DATABASE_URL, {
  ssl: 'require',
  max: 1
});

async function resetDatabase() {
  console.log('🗑️  Resetting database...');
  
  try {
    // Drop the public schema and all its contents
    await sql`DROP SCHEMA public CASCADE`;
    // Recreate the public schema
    await sql`CREATE SCHEMA public`;
    // Restore default permissions
    await sql`GRANT ALL ON SCHEMA public TO postgres`;
    await sql`GRANT ALL ON SCHEMA public TO public`;
    
    console.log('✅ Database reset successfully. Public schema recreated.');
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

resetDatabase();
