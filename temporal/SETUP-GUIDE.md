# Temporal.io Setup Guide for SoloSuccess AI Platform

## 🎉 Setup Complete!

Your Temporal.io development environment is now configured! Here's what we've set up:

### ✅ What's Already Done

1. **Dependencies Installed**: `@temporalio/client` and `@temporalio/worker` are already in your package.json
2. **Worker Configuration**: Created `temporal/worker.ts` with proper configuration
3. **Client Examples**: Created `temporal/client.ts` with example workflows
4. **Enhanced Activities**: Updated `src/activities.ts` with SoloSuccess-specific examples
5. **Enhanced Workflows**: Updated `src/workflows.ts` with complex workflow examples
6. **NPM Scripts**: Added convenient scripts for running Temporal components

### 🚀 Quick Start

#### Option 1: Use Temporal Cloud (Recommended for Production)
1. Sign up at [temporal.io/cloud](https://temporal.io/cloud)
2. Create a namespace and get your connection details
3. Update the connection settings in `temporal/worker.ts` and `temporal/client.ts`

#### Option 2: Local Development Server
The Docker approach had some issues on Windows. Here are alternative methods:

**Method A: Using Temporal CLI (Recommended)**
```bash
# Install Temporal CLI (if not already installed)
# Windows: Download from https://github.com/temporalio/cli/releases
# Or use: winget install Temporal.CLI

# Start the development server
temporal server start-dev
```

**Method B: Using Docker Compose**
Create a `docker-compose.yml` file:
```yaml
version: '3.8'
services:
  temporal:
    image: temporalio/auto-setup:latest
    ports:
      - "7233:7233"
      - "8080:8080"
    environment:
      - DB=postgresql
      - POSTGRES_USER=temporal
      - POSTGRES_PWD=temporal
      - POSTGRES_SEEDS=postgresql
```

Then run: `docker-compose up -d`

### 🧪 Testing Your Setup

Once you have a Temporal server running:

1. **Start the Worker** (in one terminal):
   ```bash
   npm run temporal:worker
   ```

2. **Run Example Workflows** (in another terminal):
   ```bash
   npm run temporal:client
   ```

3. **View the Web UI**: Open http://localhost:8080 in your browser

### 📁 File Structure

```
temporal/
├── README.md           # Basic documentation
├── SETUP-GUIDE.md     # This comprehensive guide
├── worker.ts          # Temporal worker configuration
└── client.ts          # Example client for running workflows

src/
├── activities.ts      # Activity functions (business logic)
└── workflows.ts       # Workflow definitions
```

### 🔧 Available Scripts

- `npm run temporal:worker` - Start the Temporal worker
- `npm run temporal:client` - Run example workflows
- `npm run temporal:dev` - Run worker + Next.js dev server

### 🌟 Example Workflows Included

1. **Simple Greeting** - Basic workflow example
2. **User Onboarding** - Complex workflow with multiple steps:
   - Process user data
   - Update user profile
   - Send welcome notification
   - Wait and finalize
3. **Scheduled Data Processing** - Batch processing workflow

### 🔗 Integration with Your App

To use Temporal in your Next.js API routes:

```typescript
// In your API route (e.g., app/api/onboard-user/route.ts)
import { Connection, Client } from '@temporalio/client';
import { userOnboardingWorkflow } from '@/src/workflows';

export async function POST(request: Request) {
  const { userId, userData } = await request.json();
  
  const connection = await Connection.connect({
    address: 'localhost:7233', // or your Temporal Cloud address
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

  return Response.json({ 
    workflowId: handle.workflowId,
    message: 'User onboarding started' 
  });
}
```

### 🎯 Next Steps

1. **Get Temporal Server Running**: Choose one of the methods above
2. **Test the Setup**: Run the example workflows
3. **Create Custom Workflows**: Add workflows specific to your SoloSuccess AI Platform features
4. **Add Error Handling**: Implement retry policies and error handling
5. **Production Setup**: Consider Temporal Cloud for production

### 🆘 Troubleshooting

**Worker won't start?**
- Make sure the Temporal server is running
- Check that port 7233 is accessible
- Verify the connection settings in `temporal/worker.ts`

**Workflows not executing?**
- Ensure the worker is running and connected
- Check the task queue name matches between client and worker
- Look at the Temporal Web UI for workflow status

**Docker issues on Windows?**
- Try using WSL2 or the Temporal CLI instead
- Make sure Docker Desktop is running
- Check Windows firewall settings

### 📚 Resources

- [Temporal Documentation](https://docs.temporal.io/)
- [Temporal TypeScript SDK](https://typescript.temporal.io/)
- [Temporal Web UI](http://localhost:8080) (when server is running)
- [Temporal Cloud](https://temporal.io/cloud)

---

**Ready to start building with Temporal! 🚀**

Your SoloSuccess AI Platform now has a robust workflow orchestration system that can handle complex, long-running processes reliably.
