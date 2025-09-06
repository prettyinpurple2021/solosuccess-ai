import { Connection, Client } from "@temporalio/client";
import { userOnboardingWorkflow, subscriptionManagementWorkflow } from "../workflows";
import { SoloBossCustomer, SubscriptionWorkflowData, TASK_QUEUE_NAME } from "../shared";

// Sample SoloBoss customers for testing
const customers: SoloBossCustomer[] = [
  {
    id: "user-1",
    email: "john@example.com",
    fullName: "John Doe",
    username: "johndoe",
    subscriptionTier: "launch",
    subscriptionStatus: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "user-2", 
    email: "jane@example.com",
    fullName: "Jane Smith",
    username: "janesmith",
    subscriptionTier: "accelerator",
    subscriptionStatus: "active",
    stripeCustomerId: "cus_test123",
    stripeSubscriptionId: "sub_test123",
    currentPeriodStart: new Date(),
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    cancelAtPeriodEnd: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "user-3",
    email: "bob@example.com", 
    fullName: "Bob Johnson",
    username: "bobjohnson",
    subscriptionTier: "dominator",
    subscriptionStatus: "active",
    stripeCustomerId: "cus_test456",
    stripeSubscriptionId: "sub_test456",
    currentPeriodStart: new Date(),
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    cancelAtPeriodEnd: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

async function run() {
  const connection = await Connection.connect({ address: "localhost:7233" });
  const client = new Client({
    connection,
  });

  console.log("🚀 Starting SoloBoss AI Platform subscription workflows...\n");

  // Run onboarding workflows for all customers
  const onboardingResults = await Promise.all(
    customers.map(async (customer) => {
      try {
        console.log(`📧 Starting onboarding for ${customer.email} (${customer.subscriptionTier} tier)`);
        
        const execution = await client.workflow.start(userOnboardingWorkflow, {
          args: [customer],
          taskQueue: TASK_QUEUE_NAME,
          workflowId: `onboarding-${customer.id}`,
          workflowRunTimeout: "5 minutes",
        });
        
        const result = await execution.result();
        console.log(`✅ Onboarding completed for ${customer.email}:`, result.message);
        return result;
      } catch (err) {
        console.error(`❌ Onboarding failed for ${customer.email}:`, err);
        return { success: false, message: `Onboarding failed: ${err}`, tier: 'launch' as const };
      }
    })
  );

  console.log("\n📊 Onboarding Results:");
  onboardingResults.forEach((result, index) => {
    console.log(`${index + 1}. ${result.success ? '✅' : '❌'} ${result.message}`);
  });

  // Run subscription management workflows for paid tier customers
  const paidCustomers = customers.filter(c => c.subscriptionTier !== 'launch');
  
  if (paidCustomers.length > 0) {
    console.log("\n💳 Starting subscription management for paid customers...\n");
    
    const managementResults = await Promise.all(
      paidCustomers.map(async (customer) => {
        try {
          const workflowData: SubscriptionWorkflowData = {
            customer,
            tier: customer.subscriptionTier,
            billingCycle: 'monthly',
            priceId: customer.subscriptionTier === 'accelerator' ? 'price_accelerator_monthly' : 'price_dominator_monthly',
            amount: customer.subscriptionTier === 'accelerator' ? 1900 : 2900, // $19 or $29 in cents
            isFreeTier: false
          };
          
          console.log(`🔄 Starting subscription management for ${customer.email} (${customer.subscriptionTier} tier)`);
          
          const execution = await client.workflow.start(subscriptionManagementWorkflow, {
            args: [workflowData],
            taskQueue: TASK_QUEUE_NAME,
            workflowId: `subscription-mgmt-${customer.id}`,
            workflowRunTimeout: "10 minutes",
          });
          
          const result = await execution.result();
          console.log(`✅ Subscription management started for ${customer.email}`);
          return result;
        } catch (err) {
          console.error(`❌ Subscription management failed for ${customer.email}:`, err);
          return { success: false, message: `Management failed: ${err}`, finalTier: customer.subscriptionTier };
        }
      })
    );

    console.log("\n📊 Subscription Management Results:");
    managementResults.forEach((result, index) => {
      console.log(`${index + 1}. ${result.success ? '✅' : '❌'} ${result.message}`);
    });
  }

  console.log("\n🎉 All SoloBoss AI Platform workflows completed!");
}

run().catch((err) => {
  console.error("❌ Workflow execution failed:", err);
  process.exit(1);
});
