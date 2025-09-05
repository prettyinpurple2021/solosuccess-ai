import { NativeConnection, Worker } from '@temporalio/worker';
import * as activities from '../src/activities';

async function run() {
  // Step 1: Establish a connection with Temporal server.
  const connection = await NativeConnection.connect({
    address: 'localhost:7233',
    // TLS and gRPC metadata configuration goes here.
  });
  
  try {
    // Step 2: Register Workflows and Activities with the Worker.
    const worker = await Worker.create({
      connection,
      namespace: 'default',
      taskQueue: 'soloboss-tasks',
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
