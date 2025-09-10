import { Connection, Client } from "@temporalio/client";
import { userOnboardingWorkflow } from "../workflows";
import { TASK_QUEUE_NAME, SoloSuccessCustomer } from "../shared";

// Simple test customer
const testCustomer: SoloSuccessCustomer = {
  id: "test-user-1",
  email: "test@SoloSuccessai.fun",
  fullName: "Test User",
  username: "testuser",
  subscriptionTier: "launch",
  subscriptionStatus: "active",
  createdAt: new Date(),
  updatedAt: new Date(),
};

async function run() {
  console.log("🧪 Testing SoloSuccess AI Platform Temporal Workflows (Simple Test)...\n");

  try {
    // First, check if Temporal server is running
    console.log("🔍 Checking Temporal server connection...");
    
    const connection = await Connection.connect({ 
      address: "localhost:7233",
      connectTimeout: "5s" // Shorter timeout for faster failure detection
    });
    
    const client = new Client({
      connection,
    });

    console.log("✅ Connected to Temporal server");
    console.log(`📧 Testing onboarding for: ${testCustomer.email} (${testCustomer.subscriptionTier} tier)`);

    // Start the onboarding workflow with shorter timeout
    const execution = await client.workflow.start(userOnboardingWorkflow, {
      args: [testCustomer],
      taskQueue: TASK_QUEUE_NAME,
      workflowId: `test-onboarding-${testCustomer.id}-${Date.now()}`, // Add timestamp to avoid conflicts
      workflowRunTimeout: "2 minutes", // Shorter timeout
      workflowTaskTimeout: "30s", // Add task timeout
    });

    console.log(`🔄 Started workflow: ${execution.workflowId}`);

    // Wait for the result with a timeout
    const result = await Promise.race([
      execution.result(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Test timeout after 2 minutes")), 120000)
      )
    ]);

    console.log("\n📊 Test Results:");
    console.log(`✅ Success: ${result.success}`);
    console.log(`📝 Message: ${result.message}`);
    console.log(`🎯 Final Tier: ${result.tier}`);

    if (result.success) {
      console.log("\n🎉 Test passed! SoloSuccess AI Platform workflows are working correctly.");
    } else {
      console.log("\n❌ Test failed. Check the error message above.");
    }

  } catch (error) {
    console.error("❌ Test failed with error:", error);
    
    if (error.message?.includes("ECONNREFUSED") || error.message?.includes("connectTimeout")) {
      console.log("\n💡 Make sure Temporal server is running:");
      console.log("   temporal server start-dev");
      console.log("\n🔧 Or start it with Docker:");
      console.log("   docker run -p 7233:7233 -p 8233:8233 temporalio/auto-setup:latest");
    } else if (error.message?.includes("timeout")) {
      console.log("\n⏰ Workflow timed out. This could mean:");
      console.log("   - Temporal worker is not running");
      console.log("   - Activities are taking too long");
      console.log("   - Database/external services are not available");
      console.log("\n🔧 Try starting the worker:");
      console.log("   npm run worker");
    } else {
      console.log("\n🔍 Check the error details above for more information.");
    }
  }
}

run().catch((err) => {
  console.error("❌ Test execution failed:", err);
  process.exit(1);
});
