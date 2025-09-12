# SoloSuccess AI - Copilot Instructions

## Architecture Overview

**SoloSuccess AI** is a comprehensive AI-powered productivity platform with 8 specialized AI agents, built on Next.js 15 with App Router, PostgreSQL, and TypeScript. The core architecture follows a **multi-agent personality system** with **decision frameworks** and **compliance automation**.

## Key Components & Patterns

### 🤖 AI Agent System Architecture

- **8 Specialized Agents**: Roxy (SPADE), Blaze (Cost-Benefit), Glitch (Five Whys), Echo (Marketing), Lumi (Compliance), Vex (Technical), Lexi (Analytics), Nova (Product)
- **Personality Engine**: `lib/ai-personality-system.ts` manages contextual responses based on user mood, time, and achievements
- **Agent Configurations**: `lib/ai-config.ts` contains systemPrompts and model assignments per agent
- **Decision Frameworks**: Each agent specializes in specific methodologies (SPADE, Cost-Benefit-Mitigation, Five Whys)

```typescript
// Pattern: Agent configuration with personality
export const teamMemberModels = {
  roxy: {
    model: openai("gpt-4o"),
    systemPrompt: `...SPADE Framework for Type 1 decisions...`,
  },
};
```

### 🎯 Database Schema & Patterns

- **Schema**: `db/schema.ts` - 15+ interconnected tables with relations
- **Migrations**: Use `drizzle-kit` exclusively - run `npm run db:generate` then `npm run db:push`
- **Database Access**: Lazy connection pattern in `db/index.ts` using Neon PostgreSQL
- **Scripts**: `scripts/` contains database setup and migration utilities

```typescript
// Pattern: Lazy database connection
export function getDb() {
  if (!_db) {
    const client = neon(process.env.DATABASE_URL!);
    _db = drizzle({ schema, client });
  }
  return _db;
}
```

### 🎨 UI & Component Patterns

- **Component Structure**: `components/ui/` (Radix primitives), `components/dashboard/`, `components/shared/`
- **Styling**: Tailwind CSS with custom purple-to-pink gradient brand (`from-pink-500 to-purple-500`)
- **Agent Colors**: Each agent has unique accent colors (Roxy: #8B5CF6, Blaze: #F59E0B, etc.)
- **Path Aliases**: Use `@/` prefix for all imports

### 🚀 API Routes & Chat System

- **Chat API**: `/app/api/chat/route.ts` - Streaming AI responses with competitive intelligence context
- **Agent Selection**: Route includes agent personality injection and framework-specific prompts
- **Response Pattern**: All APIs return `{ success: boolean, data?, error? }` format
- **Authentication**: User context passed through authenticated API routes

```typescript
// Pattern: API response structure
return NextResponse.json({
  success: true,
  data: result,
  message: "Operation completed",
});
```

## Development Workflows

### 🔧 Core Commands

```bash
npm run dev              # Start development server
npm run db:generate      # Generate Drizzle migrations
npm run db:push         # Apply migrations to database
npm run db:studio       # Open Drizzle Studio
npm test                # Run Jest tests
npm run typecheck       # TypeScript validation
npm run lint            # ESLint checks
```

### 🗃️ Database Operations

- **Never edit migrations directly** - always use `drizzle-kit generate`
- **Setup scripts**: Use `scripts/setup-*.mjs` for database initialization
- **Schema changes**: Modify `db/schema.ts`, then generate/push migrations
- **Verification**: Use `scripts/verify-*.mjs` to validate database state

### 🧪 Testing Patterns

- **Jest Configuration**: `jest.config.js` with Next.js integration
- **Test Location**: Tests in `__tests__/` directories alongside components
- **API Testing**: Use `scripts/api-testing.js` for endpoint validation
- **E2E**: Playwright configuration in `playwright.config.ts`

## Project-Specific Conventions

### 📝 AI Agent Integration

- **Framework Integration**: When adding agent features, update both `ai-config.ts` and `competitive-intelligence-context.ts`
- **Personality Responses**: Use `PersonalityEngine` for contextual agent responses
- **Agent Communication**: Follow decision framework patterns (SPADE for Roxy, Cost-Benefit for Blaze, Five Whys for Glitch)

### 🎮 Gamification System

- **Points & Levels**: Integrated throughout dashboard with punk rock achievements
- **Progress Tracking**: Daily stats in `daily_stats` table with automated functions
- **Streak Counters**: User engagement tracking for motivation

### 🛡️ Compliance & Security

- **Guardian AI (Lumi)**: Automated GDPR/CCPA compliance scanning
- **Policy Generation**: AI-powered legal document creation
- **Trust Scores**: Compliance certification system
- **Environment Validation**: Zod schemas for configuration validation

### 🎨 Design System

- **Brand Identity**: "Punk rock meets professional" with purple gradients
- **Typography**: Consistent heading/body text patterns
- **Animations**: Framer Motion for smooth transitions
- **Responsive**: Mobile-first Tailwind breakpoints

## Integration Points

### 🔌 External Services

- **AI Providers**: OpenAI (primary), Anthropic, Google AI via AI SDK
- **Database**: Neon PostgreSQL with connection pooling
- **Authentication**: Custom auth system with JWT tokens
- **Email**: Resend integration for transactional emails
- **Payments**: Stripe integration (Launch/Accelerator/Dominator tiers)

### 📊 Data Flow Patterns

```
User Input → Agent Selection → Framework Application → AI Processing → Response Generation → UI Update
Database Changes → Real-time Updates → Dashboard Refresh → Gamification Updates
```

### 🔄 State Management

- **No Global State**: Component-level state with React hooks
- **Custom Hooks**: `hooks/` directory for reusable logic (`use-auth.tsx`, `use-dashboard-data.ts`)
- **Server State**: Fresh data fetching with Next.js Server Components

## Critical Files for Understanding

| File                           | Purpose                                 |
| ------------------------------ | --------------------------------------- |
| `lib/ai-config.ts`             | Agent configurations and system prompts |
| `lib/ai-personality-system.ts` | Dynamic agent personality engine        |
| `app/api/chat/route.ts`        | Core AI chat functionality              |
| `db/schema.ts`                 | Complete database schema                |
| `app/dashboard/`               | Main user interface patterns            |
| `components/dashboard/`        | Reusable dashboard components           |
| `scripts/setup-*.mjs`          | Database setup and migration scripts    |

## Decision Framework Implementation

When adding new agent capabilities:

1. **Update agent config** in `ai-config.ts` with framework-specific prompts
2. **Extend personality system** in `ai-personality-system.ts` for contextual responses
3. **Add competitive intelligence integration** in `competitive-intelligence-context.ts`
4. **Update UI components** to reflect new agent capabilities
5. **Test framework integration** through chat API

Remember: Each agent has a specific decision framework specialty - maintain this consistency when extending functionality.

## Environment & Configuration Management

### 🔧 Environment Variable Patterns

```typescript
// Pattern: Environment validation with Zod
import { z } from "zod";

const environmentSchema = z.object({
  DATABASE_URL: z.string().url(),
  OPENAI_API_KEY: z.string().min(1),
  NEXT_PUBLIC_STACK_PROJECT_ID: z.string().min(1),
  MONGODB_URI: z.string().url().optional(),
  GOOGLE_CLOUD_PROJECT_ID: z.string().optional(),
  SENTRY_DSN: z.string().url().optional(),
});

// Pattern: Safe environment access
const env = environmentSchema.parse(process.env);
```

### 📋 Required Environment Variables

- **Core**: `DATABASE_URL`, `OPENAI_API_KEY`, `NEXT_PUBLIC_STACK_PROJECT_ID`
- **AI Providers**: `ANTHROPIC_API_KEY`, `GOOGLE_AI_API_KEY`
- **MongoDB**: `MONGODB_URI` (optional secondary database)
- **Authentication**: JWT secrets and OAuth provider keys
- **Email**: `RESEND_API_KEY` for transactional emails
- **Monitoring**: `SENTRY_DSN`, Google Cloud credentials

### 🎯 Configuration File Patterns

- **Database**: `drizzle.config.ts` - Migration and connection config
- **Tailwind**: `tailwind.config.ts` - Design system configuration
- **TypeScript**: `tsconfig.json` - Strict type checking enabled
- **Next.js**: `next.config.mjs` - App Router and Sentry integration
- **Testing**: `jest.config.js`, `playwright.config.ts`

## Deployment & Production Workflows

### 🚀 Deployment Strategy

```bash
# Production deployment pipeline
npm run build              # Next.js production build
npm run typecheck         # TypeScript validation
npm run lint              # Code quality checks
npm run test              # Unit and integration tests
npm run db:push           # Apply database migrations
```

### 🌐 Hosting Configuration

- **Platform**: Google Cloud Run (serverless, auto-scaling)
- **CDN**: Global edge network for static assets
- **Database**: Neon PostgreSQL with connection pooling
- **Containerization**: Docker-based deployment
- **CI/CD**: GitHub Actions with automated testing

### 📊 Production Monitoring

```typescript
// Pattern: Health check endpoints
export async function GET() {
  const health = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    database: await checkDatabaseConnection(),
    ai_services: await checkAIProviders(),
    memory_usage: process.memoryUsage(),
    uptime: process.uptime(),
  };
  return NextResponse.json(health);
}
```

### 🔄 Blue-Green Deployment

- **Feature Flags**: Gradual rollout with `lib/feature-flags.ts`
- **Rollback Strategy**: Instant rollback capabilities
- **Health Checks**: Automated deployment validation
- **Database Migrations**: Zero-downtime migration patterns

## Monitoring, Logging & Error Handling

### 📊 Performance Monitoring System

```typescript
// Pattern: Performance tracking with Core Web Vitals
const performanceMonitor = {
  trackCoreWebVitals: () => {
    // LCP (Largest Contentful Paint): < 2.5s good
    // FID (First Input Delay): < 100ms good
    // CLS (Cumulative Layout Shift): < 0.1 good
  },
  trackAPIResponseTime: (endpoint, responseTime) => {
    // Flag endpoints > 2s as slow
    if (responseTime > 2000) {
      logger.warn(`Slow API endpoint: ${endpoint} (${responseTime}ms)`);
    }
  },
};

// Pattern: Memory and resource monitoring
if ("memory" in performance) {
  const memory = (performance as any).memory;
  trackPerformance({
    memoryUsage: memory.usedJSHeapSize,
    memoryLimit: memory.jsHeapSizeLimit,
  });
}
```

### 🛡️ Error Handling Architecture

```typescript
// Pattern: Structured error handling
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = "AppError";
  }
}

// Pattern: API error responses
try {
  const result = await riskyOperation();
  return NextResponse.json({ success: true, data: result });
} catch (error) {
  logger.error("Operation failed:", error);
  return NextResponse.json(
    { success: false, error: "Operation failed", code: error.code },
    { status: error.statusCode || 500 }
  );
}

// Pattern: Global error boundaries
export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Log error to monitoring service
    analytics.trackError(error.message, { stack: error.stack });
  }, [error]);
}
```

### 📝 Logging Strategy

```typescript
// Pattern: Structured logging with levels
import { logger } from "@/lib/log";

// Development logging
logger.debug("User action", { userId, action, metadata });
logger.info("Task completed", { taskId, duration });
logger.warn("Rate limit approaching", { userId, requests });
logger.error("Database connection failed", { error, retryCount });

// Pattern: Performance logging
const startTime = performance.now();
const result = await expensiveOperation();
const duration = performance.now() - startTime;
logger.info("Operation completed", { operation: "aiAnalysis", duration });
```

### 🔍 Debugging Workflows

```typescript
// Pattern: Debug mode activation
if (process.env.NODE_ENV === "development") {
  window.SoloSuccess_DEBUG = {
    focus: true,
    ai_insights: true,
    performance: true,
    database: true,
  };
}

// Pattern: Conditional debug logging
const debug = process.env.NODE_ENV === "development" ? console.log : () => {};
debug("AI agent response:", { agentId, responseTime, tokenCount });

// Pattern: Error reproduction in development
export async function debugAIAgent(agentId: string, userMessage: string) {
  const context = await getDebugContext(agentId);
  const response = await generateResponse(agentId, userMessage, context);

  if (process.env.NODE_ENV === "development") {
    console.log("Debug AI Response:", {
      agentId,
      userMessage,
      context,
      response,
      timestamp: new Date().toISOString(),
    });
  }

  return response;
}
```

### ⚡ Performance Optimization Patterns

```typescript
// Pattern: API response time monitoring
const apiTiming = async (request: NextRequest) => {
  const start = Date.now();
  const response = await handleRequest(request);
  const duration = Date.now() - start;

  if (duration > 2000) {
    logger.warn("Slow API response", {
      url: request.url,
      method: request.method,
      duration,
    });
  }

  return response;
};

// Pattern: Database query optimization
export async function optimizedQuery(userId: string) {
  // Use indexes and limit results
  const result = await db
    .select()
    .from(tasks)
    .where(eq(tasks.userId, userId))
    .orderBy(desc(tasks.createdAt))
    .limit(50); // Prevent massive result sets

  return result;
}

// Pattern: Caching for expensive operations
const cache = new Map();
export async function getCachedCompetitiveIntelligence(userId: string) {
  const cacheKey = `competitive_${userId}`;

  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    if (Date.now() - cached.timestamp < 300000) {
      // 5 minutes
      return cached.data;
    }
  }

  const data = await fetchCompetitiveIntelligence(userId);
  cache.set(cacheKey, { data, timestamp: Date.now() });
  return data;
}
```

### 🚨 Production Troubleshooting

```typescript
// Pattern: Production health checks
export async function systemHealthCheck() {
  const checks = {
    database: await checkDatabaseConnection(),
    ai_providers: await Promise.all([
      checkOpenAI(),
      checkAnthropic(),
      checkGoogleAI(),
    ]),
    memory: process.memoryUsage(),
    uptime: process.uptime(),
  };

  const isHealthy =
    checks.database &&
    checks.ai_providers.every((p) => p) &&
    checks.memory.heapUsed < checks.memory.heapTotal * 0.8;

  return { healthy: isHealthy, details: checks };
}

// Pattern: Automated alerting
if (errorRate > 5 || responseTime > 3000 || memoryUsage > 80) {
  await sendAlert({
    severity: "high",
    message: "System performance degraded",
    metrics: { errorRate, responseTime, memoryUsage },
  });
}
```

## Security & Compliance Patterns

### 🔒 API Security Implementation

```typescript
// Pattern: Rate limiting with user context
export async function rateLimitByUser(userId: string, limit: number = 100) {
  const key = `rate_limit_${userId}`;
  const requests = await redis.incr(key);

  if (requests === 1) {
    await redis.expire(key, 3600); // 1 hour window
  }

  if (requests > limit) {
    throw new AppError("Rate limit exceeded", 429);
  }
}

// Pattern: Input validation and sanitization
const requestSchema = z.object({
  message: z.string().min(1).max(2000),
  agentId: z.enum([
    "roxy",
    "blaze",
    "glitch",
    "echo",
    "lumi",
    "vex",
    "lexi",
    "nova",
  ]),
  context: z.object({}).optional(),
});

const validatedInput = requestSchema.parse(await request.json());
```

### 🛡️ Data Protection Workflows

```typescript
// Pattern: GDPR compliance automation
export async function handleGDPRRequest(
  userId: string,
  requestType: "export" | "delete"
) {
  switch (requestType) {
    case "export":
      return await exportAllUserData(userId);
    case "delete":
      await anonymizeUserData(userId);
      await scheduleDataDeletion(userId, 30); // 30-day grace period
      break;
  }
}

// Pattern: Data anonymization for compliance
export async function anonymizeUserData(userId: string) {
  await db.transaction(async (tx) => {
    await tx
      .update(users)
      .set({
        email: "anonymized@deleted.user",
        name: "Deleted User",
        deletedAt: new Date(),
      })
      .where(eq(users.id, userId));

    // Keep anonymized analytics data
    await tx
      .update(analytics)
      .set({
        userId: "anonymized",
      })
      .where(eq(analytics.userId, userId));
  });
}
```

Remember: Monitoring, logging, and performance optimization are continuous processes - build them into your development workflow from the start. Each agent interaction should be logged, performance metrics tracked, and errors handled gracefully to maintain production stability.

## Competitive Intelligence Integration Patterns

### 🎯 **System Architecture**

- **Context Service**: `lib/competitive-intelligence-context.ts` - Aggregates competitor data for AI agent conversations
- **Integration Layer**: `lib/competitive-intelligence-integration.ts` - Automates task creation from competitive alerts
- **Decision Frameworks**: `lib/competitive-decision-frameworks.ts` - SPADE, Cost-Benefit, Five Whys with competitive context
- **Automation**: `lib/competitive-intelligence-automation.ts` - Rule-based competitive response triggers

### 🔄 **Data Flow Integration**

```
Competitive Alert → Template Matching → Task Creation → Agent Context → Decision Framework
Database Intelligence → Context Aggregation → Agent Prompts → Contextual Responses
```

### 📊 **Agent-Specific Integration**

Each agent receives tailored competitive intelligence:

- **Roxy**: SPADE framework enhanced with competitive landscape analysis
- **Blaze**: Cost-benefit analysis incorporating competitive response costs
- **Glitch**: Five Whys analysis exploring competitive factors in problem root causes
- **Echo**: Marketing intelligence with competitor messaging and positioning data
- **Lumi**: Compliance intelligence including regulatory challenges of competitors
- **Vex**: Technical intelligence with technology stack comparisons
- **Lexi**: Strategic analysis with competitive positioning and market dynamics
- **Nova**: Product intelligence with feature comparisons and UX benchmarking

### 🚀 **Implementation Patterns**

```typescript
// Pattern: Adding competitive context to agent conversations
const competitiveContext =
  await CompetitiveIntelligenceContextService.getCompetitiveContext(
    userId,
    agentId
  );
const formattedContext =
  CompetitiveIntelligenceContextService.formatContextForAgent(
    context,
    agentId,
    userMessage
  );

// Pattern: Automatic task creation from competitive alerts
await CompetitiveIntelligenceIntegration.createTaskFromAlert(alert, userId);

// Pattern: Enhanced decision frameworks with competitive data
const spadeAnalysis =
  await CompetitiveDecisionFrameworks.generateSPADEWithCompetitiveIntelligence(
    userId,
    decision,
    alternatives
  );
```

## Compliance System Workflows

### 🛡️ **Guardian AI (Lumi) Architecture**

- **Compliance Scanner**: `components/guardian-ai/compliance-scanner.tsx` - Real-time GDPR/CCPA website scanning
- **Policy Generator**: `components/guardian-ai/policy-generator.tsx` - AI-powered legal document creation
- **Trust Score System**: Automated compliance certification with "Guardian AI Certified" badges
- **Dashboard**: `components/guardian-ai/guardian-ai-dashboard.tsx` - Centralized compliance management

### ⚡ **Scanning Process Flow**

```
URL Input → Website Fetching → HTML Analysis → Pattern Detection → Issue Classification → Trust Score Calculation → Report Generation
```

### 📋 **Compliance Patterns**

```typescript
// Pattern: Compliance scanning API integration
const response = await fetch("/api/compliance/scan", {
  method: "POST",
  body: JSON.stringify({ url, userId }),
});

// Pattern: Trust score evaluation
const trustScore = calculateTrustScore(issues, dataPoints, mechanisms);
if (trustScore >= 80) {
  award_guardian_ai_certified_badge();
}

// Pattern: Policy generation with business context
const policyData = {
  businessName,
  websiteUrl,
  businessType,
  dataCollected,
  thirdPartyServices,
  userRights,
};
const generatedPolicy = await PolicyGenerator.create(policyData);
```

### 🎯 **Compliance Database Schema**

- `compliance_scans` - Scan results and trust scores
- `compliance_issues` - Detected violations with GDPR/CCPA references
- `compliance_policies` - Generated policy documents
- `trust_scores` - Historical compliance certifications

## Gamification Implementation Details

### 🎮 **Core Gamification Engine**

- **Base System**: `lib/gamification-system.ts` - Achievement tracking, level progression, points calculation
- **Competitive Extension**: `lib/competitive-intelligence-gamification.ts` - Competitive-specific achievements and victories
- **Trigger System**: `lib/competitive-intelligence-gamification-triggers.ts` - Event-based gamification automation

### 🏆 **Achievement Categories**

```typescript
// Achievement types with point values
productivity: 10-500 points (tasks, goals, focus sessions)
wellness: 120-250 points (focus sessions, wellness scores)
social: 100-300 points (AI collaborations, team features)
streak: 120+ points (consistency tracking)
competitive: 50-500 points (intelligence gathering, market victories)
```

### 📈 **Level System Progression**

```typescript
// Progression tiers with perks
Boss Rookie (0 pts) → Rising Boss (500 pts) → Boss Babe (1500 pts) → Empire Queen (3000 pts) → Legendary Boss (5000 pts)

// Pattern: Level calculation
const currentLevel = levels.find(level => totalPoints >= level.pointsRequired)
const progressToNext = ((totalPoints - currentLevel.pointsRequired) / (nextLevel.pointsRequired - currentLevel.pointsRequired)) * 100
```

### 🎯 **Competitive Gamification Features**

- **Market Victories**: Track competitive wins with impact levels (minor: 50pts, game_changing: 500pts)
- **Intelligence Badges**: Tiered recognition (Bronze, Silver, Gold, Platinum)
- **Threat Response Tracking**: Gamify competitive response activities
- **Leaderboards**: User ranking based on competitive advantage points

### 🔄 **Gamification Trigger Patterns**

```typescript
// Pattern: Event-driven gamification
await CompetitiveIntelligenceGamificationTriggers.onIntelligenceGathered(
  userId,
  alertData
);
await CompetitiveIntelligenceGamificationTriggers.onCompetitiveVictory(
  userId,
  victoryData
);

// Pattern: Achievement evaluation
const newAchievements = gamificationEngine.checkAchievements(
  activityType,
  value
);
const newBadges = gamificationEngine.checkCompetitiveBadges();
```

## Testing Strategies for AI Agent Functionality

### 🧪 **Testing Architecture**

- **Unit Tests**: Jest configuration in `jest.config.js` with Next.js integration
- **API Testing**: `scripts/api-testing.js` - Comprehensive endpoint validation
- **E2E Tests**: Playwright setup in `playwright.config.ts` for full user journeys
- **Smoke Tests**: `scripts/smoke-auth.mjs` - Quick health checks and auth validation

### 🎯 **AI Agent Testing Patterns**

```typescript
// Pattern: Mock AI responses for testing
const mockRoxyResponse = `Hey there, boss! I'm here to help with SPADE framework decisions...`;

// Pattern: Agent personality testing
test("should return agent-specific personality response", async () => {
  const response = await fetch("/api/chat", {
    method: "POST",
    body: JSON.stringify({ message: "test", agentId: "roxy" }),
  });
  expect(response.personality).toContain("strategic");
});
```

### 📊 **Test Categories & Priorities**

- **CRITICAL**: Authentication, core APIs, agent chat functionality
- **HIGH**: Dashboard data, task management, competitive intelligence
- **MEDIUM**: Templates, gamification, file management
- **LOW**: Analytics, notifications, cosmetic features

### 🔧 **Testing Commands & Scripts**

```bash
npm test                    # Jest unit tests
npm run test:coverage      # Coverage reports with threshold enforcement
npm run e2e               # Playwright E2E tests
node scripts/api-testing.js   # Comprehensive API validation
node scripts/smoke-auth.mjs   # Quick smoke test for auth flows
```

### ⚡ **Performance Testing Patterns**

- **Response Time Monitoring**: Track API response times, flag endpoints >2s
- **Load Testing**: Concurrent user simulation and error rate monitoring
- **Memory Usage**: Monitor resource consumption during test runs
- **Database Performance**: Query optimization and connection pooling validation

### 🎭 **Mock Data Patterns**

```typescript
// Pattern: Mock API responses for static testing
export const mockApiResponses = {
  "/api/competitive-intelligence/context": mockCompetitiveData,
  "/api/compliance/scan": mockComplianceResults,
  "/api/gamification/achievements": mockAchievements,
};

// Pattern: Test data factories
const createMockUser = () => ({ id: "test-user", level: 5, points: 1250 });
const createMockAgent = (id) => ({ id, personality: agentPersonalities[id] });
```

## Critical Integration Testing Workflows

### 🔄 **Agent-Framework Integration Tests**

- Test SPADE framework integration with competitive intelligence context
- Validate Cost-Benefit analysis incorporates competitive response costs
- Verify Five Whys analysis explores competitive factors in root causes
- Ensure agent personality consistency across decision frameworks

### 🛡️ **Compliance System Integration**

- Test end-to-end scanning: URL → analysis → trust score → certification
- Validate policy generation with business context and legal requirements
- Test compliance dashboard aggregation and real-time updates
- Verify GDPR/CCPA article references in compliance recommendations

### 🎮 **Gamification Integration Testing**

- Test achievement unlock triggers across all activity types
- Validate point calculation and level progression accuracy
- Test competitive victory recording and impact level assessment
- Verify leaderboard updates and ranking calculations

Remember: Always test agent personality consistency, competitive context integration, and gamification triggers when modifying AI agent functionality.
