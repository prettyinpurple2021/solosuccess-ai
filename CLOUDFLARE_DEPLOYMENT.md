# 🚀 Cloudflare Pages Deployment Guide

## Complete Guide for Deploying SoloSuccess AI to Cloudflare Pages

This guide will walk you through deploying your SoloSuccess AI platform to Cloudflare Pages with your custom domain.

---

## 📋 Prerequisites

Before starting, make sure you have:

- ✅ A Cloudflare account (free tier works)
- ✅ Your custom domain registered
- ✅ A Neon PostgreSQL database (free tier available at [neon.tech](https://neon.tech))
- ✅ GitHub repository with your code
- ✅ Required API keys (OpenAI, Stripe, etc.)

---

## 🎯 Step 1: Prepare Your Environment Variables

You'll need these environment variables for production. Keep them secure!

### Required Variables

```bash
# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://username:password@your-neon-host.neon.tech/database?sslmode=require

# Authentication (JWT)
JWT_SECRET=your-secure-jwt-secret-minimum-32-characters

# Application URL (your custom domain)
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Optional but Recommended

```bash
# AI Services
OPENAI_API_KEY=sk-your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-key
GOOGLE_AI_API_KEY=your-google-ai-key

# OAuth (if using social login)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Email Service
RESEND_API_KEY=your-resend-api-key
FROM_EMAIL=noreply@yourdomain.com

# Payments
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-public-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Build Configuration
SKIP_DB_CHECK=true
NODE_ENV=production
```

### 🔑 How to Generate JWT_SECRET

```bash
# On Mac/Linux:
openssl rand -base64 32

# Or use Node.js:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 🗄️ Step 2: Set Up Your Database

### 2.1 Create Neon Database

1. Go to [neon.tech](https://neon.tech) and sign up
2. Create a new project
3. Copy your connection string
4. It should look like: `postgresql://username:password@ep-xxx.neon.tech/neondb?sslmode=require`

### 2.2 Run Database Migrations

```bash
# Set your DATABASE_URL locally
export DATABASE_URL="your-neon-connection-string"

# Run setup scripts
npm run setup-neon-db
npm run setup-briefcase
npm run setup-templates
npm run setup-compliance

# Verify database
npm run db:verify
```

---

## 🌐 Step 3: Deploy to Cloudflare Pages

### Option A: Automatic GitHub Deployment (Recommended)

1. **Connect to Cloudflare Pages:**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Navigate to **Workers & Pages** → **Create Application** → **Pages**
   - Click **Connect to Git**
   - Select your GitHub repository

2. **Configure Build Settings:**
   - **Framework preset:** Next.js
   - **Build command:** `npm run build:cf`
   - **Build output directory:** `.open-next`
   - **Node version:** 18 or higher

3. **Add Environment Variables:**
   - Go to **Settings** → **Environment Variables**
   - Add all required variables from Step 1
   - Make sure to add them to **Production** environment

4. **Deploy:**
   - Click **Save and Deploy**
   - Wait for the build to complete (2-5 minutes)
   - Your app will be live at `your-project.pages.dev`

### Option B: Manual Deployment with Wrangler

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Build and deploy
npm run build:cf
npx wrangler pages deploy .open-next --project-name=your-project-name
```

---

## 🌍 Step 4: Set Up Custom Domain

### 4.1 Add Custom Domain in Cloudflare

1. Go to your Cloudflare Pages project
2. Click **Custom Domains** tab
3. Click **Set up a custom domain**
4. Enter your domain (e.g., `yourdomain.com`)
5. Cloudflare will provide DNS records

### 4.2 Configure DNS

If your domain is **already on Cloudflare:**
- DNS will be configured automatically ✅

If your domain is **elsewhere:**
- Add CNAME record: `yourdomain.com` → `your-project.pages.dev`
- Or migrate to Cloudflare nameservers for full integration

### 4.3 Update Environment Variables

After adding your domain, update:
```bash
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

---

## ✅ Step 5: Verify Deployment

### Test These Endpoints

1. **Main Application:**
   ```
   https://yourdomain.com
   ```

2. **Health Check:**
   ```
   https://yourdomain.com/api/health
   ```
   Should return:
   ```json
   {
     "status": "healthy",
     "timestamp": "2025-01-01T00:00:00.000Z",
     "checks": {
       "server": "ok",
       "auth": "configured",
       "ai": "configured"
     }
   }
   ```

3. **Authentication:**
   ```
   https://yourdomain.com/api/auth/session
   ```
   Should return session data or null session

4. **Sign In Page:**
   ```
   https://yourdomain.com/signin
   ```

---

## 🔧 Troubleshooting

### Build Fails

**Problem:** Build fails with database connection error  
**Solution:** Make sure `SKIP_DB_CHECK=true` is set in environment variables

**Problem:** Module not found errors  
**Solution:** Run `npm ci --legacy-peer-deps` locally to verify dependencies

**Problem:** Out of memory error  
**Solution:** This shouldn't happen with Cloudflare's generous limits, but if it does, reduce bundle size

### Authentication Issues

**Problem:** JWT errors or authentication failures  
**Solution:** 
- Verify `JWT_SECRET` is set and at least 32 characters
- Check that `NEXT_PUBLIC_APP_URL` matches your actual domain
- Clear browser cookies and try again

**Problem:** Users can't sign in  
**Solution:**
- Check database connection is working
- Verify `DATABASE_URL` is correctly set
- Test the `/api/auth/session` endpoint

### Custom Domain Not Working

**Problem:** Domain shows 404 or SSL errors  
**Solution:**
- Wait 24-48 hours for DNS propagation
- Check CNAME record points to `.pages.dev` domain
- Verify SSL certificate is active in Cloudflare dashboard

**Problem:** Mixed content warnings  
**Solution:**
- Ensure all URLs use `https://`
- Check `NEXT_PUBLIC_APP_URL` uses HTTPS

### API Routes Failing

**Problem:** API routes return 500 errors  
**Solution:**
- Check Cloudflare Pages function logs
- Verify all environment variables are set
- Test database connectivity from Cloudflare

---

## 📊 Monitoring & Maintenance

### Cloudflare Analytics

- View real-time traffic in **Analytics** tab
- Monitor page views, requests, and bandwidth
- Set up alerts for errors

### Function Logs

- Go to **Functions** tab in Cloudflare Pages
- View real-time logs of API routes
- Debug errors and performance issues

### Database Monitoring

- Monitor in Neon dashboard at [neon.tech](https://neon.tech)
- Check connection count and query performance
- Set up alerts for high usage

---

## 🚀 Deployment Checklist

Use this checklist before going live:

- [ ] Database is set up and migrated
- [ ] All environment variables are configured
- [ ] Build succeeds locally (`npm run build:cf`)
- [ ] Health check endpoint works
- [ ] Authentication flow tested (signup/signin)
- [ ] Custom domain is connected
- [ ] SSL certificate is active
- [ ] API routes are responding correctly
- [ ] Email service is configured (if using)
- [ ] Payment webhooks are set up (if using Stripe)
- [ ] Error monitoring is configured
- [ ] Backups are configured for database

---

## 🎉 Next Steps After Deployment

1. **Test Complete User Journey:**
   - Sign up new account
   - Create briefcase/project
   - Add tasks and goals
   - Test AI agent conversations
   - Verify dashboard loads

2. **Set Up Monitoring:**
   - Configure Cloudflare alerts
   - Set up error tracking (Sentry)
   - Monitor database performance

3. **Optimize:**
   - Review Cloudflare Analytics
   - Optimize slow pages
   - Set up caching strategies

4. **Scale:**
   - Upgrade Neon if needed
   - Configure auto-scaling
   - Set up CDN for assets

---

## 💡 Pro Tips

- **Use Preview Deployments:** Every Git branch gets its own preview URL for testing
- **Environment Variables per Branch:** Set different variables for production vs preview
- **Rollback:** Cloudflare keeps your deployment history - rollback instantly if needed
- **Global CDN:** Your app is automatically distributed globally with Cloudflare's edge network
- **Zero Downtime:** Deployments are atomic - users never see a broken state

---

## 📞 Support & Resources

- **Cloudflare Pages Docs:** https://developers.cloudflare.com/pages
- **Neon Docs:** https://neon.tech/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Repository Issues:** https://github.com/prettyinpurple2021/solosuccess-ai/issues

---

## 🔐 Security Best Practices

1. **Never commit secrets to Git**
2. **Rotate JWT_SECRET periodically**
3. **Use environment variables for all sensitive data**
4. **Enable Cloudflare's security features:**
   - Bot protection
   - DDoS protection
   - WAF rules
5. **Keep dependencies updated:** `npm audit` regularly
6. **Use HTTPS everywhere**
7. **Implement rate limiting on API routes**

---

**Status:** ✅ Ready for Production Deployment  
**Last Updated:** January 2025

Your SoloSuccess AI platform is now ready to deploy to Cloudflare Pages! 🚀
