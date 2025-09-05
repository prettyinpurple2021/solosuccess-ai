import { Client, Connection } from '@temporalio/client';

// This is a singleton connection to Temporal Cloud.
// It will be reused throughout the application.

// Await the connection to be established.
// This is done at the module level to ensure it's ready for any import.
const connection = await Connection.connect({
  address: process.env.TEMPORAL_ADDRESS!,
});

export const temporalClient = new Client({
  connection,
  namespace: process.env.TEMPORAL_NAMESPACE || 'soloboss-dev',
  // Create an interceptor to add the API Key to the gRPC headers of every call.
  // This is how Temporal Cloud authenticates our requests.
  interceptors: {
    calls: [
      {
        async start(input) {
          input.headers.set(
            'authorization',
            `Bearer ${process.env.TEMPORAL_API_KEY}`
          );
          return await this.next.start(input);
        },
      },
    ],
  },
});

