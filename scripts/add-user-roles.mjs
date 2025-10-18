#!/usr/bin/env node

/**
 * Simple script to add role field to users table
 * Uses standard postgres connection instead of Neon serverless
 */

import postgres from 'postgres';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables
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

// Clean up the connection string for standard postgres
let connectionString = process.env.DATABASE_URL;
if (connectionString.includes('channel_binding=require')) {
  connectionString = connectionString.replace('&channel_binding=require', '');
}

console.log('🔗 Connecting to database...');
console.log(`📍 Database: ${connectionString.split('@')[1]?.split('/')[0] || 'Unknown'}`);

const sql = postgres(connectionString);

async function addUserRoles() {
  try {
    console.log('\n🚀 Adding role field to users table...');
    
    // Check if role column already exists
    const columnExists = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'role'
    `;
    
    if (columnExists.length > 0) {
      console.log('✅ Role column already exists');
    } else {
      // Add role column
      await sql`ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user'`;
      console.log('✅ Added role column to users table');
    }
    
    // Update existing users to have 'user' role
    await sql`UPDATE users SET role = 'user' WHERE role IS NULL`;
    console.log('✅ Updated existing users with default role');
    
    // Make role field not null
    await sql`ALTER TABLE users ALTER COLUMN role SET NOT NULL`;
    console.log('✅ Set role column as NOT NULL');
    
    // Create index for role field
    try {
      await sql`CREATE INDEX users_role_idx ON users(role)`;
      console.log('✅ Created index on role field');
    } catch (indexError) {
      if (indexError.message.includes('already exists')) {
        console.log('✅ Index on role field already exists');
      } else {
        throw indexError;
      }
    }
    
    console.log('\n🎉 User roles migration completed successfully!');
    console.log('💡 You can now set a user to admin with: node scripts/set-admin-role.mjs <email>');
    
  } catch (error) {
    console.error('❌ Error during migration:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

addUserRoles();
