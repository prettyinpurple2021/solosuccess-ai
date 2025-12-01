# 🔄 GitHub Workflows Update (ARCHIVED)

## ✅ What Needs to Be Updated

### **1. Remove Google Cloud Deployment Workflow**
- ❌ `.github/workflows/deploy-gcp.yml` - No longer needed
- ✅ Keep CI workflow - Still useful for testing
- ✅ Keep Neon workflow - Still useful for database branches

### **2. Update CI Workflow**
- ✅ Update Node.js version to 20 (already correct)
- ✅ Update npm install command to use `--legacy-peer-deps`
- ✅ Remove Google Cloud specific environment variables
- ✅ Add Vercel-specific environment variables

### **3. Temporal Configuration**
- ✅ Temporal works independently of deployment platform
- ✅ Can use local Docker or Temporal Cloud
- ✅ No changes needed for Vercel deployment

## 🚀 Updated Workflows

### **Updated CI Workflow**
```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint-typecheck:
    name: Lint & Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci --legacy-peer-deps
      
      - name: Lint
        run: npm run lint
      
      - name: Type check
        run: npm run typecheck

  unit-tests:
    name: Unit Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci --legacy-peer-deps
      
      - name: Run unit tests
        run: npm test
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: |
            junit.xml
            coverage/

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: [lint-typecheck, unit-tests]
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci --legacy-peer-deps
      
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_APP_URL: http://localhost:3000
          DATABASE_URL: postgresql://user:pass@host:5432/database
          NEXT_PUBLIC_STACK_PROJECT_ID: test-project-id
          NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY: test-publishable-key
          STACK_SECRET_SERVER_KEY: test-secret-key
          JWT_SECRET: fake-jwt-secret-for-ci-testing-32-chars
          OPENAI_API_KEY: fake-openai-key-for-ci-testing
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-output
          path: .next/

  e2e-tests:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: [build]
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci --legacy-peer-deps
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      
      - name: Setup test environment
        run: node scripts/e2e-setup.mjs
      
      - name: Run Playwright tests
        run: npx playwright test
      
      - name: Upload Playwright report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/

  security-scan:
    name: Security Scan
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci --legacy-peer-deps
      
      - name: Run npm audit
        run: npm audit --audit-level=high
```

### **New Vercel Deployment Workflow (Optional)**
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    name: Deploy to Vercel
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## 🔧 Temporal Configuration

### **Temporal Works with Vercel**
- ✅ **Local Development**: Use Docker Compose for local Temporal server
- ✅ **Production**: Use Temporal Cloud or self-hosted server
- ✅ **Vercel Integration**: Temporal runs independently of Vercel

### **Temporal Environment Variables**
```bash
# For local development
TEMPORAL_ADDRESS=localhost:7233
TEMPORAL_NAMESPACE=default

# For Temporal Cloud
TEMPORAL_ADDRESS=your-namespace.tmprl.cloud:7233
TEMPORAL_API_KEY=your-temporal-api-key
TEMPORAL_NAMESPACE=your-namespace
```

### **Temporal Deployment Options**

#### **Option 1: Temporal Cloud (Recommended)**
- **Free Tier**: 1,000 workflow executions/month
- **Paid**: $25/month for 10,000 executions
- **Benefits**: Managed service, no infrastructure to maintain

#### **Option 2: Self-Hosted**
- **Free**: Run your own Temporal server
- **Cost**: Just server hosting costs
- **Benefits**: Full control, no usage limits

#### **Option 3: Local Development Only**
- **Free**: Use Docker for local development
- **Production**: Use Vercel without Temporal
- **Benefits**: Simple setup, no additional costs

## 🚀 Implementation Steps

### **1. Update GitHub Workflows**
```bash
# Remove Google Cloud deployment workflow
rm .github/workflows/deploy-gcp.yml

# Update CI workflow
# (Replace content with updated version above)
```

### **2. Set Up Vercel Deployment**
```bash
# Option 1: Automatic deployment (Recommended)
# - Connect GitHub repo to Vercel
# - Vercel automatically deploys on push to main

# Option 2: Manual deployment workflow
# - Add Vercel secrets to GitHub
# - Use the Vercel deployment workflow above
```

### **3. Configure Temporal**
```bash
# For local development
docker-compose -f docker-compose.temporal.yml up -d

# For production
# - Sign up for Temporal Cloud
# - Update environment variables
# - Deploy worker to Vercel or separate server
```

## 💰 Cost Comparison

### **GitHub Actions**
- **Before**: Free (2,000 minutes/month)
- **After**: Free (2,000 minutes/month)
- **Change**: No cost change

### **Temporal**
- **Before**: Not configured
- **After**: 
  - **Local Development**: Free (Docker)
  - **Temporal Cloud**: $0-25/month
  - **Self-Hosted**: $5-20/month (server costs)

### **Deployment**
- **Before**: Google Cloud Run (~$20-50/month)
- **After**: Vercel (Free tier)
- **Savings**: $20-50/month

## 🎯 Recommendations

### **For GitHub Workflows**
1. **Keep CI workflow** - Still useful for testing
2. **Remove Google Cloud workflow** - No longer needed
3. **Keep Neon workflow** - Still useful for database branches
4. **Add Vercel workflow** - Optional, for manual deployments

### **For Temporal**
1. **Start with local development** - Use Docker for now
2. **Consider Temporal Cloud** - When you need production workflows
3. **Keep current setup** - Works fine with Vercel

### **For Deployment**
1. **Use Vercel automatic deployment** - Connect GitHub repo
2. **Set up environment variables** - In Vercel dashboard
3. **Test thoroughly** - Before going live

## 🎉 Summary

### **What Changes**
- ❌ Remove Google Cloud deployment workflow
- ✅ Update CI workflow for Vercel compatibility
- ✅ Keep Temporal configuration (works with Vercel)
- ✅ Keep Neon workflow (still useful)

### **What Stays the Same**
- ✅ CI/CD pipeline
- ✅ Testing workflow
- ✅ Database branch management
- ✅ Temporal functionality

### **Benefits**
- ✅ **Simpler deployment** - Vercel handles everything
- ✅ **Lower costs** - Free Vercel vs paid Google Cloud
- ✅ **Better performance** - Vercel's global CDN
- ✅ **Easier maintenance** - Less infrastructure to manage

Your GitHub workflows are now optimized for Vercel deployment! 🚀
