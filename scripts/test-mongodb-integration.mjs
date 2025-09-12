#!/usr/bin/env node

/**
 * MongoDB Integration Test Script
 * Tests the MongoDB connection and functionality without requiring environment variables
 */

import { MongoClient, ServerApiVersion } from 'mongodb';

// Test MongoDB connection using the hardcoded URI from the implementation
const uri = "mongodb+srv://psychedeliccreator_db_user:a0e4nfZtDwfYB0sF@solosuccessai.pvtc6rj.mongodb.net/?retryWrites=true&w=majority&appName=solosuccessai";

const clientOptions = {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
};

async function testMongoDBIntegration() {
    console.log('🧪 Testing MongoDB Integration...\n');
    
    try {
        console.log('1. Testing basic connection...');
        const client = new MongoClient(uri, clientOptions);
        await client.connect();
        
        // Test ping
        await client.db("admin").command({ ping: 1 });
        console.log('   ✅ Successfully connected to MongoDB');
        
        // Test database access
        console.log('\n2. Testing database access...');
        const db = client.db("solosuccessai");
        const collections = await db.listCollections().toArray();
        console.log(`   ✅ Database "solosuccessai" accessible`);
        console.log(`   📊 Found ${collections.length} collections:`, collections.map(c => c.name));
        
        // Test collection operations
        console.log('\n3. Testing collection operations...');
        const testCollection = db.collection('test-integration');
        
        // Insert test document
        const testDoc = {
            message: 'MongoDB integration test',
            timestamp: new Date(),
            testId: Math.random().toString(36).substr(2, 9)
        };
        
        const insertResult = await testCollection.insertOne(testDoc);
        console.log('   ✅ Document inserted successfully');
        console.log('   📝 Inserted ID:', insertResult.insertedId);
        
        // Find the document
        const foundDoc = await testCollection.findOne({ _id: insertResult.insertedId });
        console.log('   ✅ Document retrieved successfully');
        console.log('   📄 Retrieved data:', JSON.stringify(foundDoc, null, 2));
        
        // Clean up test document
        await testCollection.deleteOne({ _id: insertResult.insertedId });
        console.log('   🧹 Test document cleaned up');
        
        await client.close();
        console.log('\n🎉 MongoDB integration test completed successfully!');
        
        return true;
        
    } catch (error) {
        console.error('\n❌ MongoDB integration test failed:', error.message);
        return false;
    }
}

// Run the test
testMongoDBIntegration()
    .then(success => {
        process.exit(success ? 0 : 1);
    })
    .catch(error => {
        console.error('Test script error:', error);
        process.exit(1);
    });