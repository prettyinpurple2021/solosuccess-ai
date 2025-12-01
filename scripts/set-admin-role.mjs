#!/usr/bin/env node

/**
 * Script to set a user's role to admin
 * Usage: node scripts/set-admin-role.mjs <email>
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq } from 'drizzle-orm';
import { users } from '../db/schema.js';

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

const sql = postgres(connectionString);
const db = drizzle(sql);

try {
  console.log(`🔍 Looking for user with email: ${email}`);
  
  // Find the user
  const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
  
  if (user.length === 0) {
    console.error(`❌ User with email ${email} not found`);
    process.exit(1);
  }
  
  console.log(`✅ Found user: ${user[0].full_name || user[0].email}`);
  console.log(`📧 Email: ${user[0].email}`);
  console.log(`👤 Current role: ${user[0].role || 'not set'}`);
  
  // Update the user's role to admin
  await db.update(users)
    .set({ 
      role: 'admin',
      updated_at: new Date()
    })
    .where(eq(users.id, user[0].id));
  
  console.log('✅ Successfully updated user role to admin');
  console.log('🎉 You can now access the admin panel at /admin');
  
} catch (error) {
  console.error('❌ Error updating user role:', error);
  process.exit(1);
} finally {
  await sql.end();
}
