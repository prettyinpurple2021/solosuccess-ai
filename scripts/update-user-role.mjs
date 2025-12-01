#!/usr/bin/env node

/**
 * Simple script to update user role to admin
 * Uses the existing database connection approach
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

// Use the existing migration script approach
import { neon } from '@neondatabase/serverless';

function getSql() {
  // Clean up the connection string for Neon
  let connectionString = process.env.DATABASE_URL;
  if (connectionString.includes('channel_binding=require')) {
    connectionString = connectionString.replace('&channel_binding=require', '');
  }
  if (connectionString.includes('sslmode=require')) {
    connectionString = connectionString.replace('?sslmode=require', '');
  }
  return neon(connectionString);
}

async function updateUserRole() {
  const sql = getSql();
  
  try {
    console.log('\n🚀 Updating user role to admin...');
    
    // Update the user's role to admin
    const result = await sql`
      UPDATE users 
      SET role = 'admin', updated_at = NOW() 
      WHERE email = 'prettyinpurple2021@gmail.com'
      RETURNING id, email, full_name, role, updated_at
    `;
    
    if (result.length > 0) {
      console.log('✅ Successfully updated user role to admin');
      console.log(`👤 User: ${result[0].full_name || result[0].email}`);
      console.log(`📧 Email: ${result[0].email}`);
      console.log(`🎖️ Role: ${result[0].role}`);
      console.log(`🕒 Updated: ${result[0].updated_at}`);
      console.log('\n🎉 You can now access the admin panel at /admin');
    } else {
      console.log('❌ User not found with email: prettyinpurple2021@gmail.com');
      console.log('Please check if the email address is correct');
    }
    
  } catch (error) {
    console.error('❌ Error updating user role:', error);
    process.exit(1);
  }
}

updateUserRole();
