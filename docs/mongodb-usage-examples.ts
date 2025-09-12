/**
 * MongoDB Integration Usage Examples
 * Demonstrates how to use the MongoDB integration in your Next.js app
 */

// Example 1: Basic Connection and Database Operations
import { connectToMongoDB, getMongoCollection, testMongoConnection } from '@/lib/mongodb';

// Example 2: Testing the connection
export async function exampleTestConnection() {
    try {
        const isConnected = await testMongoConnection();
        if (isConnected) {
            console.log('✅ MongoDB is connected and ready!');
        } else {
            console.log('❌ MongoDB connection failed');
        }
    } catch (error) {
        console.error('Connection test error:', error);
    }
}

// Example 3: Working with collections
export async function exampleCollectionOperations() {
    try {
        // Get a collection (this automatically connects to MongoDB)
        const usersCollection = await getMongoCollection('users');
        
        // Insert a document
        const newUser = {
            name: 'John Doe',
            email: 'john@example.com',
            createdAt: new Date(),
            preferences: {
                theme: 'dark',
                notifications: true
            }
        };
        
        const insertResult = await usersCollection.insertOne(newUser);
        console.log('User created with ID:', insertResult.insertedId);
        
        // Find documents
        const user = await usersCollection.findOne({ email: 'john@example.com' });
        console.log('Found user:', user);
        
        // Update a document
        const updateResult = await usersCollection.updateOne(
            { email: 'john@example.com' },
            { $set: { 'preferences.theme': 'light' } }
        );
        console.log('Updated', updateResult.modifiedCount, 'documents');
        
        // Find multiple documents
        const allUsers = await usersCollection.find({}).toArray();
        console.log('All users:', allUsers);
        
        return insertResult.insertedId;
        
    } catch (error) {
        console.error('Collection operations error:', error);
    }
}

// Example 4: Direct database access
export async function exampleDirectDatabaseAccess() {
    try {
        // Get direct database access for advanced operations
        const db = await connectToMongoDB();
        
        // List all collections
        const collections = await db.listCollections().toArray();
        console.log('Available collections:', collections.map(c => c.name));
        
        // Create an index
        const logsCollection = db.collection('logs');
        await logsCollection.createIndex({ createdAt: 1 });
        console.log('Index created on logs.createdAt');
        
        // Aggregation example
        const pipeline = [
            { $match: { type: 'user_action' } },
            { $group: { _id: '$action', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ];
        
        const actionStats = await logsCollection.aggregate(pipeline).toArray();
        console.log('Action statistics:', actionStats);
        
    } catch (error) {
        console.error('Database access error:', error);
    }
}

// Example 5: Error handling patterns
export async function exampleErrorHandling() {
    try {
        const collection = await getMongoCollection('products');
        
        // Always wrap database operations in try-catch
        try {
            const result = await collection.insertOne({
                name: 'Test Product',
                price: 99.99,
                createdAt: new Date()
            });
            
            console.log('Product created successfully:', result.insertedId);
            
        } catch (dbError) {
            console.error('Database operation failed:', dbError);
            
            // Handle specific MongoDB errors
            if (dbError.code === 11000) {
                console.error('Duplicate key error - product already exists');
            } else if (dbError.name === 'ValidationError') {
                console.error('Validation failed:', dbError.message);
            } else {
                console.error('Unexpected database error');
            }
            
            throw dbError; // Re-throw to handle in calling code
        }
        
    } catch (connectionError) {
        console.error('Failed to connect to MongoDB:', connectionError);
        
        // Handle connection-specific errors
        if (connectionError.message.includes('authentication')) {
            console.error('Authentication failed - check your credentials');
        } else if (connectionError.message.includes('network')) {
            console.error('Network error - check your connection and firewall');
        }
    }
}

// Example 6: Usage in API routes
export function exampleApiRouteUsage() {
    return `
// In your API route file (app/api/users/route.ts):

import { NextRequest, NextResponse } from 'next/server';
import { getMongoCollection } from '@/lib/mongodb';

export async function GET() {
    try {
        const usersCollection = await getMongoCollection('users');
        const users = await usersCollection.find({}).limit(10).toArray();
        
        return NextResponse.json({
            success: true,
            users: users
        });
        
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch users' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const userData = await request.json();
        const usersCollection = await getMongoCollection('users');
        
        const result = await usersCollection.insertOne({
            ...userData,
            createdAt: new Date()
        });
        
        return NextResponse.json({
            success: true,
            userId: result.insertedId
        });
        
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create user' },
            { status: 500 }
        );
    }
}
`;
}

// Example 7: Environment setup reminder
export function exampleEnvironmentSetup() {
    return `
// Set up your environment variables in .env.local:

MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DATABASE=your_database_name

// The MongoDB integration will:
// 1. Use MONGODB_URI for connection (falls back to hardcoded URI if not set)
// 2. Use MONGODB_DATABASE for database name (defaults to 'solosuccessai')
// 3. Cache connections to avoid creating multiple database connections
// 4. Provide error handling and logging
`;
}