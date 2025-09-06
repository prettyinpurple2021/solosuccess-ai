export async function greet(name: string): Promise<string> {
  return `Hello, ${name}!`;
}

// Example activities for SoloBoss AI Platform
export async function processUserData(userId: string, data: any): Promise<{ success: boolean; processedAt: string }> {
  // Simulate processing user data
  console.log(`Processing data for user: ${userId}`);
  
  // Simulate some processing time
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    success: true,
    processedAt: new Date().toISOString()
  };
}

export async function sendNotification(userId: string, message: string): Promise<{ sent: boolean; messageId: string }> {
  // Simulate sending a notification
  console.log(`Sending notification to user ${userId}: ${message}`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    sent: true,
    messageId: `msg_${Date.now()}`
  };
}

export async function updateUserProfile(userId: string, updates: any): Promise<{ updated: boolean; timestamp: string }> {
  // Simulate updating user profile
  console.log(`Updating profile for user: ${userId}`, updates);
  
  // Simulate database update time
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    updated: true,
    timestamp: new Date().toISOString()
  };
}

// SoloBoss AI Platform specific activities
export async function createInitialGoals(userId: string, userData: any): Promise<{ goalsCreated: number; goalIds: string[] }> {
  console.log(`Creating initial goals for user: ${userId}`);
  
  // Simulate creating default goals based on user data
  const defaultGoals = [
    { title: "Complete onboarding", category: "onboarding", priority: "high" },
    { title: "Set up first project", category: "productivity", priority: "medium" },
    { title: "Explore AI agents", category: "learning", priority: "low" }
  ];
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    goalsCreated: defaultGoals.length,
    goalIds: defaultGoals.map((_, index) => `goal_${userId}_${index}`)
  };
}

export async function setupCompetitiveIntelligence(userId: string): Promise<{ setup: boolean; competitorsAdded: number }> {
  console.log(`Setting up competitive intelligence for user: ${userId}`);
  
  // Simulate setting up competitive intelligence monitoring
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    setup: true,
    competitorsAdded: 3 // Default competitors to monitor
  };
}

export async function initializeAIAgents(userId: string): Promise<{ agentsInitialized: string[]; personalized: boolean }> {
  console.log(`Initializing AI agents for user: ${userId}`);
  
  // Simulate AI agent initialization
  const agents = ['Roxy', 'Blaze', 'Echo', 'Lumi', 'Vex', 'Lexi', 'Nova', 'Glitch'];
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    agentsInitialized: agents,
    personalized: true
  };
}

export async function sendWelcomeEmail(userId: string, userEmail: string, userName: string): Promise<{ sent: boolean; emailId: string }> {
  console.log(`Sending welcome email to: ${userEmail}`);
  
  // Simulate email sending
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    sent: true,
    emailId: `welcome_${Date.now()}`
  };
}

export async function createOnboardingTasks(userId: string, goalIds: string[]): Promise<{ tasksCreated: number; taskIds: string[] }> {
  console.log(`Creating onboarding tasks for user: ${userId}`);
  
  const onboardingTasks = [
    { title: "Complete profile setup", goalId: goalIds[0], priority: "high" },
    { title: "Take platform tour", goalId: goalIds[0], priority: "medium" },
    { title: "Set up first project", goalId: goalIds[1], priority: "high" },
    { title: "Meet your AI agents", goalId: goalIds[2], priority: "low" }
  ];
  
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  return {
    tasksCreated: onboardingTasks.length,
    taskIds: onboardingTasks.map((_, index) => `task_${userId}_${index}`)
  };
}

export async function scheduleIntelligenceBriefing(userId: string): Promise<{ scheduled: boolean; briefingId: string }> {
  console.log(`Scheduling intelligence briefing for user: ${userId}`);
  
  // Simulate scheduling a briefing
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    scheduled: true,
    briefingId: `briefing_${userId}_${Date.now()}`
  };
}

// SoloBoss AI Platform subscription activities
import { log } from "@temporalio/activity";
import { SoloBossCustomer, SubscriptionTier, SubscriptionWorkflowData } from "./shared";

// Welcome and onboarding activities
export async function sendWelcomeEmail(customer: SoloBossCustomer) {
  log.info(`Sending welcome email to ${customer.email} for ${customer.subscriptionTier} tier`);
  
  // Simulate email sending with a short delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // In a real implementation, you would integrate with your email service (Resend, SendGrid, etc.)
  // await sendEmail({
  //   to: customer.email,
  //   subject: `Welcome to SoloBoss AI Platform!`,
  //   template: 'welcome',
  //   data: { customer, tier: customer.subscriptionTier }
  // });
  
  log.info(`Welcome email sent successfully to ${customer.email}`);
}

export async function setupFreeTierAccess(customer: SoloBossCustomer) {
  log.info(`Setting up free tier access for ${customer.email}`);
  
  // Simulate setup with a short delay
  await new Promise(resolve => setTimeout(resolve, 150));
  
  // Set up free tier limits and features
  // - 2 AI agents (Nova & Echo)
  // - 5 AI conversations per day
  // - Basic task automation
  // - Email support
  // - Community access
  // - Mobile app access
  
  log.info(`Free tier access set up successfully for ${customer.email}`);
}

export async function setupPaidTierAccess(customer: SoloBossCustomer, tier: SubscriptionTier) {
  log.info(`Setting up ${tier} tier access for ${customer.email}`);
  
  if (tier === 'accelerator') {
    // - Access to all 8 AI agents
    // - Unlimited AI conversations
    // - Advanced automation
    // - Priority support
    // - Advanced analytics
    // - File management (10GB)
    // - Competitive intelligence
    // - Guardian AI compliance
    // - Template library access
    // - API access
  } else if (tier === 'dominator') {
    // - Everything in Accelerator
    // - Premium features
    // - Higher limits
    // - White-label options
  }
}

// Subscription management activities
export async function createStripeSubscription(customer: SoloBossCustomer, priceId: string) {
  log.info(`Creating Stripe subscription for ${customer.email} with price ${priceId}`);
  
  // In a real implementation, you would call Stripe API
  // const subscription = await stripe.subscriptions.create({
  //   customer: customer.stripeCustomerId,
  //   items: [{ price: priceId }],
  //   metadata: {
  //     user_id: customer.id,
  //     tier: customer.subscriptionTier
  //   }
  // });
  
  // return subscription.id;
  return `sub_mock_${Date.now()}`;
}

export async function cancelStripeSubscription(customer: SoloBossCustomer) {
  log.info(`Canceling Stripe subscription for ${customer.email}`);
  
  if (!customer.stripeSubscriptionId) {
    log.info(`No Stripe subscription to cancel for ${customer.email}`);
    return;
  }
  
  // In a real implementation, you would call Stripe API
  // await stripe.subscriptions.update(customer.stripeSubscriptionId, {
  //   cancel_at_period_end: true
  // });
  
  log.info(`Stripe subscription ${customer.stripeSubscriptionId} marked for cancellation`);
}

export async function updateStripeSubscription(customer: SoloBossCustomer, newPriceId: string) {
  log.info(`Updating Stripe subscription for ${customer.email} to price ${newPriceId}`);
  
  if (!customer.stripeSubscriptionId) {
    log.error(`No Stripe subscription to update for ${customer.email}`);
    return;
  }
  
  // In a real implementation, you would call Stripe API
  // await stripe.subscriptions.update(customer.stripeSubscriptionId, {
  //   items: [{
  //     id: customer.stripeSubscriptionId,
  //     price: newPriceId
  //   }],
  //   proration_behavior: 'create_prorations'
  // });
  
  log.info(`Stripe subscription ${customer.stripeSubscriptionId} updated to ${newPriceId}`);
}

// Email notification activities
export async function sendSubscriptionUpgradeEmail(customer: SoloBossCustomer, newTier: SubscriptionTier) {
  log.info(`Sending subscription upgrade email to ${customer.email} for ${newTier} tier`);
  // await sendEmail({
  //   to: customer.email,
  //   subject: `Welcome to SoloBoss AI ${newTier.charAt(0).toUpperCase() + newTier.slice(1)}!`,
  //   template: 'subscription-upgrade',
  //   data: { customer, newTier }
  // });
}

export async function sendSubscriptionDowngradeEmail(customer: SoloBossCustomer, newTier: SubscriptionTier) {
  log.info(`Sending subscription downgrade email to ${customer.email} for ${newTier} tier`);
  // await sendEmail({
  //   to: customer.email,
  //   subject: `Your SoloBoss AI subscription has been updated`,
  //   template: 'subscription-downgrade',
  //   data: { customer, newTier }
  // });
}

export async function sendSubscriptionCancellationEmail(customer: SoloBossCustomer) {
  log.info(`Sending subscription cancellation email to ${customer.email}`);
  // await sendEmail({
  //   to: customer.email,
  //   subject: `Your SoloBoss AI subscription has been canceled`,
  //   template: 'subscription-cancellation',
  //   data: { customer }
  // });
}

export async function sendPaymentFailedEmail(customer: SoloBossCustomer, retryCount: number) {
  log.info(`Sending payment failed email to ${customer.email} (retry ${retryCount})`);
  // await sendEmail({
  //   to: customer.email,
  //   subject: `Payment failed for your SoloBoss AI subscription`,
  //   template: 'payment-failed',
  //   data: { customer, retryCount }
  // });
}

export async function sendPaymentSucceededEmail(customer: SoloBossCustomer, amount: number) {
  log.info(`Sending payment succeeded email to ${customer.email} for $${amount / 100}`);
  // await sendEmail({
  //   to: customer.email,
  //   subject: `Payment successful for your SoloBoss AI subscription`,
  //   template: 'payment-succeeded',
  //   data: { customer, amount }
  // });
}

// Database update activities
export async function updateUserSubscriptionInDatabase(customer: SoloBossCustomer) {
  log.info(`Updating user subscription in database for ${customer.email}`);
  
  // Simulate database update with a short delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // In a real implementation, you would update your database
  // await db.update(users)
  //   .set({
  //     subscription_tier: customer.subscriptionTier,
  //     subscription_status: customer.subscriptionStatus,
  //     stripe_customer_id: customer.stripeCustomerId,
  //     stripe_subscription_id: customer.stripeSubscriptionId,
  //     current_period_start: customer.currentPeriodStart,
  //     current_period_end: customer.currentPeriodEnd,
  //     cancel_at_period_end: customer.cancelAtPeriodEnd,
  //     updated_at: new Date()
  //   })
  //   .where(eq(users.id, customer.id));
  
  log.info(`User subscription updated successfully for ${customer.email}`);
}

export async function downgradeToFreeTier(customer: SoloBossCustomer) {
  log.info(`Downgrading ${customer.email} to free tier`);
  
  // Update customer to free tier
  customer.subscriptionTier = 'launch';
  customer.subscriptionStatus = 'active';
  customer.stripeSubscriptionId = undefined;
  customer.cancelAtPeriodEnd = false;
  
  // Set up free tier access
  await setupFreeTierAccess(customer);
  
  // Update database
  await updateUserSubscriptionInDatabase(customer);
}