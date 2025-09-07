import { NativeConnection, Worker } from '@temporalio/worker';
import * as activities from '../src/activities';

async function run() {
  // Step 1: Establish a connection with Temporal server.
  const connection = await NativeConnection.connect({
    address: process.env.TEMPORAL_ADDRESS || 'localhost:7233',
    // Add TLS and API key configuration for Temporal Cloud
    ...(process.env.TEMPORAL_ADDRESS?.includes('temporal.io') && {
      tls: true,
      apiKey: process.env.TEMPORAL_API_KEY,
    }),
  });
  
  try {
    // Step 2: Register Workflows and Activities with the Worker.
    const worker = await Worker.create({
      connection,
      namespace: process.env.TEMPORAL_NAMESPACE || 'default',
      taskQueue: 'subscriptions-task-queue',
      // Workflows are registered using a path as they run in a separate JS context.
      workflowsPath: require.resolve('../src/workflows'),
      activities,
    });

    // Step 3: Start accepting tasks on the `soloboss-tasks` queue
    console.log('Worker started, listening for tasks...');
    await worker.run();
  } finally {
    // Close the connection once the worker has stopped
    await connection.close();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
