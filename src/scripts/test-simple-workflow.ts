import { Connection, Client } from "@temporalio/client";
import { TASK_QUEUE_NAME } from "../shared";

// Simple test workflow that just returns a result
async function simpleTestWorkflow(name: string): Promise<string> {
  return `Hello, ${name}! Test completed successfully.`;
}

async function run() {
  console.log("🧪 Testing Simple Temporal Workflow...\n");

  try {
    const connection = await Connection.connect({ 
      address: "localhost:7233",
      connectTimeout: "5s"
    });
    
    const client = new Client({
      connection,
    });

    console.log("✅ Connected to Temporal server");

    // Start a simple workflow
    const execution = await client.workflow.start(simpleTestWorkflow, {
      args: ["SoloBoss AI"],
      taskQueue: TASK_QUEUE_NAME,
      workflowId: `simple-test-${Date.now()}`,
      workflowRunTimeout: "30s",
    });

    console.log(`🔄 Started simple workflow: ${execution.workflowId}`);

    // Wait for the result
    const result = await execution.result();

    console.log("\n📊 Test Results:");
    console.log(`✅ Result: ${result}`);
    console.log("\n🎉 Simple workflow test passed!");

  } catch (error) {
    console.error("❌ Test failed with error:", error);
    
    if (error.message?.includes("ECONNREFUSED")) {
      console.log("\n💡 Make sure Temporal server is running:");
      console.log("   temporal server start-dev");
    } else if (error.message?.includes("timeout")) {
      console.log("\n⏰ Workflow timed out. The worker might not be running or configured properly.");
    }
  }
}

run().catch((err) => {
  console.error("❌ Test execution failed:", err);
  process.exit(1);
});
