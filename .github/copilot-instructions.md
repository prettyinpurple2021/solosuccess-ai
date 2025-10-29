# SoloSuccess AI — Copilot Instructions (concise)

Follow these rules first. Use repository files and tests to verify changes before opening PRs.

Quick commands (Windows PowerShell):
- Install deps: npm ci --legacy-peer-deps
- Dev server: npm run dev  (http://localhost:3000)
- Build: npm run build  (allow 120s+; do not cancel)
- Tests: npm test  (allow 180s+ on CI)

Critical env vars (check .env.example): DATABASE_URL, OPENAI_API_KEY, NEXT_PUBLIC_STACK_PROJECT_ID, JWT_SECRET

Where to look next (important files/dirs):
- Agent system: lib/ai-config.ts, lib/ai-personality-system.ts, lib/competitive-intelligence-*.ts
- Chat endpoints: app/api/chat/route.ts (streaming responses + agent injection)
- DB and migrations: db/schema.ts, drizzle.config.ts, scripts/, migrations/
- App entry & routing: app/ (Next.js App Router), next.config.mjs, package.json scripts
- Tests & CI: jest.config.cjs, playwright.config.ts, .github/workflows/ci.yml

Project-specific conventions (do not guess):
- Always use npm with --legacy-peer-deps here (CI and docs rely on it).
- Many TypeScript React 19 warnings exist; builds succeed despite local type errors — don't spend large refactors on TS noise unless needed.
- DB migrations: modify db/schema.ts then run npm run db:generate → npm run db:push (do not hand-edit migrations).
- Agent changes require updates in both lib/ai-config.ts and lib/ai-personality-system.ts and tests for the chat route.

Examples of common edits:
- Add agent: update lib/ai-config.ts (systemPrompt + model), extend lib/ai-personality-system.ts, add UI component under components/ai or app/flows, then test app/api/chat/route.ts.
- Add DB column: update db/schema.ts, run npm run db:generate, commit migration.

Testing & validation:
- Unit: npm test (Jest). Expect ~5/6 suites passing locally.
- E2E: npm run e2e (install browsers: npx playwright install --with-deps)
- Quick smoke: npm run smoke (requires dev server)

Common pitfalls & where to check:
- Module resolution/runtime failures: check scripts that reference absolute imports; run npm ci --legacy-peer-deps and clear .next/node_modules caches if needed.
- Port 3000 in use: use npm run dev -- --port 3001
- CI timeouts: increase job timeouts, allow 3-5 minute windows for builds/tests when diagnosing.

If unsure, open these files first: package.json (scripts), lib/ai-config.ts, app/api/chat/route.ts, db/schema.ts, scripts/setup-*.mjs.

If you want, I can expand this into a 1-page "how to add an agent" checklist or add sample PR checklist items. Feedback?

## Quick Start - Essential Commands

### Bootstrap Development Environment
```bash
# Install dependencies (27 seconds)
npm ci --legacy-peer-deps

# Create environment file from example if needed
cp .env.example .env.local  # Edit with your actual values

# Start development server (2 seconds startup)
npm run dev  # Runs on http://localhost:3000

# Build for production (64 seconds - NEVER CANCEL, set timeout 120+ seconds)
npm run build

# Run tests (108 seconds - NEVER CANCEL, set timeout 180+ seconds)  
npm test

# Type checking (with React 19 compatibility issues - expect errors)
npm run typecheck

# Lint code (many warnings/errors but not blocking)
npm run lint
```

### Database Operations
```bash
# Generate Drizzle migrations (always run before db:push)
npm run db:generate

# Apply migrations to database
npm run db:push

# Open Drizzle Studio for database inspection
npm run db:studio

# Database setup scripts
npm run setup-neon-db          # Initialize Neon database
npm run setup-briefcase        # Setup file storage tables
npm run setup-templates        # Setup template system
npm run setup-compliance       # Setup compliance tables
npm run db:verify              # Verify database setup
```

### Testing Commands
```bash
# Unit tests (Jest with Next.js integration)
npm test                    # 5/6 test suites pass, ~108 seconds
npm run test:coverage      # Coverage reports with thresholds

# E2E tests (Playwright)
npm run e2e                # Full user journeys
npx playwright install --with-deps  # Install browsers first

# API validation (currently broken due to module resolution)
npm run test:api           # Comprehensive endpoint validation
npm run smoke             # Quick auth flow verification
```

## Critical Build & Development Information

### Build Status & Known Issues
- **Build succeeds** but requires environment variables and has React 19 compatibility warnings
- **TypeScript errors** exist due to React 19 migration but build still completes
- **Development server works** - starts in ~2 seconds on localhost:3000
- **Unit tests mostly pass** - 5/6 test suites successful, 1 failing due to timeout issues
- **Lint has many warnings** but doesn't block development

### Required Environment Variables
```bash
# Minimum required for build to succeed
DATABASE_URL=postgresql://user:pass@host:5432/database
OPENAI_API_KEY=test-key
NEXT_PUBLIC_STACK_PROJECT_ID=test-project
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=test-key
STACK_SECRET_SERVER_KEY=test-key
JWT_SECRET=fake-jwt-secret-for-testing-32-chars
```

### CRITICAL: Timeout Requirements
- **NEVER CANCEL builds or long-running commands**
- **Build**: 64+ seconds (set timeout to 120+ seconds minimum)
- **Tests**: 108+ seconds (set timeout to 180+ seconds minimum)
- **Dependencies**: 27+ seconds (set timeout to 60+ seconds)
- **Type checking**: Variable time due to React 19 issues

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

## Manual Validation Requirements

### ALWAYS Test After Making Changes
After making any code changes, you MUST run these validation scenarios:

#### 1. Development Server Validation
```bash
# Start dev server and verify it works
npm run dev
# Visit http://localhost:3000 and verify the app loads
# Test basic navigation and functionality
```

#### 2. Build Validation
```bash
# NEVER CANCEL - Build takes 64+ seconds
timeout 180 npm run build
# Verify build completes even with warnings
```

#### 3. Test Suite Validation
```bash
# NEVER CANCEL - Tests take 108+ seconds
timeout 240 npm test
# Expect 5/6 test suites to pass, 1 may fail due to timeout
```

#### 4. Database Operations Validation
```bash
# Test database schema generation
npm run db:generate
# Verify migrations are created in ./migrations/
```

#### 5. User Workflow Testing
**CRITICAL**: Always test complete user scenarios after changes:
- User registration/login flow
- Dashboard navigation and data loading
- AI agent chat functionality
- File upload to Briefcase
- Template interaction
- Goal/task creation in SlayList

### Troubleshooting Common Issues

#### Port 3000 Already in Use
```bash
# Find and kill process using port 3000
lsof -ti:3000 | xargs kill -9
# Or use different port
npm run dev -- --port 3001
```

#### Module Resolution Errors
```bash
# Clear caches and reinstall
rm -rf node_modules package-lock.json .next
npm ci --legacy-peer-deps
```

#### React 19 TypeScript Errors
- **Known Issue**: Many TypeScript errors due to React 19 migration
- **Workaround**: Build still succeeds despite errors
- **Do not fix** React compatibility issues unless specifically required

#### Database Connection Issues
```bash
# Verify environment variables are set
echo $DATABASE_URL
# Check .env.local file exists and has correct values
```

### 🗃️ Database Operations

- **Never edit migrations directly** - always use `drizzle-kit generate`
- **Setup scripts**: Use `scripts/setup-*.mjs` for database initialization
- **Schema changes**: Modify `db/schema.ts`, then generate/push migrations
- **Verification**: Use `scripts/verify-*.mjs` to validate database state

### 🧪 Testing Patterns

- **Jest Configuration**: `jest.config.cjs` with Next.js integration
- **Test Location**: Tests in `__tests__/` directories alongside components
- **API Testing**: `scripts/api-testing.js` currently broken due to module resolution
- **E2E**: Playwright configuration in `playwright.config.ts`
- **Test Status**: 5/6 test suites pass, expect ~108 seconds execution time

#### Current Test Results
- ✅ scraping-scheduler.test.ts
- ✅ web-scraping-service.test.ts  
- ❌ competitor-enrichment.test.ts (timeout issues)
- ✅ compliance-scanner.test.ts
- ✅ templates-delete.test.ts

#### Test Command Timing
```bash
npm test                    # 108+ seconds - NEVER CANCEL
npm run test:coverage      # Longer with coverage reports
npm run e2e               # Requires Playwright browsers installed
npm run smoke             # Quick test but requires running server
```

## Repository Structure & Key Files

### Critical Files for Understanding
| File | Purpose | Status |
|------|---------|---------|
| `package.json` | Dependencies and scripts | ✅ Working |
| `next.config.mjs` | Next.js configuration | ✅ Working |
| `drizzle.config.ts` | Database configuration | ✅ Working |
| `jest.config.cjs` | Test configuration | ✅ Working |
| `playwright.config.ts` | E2E test configuration | ✅ Working |
| `.github/workflows/ci.yml` | CI/CD pipeline | ✅ Working |

### Essential Directories
```
/app/                    # Next.js App Router - main application pages
/components/            # React components (UI, dashboard, shared)
/lib/                   # Core utilities and AI configurations  
/db/                    # Database schema and connections
/scripts/               # Database setup and utility scripts
/hooks/                 # Custom React hooks
/tests/                 # Playwright E2E tests
/test/                  # Jest unit tests
/migrations/            # Drizzle database migrations
```

### Package Manager
- **Uses npm** with `--legacy-peer-deps` flag required
- **Package manager specified**: "npm@10.0.0" in package.json
- **DO NOT use pnpm or yarn** - stick with npm for consistency

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
- **Testing**: `jest.config.cjs`, `playwright.config.ts`

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

- **Unit Tests**: Jest configuration in `jest.config.cjs` with Next.js integration
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

## Common Development Tasks & Outputs

### Repository Root Structure
```
/home/runner/work/solosuccess-ai/solosuccess-ai/
├── .github/                    # GitHub configuration and workflows
├── app/                        # Next.js App Router pages and API routes
├── components/                 # React components (UI, dashboard, shared)
├── db/                         # Database schema and Drizzle configuration
├── hooks/                      # Custom React hooks
├── lib/                        # Core utilities, AI configurations, services
├── migrations/                 # Drizzle database migrations (auto-generated)
├── public/                     # Static assets
├── scripts/                    # Database setup and utility scripts
├── styles/                     # Global styles and Tailwind configuration
├── test/                       # Jest unit tests
├── tests/                      # Playwright E2E tests
├── types/                      # TypeScript type definitions
├── utils/                      # Utility functions
├── package.json               # Dependencies and npm scripts
├── next.config.mjs           # Next.js configuration
├── drizzle.config.ts         # Database configuration
├── jest.config.cjs           # Test configuration
├── playwright.config.ts      # E2E test configuration
└── tailwind.config.ts        # Tailwind CSS configuration
```

### Key npm Scripts Summary
```bash
# Development & Building
npm run dev              # Start dev server (2s startup, http://localhost:3000)
npm run build           # Production build (64s, NEVER CANCEL)
npm run start           # Start production server
npm run typecheck       # TypeScript validation (has React 19 errors)
npm run lint            # ESLint checks (many warnings, not blocking)

# Database Operations  
npm run db:generate     # Generate Drizzle migrations
npm run db:push        # Apply migrations to database  
npm run db:studio      # Open Drizzle Studio GUI

# Testing
npm test               # Jest unit tests (108s, 5/6 suites pass)
npm run test:coverage  # Jest with coverage reports
npm run e2e           # Playwright E2E tests
npm run smoke         # Quick smoke test (needs running server)

# Database Setup
npm run setup-neon-db          # Initialize Neon database
npm run setup-briefcase        # Setup file storage tables
npm run setup-templates        # Setup template system  
npm run setup-compliance       # Setup compliance tables
npm run db:verify              # Verify database setup
```

### Working Commands Verified
- ✅ `npm ci --legacy-peer-deps` - Dependencies install successfully (~27s)
- ✅ `npm run dev` - Development server starts and runs on localhost:3000 (~2s)
- ✅ `npm run build` - Production build completes with warnings (~64s)  
- ✅ `npm test` - Unit tests run, 5/6 suites pass (~108s)
- ✅ `npm run lint` - Linting runs with warnings (not blocking)
- ✅ `npx playwright install --with-deps` - E2E browser installation works
- ❌ `npm run typecheck` - Many React 19 compatibility errors (expected)
- ❌ `npm run test:api` - Module resolution errors (broken)
- ❌ `npm run smoke` - Requires running server

### Application Validation Results
**CONFIRMED WORKING**: The application successfully loads and displays:
- ✅ Landing page with full SoloSuccess AI branding and features
- ✅ Navigation with Features, AI Squad, Pricing sections
- ✅ 8 AI Agent profiles (Roxy, Blaze, Echo, Glitch, Lumi, Vex, Lexi, Nova)
- ✅ Pricing tiers (Launch $0, Accelerator $19, Dominator $29)
- ✅ Performance monitoring widget in development
- ✅ Responsive design and theme toggle functionality

**Screenshot**: The application UI shows a professional purple-gradient design with clear calls-to-action and comprehensive feature descriptions.

### CI Pipeline Information
From `.github/workflows/ci.yml`:
- **Node.js Version**: 20
- **Build Process**: lint-typecheck → unit-tests → build → e2e-tests
- **Required for CI**: npm ci --legacy-peer-deps, specific environment variables
- **Build timeout in CI**: Uses standard GitHub Actions timeouts
- **Browser installation**: Playwright with --with-deps for full dependencies

## Final Development Workflow
1. **Fresh Clone Setup**:
   ```bash
   npm ci --legacy-peer-deps  # Install dependencies
   cp .env.example .env.local # Create environment file (edit with real values)
   npm run dev                # Start development (verify at localhost:3000)
   ```

2. **Before Making Changes**:
   ```bash
   npm run build             # Verify build works (64s timeout minimum)
   npm test                  # Run tests (108s timeout minimum) 
   ```

3. **After Making Changes**:
   ```bash
   npm run dev               # Test in development
   # Manually verify user scenarios in browser
   npm run build             # Ensure build still works
   npm test                  # Ensure tests still pass
   npm run lint              # Check code quality (warnings OK)
   ```

4. **Always Test These User Scenarios**:
   - Landing page loads and displays correctly
   - Navigation works between sections
   - AI agent profiles are accessible
   - Pricing information displays properly
   - Sign-in/sign-up flows (expect errors without real auth setup)

**CRITICAL**: Use timeout values of 120+ seconds for builds and 180+ seconds for tests. NEVER CANCEL long-running operations.
