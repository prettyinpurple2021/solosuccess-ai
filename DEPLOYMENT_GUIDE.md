# SoloSuccess AI - Cloudflare Pages Deployment Guide

## 🚀 Production Deployment with Custom Domain

### Prerequisites
- [x] Cloudflare account
- [x] Custom domain registered
- [x] Neon PostgreSQL database
- [x] Environment variables ready

### Step 1: Prepare Environment Variables

Create these secrets in Cloudflare Dashboard:

```bash
# Required for production
DATABASE_URL=your-neon-database-url
JWT_SECRET=your-secret-key-minimum-32-chars

# GitHub OAuth Provider (Optional)
GITHUB_CLIENT_ID=your-github-client-id  
GITHUB_CLIENT_SECRET=your-github-client-secret

# Email Service
RESEND_API_KEY=your-resend-api-key
FROM_EMAIL=noreply@yourdomain.com

# AI Services
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
GOOGLE_AI_API_KEY=your-google-ai-key

# Stripe (Optional)
STRIPE_SECRET_KEY=your-stripe-secret
STRIPE_PUBLISHABLE_KEY=your-stripe-public
```

### Step 2: Build for Cloudflare

```bash
# Build optimized for Cloudflare Pages
npm run build:cf

# This creates .opennext/ directory with Cloudflare-optimized build
```

### Step 3: Deploy Options

#### Option A: Automatic GitHub Deployment (Recommended)
1. Push your code to GitHub
2. Connect repository in Cloudflare Pages dashboard
3. Set build command: `npm run build:cf`
4. Set build output directory: `.opennext`

#### Option B: Manual Wrangler Deployment
```bash
# Deploy to staging
npm run deploy:cf:staging

# Deploy to production  
npm run deploy:cf
```

### Step 4: Custom Domain Setup

1. **In Cloudflare Pages Dashboard:**
   - Go to your deployed project
   - Click "Custom Domains" tab
   - Click "Set up a custom domain"
   - Enter your domain (e.g., `yourdomain.com`)

2. **Update DNS:**
   - Add CNAME record: `yourdomain.com` → `your-pages-project.pages.dev`
   - Or use Cloudflare nameservers for full integration

3. **Update Environment Variables:**
   ```bash
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   JWT_SECRET=your-production-jwt-secret-32-chars-minimum
   ```

### Step 5: Verify Deployment

Check these URLs:
- `https://yourdomain.com` - Main app
- `https://yourdomain.com/api/health` - API health check
- `https://yourdomain.com/api/auth/session` - Auth endpoint

## ⚙️ Database Migration

Before first deployment, run database setup:

```bash
# Set your DATABASE_URL in .env
DATABASE_URL=your-neon-connection-string

# Run migrations
npm run setup-neon-db
npm run migrate

# Verify database
npm run db:verify
```

## 🔐 Environment Variables Setup

### Local Development (.env)
```env
DATABASE_URL=your-neon-dev-database-url  
JWT_SECRET=local-dev-secret-key-minimum-32-characters
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Production (Cloudflare Dashboard)
Set all production values in Cloudflare Pages → Settings → Environment Variables

## 🚨 Troubleshooting

### Build Fails
- Check Node.js version (use 18+)
- Verify environment variables
- Run `npm run build` first to test locally

### Authentication Issues  
- Verify `JWT_SECRET` is set and at least 32 characters
- Check that authentication cookies are being set properly
- Ensure database tables exist (`npm run setup-neon-db`)

### Custom Domain Not Working
- Wait 24-48 hours for DNS propagation
- Check CNAME record is pointing to `.pages.dev` domain
- Verify SSL certificate is active

## 📊 Monitoring

- **Cloudflare Analytics**: Built-in traffic analytics
- **Pages Logs**: Real-time function logs
- **Database Metrics**: Monitor in Neon dashboard

---

## 🎯 Next Steps After Deployment

1. **Set up monitoring** with Cloudflare Analytics
2. **Configure email service** (Resend integration)  
3. **Test authentication flows** on production domain
4. **Set up backup strategy** for Neon database
5. **Configure custom error pages**

Your app will be production-ready with:
- ✅ Custom domain with SSL
- ✅ Global CDN via Cloudflare
- ✅ Serverless API routes
- ✅ JWT-based authentication
- ✅ Neon PostgreSQL database
- ✅ 99.9% uptime SLA