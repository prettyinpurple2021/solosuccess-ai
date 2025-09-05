import { NextRequest, NextResponse } from 'next/server';
import { temporalClient } from '@/lib/temporal'; // Use our singleton client
import { processBriefcaseFile } from '@/temporal/workflows'; // Import the workflow
import { v4 as uuidv4 } from 'uuid'; // To generate a unique ID

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { fileId } = await request.json();

    if (!fileId) {
      return NextResponse.json(
        { error: 'fileId is required' },
        { status: 400 }
      );
    }

    // A unique ID for this specific workflow execution
    const workflowId = `process-briefcase-${fileId}-${uuidv4()}`;

    // Start the Workflow execution.
    // This sends the job to Temporal Cloud, which will then be picked up by our Worker.
    await temporalClient.workflow.start(processBriefcaseFile, {
      taskQueue: 'soloboss-task-queue', // Must match the taskQueue in our Worker
      workflowId: workflowId,
      args: [fileId], // The arguments for our workflow function
    });

    console.log(`[API] Started workflow ${workflowId} for file ${fileId}`);

    // Return the workflowId to the client so it can track the job if needed.
    return NextResponse.json({ success: true, workflowId });
  } catch (error) {
    console.error('Error starting workflow:', error);
    return NextResponse.json(
      { error: 'Failed to start workflow' },
      { status: 500 }
    );
  }
}