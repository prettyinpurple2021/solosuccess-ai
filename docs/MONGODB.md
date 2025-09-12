# MongoDB Integration

The SoloSuccess AI platform includes a complete MongoDB integration for flexible document storage and analytics.

## Features

- **Connection Caching**: Prevents multiple database connections
- **Error Handling**: Comprehensive error catching and logging
- **TypeScript Support**: Full type safety for database operations
- **Environment Configuration**: Secure credential management
- **Helper Functions**: Easy-to-use utility functions

## Setup

1. **Environment Variables**: Copy `.env.example` to `.env.local` and configure:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
   MONGODB_DATABASE=your_database_name
   ```

2. **Test Connection**: Visit `/api/mongodb-test` to verify the connection

## Usage

### Basic Connection
```typescript
import { connectToMongoDB } from '@/lib/mongodb';

const db = await connectToMongoDB();
```

### Working with Collections
```typescript
import { getMongoCollection } from '@/lib/mongodb';

// Get a collection
const users = await getMongoCollection('users');

// Insert a document
const result = await users.insertOne({
  name: 'John Doe',
  email: 'john@example.com',
  createdAt: new Date()
});

// Find documents
const user = await users.findOne({ email: 'john@example.com' });
const allUsers = await users.find({}).toArray();
```

### Testing Connection
```typescript
import { testMongoConnection } from '@/lib/mongodb';

const isConnected = await testMongoConnection();
if (isConnected) {
  console.log('MongoDB is ready!');
}
```

### API Route Example
```typescript
// app/api/example/route.ts
import { NextResponse } from 'next/server';
import { getMongoCollection } from '@/lib/mongodb';

export async function GET() {
  try {
    const collection = await getMongoCollection('data');
    const documents = await collection.find({}).limit(10).toArray();
    
    return NextResponse.json({ success: true, data: documents });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Database error' },
      { status: 500 }
    );
  }
}
```

## Available Functions

- `connectToMongoDB()`: Returns database instance with connection caching
- `testMongoConnection()`: Tests connection and returns boolean
- `getMongoCollection(name)`: Returns a collection instance
- `closeMongoConnection()`: Closes the database connection

## Testing

Run the MongoDB integration tests:
```bash
npm test test/mongodb-integration.test.js
```

Test the API endpoints:
```bash
# Test connection
curl http://localhost:3000/api/mongodb-test

# Test document insertion
curl -X POST http://localhost:3000/api/mongodb-test \
  -H "Content-Type: application/json" \
  -d '{"collectionName": "test", "data": {"message": "Hello MongoDB"}}'
```

## Error Handling

The integration includes comprehensive error handling:

- **Connection errors**: Authentication, network, firewall issues
- **Database errors**: Validation, duplicate keys, permissions
- **Retry logic**: Built-in connection retry mechanism
- **Logging**: Detailed error logging for debugging

See `docs/mongodb-usage-examples.ts` for detailed usage patterns and error handling examples.