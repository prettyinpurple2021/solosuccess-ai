import { Connection, Client } from "@temporalio/client";
import { subscriptionManagementWorkflow, upgradeSubscription } from "../workflows";
import { TASK_QUEUE_NAME, SoloSuccessCustomer, SubscriptionWorkflowData } from "../shared";

const customer: SoloSuccessCustomer = {
  id: "user-upgrade-test",
  email: "upgrade-test@example.com",
  fullName: "Upgrade Test User",
  username: "upgradetest",
  subscriptionTier: "accelerator",
  subscriptionStatus: "active",
  stripeCustomerId: "cus_upgrade_test",
  stripeSubscriptionId: "sub_upgrade_test",
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

  console.log("⬆️ Starting subscription upgrade workflow...\n");

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
  console.log(`📊 Current Tier: ${customer.subscriptionTier}`);

  // Wait a moment for the workflow to start
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Get the workflow handle and send upgrade signal
  const handle = await client.workflow.getHandle(`subscription-mgmt-${customer.id}`);
  
  // Upgrade from Accelerator to Dominator tier
  const newTier = "dominator";
  const newPriceId = "price_dominator_monthly";
  
  try {
    await handle.signal(upgradeSubscription, newTier, newPriceId);
    console.log(`📤 Sent upgrade signal to workflow for ${customer.email}`);
    console.log(`⬆️ Upgrading from ${customer.subscriptionTier} to ${newTier} tier`);
    console.log(`💰 New price ID: ${newPriceId}`);
  } catch (err) {
    console.error("❌ Failed to send upgrade signal:", err);
    return;
  }

  // Wait for the workflow to complete
  const result = await subscriptionWorkflowExecution.result();
  
  console.log("\n📊 Upgrade Results:");
  console.log(`✅ Success: ${result.success}`);
  console.log(`📝 Message: ${result.message}`);
  console.log(`🎯 Final Tier: ${result.finalTier}`);
  
  console.log(`\n🎉 Subscription upgrade completed for ${customer.email}!`);
}

run().catch((err) => {
  console.error("❌ Upgrade workflow failed:", err);
  process.exit(1);
});
