import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoDB, testMongoConnection, getMongoCollection } from '@/lib/mongodb';

export async function GET() {
    try {
        // Test the MongoDB connection
        const isConnected = await testMongoConnection();

        if (!isConnected) {
            return NextResponse.json(
                { success: false, message: 'Failed to connect to MongoDB' },
                { status: 500 }
            );
        }

        // Get a sample collection to verify database access
        const db = await connectToMongoDB();
        const collections = await db.listCollections().toArray();

        return NextResponse.json({
            success: true,
            message: 'Successfully connected to MongoDB!',
            database: db.databaseName,
            collections: collections.map(col => col.name),
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('MongoDB test error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'MongoDB connection failed',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { collectionName, data } = body;

        if (!collectionName || !data) {
            return NextResponse.json(
                { success: false, message: 'Collection name and data are required' },
                { status: 400 }
            );
        }

        // Example: Insert a document into a collection
        const collection = await getMongoCollection(collectionName);
        const result = await collection.insertOne({
            ...data,
            createdAt: new Date(),
            _id: undefined // Let MongoDB generate the ID
        });

        return NextResponse.json({
            success: true,
            message: 'Document inserted successfully',
            insertedId: result.insertedId,
            collection: collectionName
        });

    } catch (error) {
        console.error('MongoDB insert error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to insert document',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}