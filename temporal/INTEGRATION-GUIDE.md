# 🚀 SoloSuccess AI Platform - Temporal Integration Guide

## Overview

This guide shows how Temporal.io workflows are integrated with your SoloSuccess AI Platform features. The integration provides reliable, scalable background processing for complex user operations.

## 🎯 Integrated Features

### 1. **User Onboarding Workflow**
**File:** `src/workflows.ts` - `SoloSuccessUserOnboardingWorkflow`

**What it does:**
- Creates initial goals for new users
- Sets up competitive intelligence monitoring
- Initializes all 8 AI agents (Roxy, Blaze, Echo, Lumi, Vex, Lexi, Nova, Glitch)
- Creates onboarding tasks
- Sends welcome email
- Schedules intelligence briefing
- Updates user profile with completion status

**Integration:** Automatically triggered when users sign up via `/api/auth/signup`

### 2. **Competitive Intelligence Processing**
**File:** `src/workflows.ts` - `competitiveIntelligenceProcessingWorkflow`

**What it does:**
- Processes competitor data in batches
- Generates insights and recommendations
- Creates alerts for significant changes
- Sends notifications about processing results

**API Endpoint:** `/api/temporal/intelligence`

### 3. **AI Agent Briefing System**
**File:** `src/workflows.ts` - `aiAgentBriefingWorkflow`

**What it does:**
- Generates personalized briefings for selected AI agents
- Supports daily, weekly, and monthly briefing types
- Aggregates insights across multiple agents
- Sends completion notifications

**API Endpoint:** `/api/temporal/briefings`

### 4. **Goal Achievement Tracking**
**File:** `src/workflows.ts` - `goalAchievementTrackingWorkflow`

**What it does:**
- Analyzes goal progress across multiple goals
- Detects achievements and awards points
- Generates improvement recommendations
- Sends achievement notifications

## 🔧 API Integration

### Starting Workflows

```typescript
// Example: Start onboarding workflow
const response = await fetch('/api/temporal/onboarding', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user123',
    userData: {
      email: 'user@example.com',
      fullName: 'John Doe',
      username: 'johndoe'
    }
  })
})

const { workflowId } = await response.json()
```

### Checking Workflow Status

```typescript
// Example: Check workflow status
const response = await fetch(`/api/temporal/onboarding?workflowId=${workflowId}`)
const { status, result } = await response.json()
```

## 🏗️ Architecture

### Workflow Structure
```
User Signup → Temporal Onboarding Workflow → Multiple Activities
    ↓
┌─────────────────────────────────────────────────────────────┐
│ 1. Create Initial Goals                                     │
│ 2. Setup Competitive Intelligence                          │
│ 3. Initialize AI Agents                                    │
│ 4. Create Onboarding Tasks                                 │
│ 5. Send Welcome Email                                      │
│ 6. Schedule Intelligence Briefing                          │
│ 7. Update User Profile                                     │
└─────────────────────────────────────────────────────────────┘
```

### Activity Functions
All activities are defined in `src/activities.ts`:
- `createInitialGoals()` - Creates default goals for new users
- `setupCompetitiveIntelligence()` - Sets up competitor monitoring
- `initializeAIAgents()` - Initializes all 8 AI agents
- `sendWelcomeEmail()` - Sends welcome email
- `createOnboardingTasks()` - Creates initial tasks
- `scheduleIntelligenceBriefing()` - Schedules first briefing

## 🚀 Usage Examples

### 1. Manual Onboarding Trigger

```typescript
// In your React component
const triggerOnboarding = async (userId: string, userData: any) => {
  const response = await fetch('/api/temporal/onboarding', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, userData })
  })
  
  if (response.ok) {
    const { workflowId } = await response.json()
    console.log('Onboarding started:', workflowId)
  }
}
```

### 2. Competitive Intelligence Processing

```typescript
// Process competitor data
const processCompetitors = async (userId: string, competitors: any[]) => {
  const response = await fetch('/api/temporal/intelligence', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, competitorData: competitors })
  })
  
  const { workflowId } = await response.json()
  return workflowId
}
```

### 3. AI Agent Briefing

```typescript
// Generate daily briefings
const generateBriefings = async (userId: string, agentIds: string[]) => {
  const response = await fetch('/api/temporal/briefings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      agentIds,
      briefingType: 'daily'
    })
  })
  
  const { workflowId } = await response.json()
  return workflowId
}
```

## 🔄 Workflow Monitoring

### Temporal Web UI
Access the Temporal Web UI at `http://localhost:8080` to:
- View running workflows
- Check workflow history
- Monitor activity execution
- Debug failed workflows

### Programmatic Monitoring

```typescript
import { getWorkflowStatus, getWorkflowResult } from '@/lib/temporal-client'

// Check workflow status
const status = await getWorkflowStatus(workflowId)
console.log('Workflow status:', status.status)

// Get workflow result when completed
if (status.status === 'COMPLETED') {
  const result = await getWorkflowResult(workflowId)
  console.log('Workflow result:', result)
}
```

## 🎨 Frontend Integration

### React Hook Example

```typescript
// hooks/use-temporal-workflow.ts
import { useState, useEffect } from 'react'

export function useTemporalWorkflow(workflowId: string | null) {
  const [status, setStatus] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!workflowId) return

    const checkStatus = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/temporal/onboarding?workflowId=${workflowId}`)
        const data = await response.json()
        setStatus(data.status)
        if (data.result) setResult(data.result)
      } catch (error) {
        console.error('Error checking workflow status:', error)
      } finally {
        setLoading(false)
      }
    }

    checkStatus()
    const interval = setInterval(checkStatus, 5000) // Check every 5 seconds
    return () => clearInterval(interval)
  }, [workflowId])

  return { status, result, loading }
}
```

## 🔧 Configuration

### Environment Variables

Add these to your `.env.local`:

```bash
# Temporal Configuration
TEMPORAL_ADDRESS=localhost:7233
TEMPORAL_NAMESPACE=default

# For production with Temporal Cloud
# TEMPORAL_ADDRESS=your-namespace.tmprl.cloud:7233
# TEMPORAL_NAMESPACE=your-namespace
# TEMPORAL_CLIENT_CERT=your-client-cert
# TEMPORAL_CLIENT_KEY=your-client-key
```

### Production Setup

For production, consider:
1. **Temporal Cloud** - Managed Temporal service
2. **Self-hosted Temporal** - Your own Temporal cluster
3. **Monitoring** - Set up alerts for failed workflows
4. **Scaling** - Configure worker scaling based on load

## 🚨 Error Handling

### Workflow Retry Policy

All workflows include retry policies:
```typescript
retryPolicy: {
  initialInterval: '1s',
  backoffCoefficient: 2.0,
  maximumInterval: '100s',
  maximumAttempts: 3,
}
```

### Activity Error Handling

Activities include try-catch blocks and return success/failure status:
```typescript
export async function processUserData(userId: string, data: any) {
  try {
    // Process data
    return { success: true, processedAt: new Date().toISOString() }
  } catch (error) {
    console.error('Processing failed:', error)
    return { success: false, error: error.message }
  }
}
```

## 📊 Benefits

### Reliability
- **Automatic retries** for failed activities
- **Durability** - workflows survive server restarts
- **Exactly-once execution** guarantees

### Scalability
- **Horizontal scaling** of workers
- **Load balancing** across multiple workers
- **Resource isolation** between workflows

### Observability
- **Complete audit trail** of all operations
- **Real-time monitoring** via Temporal Web UI
- **Detailed error reporting** and debugging

### User Experience
- **Non-blocking operations** - users don't wait for long processes
- **Progress tracking** - real-time status updates
- **Reliable completion** - operations complete even if servers restart

## 🎯 Next Steps

1. **Test the Integration**: Run `npm run temporal:client` to test all workflows
2. **Monitor Workflows**: Use the Temporal Web UI to monitor execution
3. **Add More Workflows**: Create additional workflows for other platform features
4. **Production Setup**: Configure Temporal Cloud or self-hosted cluster
5. **Frontend Integration**: Add workflow status tracking to your UI

---

**Your SoloSuccess AI Platform now has enterprise-grade workflow orchestration! 🚀**
