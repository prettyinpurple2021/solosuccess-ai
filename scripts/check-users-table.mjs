import pg from 'pg';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const { Client } = pg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function checkTable() {
  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Check users table structure
    const result = await client.query(`
      SELECT column_name, data_type, character_maximum_length
      FROM information_schema.columns
      WHERE table_name = 'users' AND column_name = 'id'
      ORDER BY ordinal_position;
    `);
    
    console.log('Users table id column:', result.rows);
    
    // Check if users table exists and what its primary key is
    const pkResult = await client.query(`
      SELECT constraint_name, constraint_type
      FROM information_schema.table_constraints
      WHERE table_name = 'users' AND constraint_type = 'PRIMARY KEY';
    `);
    
    console.log('Users table primary key:', pkResult.rows);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

checkTable();
