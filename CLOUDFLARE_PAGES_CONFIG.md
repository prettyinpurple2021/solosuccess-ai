# Cloudflare Pages Configuration Guide

This document outlines the required configuration for deploying SoloSuccess AI to Cloudflare Pages.

## Pages Project Setup

### 1. Create a new Pages project

1. Go to Cloudflare Dashboard → Pages → Create a project
2. Connect your GitHub repository
3. Select `solosuccess-ai` repository

### 2. Build Configuration

| Setting | Value |
|---------|-------|
| **Production branch** | `main` |
| **Build command** | `npm run build:cf` |
| **Build output directory** | `.vercel/output/static` |
| **Root directory** | `/` (project root) |
| **Environment** | Production (Node.js 20.x) |

**Note**: The build command `npm run build:cf` is defined in `package.json` and runs:
```json
"build:cf": "node scripts/patch-stripe.js && cross-env SKIP_DB_CHECK=true npx @cloudflare/next-on-pages"
```

### 3. Environment Variables

Configure these in Pages Project → Settings → Environment variables:

#### Required (Production)
- `DATABASE_URL` - Neon PostgreSQL connection string (format: `postgresql://user:pass@host/db`)
- `JWT_SECRET` - Secret key for JWT signing/verification
- `NEXT_PUBLIC_SITE_URL` - Your production URL (e.g., `https://solosuccess.pages.dev`)

#### Optional (Production)
- `OPENAI_API_KEY` - OpenAI API key for AI features
- `ANTHROPIC_API_KEY` - Anthropic API key for Claude
- `GOOGLE_AI_API_KEY` - Google AI API key
- `STRIPE_SECRET_KEY` - Stripe secret key for payments
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- `RESEND_API_KEY` - Resend API key for transactional emails

#### Preview Environment Variables
Duplicate all production variables for Preview environment, optionally using separate values for testing (e.g., test Stripe keys, separate DB).

### 4. Functions Configuration

Cloudflare Pages will automatically detect Next.js API routes compiled by `@cloudflare/next-on-pages` and run them as Pages Functions (Workers).

- **Runtime**: Edge (all routes now use `export const runtime = 'edge'`)
- **Compatibility date**: Set in `wrangler.toml` or Pages project settings (recommended: `2025-08-01` or latest stable)

### 5. Custom Domains (Optional)

After successful deployment:
1. Go to Pages Project → Custom domains
2. Add your domain (e.g., `app.solosuccess.com`)
3. Follow DNS configuration instructions

## Deployment Workflow

### Automatic Deployments
- **Production**: Every push to `main` branch triggers a production build
- **Preview**: Every PR creates a preview deployment with unique URL

### Manual Deployment via CLI

Install Wrangler globally:
```bash
npm install -g wrangler
```

Login to Cloudflare:
```bash
wrangler login
```

Deploy to production:
```bash
npm run build:cf
npx wrangler pages deploy .vercel/output --project-name solosuccess-ai
```

Deploy to preview:
```bash
npm run build:cf
npx wrangler pages deploy .vercel/output --project-name solosuccess-ai --env preview
```

## Build Validation

Before pushing to production, validate the build locally:

```bash
# Build for Cloudflare
npm run build:cf

# Preview locally using Miniflare
npm run preview:cf
```

The preview runs at `http://localhost:8788` and simulates the Cloudflare Workers environment.

## Observability

### Logs
- **Real-time logs**: Cloudflare Dashboard → Pages → [Project] → Functions → View Logs
- **Tail logs**: `npx wrangler pages deployment tail --project-name solosuccess-ai`

### Analytics
- **Web Analytics**: Cloudflare Dashboard → Analytics → Web Analytics
- **Workers Analytics**: Dashboard → Analytics → Workers & Pages

## Database Migrations

**Important**: Do NOT run migrations during Pages build.

Migrations should be run separately via CI/CD:

1. Add a GitHub Actions workflow (`.github/workflows/db-migrate.yml`) that runs Drizzle migrations on push to `main` BEFORE Pages deployment
2. Use Drizzle Kit:
   ```bash
   npx drizzle-kit push:pg
   ```

Example CI step:
```yaml
- name: Run Database Migrations
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
  run: npx drizzle-kit push:pg
```

## Troubleshooting

### Build Fails
- Check build logs in Pages dashboard
- Verify all environment variables are set correctly
- Ensure `SKIP_DB_CHECK=true` is in build command

### Runtime Errors
- Check Functions logs in Pages dashboard
- Verify `DATABASE_URL` is accessible from Cloudflare Workers (Neon supports HTTP connections)
- Ensure JWT_SECRET is set

### Performance Issues
- Enable caching headers for static assets (handled by Next.js)
- Use Cloudflare CDN for images and static content
- Monitor via Cloudflare Analytics

## Next Steps

After successful deployment:

1. Test all API routes via the deployed URL
2. Run e2e tests against the preview deployment
3. Monitor logs and analytics for errors
4. Set up alerts for critical failures
5. Plan Workflows Worker (see `cf.plan.md` - Future Milestone section)

## References

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Next.js on Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [`@cloudflare/next-on-pages` Guide](https://github.com/cloudflare/next-on-pages)
- [Cloudflare Workers Runtime APIs](https://developers.cloudflare.com/workers/runtime-apis/)

