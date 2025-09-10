import { Connection, Client } from '@temporalio/client';
import { 
  example, 
  userOnboardingWorkflow, 
  scheduledDataProcessingWorkflow,
  SoloSuccessUserOnboardingWorkflow,
  competitiveIntelligenceProcessingWorkflow,
  aiAgentBriefingWorkflow,
  goalAchievementTrackingWorkflow
} from '../src/workflows';

async function run() {
  // Connect to Temporal server using environment variables
  const connection = await Connection.connect({
    address: process.env.TEMPORAL_ADDRESS || 'localhost:7233',
    // Add TLS and API key configuration for Temporal Cloud
    ...(process.env.TEMPORAL_ADDRESS?.includes('temporal.io') && {
      tls: true,
      apiKey: process.env.TEMPORAL_API_KEY,
    }),
  });

  const client = new Client({
    connection,
    namespace: process.env.TEMPORAL_NAMESPACE || 'default',
  });

  console.log('🚀 Starting SoloSuccess AI Platform Temporal workflows...\n');

  // Example 1: Simple greeting workflow
  console.log('1. Running simple greeting workflow...');
  const greetingHandle = await client.workflow.start(example, {
    args: ['SoloSuccess AI Platform'],
    taskQueue: 'SoloSuccess-tasks',
    workflowId: 'greeting-workflow-' + Date.now(),
  });

  const greetingResult = await greetingHandle.result();
  console.log('✅ Greeting result:', greetingResult);

  // Example 2: Complete SoloSuccess user onboarding workflow
  console.log('\n2. Running SoloSuccess user onboarding workflow...');
  const SoloSuccessOnboardingHandle = await client.workflow.start(SoloSuccessUserOnboardingWorkflow, {
    args: ['user123', { 
      email: 'jane@example.com', 
      fullName: 'Jane Doe', 
      username: 'janedoe' 
    }],
    taskQueue: 'SoloSuccess-tasks',
    workflowId: 'SoloSuccess-onboarding-' + Date.now(),
  });

  const SoloSuccessOnboardingResult = await SoloSuccessOnboardingHandle.result();
  console.log('✅ SoloSuccess onboarding result:', SoloSuccessOnboardingResult);

  // Example 3: Competitive Intelligence Processing
  console.log('\n3. Running competitive intelligence processing workflow...');
  const intelligenceHandle = await client.workflow.start(competitiveIntelligenceProcessingWorkflow, {
    args: ['user123', [
      { name: 'Competitor A', industry: 'SaaS', threatLevel: 'high' },
      { name: 'Competitor B', industry: 'AI', threatLevel: 'medium' },
      { name: 'Competitor C', industry: 'Productivity', threatLevel: 'low' }
    ]],
    taskQueue: 'SoloSuccess-tasks',
    workflowId: 'intelligence-processing-' + Date.now(),
  });

  const intelligenceResult = await intelligenceHandle.result();
  console.log('✅ Intelligence processing result:', intelligenceResult);

  // Example 4: AI Agent Briefing
  console.log('\n4. Running AI agent briefing workflow...');
  const briefingHandle = await client.workflow.start(aiAgentBriefingWorkflow, {
    args: ['user123', ['Roxy', 'Blaze', 'Echo', 'Lumi'], 'daily'],
    taskQueue: 'SoloSuccess-tasks',
    workflowId: 'agent-briefing-' + Date.now(),
  });

  const briefingResult = await briefingHandle.result();
  console.log('✅ Agent briefing result:', briefingResult);

  // Example 5: Goal Achievement Tracking
  console.log('\n5. Running goal achievement tracking workflow...');
  const goalTrackingHandle = await client.workflow.start(goalAchievementTrackingWorkflow, {
    args: ['user123', ['goal_1', 'goal_2', 'goal_3']],
    taskQueue: 'SoloSuccess-tasks',
    workflowId: 'goal-tracking-' + Date.now(),
  });

  const goalTrackingResult = await goalTrackingHandle.result();
  console.log('✅ Goal tracking result:', goalTrackingResult);

  // Example 6: Scheduled data processing workflow
  console.log('\n6. Running scheduled data processing workflow...');
  const processingHandle = await client.workflow.start(scheduledDataProcessingWorkflow, {
    args: [],
    taskQueue: 'SoloSuccess-tasks',
    workflowId: 'processing-workflow-' + Date.now(),
  });

  const processingResult = await processingHandle.result();
  console.log('✅ Processing result:', processingResult);

  console.log('\n🎉 All SoloSuccess AI Platform workflows completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   • User onboarding: ${SoloSuccessOnboardingResult.success ? '✅' : '❌'}`);
  console.log(`   • Competitive intelligence: ${intelligenceResult.processed} competitors processed`);
  console.log(`   • AI agent briefings: ${briefingResult.briefingsGenerated} briefings generated`);
  console.log(`   • Goal achievements: ${goalTrackingResult.achievements} achievements detected`);
  console.log(`   • Data processing: ${processingResult.processed} users processed`);
}

run().catch((err) => {
  console.error('❌ Error running workflows:', err);
  process.exit(1);
});
