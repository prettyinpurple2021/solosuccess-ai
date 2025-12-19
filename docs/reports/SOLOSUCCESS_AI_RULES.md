# 🎯 SoloSuccess AI - Production Standards & Rules

**Production-First Philosophy**: Zero tolerance for mocks, placeholders, disabled code, demos, or TODO comments. Every feature shipped must be real, functional, and serve actual users.

---

## 🚀 TECH STACK & DEPLOYMENT

### Core Technologies
- **Framework**: Next.js 15.5+ with App Router
- **Language**: TypeScript (strict mode, zero `any` types)
- **Styling**: Tailwind CSS 3.4+ with Cyberpunk Design System v3
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Authentication**: JWT-based custom auth
- **Deployment**: Compatible with any modern hosting platform
- **File Storage**: S3-compatible storage or local storage
- **AI Integration**: OpenAI, Anthropic, Google AI SDKs

### Deployment Architecture
```typescript
// next.config.mjs - Standard Next.js configuration
export default {
  distDir: '.next',
  output: 'standalone',
  // Platform-agnostic configuration
}
```

### Environment Variables
```bash
# Required for production
DATABASE_URL=          # Neon PostgreSQL connection
JWT_SECRET=           # JWT secret (min 32 characters)
OPENAI_API_KEY=       # AI service keys
ANTHROPIC_API_KEY=    # AI service keys
# Add storage credentials based on your provider
```

---

## 🎨 CYBERPUNK DESIGN SYSTEM v3 MANDATES

### Brand Colors (Required)
```typescript
// tailwind.config.ts - Exact colors only
colors: {
  'neon-cyan': '#0be4ec',
  'neon-magenta': '#ff006e',
  'neon-lime': '#39ff14',
  'neon-purple': '#b300ff',
  'neon-orange': '#ff6600',
  'dark-bg': '#0a0e27',
  'dark-card': '#0f1535',
  'dark-hover': '#151d3a',
}
```

### Required Components
- **All buttons**: Use `PrimaryButton` from `@/components/ui/Button`
- **All cards**: Use `div` with `border-2 border-neon-cyan bg-dark-card rounded-sm` classes
- **All headings**: Use `Heading` component with glitch-hover support
- **All text**: Use `Text` component (no glitch on body text)
- **All loaders**: Use `Loading` component from `@/components/ui/Loading`

### Theme System
- **Dual-mode**: Balanced (production) and Aggressive (full cyberpunk)
- **Default**: Balanced mode (0.3s animations, 0.5 opacity, 4px radius)
- **Theme switcher**: Use `ThemeSwitcher` component
.gradient-holographic { background: linear-gradient(135deg, #B621FF 0%, #18FFFF 20%, #FF1FAF 40%, #18FFFF 60%, #B621FF 80%, #FF1FAF 100%); }
```

### Animation Standards
- **Framer Motion**: Required for all interactive elements
- **Performance**: Hardware-accelerated transforms only
- **Accessibility**: Respect `prefers-reduced-motion`

---

## 🔒 AUTHENTICATION (BETTER AUTH)

### Implementation Requirements
```typescript
// lib/auth.ts - Better Auth configuration
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg"
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24 // 24 hours
  }
})
```

### API Route Protection
```typescript
// Required pattern for all protected API routes
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Continue with authenticated logic
}
```

---

## 💾 DATABASE (NEON POSTGRESQL)

### Connection Management
```typescript
// lib/db.ts - Neon with connection pooling
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql)
```

### Schema Requirements
```typescript
// db/schema.ts - Required patterns
import { pgTable, uuid, text, timestamp, index } from 'drizzle-orm/pg-core'

export const exampleTable = pgTable('example_table', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => ({
  userIdIdx: index('example_user_id_idx').on(table.userId),
  createdAtIdx: index('example_created_at_idx').on(table.createdAt)
}))
```

### Migration Requirements
- Use Drizzle Kit for all schema changes
- Never modify production data directly
- Include proper indexes for performance

---

## 🛡️ SECURITY STANDARDS

### Required Headers (Cloudflare)
```typescript
// middleware.ts - Security headers
export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  return response
}
```

### Input Validation
```typescript
// Required pattern for all API routes
import { z } from 'zod'

const RequestSchema = z.object({
  // Define strict validation
})

const { data, error } = RequestSchema.safeParse(body)
if (error) {
  return NextResponse.json({ error: error.issues }, { status: 400 })
}
```

### Rate Limiting
```typescript
// lib/rate-limit.ts - Cloudflare KV based
export async function rateLimit(identifier: string, limit = 100, window = 3600) {
  // Implementation using Cloudflare KV
}
```

---

## 🧩 COMPONENT STANDARDS

### File Structure
```
components/
├── holographic/          # Holographic design components
│   ├── HolographicButton.tsx
│   ├── HolographicCard.tsx
│   ├── animations/       # Framer Motion animations
├── ui/                   # Base Radix UI components  
├── forms/               # Form components with Better Auth
└── layout/              # Layout components
```

### Component Template
```typescript
'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ComponentProps {
  children: React.ReactNode
  className?: string
  sparkles?: boolean
  shine?: boolean
  glow?: boolean
}

export function HolographicComponent({ 
  children,
  className,
  sparkles = false,
  shine = false,
  glow = false,
  ...props 
}: ComponentProps) {
  return (
    <motion.div
      className={cn(
        "relative holo-overlay",
        sparkles && "holo-glitter",
        shine && "glass-shine", 
        glow && "glow-pulse",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
```

---

## 🔧 API STANDARDS

### Route Template
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { rateLimit } from '@/lib/rate-limit'
import { db } from '@/lib/db'
import { z } from 'zod'
import { headers } from 'next/headers'

const RequestSchema = z.object({
  // Define validation schema
})

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimit('api', 100)
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    // Authentication
    const session = await auth.api.getSession({
      headers: await headers()
    })
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Validation
    const body = await request.json()
    const { data, error } = RequestSchema.safeParse(body)
    if (error) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }

    // Database operations - REAL DATA ONLY
    const result = await db.query./* your query */

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

---

## ♿ ACCESSIBILITY REQUIREMENTS

### Form Standards
```typescript
// Required accessibility patterns
<label htmlFor="email" className="sr-only">
  Email Address
</label>
<input
  id="email"
  type="email"
  aria-describedby="email-error"
  aria-invalid={errors.email ? 'true' : 'false'}
  className="..."
/>
{errors.email && (
  <p id="email-error" role="alert" className="text-red-500">
    {errors.email.message}
  </p>
)}
```

### Navigation Requirements
- All interactive elements keyboard accessible
- Focus states visible and consistent
- ARIA labels for complex interactions
- Screen reader tested navigation

---

## 🚫 PROHIBITED PRACTICES

### Absolutely Forbidden
```typescript
// ❌ NEVER DO THESE
const mockData = [...] // No mock data
const TODO = "..." // No TODO comments
const disabled = true // No disabled features
const placeholder = "..." // No placeholders
console.log(...) // No console logging in production
```

### Security Violations
```typescript
// ❌ SECURITY VIOLATIONS
const query = `SELECT * FROM users WHERE id = ${userId}` // SQL injection
const token = localStorage.getItem('token') // Insecure storage
process.env.SECRET_KEY // Client-side secrets
```

---

## ✅ REQUIRED PRACTICES

### Production Standards
```typescript
// ✅ ALWAYS DO THESE
const realData = await db.query.users.findMany() // Real data
const validatedInput = schema.parse(input) // Validation
const authenticatedUser = await getSession() // Authentication
const rateLimited = await rateLimit(ip) // Rate limiting
```

### Code Quality
- TypeScript strict mode enabled
- Zero ESLint errors or warnings
- All components tested and functional
- Performance optimized (Core Web Vitals)
- Accessibility compliant (WCAG 2.1 AA)

---

## 🎯 SUCCESS METRICS

### Technical Requirements
- **Build**: Zero errors, zero warnings
- **Performance**: Core Web Vitals all green
- **Security**: Zero vulnerabilities
- **Accessibility**: WCAG 2.1 AA compliant
- **Type Safety**: 100% TypeScript coverage

### User Experience Goals
- **Loading**: Sub-3 second page loads on Cloudflare
- **Interactive**: Holographic effects smooth on all devices
- **Responsive**: Perfect mobile experience
- **Reliable**: 99.9% uptime with Neon connection pooling

---

## 📋 DEPLOYMENT CHECKLIST

### Pre-deployment Requirements
- [ ] Better Auth configured and tested
- [ ] Neon database schema migrated
- [ ] All holographic components implemented
- [ ] Cloudflare Pages build successful
- [ ] Environment variables configured
- [ ] Security headers implemented
- [ ] Rate limiting active
- [ ] Accessibility validated
- [ ] Performance optimized

### Post-deployment Verification
- [ ] Authentication flows working
- [ ] Database connections stable
- [ ] Holographic animations smooth
- [ ] Mobile experience validated
- [ ] Security scan passed
- [ ] User testing completed

---

**REMEMBER**: This is a production application serving real users. Every line of code must be production-ready, secure, accessible, and aligned with the holographic design system. No compromises. No shortcuts. No fake data. 

Build with integrity. Ship with confidence. Serve users with excellence.

<citations>
<document>
<document_type>RULE</document_type>
<document_id>AGBdBMsHgdpuHzp6ibHWRH</document_id>
</document>
<document>
<document_type>RULE</document_type>
<document_id>OOkqCW6HtnyHGSWdEoBhA2</document_id>
</document>
<document>
<document_type>RULE</document_type>
<document_id>ow3nATI7pBAcw1gQXye9xG</document_id>
</document>
</citations>