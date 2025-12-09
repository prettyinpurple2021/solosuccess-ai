#!/usr/bin/env node

/**
 * Script to set a user's role to admin
 * Usage: node scripts/set-admin-role.mjs <email>
 */

import postgres from 'postgres';

const email = process.argv[2];

if (!email) {
  console.error('❌ Please provide an email address');
  console.log('Usage: node scripts/set-admin-role.mjs <email>');
  process.exit(1);
}

// Database connection
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('❌ DATABASE_URL environment variable is not set');
  process.exit(1);
}

const sql = postgres(connectionString, { prepare: true });

try {
  console.log(`🔍 Looking for user with email: ${email}`);

  const user = await sql/* sql */`
    SELECT id, email, role
    FROM users
    WHERE email = ${email}
    LIMIT 1
  `;

  if (user.length === 0) {
    console.error(`❌ User with email ${email} not found`);
    process.exit(1);
  }

  const target = user[0];
  console.log(`✅ Found user: ${target.email}`);
  console.log(`📧 Email: ${target.email}`);
  console.log(`👤 Current role: ${target.role || 'not set'}`);

  await sql/* sql */`
    UPDATE users
    SET role = 'admin',
        updated_at = NOW()
    WHERE id = ${target.id}
  `;

  console.log('✅ Successfully updated user role to admin');
  console.log('🎉 You can now access the admin panel at /admin');
} catch (error) {
  console.error('❌ Error updating user role:', error);
  process.exit(1);
} finally {
  await sql.end();
}
