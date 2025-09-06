import { Connection, Client } from "@temporalio/client";
import { subscriptionManagementWorkflow, cancelSubscription } from "../workflows";
import { TASK_QUEUE_NAME, SoloBossCustomer, SubscriptionWorkflowData } from "../shared";

const customer: SoloBossCustomer = {
  id: "user-cancel-test",
  email: "cancel-test@example.com",
  fullName: "Cancel Test User",
  username: "canceltest",
  subscriptionTier: "accelerator",
  subscriptionStatus: "active",
  stripeCustomerId: "cus_cancel_test",
  stripeSubscriptionId: "sub_cancel_test",
  currentPeriodStart: new Date(),
  currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  cancelAtPeriodEnd: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

async function run() {
  const connection = await Connection.connect({ address: "localhost:7233" });
  const client = new Client({
    connection,
  });

  console.log("🚫 Starting subscription cancellation workflow...\n");

  // Create subscription management workflow data
  const workflowData: SubscriptionWorkflowData = {
    customer,
    tier: customer.subscriptionTier,
    billingCycle: 'monthly',
    priceId: 'price_accelerator_monthly',
    amount: 1900, // $19 in cents
    isFreeTier: false
  };

  // Start the subscription management workflow
  const subscriptionWorkflowExecution = await client.workflow.start(
    subscriptionManagementWorkflow,
    {
      args: [workflowData],
      taskQueue: TASK_QUEUE_NAME,
      workflowId: `subscription-mgmt-${customer.id}`,
      workflowRunTimeout: "10 minutes",
    }
  );

  console.log(`✅ Started subscription management workflow for ${customer.email}`);
  console.log(`🔄 Workflow ID: ${subscriptionWorkflowExecution.workflowId}`);

  // Wait a moment for the workflow to start
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Get the workflow handle and send cancellation signal
  const handle = await client.workflow.getHandle(`subscription-mgmt-${customer.id}`);
  await handle.signal(cancelSubscription);
  
  console.log(`📤 Sent cancellation signal to workflow for ${customer.email}`);

  // Wait for the workflow to complete
  const result = await subscriptionWorkflowExecution.result();
  
  console.log("\n📊 Cancellation Results:");
  console.log(`✅ Success: ${result.success}`);
  console.log(`📝 Message: ${result.message}`);
  console.log(`🎯 Final Tier: ${result.finalTier}`);
  
  console.log(`\n🎉 Subscription cancellation completed for ${customer.email}!`);
}

run().catch((err) => {
  console.error("❌ Cancellation workflow failed:", err);
  process.exit(1);
});
