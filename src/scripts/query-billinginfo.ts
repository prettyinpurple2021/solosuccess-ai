import { Connection, Client } from "@temporalio/client";
import { subscriptionManagementWorkflow } from "../workflows";
import { TASK_QUEUE_NAME, SoloSuccessCustomer, SubscriptionWorkflowData } from "../shared";

const customer: SoloSuccessCustomer = {
  id: "user-query-test",
  email: "query-test@example.com",
  fullName: "Query Test User",
  username: "querytest",
  subscriptionTier: "accelerator",
  subscriptionStatus: "active",
  stripeCustomerId: "cus_query_test",
  stripeSubscriptionId: "sub_query_test",
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

  console.log("🔍 Starting subscription query workflow...\n");

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

  // Query the workflow multiple times to see subscription details
  for (let i = 1; i <= 5; i++) {
    console.log(`\n📊 Query #${i} - Subscription Details:`);
    
    try {
      // Wait a bit between queries
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Query current subscription tier
      const currentTier = await subscriptionWorkflowExecution.query<string>("customerTier");
      console.log(`🎯 Current Tier: ${currentTier}`);
      
      // Query subscription status
      const subscriptionStatus = await subscriptionWorkflowExecution.query<string>("customerStatus");
      console.log(`📋 Status: ${subscriptionStatus}`);
      
      // Query subscription amount
      const subscriptionAmount = await subscriptionWorkflowExecution.query<number>("subscriptionAmount");
      console.log(`💰 Amount: $${subscriptionAmount / 100} (${subscriptionAmount} cents)`);
      
      // Display customer info
      console.log(`👤 Customer: ${customer.fullName} (${customer.email})`);
      console.log(`🆔 Customer ID: ${customer.id}`);
      console.log(`💳 Stripe Customer ID: ${customer.stripeCustomerId || 'N/A'}`);
      console.log(`📅 Current Period End: ${customer.currentPeriodEnd?.toLocaleDateString() || 'N/A'}`);
      console.log(`❌ Cancel at Period End: ${customer.cancelAtPeriodEnd ? 'Yes' : 'No'}`);
      
    } catch (err) {
      console.error(`❌ Error querying workflow (attempt ${i}):`, err);
    }
  }

  console.log("\n🎉 Subscription query workflow completed!");
  console.log("💡 The subscription management workflow is still running and can be queried at any time.");
}

run().catch((err) => {
  console.error("❌ Query workflow failed:", err);
  process.exit(1);
});
