import { Worker } from '@temporalio/worker';
import * as activities from './activities';

async function runWorker() {
  // Create a new Worker instance.
  // This is the process that will poll Temporal for tasks and execute them.
  const worker = await Worker.create({
    // Tell the Worker where to find the compiled workflow code.
    // The `workflowsPath` points to a single file that will bundle all our workflows.
    workflowsPath: require.resolve('./workflows'),
    // Register the activities. These are the functions our workflows can call.
    activities,
    // Define the "Task Queue" this Worker will listen on.
    // Think of it like a channel. Our client will send tasks to this specific channel.
    taskQueue: 'soloboss-task-queue',
  });

  // Start the Worker. This begins the long-polling process, waiting for tasks.
  await worker.run();
}

// Start the worker and catch any errors.
runWorker().catch((err) => {
  console.error(err);
  process.exit(1);
});
