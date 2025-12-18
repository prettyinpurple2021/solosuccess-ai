
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../src/db/schema.ts';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

async function checkTables() {
    try {
        const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('competitor_profiles', 'intelligence_data');
    `);

        console.log('Found tables:', result.rows.map(row => row.table_name));

        if (result.rows.length === 2) {
            console.log('All required tables found.');
            process.exit(0);
        } else {
            console.log('Missing tables.');
            process.exit(1);
        }
    } catch (error) {
        console.error('Error checking tables:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

checkTables();
