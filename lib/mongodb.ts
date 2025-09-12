import { MongoClient, ServerApiVersion, Db } from 'mongodb';

// MongoDB connection string - should be stored in environment variables
const uri = process.env.MONGODB_URI || "mongodb+srv://psychedeliccreator_db_user:a0e4nfZtDwfYB0sF@solosuccessai.pvtc6rj.mongodb.net/?retryWrites=true&w=majority&appName=solosuccessai";

// Global variable to store the cached database connection
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

// Create a MongoClient with MongoClientOptions to set the Stable API version
const clientOptions = {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
};

/**
 * Connect to MongoDB and return the database instance
 * Uses connection caching to avoid creating multiple connections
 */
export async function connectToMongoDB(): Promise<Db> {
    // Return cached connection if available
    if (cachedClient && cachedDb) {
        return cachedDb;
    }

    try {
        // Create new connection
        cachedClient = new MongoClient(uri, clientOptions);

        // Connect the client to the server
        await cachedClient.connect();

        // Get the database (you can specify your database name here)
        cachedDb = cachedClient.db(process.env.MONGODB_DATABASE || "solosuccessai");

        console.log("Successfully connected to MongoDB!");
        return cachedDb;

    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        throw error;
    }
}

/**
 * Test the MongoDB connection by pinging the database
 */
export async function testMongoConnection(): Promise<boolean> {
    try {
        const client = new MongoClient(uri, clientOptions);
        await client.connect();

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        await client.close();
        return true;

    } catch (error) {
        console.error("MongoDB connection test failed:", error);
        return false;
    }
}

/**
 * Close the MongoDB connection
 */
export async function closeMongoConnection(): Promise<void> {
    if (cachedClient) {
        await cachedClient.close();
        cachedClient = null;
        cachedDb = null;
        console.log("MongoDB connection closed");
    }
}

/**
 * Get a MongoDB collection
 */
export async function getMongoCollection(collectionName: string) {
    const db = await connectToMongoDB();
    return db.collection(collectionName);
}

// Export the direct client for advanced use cases
export { MongoClient, ServerApiVersion } from 'mongodb';