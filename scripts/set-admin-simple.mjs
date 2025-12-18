#!/usr/bin/env node

/**
 * Simple script to set user role to admin using existing database client
 */

import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables from .env.production
const envPath = join(process.cwd(), '.env.production');
let envContent = '';

try {
  envContent = readFileSync(envPath, 'utf8');
  console.log('✅ Loaded .env.production file');
} catch (error) {
  console.log('❌ Could not load .env.production file');
  console.log('Please make sure the file exists and contains DATABASE_URL');
  process.exit(1);
}

// Parse environment variables
envContent.split('\n').forEach(line => {
  const trimmedLine = line.trim();
  if (trimmedLine && !trimmedLine.startsWith('#')) {
    const [key, ...valueParts] = trimmedLine.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim();
      process.env[key.trim()] = value;
    }
  }
});

// Check if DATABASE_URL exists
if (!process.env.DATABASE_URL) {
  console.log('❌ DATABASE_URL not found in .env.production');
  process.exit(1);
}

console.log('🔗 Connecting to database...');
console.log(`📍 Database: ${process.env.DATABASE_URL.split('@')[1]?.split('/')[0] || 'Unknown'}`);

// Use the existing database client
import { getDb } from '../src/lib/database-client.ts';
import { users } from '../src/db/schema.ts';
import { eq } from 'drizzle-orm';

async function setAdminRole() {
  try {
    console.log('\n🚀 Setting user role to admin...');
    
    const db = getDb();
    
    // Find the user first
    const userResult = await db.select().from(users).where(eq(users.email, 'prettyinpurple2021@gmail.com')).limit(1);
    
    if (userResult.length === 0) {
      console.log('❌ User not found with email: prettyinpurple2021@gmail.com');
      console.log('Please check if the email address is correct');
      return;
    }
    
    console.log(`👤 Found user: ${userResult[0].full_name || userResult[0].email}`);
    console.log(`📧 Email: ${userResult[0].email}`);
    console.log(`🎖️ Current role: ${userResult[0].role || 'not set'}`);
    
    // Update the user's role to admin
    await db.update(users)
      .set({ 
        role: 'admin',
        updated_at: new Date()
      })
      .where(eq(users.id, userResult[0].id));
    
    console.log('✅ Successfully updated user role to admin');
    console.log('\n🎉 You can now access the admin panel at /admin');
    console.log('🛡️ Admin features:');
    console.log('  - System monitoring and performance metrics');
    console.log('  - Service management (start/stop/restart)');
    console.log('  - Database monitoring and health checks');
    console.log('  - Tactical operations center');
    
  } catch (error) {
    console.error('❌ Error setting admin role:', error);
    process.exit(1);
  }
}

setAdminRole();
