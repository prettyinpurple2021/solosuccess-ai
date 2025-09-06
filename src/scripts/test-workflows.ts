import { Connection, Client } from "@temporalio/client";
import { userOnboardingWorkflow } from "../workflows";
import { TASK_QUEUE_NAME, SoloBossCustomer } from "../shared";

// Simple test customer
const testCustomer: SoloBossCustomer = {
  id: "test-user-1",
  email: "test@solobossai.fun",
  fullName: "Test User",
  username: "testuser",
  subscriptionTier: "launch",
  subscriptionStatus: "active",
  createdAt: new Date(),
  updatedAt: new Date(),
};

async function run() {
  console.log("🧪 Testing SoloBoss AI Platform Temporal Workflows...\n");

  try {
    const connection = await Connection.connect({ address: "localhost:7233" });
    const client = new Client({
      connection,
    });

    console.log("✅ Connected to Temporal server");
    console.log(`📧 Testing onboarding for: ${testCustomer.email} (${testCustomer.subscriptionTier} tier)`);

    // Start the onboarding workflow
    const execution = await client.workflow.start(userOnboardingWorkflow, {
      args: [testCustomer],
      taskQueue: TASK_QUEUE_NAME,
      workflowId: `test-onboarding-${testCustomer.id}`,
      workflowRunTimeout: "5 minutes",
    });

    console.log(`🔄 Started workflow: ${execution.workflowId}`);

    // Wait for the result
    const result = await execution.result();

    console.log("\n📊 Test Results:");
    console.log(`✅ Success: ${result.success}`);
    console.log(`📝 Message: ${result.message}`);
    console.log(`🎯 Final Tier: ${result.tier}`);

    if (result.success) {
      console.log("\n🎉 Test passed! SoloBoss AI Platform workflows are working correctly.");
    } else {
      console.log("\n❌ Test failed. Check the error message above.");
    }

  } catch (error) {
    console.error("❌ Test failed with error:", error);
    
    if (error.message?.includes("ECONNREFUSED")) {
      console.log("\n💡 Make sure Temporal server is running:");
      console.log("   temporal server start-dev");
    }
  }
}

run().catch((err) => {
  console.error("❌ Test execution failed:", err);
  process.exit(1);
});
