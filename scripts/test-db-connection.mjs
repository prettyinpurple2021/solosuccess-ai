import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    console.log('Loading .env.local');
    dotenv.config({ path: envPath });
} else {
    console.log('.env.local not found');
}

async function test() {
    console.log('Testing Database Connection...');
    const url = process.env.DATABASE_URL;
    if (!url) {
        console.error('DATABASE_URL is not set');
        process.exit(1);
    }

    try {
        const sql = neon(url);
        const result = await sql`SELECT NOW()`;
        console.log('Database Connection Successful:', result);
    } catch (error) {
        console.error('Database Connection Failed:', error);
    }

    console.log('Testing Bcrypt...');
    try {
        const hash = await bcrypt.hash('testpassword', 12);
        console.log('Bcrypt Hash Successful:', hash);
        const compare = await bcrypt.compare('testpassword', hash);
        console.log('Bcrypt Compare Successful:', compare);
    } catch (error) {
        console.error('Bcrypt Failed:', error);
    }
}

test();
