# Deployment Guide

## Required Environment Variables

Ensure the following environment variables are set in your production environment (e.g., Render, Vercel):

- **DATABASE_URL**: Connection string for your PostgreSQL database (Neon).
- **OPENAI_API_KEY**: API key for OpenAI (used by Roxy, Blaze, Vex, Nova, Glitch).
- **ANTHROPIC_API_KEY**: API key for Anthropic (used by Echo, Lumi, Lexi).
- **JWT_SECRET**: Secret key for signing JSON Web Tokens (auth).
- **NEXT_PUBLIC_APP_URL**: The URL of your deployed application (e.g., `https://solosuccess-ai.onrender.com`).
- **STRIPE_SECRET_KEY**: Secret key for Stripe payments.
- **STRIPE_WEBHOOK_SECRET**: Secret key for Stripe webhooks (if configured).

## Deployment Steps

1. **Database Migrations**: The migrations have been generated. On deployment, you may need to run `npm run db:push` or `npm run db:migrate` (depending on your setup) to apply them to the production database.
2. **Build**: The application is built using `npm run build`.
3. **Start**: The application is started using `npm start`.
