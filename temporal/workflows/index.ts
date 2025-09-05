import { proxyActivities } from '@temporalio/workflow';
// Only import the activity types, not the implementation.
// This is a best practice for Temporal workflows.
import type * as activities from '../activities';

// Set up the activities with a retry policy.
// If an activity fails, Temporal will automatically retry it up to 3 times.
const { generateEmbeddings } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
  retry: {
    maximumAttempts: 3,
  },
});

/**
 * Defines a workflow for processing a file uploaded to the briefcase.
 * @param fileId The ID of the file to process.
 */
export async function processBriefcaseFile(fileId: string): Promise<string> {
  // 1. Call the activity to generate embeddings.
  // The workflow will pause here and wait for the activity to complete.
  // If the activity fails, the retry policy will be applied.
  const embeddingsResult = await generateEmbeddings(fileId);

  // In a real workflow, you would continue the chain:
  // await updateFileMetadataInDb(fileId, embeddingsResult);
  // await sendFileProcessedNotification(userId, fileId);

  // 2. Return the final result.
  return `Workflow completed for ${fileId}. Embeddings: ${embeddingsResult}`;
}
