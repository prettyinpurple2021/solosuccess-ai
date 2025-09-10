import { 
  proxyActivities, 
  sleep, 
  log, 
  workflowInfo, 
  defineQuery, 
  defineSignal, 
  setHandler, 
  condition 
} from '@temporalio/workflow';
// Only import the activity types
import type * as activities from './activities';
import { SoloSuccessCustomer, SubscriptionTier, SubscriptionWorkflowData } from './shared';

const { greet, processUserData, sendNotification, updateUserProfile } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});

// SoloSuccess subscription workflow activities
const {
  sendWelcomeEmail,
  setupFreeTierAccess,
  setupPaidTierAccess,
  createStripeSubscription,
  cancelStripeSubscription,
  updateStripeSubscription,
  sendSubscriptionUpgradeEmail,
  sendSubscriptionDowngradeEmail,
  sendSubscriptionCancellationEmail,
  sendPaymentFailedEmail,
  sendPaymentSucceededEmail,
  updateUserSubscriptionInDatabase,
  downgradeToFreeTier,
} = proxyActivities<typeof activities>({
  startToCloseTimeout: "30 seconds",
});

/** A workflow that simply calls an activity */
export async function example(name: string): Promise<string> {
  return await greet(name);
}

/** A more complex workflow for user onboarding (legacy) */
export async function legacyUserOnboardingWorkflow(userId: string, userData: any): Promise<{ success: boolean; steps: string[] }> {
  const steps: string[] = [];
  
  try {
    // Step 1: Process user data
    const processResult = await processUserData(userId, userData);
    if (processResult.success) {
      steps.push('User data processed successfully');
    }
    
    // Step 2: Update user profile
    const updateResult = await updateUserProfile(userId, { 
      onboardingCompleted: true,
      lastLogin: new Date().toISOString()
    });
    if (updateResult.updated) {
      steps.push('User profile updated');
    }
    
    // Step 3: Send welcome notification
    const notificationResult = await sendNotification(userId, 'Welcome to SoloSuccess AI Platform!');
    if (notificationResult.sent) {
      steps.push('Welcome notification sent');
    }
    
    // Step 4: Wait a bit before finalizing
    await sleep('10 seconds');
    
    return {
      success: true,
      steps
    };
  } catch (error) {
    console.error('User onboarding failed:', error);
    return {
      success: false,
      steps: [...steps, 'Onboarding failed']
    };
  }
}

/** A workflow for scheduled user data processing */
export async function scheduledDataProcessingWorkflow(): Promise<{ processed: number; errors: number }> {
  let processed = 0;
  let errors = 0;
  
  // This would typically fetch users from your database
  const userIds = ['user1', 'user2', 'user3']; // Mock user IDs
  
  for (const userId of userIds) {
    try {
      await processUserData(userId, { scheduled: true });
      processed++;
    } catch (error) {
      console.error(`Failed to process user ${userId}:`, error);
      errors++;
    }
  }
  
  return { processed, errors };
}

// SoloSuccess AI Platform specific workflows (legacy)
const { 
  createInitialGoals, 
  setupCompetitiveIntelligence, 
  initializeAIAgents, 
  createOnboardingTasks, 
  scheduleIntelligenceBriefing 
} = proxyActivities<typeof import('./activities')>({
  startToCloseTimeout: '2 minutes',
});

/** Complete SoloSuccess AI Platform user onboarding workflow (legacy) */
export async function SoloSuccessUserOnboardingWorkflow(
  userId: string, 
  userData: { email: string; fullName: string; username?: string }
): Promise<{ 
  success: boolean; 
  steps: string[]; 
  goalsCreated: number; 
  tasksCreated: number; 
  agentsInitialized: string[];
}> {
  const steps: string[] = [];
  
  try {
    // Step 1: Create initial goals
    console.log(`Starting onboarding for user: ${userId}`);
    const goalsResult = await createInitialGoals(userId, userData);
    steps.push(`Created ${goalsResult.goalsCreated} initial goals`);
    
    // Step 2: Set up competitive intelligence
    const intelligenceResult = await setupCompetitiveIntelligence(userId);
    if (intelligenceResult.setup) {
      steps.push(`Set up competitive intelligence with ${intelligenceResult.competitorsAdded} competitors`);
    }
    
    // Step 3: Initialize AI agents
    const agentsResult = await initializeAIAgents(userId);
    steps.push(`Initialized ${agentsResult.agentsInitialized.length} AI agents`);
    
    // Step 4: Create onboarding tasks
    const tasksResult = await createOnboardingTasks(userId, goalsResult.goalIds);
    steps.push(`Created ${tasksResult.tasksCreated} onboarding tasks`);
    
    // Step 5: Send welcome email (using the new subscription workflow version)
    const emailResult = await sendWelcomeEmail({ 
      id: userId, 
      email: userData.email, 
      fullName: userData.fullName,
      subscriptionTier: 'launch',
      subscriptionStatus: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    steps.push('Welcome email sent');
    
    // Step 6: Schedule intelligence briefing
    const briefingResult = await scheduleIntelligenceBriefing(userId);
    if (briefingResult.scheduled) {
      steps.push('Intelligence briefing scheduled');
    }
    
    // Step 7: Update user profile with onboarding completion
    await updateUserProfile(userId, { 
      onboardingCompleted: true,
      onboardingCompletedAt: new Date().toISOString(),
      level: 1,
      totalPoints: 100 // Welcome bonus points
    });
    steps.push('User profile updated with onboarding completion');
    
    return {
      success: true,
      steps,
      goalsCreated: goalsResult.goalsCreated,
      tasksCreated: tasksResult.tasksCreated,
      agentsInitialized: agentsResult.agentsInitialized
    };
    
  } catch (error) {
    console.error('SoloSuccess onboarding failed:', error);
    return {
      success: false,
      steps: [...steps, 'Onboarding failed'],
      goalsCreated: 0,
      tasksCreated: 0,
      agentsInitialized: []
    };
  }
}

/** Competitive Intelligence Processing Workflow */
export async function competitiveIntelligenceProcessingWorkflow(
  userId: string,
  competitorData: any[]
): Promise<{ 
  processed: number; 
  insights: number; 
  alerts: number; 
  recommendations: number;
}> {
  let processed = 0;
  let insights = 0;
  let alerts = 0;
  let recommendations = 0;
  
  try {
    for (const competitor of competitorData) {
      // Process each competitor's data
      const result = await processUserData(userId, { 
        type: 'competitive_intelligence',
        competitor: competitor 
      });
      
      if (result.success) {
        processed++;
        
        // Simulate generating insights
        insights += Math.floor(Math.random() * 3) + 1;
        
        // Simulate generating alerts
        if (Math.random() > 0.7) {
          alerts++;
        }
        
        // Simulate generating recommendations
        recommendations += Math.floor(Math.random() * 2) + 1;
      }
    }
    
    // Send notification about processing results
    await sendNotification(userId, 
      `Competitive intelligence processing complete: ${processed} competitors analyzed, ${insights} insights generated, ${alerts} alerts created`
    );
    
    return { processed, insights, alerts, recommendations };
    
  } catch (error) {
    console.error('Competitive intelligence processing failed:', error);
    throw error;
  }
}

/** AI Agent Briefing Workflow */
export async function aiAgentBriefingWorkflow(
  userId: string,
  agentIds: string[],
  briefingType: 'daily' | 'weekly' | 'monthly'
): Promise<{ 
  briefingsGenerated: number; 
  agents: string[]; 
  insights: number;
}> {
  let briefingsGenerated = 0;
  let insights = 0;
  
  try {
    for (const agentId of agentIds) {
      // Generate briefing for each agent
      const briefingResult = await processUserData(userId, {
        type: 'agent_briefing',
        agentId,
        briefingType
      });
      
      if (briefingResult.success) {
        briefingsGenerated++;
        insights += Math.floor(Math.random() * 5) + 3; // 3-7 insights per agent
      }
    }
    
    // Send notification about briefing completion
    await sendNotification(userId, 
      `${briefingType} briefing complete for ${briefingsGenerated} agents with ${insights} total insights`
    );
    
    return { 
      briefingsGenerated, 
      agents: agentIds, 
      insights 
    };
    
  } catch (error) {
    console.error('AI agent briefing failed:', error);
    throw error;
  }
}

/** Goal Achievement Tracking Workflow */
export async function goalAchievementTrackingWorkflow(
  userId: string,
  goalIds: string[]
): Promise<{ 
  goalsAnalyzed: number; 
  achievements: number; 
  recommendations: number;
}> {
  let goalsAnalyzed = 0;
  let achievements = 0;
  let recommendations = 0;
  
  try {
    for (const goalId of goalIds) {
      // Analyze goal progress
      const analysisResult = await processUserData(userId, {
        type: 'goal_analysis',
        goalId
      });
      
      if (analysisResult.success) {
        goalsAnalyzed++;
        
        // Simulate achievement detection
        if (Math.random() > 0.8) {
          achievements++;
        }
        
        // Simulate recommendation generation
        recommendations += Math.floor(Math.random() * 2) + 1;
      }
    }
    
    // Update user points based on achievements
    if (achievements > 0) {
      await updateUserProfile(userId, {
        totalPoints: achievements * 50, // 50 points per achievement
        lastAchievementAt: new Date().toISOString()
      });
    }
    
    // Send achievement notification
    if (achievements > 0) {
      await sendNotification(userId, 
        `🎉 Congratulations! You've achieved ${achievements} goals and earned ${achievements * 50} points!`
      );
    }
    
    return { goalsAnalyzed, achievements, recommendations };
    
  } catch (error) {
    console.error('Goal achievement tracking failed:', error);
    throw error;
  }
}

// SoloSuccess AI Platform subscription workflow definitions
export const customerTierQuery = defineQuery<SubscriptionTier>("customerTier");
export const customerStatusQuery = defineQuery<string>("customerStatus");
export const subscriptionAmountQuery = defineQuery<number>("subscriptionAmount");

export const cancelSubscription = defineSignal("cancelSubscription");
export const upgradeSubscription = defineSignal<[SubscriptionTier, string]>("upgradeSubscription");
export const downgradeSubscription = defineSignal<[SubscriptionTier]>("downgradeSubscription");

/**
 * SoloSuccess AI Platform User Onboarding Workflow
 * Handles new user signup and initial subscription setup
 */
export async function userOnboardingWorkflow(
  customer: SoloSuccessCustomer
): Promise<{ success: boolean; message: string; tier: SubscriptionTier }> {
  try {
    log.info(`Starting onboarding workflow for ${customer.email}`);

    // Send welcome email
    await sendWelcomeEmail(customer);

    // Set up access based on tier
    if (customer.subscriptionTier === 'launch') {
      await setupFreeTierAccess(customer);
    } else {
      await setupPaidTierAccess(customer, customer.subscriptionTier);
    }

    // Update database
    await updateUserSubscriptionInDatabase(customer);

    log.info(`Onboarding completed for ${customer.email} on ${customer.subscriptionTier} tier`);
    
    return {
      success: true,
      message: `Welcome to SoloSuccess AI Platform! You're now on the ${customer.subscriptionTier} tier.`,
      tier: customer.subscriptionTier
    };

  } catch (error) {
    log.error(`Onboarding failed for ${customer.email}:`, error);
    return {
      success: false,
      message: `Onboarding failed: ${error}`,
      tier: 'launch'
    };
  }
}

/**
 * SoloSuccess AI Platform Subscription Management Workflow
 * Handles ongoing subscription management, upgrades, downgrades, and cancellations
 */
export async function subscriptionManagementWorkflow(
  workflowData: SubscriptionWorkflowData
): Promise<{ success: boolean; message: string; finalTier: SubscriptionTier }> {
  const { customer, tier, billingCycle, priceId, amount, isFreeTier } = workflowData;
  
  let currentTier = customer.subscriptionTier;
  let subscriptionCancelled = false;
  let pendingUpgrade: { tier: SubscriptionTier; priceId: string } | null = null;
  let pendingDowngrade: SubscriptionTier | null = null;

  // Set up query and signal handlers
  setHandler(customerTierQuery, () => currentTier);
  setHandler(customerStatusQuery, () => customer.subscriptionStatus);
  setHandler(subscriptionAmountQuery, () => amount);

  setHandler(cancelSubscription, () => {
    subscriptionCancelled = true;
    log.info(`Cancellation signal received for ${customer.email}`);
  });

  setHandler(upgradeSubscription, (newTier: SubscriptionTier, newPriceId: string) => {
    pendingUpgrade = { tier: newTier, priceId: newPriceId };
    log.info(`Upgrade signal received for ${customer.email} to ${newTier}`);
  });

  setHandler(downgradeSubscription, (newTier: SubscriptionTier) => {
    pendingDowngrade = newTier;
    log.info(`Downgrade signal received for ${customer.email} to ${newTier}`);
  });

  try {
    // Handle free tier users
    if (isFreeTier) {
      log.info(`Managing free tier subscription for ${customer.email}`);
      
      // Free tier users can upgrade at any time
      while (!subscriptionCancelled) {
        // Wait for upgrade signal or cancellation
        await condition(() => pendingUpgrade !== null || subscriptionCancelled, "1 hour");
        
        if (subscriptionCancelled) {
          break;
        }
        
        if (pendingUpgrade) {
          const { tier: newTier, priceId: newPriceId } = pendingUpgrade;
          
          // Create Stripe subscription
          const subscriptionId = await createStripeSubscription(customer, newPriceId);
          
          // Update customer data
          customer.subscriptionTier = newTier;
          customer.subscriptionStatus = 'active';
          customer.stripeSubscriptionId = subscriptionId;
          currentTier = newTier;
          
          // Set up paid tier access
          await setupPaidTierAccess(customer, newTier);
          
          // Send upgrade email
          await sendSubscriptionUpgradeEmail(customer, newTier);
          
          // Update database
          await updateUserSubscriptionInDatabase(customer);
          
          log.info(`Successfully upgraded ${customer.email} to ${newTier} tier`);
          pendingUpgrade = null;
          
          // Continue with paid subscription management
          break;
        }
      }
    }

    // Handle paid tier users
    if (!isFreeTier && !subscriptionCancelled) {
      log.info(`Managing paid subscription for ${customer.email} on ${currentTier} tier`);
      
      // Monitor for subscription changes
      while (!subscriptionCancelled) {
        // Wait for signals or billing period
        await condition(() => 
          pendingUpgrade !== null || 
          pendingDowngrade !== null || 
          subscriptionCancelled, 
          "1 day"
        );
        
        if (subscriptionCancelled) {
          // Cancel subscription
          await cancelStripeSubscription(customer);
          await sendSubscriptionCancellationEmail(customer);
          
          // Downgrade to free tier
          await downgradeToFreeTier(customer);
          currentTier = 'launch';
          
          log.info(`Subscription cancelled for ${customer.email}, downgraded to free tier`);
          break;
        }
        
        if (pendingUpgrade) {
          const { tier: newTier, priceId: newPriceId } = pendingUpgrade;
          
          // Update Stripe subscription
          await updateStripeSubscription(customer, newPriceId);
          
          // Update customer data
          customer.subscriptionTier = newTier;
          currentTier = newTier;
          
          // Set up new tier access
          await setupPaidTierAccess(customer, newTier);
          
          // Send upgrade email
          await sendSubscriptionUpgradeEmail(customer, newTier);
          
          // Update database
          await updateUserSubscriptionInDatabase(customer);
          
          log.info(`Successfully upgraded ${customer.email} to ${newTier} tier`);
          pendingUpgrade = null;
        }
        
        if (pendingDowngrade) {
          const newTier = pendingDowngrade;
          
          if (newTier === 'launch') {
            // Downgrade to free tier
            await cancelStripeSubscription(customer);
            await downgradeToFreeTier(customer);
            currentTier = 'launch';
            
            // Send downgrade email
            await sendSubscriptionDowngradeEmail(customer, 'launch');
            
            log.info(`Successfully downgraded ${customer.email} to free tier`);
            break; // Exit paid subscription management
          } else {
            // Downgrade to different paid tier
            // This would require updating the Stripe subscription with new price
            await sendSubscriptionDowngradeEmail(customer, newTier);
            currentTier = newTier;
            
            log.info(`Successfully downgraded ${customer.email} to ${newTier} tier`);
          }
          
          pendingDowngrade = null;
        }
      }
    }

    return {
      success: true,
      message: `Subscription management completed for ${customer.email}`,
      finalTier: currentTier
    };

  } catch (error) {
    log.error(`Subscription management failed for ${customer.email}:`, error);
    return {
      success: false,
      message: `Subscription management failed: ${error}`,
      finalTier: currentTier
    };
  }
}

/**
 * SoloSuccess AI Platform Payment Processing Workflow
 * Handles payment success/failure scenarios
 */
export async function paymentProcessingWorkflow(
  customer: SoloSuccessCustomer,
  paymentEvent: 'succeeded' | 'failed',
  amount?: number,
  retryCount?: number
): Promise<{ success: boolean; message: string }> {
  try {
    if (paymentEvent === 'succeeded' && amount) {
      // Payment succeeded
      await sendPaymentSucceededEmail(customer, amount);
      
      // Update subscription status
      customer.subscriptionStatus = 'active';
      await updateUserSubscriptionInDatabase(customer);
      
      log.info(`Payment succeeded for ${customer.email}: $${amount / 100}`);
      
      return {
        success: true,
        message: `Payment of $${amount / 100} processed successfully for ${customer.email}`
      };
      
    } else if (paymentEvent === 'failed') {
      // Payment failed
      const currentRetryCount = retryCount || 1;
      await sendPaymentFailedEmail(customer, currentRetryCount);
      
      // Update subscription status
      customer.subscriptionStatus = 'past_due';
      await updateUserSubscriptionInDatabase(customer);
      
      log.info(`Payment failed for ${customer.email} (retry ${currentRetryCount})`);
      
      // If this is the final retry, downgrade to free tier
      if (currentRetryCount >= 3) {
        await downgradeToFreeTier(customer);
        log.info(`Final payment retry failed for ${customer.email}, downgraded to free tier`);
      }
      
      return {
        success: false,
        message: `Payment failed for ${customer.email} (retry ${currentRetryCount})`
      };
    }
    
    return {
      success: false,
      message: `Invalid payment event: ${paymentEvent}`
    };
    
  } catch (error) {
    log.error(`Payment processing failed for ${customer.email}:`, error);
    return {
      success: false,
      message: `Payment processing failed: ${error}`
    };
  }
}