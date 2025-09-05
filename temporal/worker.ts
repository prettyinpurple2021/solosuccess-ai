import 'dotenv/config'; // <-- FIX: Load environment variables
import { Worker } from '@temporalio/worker';
import * as activities from './activities/index.js';

async function run() {
  const worker = await Worker.create({
    workflowsPath: require.resolve('./workflows/index.js'),
    activities,
    taskQueue: 'soloboss-task-queue',
  });

  try {
    await worker.run();
    console.log('Worker started successfully');
  } catch (err) {
    console.error('Error starting worker:', err);
    process.exit(1);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

