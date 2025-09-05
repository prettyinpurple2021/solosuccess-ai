import { proxyActivities, sleep } from '@temporalio/workflow';
// Only import the activity types
import type * as activities from './activities';

const { greet, processUserData, sendNotification, updateUserProfile } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});

/** A workflow that simply calls an activity */
export async function example(name: string): Promise<string> {
  return await greet(name);
}

/** A more complex workflow for user onboarding */
export async function userOnboardingWorkflow(userId: string, userData: any): Promise<{ success: boolean; steps: string[] }> {
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
    const notificationResult = await sendNotification(userId, 'Welcome to SoloBoss AI Platform!');
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

// SoloBoss AI Platform specific workflows
const { 
  createInitialGoals, 
  setupCompetitiveIntelligence, 
  initializeAIAgents, 
  sendWelcomeEmail, 
  createOnboardingTasks, 
  scheduleIntelligenceBriefing 
} = proxyActivities<typeof import('./activities')>({
  startToCloseTimeout: '2 minutes',
});

/** Complete SoloBoss AI Platform user onboarding workflow */
export async function solobossUserOnboardingWorkflow(
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
    
    // Step 5: Send welcome email
    const emailResult = await sendWelcomeEmail(userId, userData.email, userData.fullName);
    if (emailResult.sent) {
      steps.push('Welcome email sent');
    }
    
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
    console.error('SoloBoss onboarding failed:', error);
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