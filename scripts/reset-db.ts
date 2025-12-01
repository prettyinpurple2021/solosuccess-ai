import 'dotenv/config';
import path from 'path';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config({ path: path.join(process.cwd(), '.env') });

async function main() {
    console.log('💣 Dropping all tables in public schema...');
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        // Drop schema public cascade and recreate it
        await pool.query('DROP SCHEMA public CASCADE;');
        await pool.query('CREATE SCHEMA public;');
        await pool.query('GRANT ALL ON SCHEMA public TO public;');

        console.log('✅ Database reset complete. Schema is empty.');
    } catch (err) {
        console.error('❌ Failed to reset database:', err);
    } finally {
        await pool.end();
    }
}

main();
