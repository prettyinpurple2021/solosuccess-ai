# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Architecture Overview

**SoloSuccess AI** is a comprehensive AI-powered productivity platform with 8 specialized AI agents, built on Next.js 15 with App Router, Neon PostgreSQL, and TypeScript. The core architecture follows a **multi-agent personality system** with **decision frameworks** and **compliance automation**.

### Tech Stack
- **Frontend**: Next.js 15.5.2 with App Router, React 19, TypeScript
- **Database**: Neon PostgreSQL with Drizzle ORM (preferred over Supabase)
- **Deployment**: Cloudflare Pages with OpenNext, Google Cloud Run
- **Styling**: Tailwind CSS 3.4.17 with custom purple-to-pink gradient brand
- **AI**: OpenAI (primary), Anthropic Claude, Google AI via AI SDK
- **Authentication**: JWT-based custom auth with HTTP-only cookies
- **Payments**: Stripe integration
- **Email**: Resend for transactional emails
- **Package Manager**: npm with `--legacy-peer-deps` flag required

## Development Commands

### Initial Setup
```bash
# Install dependencies (requires --legacy-peer-deps flag)
npm ci --legacy-peer-deps

# Create environment file from example
cp .env.example .env.local  # Edit with actual values

# Database setup
npm run setup-neon-db          # Initialize Neon database
npm run setup-briefcase        # Setup file storage tables
npm run setup-templates        # Setup template system
npm run setup-compliance       # Setup compliance tables
npm run db:verify              # Verify database setup
npm run setup:analytics        # Setup analytics infrastructure
npm run setup:workers          # Setup multi-worker development
npm run deploy:workers         # Deploy Cloudflare workers
npm run optimize-images        # Optimize images for production
```

### Daily Development
```bash
# Development
npm run dev              # Start development server (~2s startup)
npm run build           # Production build (64s+ - NEVER CANCEL, set 120s+ timeout)
npm run build:production # Deploy build script
npm run start           # Start production server
npm run typecheck       # TypeScript validation (React 19 warnings expected)
npm run lint            # ESLint checks (warnings OK, not blocking)

# Database Operations
npm run db:generate      # Generate Drizzle migrations (run before db:push)
npm run db:push         # Apply migrations to Neon database
npm run db:studio       # Open Drizzle Studio
npm run migrate         # Run migration scripts
npm run db:run-sql      # Execute SQL file

# Testing (Set 180s+ timeout for test commands)
npm test                # Jest unit tests (108s+, 5/6 suites pass)
npm run test:coverage   # Jest with coverage reports
npm run coverage:ci     # CI coverage with runInBand
npm run e2e             # Playwright E2E tests (install browsers first)
npm run test:api        # API endpoint validation (currently broken)
npm run smoke           # Quick auth flow verification
npm run test:user          # User testing plan validation
npm run test:ux            # UX testing automation

# Storybook
npm run storybook       # Start Storybook dev server on port 6006
npm run build-storybook # Build Storybook for production

# Cloudflare Deployment
npm run build:cf        # Build for Cloudflare Pages
npm run preview:cf      # Preview Cloudflare build locally
npm run deploy:cf       # Deploy to Cloudflare
npm run deploy:cf:preview # Deploy to preview environment
npm run dev:multi          # Multi-worker development mode
```

### Critical Build Notes
- **NEVER CANCEL** build or test commands - they take significant time
- Build: 6 minutes 31 seconds (timeout: 8+ minutes minimum)
- Tests: 29 seconds (timeout: 60+ seconds minimum)
- Dependencies: 27+ seconds (timeout: 60+ seconds minimum)
- React 19 TypeScript errors are expected but don't block builds
- All tests currently pass: 6 suites, 60 tests total

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

## Critical Code Quality & Security Rules

### Production-Ready Code Only
- **NO mock data, placeholders, disabled code, demos, or TODO comments**
- **NO console.log statements** in production code - use `@/lib/logger` instead
- **NO unused imports or variables** - clean up immediately
- **NO duplicate code** - check for existing implementations first
- **NO placeholder URLs** - use real API endpoints and data

### Security Requirements
- **Authentication required** - every API route must check JWT tokens
- **Input validation** - use Zod schemas for all user inputs
- **SQL injection protection** - always use parameterized queries with Drizzle
- **Environment variables** - never expose sensitive data in client code
- **HTTPS only** - all external requests must use HTTPS

### Code Quality Standards
- **TypeScript strict mode** - no `any` types, use proper typing
- **Accessibility compliance** - form labels, ARIA attributes, keyboard navigation, alt text for images
- **Respect user preferences** - honor `prefers-reduced-motion` for animations
- **Responsive design** - mobile-first Tailwind approach
- **Error handling** - proper error boundaries and API error responses
- **Structured logging** - use `@/lib/logger` instead of console methods

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
- **Holographic Components**: HolographicButton, HolographicCard, HolographicNav, HolographicPricingCard
- **Typography**: Consistent heading/body text patterns
- **Animations**: Framer Motion for smooth transitions, holographic effects in `app/globals.css`
- **Responsive**: Mobile-first Tailwind breakpoints

### Holographic Design System Integration
- **Component Library**: `components/ui/holographic-*.tsx` - HolographicButton, HolographicCard, etc.
- **Global Effects**: `app/globals.css` contains holographic animations (glass-shine, holo-shimmer)
- **Tailwind Extensions**: Custom holographic gradients and animations in `tailwind.config.ts`
- **Usage Pattern**: Import holographic components, apply sparkles/shine/glow props for enhanced effects
- **Color Tokens**: Primary Purple (#B621FF), Cyan (#18FFFF), Pink (#FF1FAF) defined in design system

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

## CI/CD & Development Workflow

### GitHub Actions Pipeline
- **CI Workflow**: `.github/workflows/ci.yml` - lint-typecheck → unit-tests → build → e2e-tests
- **Node.js Version**: 20 (specified in CI configuration)
- **Required Environment Variables**: Minimal set for CI builds (see ci.yml)
- **Security Scanning**: npm audit with high-level threshold
- **Test Requirements**: Playwright browsers installed with `--with-deps`
- **Build Dependencies**: Requires `--legacy-peer-deps` flag for npm operations

## Deployment & Environment

### Platform Deployment
- **Platform**: Modern hosting with serverless functions
- **Database**: Neon PostgreSQL with connection pooling
- **Build Command**: `npm run build`
- **Environment**: Production environment variables via platform dashboard

### Cloudflare Pages Deployment
- **Build Command**: `npm run build:cf`
- **Preview Command**: `npm run preview:cf`
- **Deploy Command**: `npm run deploy:cf`
- **Environment**: Uses OpenNext adapter for Cloudflare Pages compatibility

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

### Minimum Environment for Build Success
```bash
# These minimal values allow builds to complete
DATABASE_URL=postgresql://user:pass@host:5432/database
OPENAI_API_KEY=test-key
NEXT_PUBLIC_STACK_PROJECT_ID=test-project
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=test-key
STACK_SECRET_SERVER_KEY=test-key
JWT_SECRET=fake-jwt-secret-for-testing-32-chars
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
- **Platform**: Hosting and serverless functions
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
- **Authentication Implementation**: JWT-based with `lib/auth-server.ts` - supports Bearer tokens and HTTP-only cookies
- **Input Validation**: Zod schemas for all user inputs with safeParse validation
- **Rate Limiting**: Implemented via middleware (currently disabled in development)
- **API Protection**: All protected routes use `authenticateRequest()` function
- **Middleware Configuration**: Route protection defined in `middleware.ts` with public/protected route lists
- **Data Protection**: Encryption at rest and in transit via Neon/platform hosting

### JWT Authentication Pattern
```typescript
// API routes should follow this pattern
const { user, error } = await authenticateRequest()
if (error || !user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
// Proceed with authenticated user
```

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