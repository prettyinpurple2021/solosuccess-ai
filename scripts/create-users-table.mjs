import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    console.log('Loading .env.local');
    dotenv.config({ path: envPath });
}

async function createUsersTable() {
    console.log('Creating users table...');
    const url = process.env.DATABASE_URL;
    if (!url) {
        console.error('DATABASE_URL is not set');
        process.exit(1);
    }

    const sql = neon(url);

    try {
        await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(255),
        username VARCHAR(100) UNIQUE,
        date_of_birth TIMESTAMP,
        avatar_url VARCHAR(500),
        subscription_tier VARCHAR(50) DEFAULT 'free',
        subscription_status VARCHAR(50) DEFAULT 'active',
        stripe_customer_id VARCHAR(255),
        stripe_subscription_id VARCHAR(255),
        current_period_start TIMESTAMP,
        current_period_end TIMESTAMP,
        cancel_at_period_end BOOLEAN DEFAULT false,
        is_verified BOOLEAN DEFAULT false,
        onboarding_completed BOOLEAN DEFAULT false,
        onboarding_completed_at TIMESTAMP,
        onboarding_data JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
        console.log('✅ Users table created successfully');
    } catch (error) {
        console.error('❌ Failed to create users table:', error);
    }
}

createUsersTable();
