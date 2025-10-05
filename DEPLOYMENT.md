# SoloSuccess AI - Production Deployment Guide

## Overview
This guide walks you through deploying your SoloSuccess AI platform to production using Cloudflare Pages and Workers.

## Prerequisites
- ✅ Next.js app builds successfully (`npm run build:cf`)
- ✅ Cloudflare account with your domain `solobossai.fun`
- ✅ GitHub repository with your code
- ✅ Neon PostgreSQL database
- ✅ All third-party API keys (Stripe, OpenAI, etc.)

## Phase 1: Environment Setup

### 1.1 Install Wrangler CLI (if not already installed)
```bash
npm install -g wrangler
wrangler auth login
```

### 1.2 Set up Cloudflare Secrets
Run the provided script to set up all secrets:
```bash
node scripts/setup-cloudflare-secrets.mjs
```

Or manually set each secret:
```bash
# Production secrets
wrangler secret put DATABASE_URL --env production
wrangler secret put JWT_SECRET --env production
wrangler secret put BETTER_AUTH_SECRET --env production
wrangler secret put GITHUB_CLIENT_SECRET --env production
wrangler secret put RESEND_API_KEY --env production
wrangler secret put OPENAI_API_KEY --env production
wrangler secret put ANTHROPIC_API_KEY --env production
wrangler secret put GOOGLE_AI_API_KEY --env production
wrangler secret put STRIPE_SECRET_KEY --env production
wrangler secret put STRIPE_WEBHOOK_SECRET --env production
wrangler secret put CLOUDFLARE_API_TOKEN --env production
wrangler secret put SENTRY_DSN --env production

# Preview secrets (same values for staging)
wrangler secret put DATABASE_URL --env preview
# ... repeat for all secrets
```

Verify secrets are set:
```bash
wrangler secret list --env production
wrangler secret list --env preview
```

## Phase 2: Cloudflare Pages Setup

### 2.1 Create Pages Project
1. Go to Cloudflare Dashboard > Pages
2. Click "Create Application" > "Connect to Git"
3. Select your repository
4. Configure build settings:
   - **Build command**: `npm run build:cf`
   - **Build output directory**: `.open-next`
   - **Node.js version**: `20.x`

### 2.2 Environment Variables in Pages Dashboard
Add these **non-secret** environment variables in Pages settings:

**Production Environment:**
- `NODE_ENV`: `production`
- `NEXT_PUBLIC_APP_URL`: `https://solobossai.fun`
- `NEXT_PUBLIC_SITE_URL`: `https://solobossai.fun`
- `FROM_EMAIL`: `noreply@solobossai.fun`
- `GITHUB_CLIENT_ID`: `[your-github-client-id]`
- `STRIPE_PUBLISHABLE_KEY`: `[your-stripe-publishable-key]`
- `CLOUDFLARE_ACCOUNT_ID`: `[your-account-id]`
- `CLOUDFLARE_ZONE_ID`: `[your-zone-id]`

### 2.3 Custom Domain Setup
1. Go to Pages > Your Project > Custom Domains
2. Add `solobossai.fun`
3. Update DNS records as shown in Cloudflare

## Phase 3: Database & Services

### 3.1 Neon Production Database
1. Create production branch in Neon console
2. Set connection limit to 20
3. Run migrations:
```bash
npx drizzle-kit push:pg --config drizzle.config.ts
```

### 3.2 Stripe Webhook Configuration
1. Go to Stripe Dashboard > Webhooks
2. Add endpoint: `https://solobossai.fun/api/stripe/webhook`
3. Select events: `payment_intent.succeeded`, `customer.subscription.created`, etc.
4. Copy webhook signing secret to Cloudflare secrets

### 3.3 GitHub OAuth Setup
1. Go to GitHub > Settings > Developer settings > OAuth Apps
2. Update Authorization callback URL: `https://solobossai.fun/api/auth/callback/github`
3. Update Homepage URL: `https://solobossai.fun`

### 3.4 Resend Email Domain
1. Go to Resend Dashboard > Domains
2. Verify `solobossai.fun` domain
3. Add required DNS records in Cloudflare

## Phase 4: Security & Performance

### 4.1 Cloudflare Security Settings
Navigate to Cloudflare > Security:
- ✅ Always Use HTTPS: On
- ✅ HSTS: On (max-age: 6 months, includeSubDomains, preload)
- ✅ Min TLS Version: 1.2
- ✅ Bot Fight Mode: On

### 4.2 Rate Limiting (API Shield)
1. Go to Security > API Shield
2. Create rate limiting rules:
   - API endpoints: 1000 req/10min per IP
   - Auth endpoints: 10 req/1min per IP

### 4.3 Performance Settings
Navigate to Speed > Optimization:
- ✅ Auto Minify: CSS, HTML, JS
- ✅ Brotli compression: On
- ✅ Early Hints: On

## Phase 5: Testing & Deployment

### 5.1 Local Testing
```bash
# Build for Cloudflare
npm run build:cf

# Test locally with Wrangler
npm run preview:cf
```

### 5.2 Preview Deployment
```bash
# Deploy to preview environment
npm run deploy:cf:preview
```
Access at your Cloudflare Pages preview URL.

### 5.3 Production Deployment
```bash
# Deploy to production
npm run deploy:cf

# Or manual deployment
wrangler pages deploy .open-next --env production
```

## Phase 6: Post-Deployment Verification

### 6.1 Smoke Tests
Test these critical flows:
- [ ] Homepage loads
- [ ] User registration
- [ ] GitHub OAuth login
- [ ] Dashboard access
- [ ] AI chat functionality
- [ ] Stripe payment flow
- [ ] Email notifications
- [ ] Database operations

### 6.2 Performance Tests
```bash
# Test from command line
curl -I https://solobossai.fun

# Expected headers:
# - strict-transport-security
# - x-frame-options: DENY
# - x-content-type-options: nosniff
```

### 6.3 Health Checks
- Database connectivity: `https://solobossai.fun/api/health`
- Auth service: `https://solobossai.fun/api/auth/session`

## Phase 7: Monitoring & Maintenance

### 7.1 Error Tracking
Sentry should be automatically sending errors. Verify in Sentry dashboard.

### 7.2 Cloudflare Analytics
Monitor traffic, performance, and security events in Cloudflare dashboard.

### 7.3 Database Monitoring
Set up alerts in Neon for:
- Connection pool usage
- Query performance
- Storage usage

## Common Issues & Troubleshooting

### Build Failures
- Ensure all environment variables are set
- Check for build-time database access
- Verify Node.js version compatibility

### Runtime Errors
- Check Cloudflare Pages Functions logs
- Verify all secrets are properly set
- Test database connectivity

### Performance Issues
- Monitor bundle size (keep under 25MB)
- Check for inefficient database queries
- Use Cloudflare caching appropriately

## Rollback Procedure
If issues arise in production:
```bash
# Rollback to previous deployment
wrangler pages deployment list
wrangler pages deployment rollback [deployment-id]
```

## Security Best Practices
- ✅ Never commit secrets to Git
- ✅ Use environment-specific secrets
- ✅ Regular security audits
- ✅ Monitor for suspicious activity
- ✅ Keep dependencies updated

## Support Contacts
- **Cloudflare Issues**: Cloudflare Support
- **Database Issues**: Neon Support  
- **Payment Issues**: Stripe Support
- **Domain Issues**: Your domain registrar

---

## Quick Commands Reference

```bash
# Local development
npm run dev

# Build for Cloudflare  
npm run build:cf

# Preview deployment
npm run preview:cf

# Deploy to production
npm run deploy:cf

# Check deployment status
wrangler pages deployment list

# View logs
wrangler pages deployment tail

# Manage secrets
wrangler secret list --env production
wrangler secret put SECRET_NAME --env production
wrangler secret delete SECRET_NAME --env production
```