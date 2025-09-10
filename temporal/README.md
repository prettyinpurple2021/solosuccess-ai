# Temporal.io Setup for SoloSuccess AI Platform

This directory contains the Temporal.io configuration and examples for the SoloSuccess AI Platform.

## Prerequisites

1. **Docker** - For running the Temporal development server
2. **Node.js** - Already installed in your project
3. **Temporal Dependencies** - Already installed (`@temporalio/client`, `@temporalio/worker`)

## Quick Start

### 1. Start the Temporal Development Server

```bash
# Start Temporal server with UI (runs in background)
docker run -p 7233:7233 -p 8080:8080 --name temporal-ui temporalio/auto-setup:latest
```

The Temporal Web UI will be available at: http://localhost:8080

### 2. Start the Worker

```bash
# Start the Temporal worker (in a separate terminal)
npm run temporal:worker
```

### 3. Run Example Workflows

```bash
# Run the example client to test workflows
npm run temporal:client
```

### 4. Development Mode

```bash
# Run both worker and Next.js dev server
npm run temporal:dev
```

## File Structure

```
temporal/
├── README.md           # This file
├── worker.ts          # Temporal worker configuration
└── client.ts          # Example client for running workflows

src/
├── activities.ts      # Activity functions (business logic)
└── workflows.ts       # Workflow definitions
```

## Available Scripts

- `npm run temporal:worker` - Start the Temporal worker
- `npm run temporal:client` - Run example workflows
- `npm run temporal:dev` - Run worker + Next.js dev server

## Workflows Included

1. **Simple Greeting** - Basic workflow example
2. **User Onboarding** - Complex workflow with multiple steps
3. **Scheduled Data Processing** - Batch processing workflow

## Integration with Your App

To integrate Temporal workflows into your Next.js API routes:

```typescript
// In your API route
import { Connection, Client } from '@temporalio/client';
import { userOnboardingWorkflow } from '@/src/workflows';

export async function POST(request: Request) {
  const connection = await Connection.connect({
    address: 'localhost:7233',
  });

  const client = new Client({
    connection,
    namespace: 'default',
  });

  const handle = await client.workflow.start(userOnboardingWorkflow, {
    args: [userId, userData],
    taskQueue: 'SoloSuccess-tasks',
    workflowId: `onboarding-${userId}-${Date.now()}`,
  });

  return Response.json({ workflowId: handle.workflowId });
}
```

## Monitoring

- **Temporal Web UI**: http://localhost:8080
- **Worker Logs**: Check the terminal where you ran `npm run temporal:worker`
- **Workflow History**: Available in the Temporal Web UI

## Next Steps

1. Create more specific workflows for your SoloSuccess AI Platform features
2. Add error handling and retry policies
3. Set up production Temporal Cloud or self-hosted server
4. Integrate with your existing database and services
