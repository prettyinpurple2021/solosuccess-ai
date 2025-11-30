import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Load .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    console.log('Loading .env.local');
    dotenv.config({ path: envPath });
}

function generateUUID() {
    return crypto.randomUUID();
}

async function simulateSignup() {
    console.log('Starting Signup Simulation...');

    const email = `test_sim_${Date.now()}@example.com`;
    const password = 'password123';
    const fullName = 'Simulation User';
    const username = `sim_user_${Date.now()}`;

    console.log(`Attempting to create user: ${email} / ${username}`);

    try {
        const url = process.env.DATABASE_URL;
        if (!url) throw new Error('DATABASE_URL is not set');
        const sql = neon(url);

        // Check existing
        console.log('Checking existing users...');
        const existingUsers = await sql`
      SELECT id FROM users WHERE email = ${email.toLowerCase()} OR username = ${username.toLowerCase()}
    `;

        if (existingUsers.length > 0) {
            console.log('User already exists (unexpected for simulation)');
            return;
        }

        // Hash password
        console.log('Hashing password...');
        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Insert user
        console.log('Inserting user...');
        const _userId = generateUUID();
        const dateOfBirth = null;

        // NOTE: This matches the query in route.ts
        const newUsers = await sql`
      INSERT INTO users (id, email, password_hash, full_name, username, date_of_birth, subscription_tier, subscription_status, cancel_at_period_end, created_at, updated_at)
      VALUES (${_userId}, ${email.toLowerCase()}, ${passwordHash}, ${fullName}, ${username.toLowerCase()}, ${dateOfBirth}, 'launch', 'active', false, NOW(), NOW())
      RETURNING id, email
    `;

        if (newUsers.length === 0) {
            throw new Error('Failed to create user (no rows returned)');
        }

        console.log('User created successfully:', newUsers[0]);

        // Generate JWT
        console.log('Generating JWT...');
        if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not set');

        const token = jwt.sign(
            {
                userId: newUsers[0].id,
                email: newUsers[0].email,
                username: username
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        console.log('JWT Generated successfully');

    } catch (error) {
        console.error('Signup Simulation Failed!');
        console.error('Error:', error.message);
        if (error.stack) console.error('Stack:', error.stack);

        // Check if it's a specific postgres error
        if (error.code) {
            console.error('Postgres Error Code:', error.code);
            console.error('Postgres Error Detail:', error.detail);
        }
    }
}

simulateSignup();
