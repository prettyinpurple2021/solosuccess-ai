import { proxyActivities } from '@temporalio/workflow';
// Correctly point to the activities' type definitions
import type * as activities from '../activities/index.js'; // <-- FIX: Point directly to the index file

const { generateEmbeddings } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});

/** A workflow that processes a file uploaded to the briefcase */
export async function processBriefcaseFile(fileId: string): Promise<string> {
  const result = await generateEmbeddings(fileId);
  return result;
}

