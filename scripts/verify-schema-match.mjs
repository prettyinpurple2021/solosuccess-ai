import pg from 'pg';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const { Client } = pg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function verifySchema() {
  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Check users table
    console.log('📋 Verifying users table:');
    const usersCheck = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'users' AND column_name IN ('id', 'email', 'password', 'role')
      ORDER BY column_name;
    `);
    usersCheck.rows.forEach(row => {
      console.log(`  ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });

    // Check calendarConnections
    console.log('\n📋 Verifying calendar_connections table:');
    const calCheck = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'calendar_connections' AND column_name = 'user_id';
    `);
    if (calCheck.rows.length > 0) {
      console.log(`  user_id: ${calCheck.rows[0].data_type} ✅`);
    } else {
      console.log('  calendar_connections table not found');
    }

    // Check social_media_connections
    console.log('\n📋 Verifying social_media_connections table:');
    const smCheck = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'social_media_connections' AND column_name = 'user_id';
    `);
    if (smCheck.rows.length > 0) {
      console.log(`  user_id: ${smCheck.rows[0].data_type} ✅`);
    } else {
      console.log('  social_media_connections table not found');
    }

    // Verify foreign key constraints
    console.log('\n🔗 Verifying foreign keys:');
    const fkCheck = await client.query(`
      SELECT
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND ccu.table_name = 'users'
        AND tc.table_name IN ('calendar_connections', 'social_media_connections');
    `);
    fkCheck.rows.forEach(row => {
      console.log(`  ${row.table_name}.${row.column_name} → ${row.foreign_table_name}.id ✅`);
    });

    console.log('\n✅ Schema verification complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

verifySchema();

