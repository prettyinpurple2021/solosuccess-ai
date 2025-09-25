# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Architecture Overview

**SoloSuccess AI** is a comprehensive AI-powered productivity platform with 8 specialized AI agents, built on Next.js 15 with App Router, Neon PostgreSQL, and TypeScript. The core architecture follows a **multi-agent personality system** with **decision frameworks** and **compliance automation**.

### Tech Stack
- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Deployment**: Vercel (serverless functions)
- **Styling**: Tailwind CSS with custom purple-to-pink gradient brand
- **AI**: OpenAI (primary), Anthropic Claude, Google AI via AI SDK
- **Authentication**: Custom JWT-based auth system
- **Payments**: Stripe integration
- **Email**: Resend for transactional emails

## Development Commands

```bash
# Development
npm run dev              # Start development server
npm run build           # Production build
npm run typecheck       # TypeScript validation
npm run lint            # ESLint checks

# Database Operations
npm run db:generate      # Generate Drizzle migrations
npm run db:push         # Apply migrations to Neon database
npm run db:studio       # Open Drizzle Studio

# Testing
npm test                # Jest unit tests
npm run test:coverage   # Jest with coverage
npm run e2e             # Playwright E2E tests
npm run test:api        # API endpoint validation

# Database Setup Scripts
npm run setup-neon-db          # Initialize Neon database
npm run setup-briefcase        # Setup file storage tables
npm run setup-templates        # Setup template system
npm run setup-compliance       # Setup compliance tables
npm run db:verify              # Verify database setup
```

## AI Agent System Architecture

### The 8 Specialized Agents

Each agent has unique decision framework specialties and personality traits:

- **Roxy** (#8B5CF6): Strategic Decision Architect using SPADE Framework for Type 1 decisions
- **Blaze** (#F59E0B): Growth Strategist using Cost-Benefit-Mitigation Matrix analysis
- **Echo** (#EC4899): Marketing Maven for content creation and brand strategy
- **Lumi** (#10B981): Guardian AI for GDPR/CCPA compliance and policy generation
- **Vex** (#3B82F6): Technical Architect for system design and optimization
- **Lexi** (#6366F1): Strategy Analyst using Five Whys methodology for insights
- **Nova** (#06B6D4): Product Designer for UI/UX and user experience
- **Glitch** (#EF4444): Problem-Solving Architect using Five Whys for root cause analysis

### Agent Configuration Pattern

```typescript
// lib/ai-config.ts
export const teamMemberModels = {
  roxy: {
    model: openai("gpt-4o"),
    systemPrompt: `SPADE Framework for Type 1 decisions...`,
  },
  blaze: {
    model: openai("gpt-4o"), 
    systemPrompt: `Cost-Benefit-Mitigation Matrix...`,
  },
  // ... other agents
};
```

### Decision Frameworks
- **SPADE** (Roxy): Setting, People, Alternatives, Decide, Explain
- **Cost-Benefit-Mitigation** (Blaze): Strategic decision evaluation with risk assessment
- **Five Whys** (Glitch/Lexi): Root cause analysis and systematic problem solving

## Database Architecture

### Core Schema (db/schema.ts)
Built with Drizzle ORM using 15+ interconnected tables:

**Primary Tables:**
- `users` - User profiles with subscription tiers
- `briefcases` - Project/document containers
- `goals` - User goals with progress tracking
- `tasks` - Enhanced tasks with AI suggestions, categories, time tracking
- `taskCategories` - Custom categorization system
- `taskAnalytics` - Task completion analytics
- `productivityInsights` - AI-generated insights
- `competitors` - Competitive intelligence data
- `competitorProfiles` - Detailed competitor analysis
- `userCompetitiveStats` - Gamification tracking

**Key Relations:**
```typescript
// Users can have multiple briefcases, goals, tasks
// Tasks can be nested (parent_task_id) and linked to goals
// Analytics track all user interactions for insights
```

### Database Operations Pattern

```typescript
// Lazy connection pattern (db/index.ts)
export function getDb() {
  if (!_db) {
    const client = neon(process.env.DATABASE_URL!);
    _db = drizzle({ schema, client });
  }
  return _db;
}
```

**Migration Workflow:**
1. Modify `db/schema.ts`
2. Run `npm run db:generate` (creates migration files)
3. Run `npm run db:push` (applies to Neon database)
4. **Never edit migrations directly** - always use drizzle-kit

## API Routes & Chat System

### Core API Pattern
All APIs follow consistent response structure:

```typescript
// Standard API response format
return NextResponse.json({
  success: true,
  data: result,
  message: "Operation completed"
});
```

### Chat API Flow
```
User Input → Agent Selection → Personality Engine → Framework Application → 
AI Processing → Competitive Intelligence Context → Streaming Response → UI Update
```

**Key Chat API**: `/app/api/chat/route.ts`
- Streaming AI responses with real-time typing effects
- Agent personality injection based on selection
- Competitive intelligence context integration
- Framework-specific prompt enhancement

## Component Architecture & Design Patterns

### Directory Structure
```
components/
├── ui/                 # Radix UI primitives
├── dashboard/          # Dashboard-specific components  
├── shared/            # Reusable components
└── guardian-ai/       # Compliance system components

app/
├── dashboard/         # Main application pages
├── api/              # Next.js API routes
└── (auth)/           # Authentication pages
```

### Key Patterns
- **Path Aliases**: Use `@/` prefix for all imports
- **No Global State**: Component-level state with React hooks  
- **Custom Hooks**: `hooks/` directory for reusable logic
- **Server Components**: Fresh data fetching with Next.js patterns

### Design System
- **Brand Colors**: Purple-to-pink gradients (`from-pink-500 to-purple-500`)
- **Agent Colors**: Each agent has unique accent color for UI consistency
- **Typography**: Consistent heading/body text patterns
- **Animations**: Framer Motion for smooth transitions
- **Responsive**: Mobile-first Tailwind breakpoints

## Gamification System

### Achievement Categories & Points
```typescript
productivity: 10-500 points    // tasks, goals, focus sessions
wellness: 120-250 points       // wellness tracking, balance
social: 100-300 points         // AI collaborations, sharing
streak: 120+ points            // consistency tracking  
competitive: 50-500 points     // market intelligence, victories
```

### Level Progression
```
Boss Rookie (0) → Rising Boss (500) → Boss Babe (1500) → 
Empire Queen (3000) → Legendary Boss (5000)
```

## Authentication & Authorization

- **Auth System**: Custom JWT-based authentication
- **User Context**: Passed through authenticated API routes
- **Subscription Tiers**: Launch/Accelerator/Dominator with Stripe
- **Agent Access**: Tier-based gating for premium agents
- **Email Verification**: Resend integration for user verification

## Testing Strategy

### Test Structure
```bash
# Unit Tests
npm test                    # Jest with Next.js integration
npm run test:coverage      # Coverage reports with thresholds

# API Testing  
npm run test:api           # scripts/api-testing.js validation
node scripts/smoke-auth.mjs # Quick auth flow verification

# E2E Testing
npm run e2e                # Playwright full user journeys
```

### Test Locations
- Unit tests: `__tests__/` directories alongside components
- API tests: `scripts/api-testing.js` for endpoint validation
- E2E tests: `tests/` directory with Playwright configuration

## Deployment & Environment

### Vercel Deployment
- **Platform**: Vercel serverless functions
- **Database**: Neon PostgreSQL with connection pooling
- **Build Command**: `npm run build`
- **Environment**: Production environment variables via Vercel dashboard

### Required Environment Variables
```bash
# Core
DATABASE_URL=<neon-connection-string>
OPENAI_API_KEY=<openai-key>
NEXT_PUBLIC_STACK_PROJECT_ID=<stack-project-id>

# AI Providers
ANTHROPIC_API_KEY=<anthropic-key>
GOOGLE_AI_API_KEY=<google-ai-key>

# Authentication & Services
JWT_SECRET=<jwt-secret>
RESEND_API_KEY=<resend-key>
STRIPE_SECRET_KEY=<stripe-secret>
STRIPE_PUBLISHABLE_KEY=<stripe-public>

# Monitoring
# Add your preferred error monitoring service here
```

### Environment Validation
Uses Zod schemas for runtime environment validation:

```typescript
const environmentSchema = z.object({
  DATABASE_URL: z.string().url(),
  OPENAI_API_KEY: z.string().min(1),
  // ... other required vars
});
```

## External Service Integrations

- **OpenAI**: Primary AI provider (GPT-4o for most agents)
- **Anthropic**: Claude for Echo and Lumi agents  
- **Google AI**: Gemini for specific use cases
- **Neon**: PostgreSQL database with connection pooling
- **Vercel**: Hosting and serverless functions
- **Stripe**: Subscription billing and payments
- **Resend**: Transactional email delivery

## Compliance & Security Features

### Guardian AI (Lumi) Capabilities
- **Compliance Scanning**: Automated GDPR/CCPA violation detection
- **Policy Generation**: AI-powered legal document creation  
- **Trust Scores**: Compliance certification with badges
- **Consent Management**: Centralized data request handling
- **Risk Assessment**: Legal risk evaluation and mitigation

### Security Patterns
- **Input Validation**: Zod schemas for all user inputs
- **Rate Limiting**: Per-user and per-agent request limits
- **Authentication**: JWT tokens with expiration
- **Data Protection**: Encryption at rest and in transit via Neon/Vercel

## Key Files Reference

| File/Directory | Purpose |
|---|---|
| `lib/ai-config.ts` | Agent configurations and system prompts |
| `lib/ai-personality-system.ts` | Dynamic agent personality engine |
| `app/api/chat/route.ts` | Core AI chat functionality |
| `db/schema.ts` | Complete database schema |
| `app/dashboard/` | Main user interface patterns |
| `components/dashboard/` | Reusable dashboard components |
| `scripts/setup-*.mjs` | Database setup and migration scripts |
| `hooks/use-*.tsx` | Custom React hooks for data fetching |
| `middleware.ts` | Route protection and auth middleware |

## Adding New Agent Capabilities

When extending agent functionality:

1. **Update agent config** in `lib/ai-config.ts` with framework-specific prompts
2. **Extend personality system** in `lib/ai-personality-system.ts` for contextual responses  
3. **Add competitive intelligence** integration if needed
4. **Update UI components** to reflect new capabilities
5. **Test framework integration** through chat API
6. **Update this WARP.md** with new agent information

## Competitive Intelligence Integration

The platform includes comprehensive competitive intelligence features:
- **Context Service**: Aggregates competitor data for AI conversations
- **Task Automation**: Creates tasks from competitive alerts
- **Decision Enhancement**: Integrates competitive data into SPADE, Cost-Benefit, and Five Whys frameworks
- **Gamification**: Tracks competitive victories and intelligence gathering

Remember: Each agent maintains consistent decision framework specialty - preserve this when extending functionality.