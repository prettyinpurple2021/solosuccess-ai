#!/bin/bash

# Setup Cloudflare Pages Environment Secrets
# Run this script to add all required environment variables to your Cloudflare Pages deployment

set -e

echo "🔧 Setting up Cloudflare Pages environment secrets..."
echo "You'll be prompted to paste each value when requested."
echo

# Database
echo "📁 Setting DATABASE_URL..."
echo "Paste: postgresql://neondb_owner:npg_MRLUf85DBNPv@ep-curly-meadow-aefoagku-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require"
wrangler pages secret put DATABASE_URL --env production

echo
echo "🔑 Setting Stack Auth variables..."
echo "Paste: a1c8e783-0b8c-4824-87e9-579ad25ae0dd"
wrangler pages secret put NEXT_PUBLIC_STACK_PROJECT_ID --env production

echo
echo "Paste: pck_hrjgp1dkvwyfbd4q0qgnzh2ghrw1na0davph9rg0vc5mr"
wrangler pages secret put NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY --env production

echo
echo "Paste: ssk_ffg20gzn6xn3xmjkpqc79r9f64pyxj5wkczz5pz8h0f38"
wrangler pages secret put STACK_SECRET_SERVER_KEY --env production

echo
echo "🔐 You'll also need to set these additional secrets:"
echo "- JWT_SECRET (generate a 32+ character random string)"
echo "- OPENAI_API_KEY (your OpenAI API key)"
echo "- Any other API keys you're using"

echo
echo "Run these commands manually for additional secrets:"
echo "wrangler pages secret put JWT_SECRET --env production"
echo "wrangler pages secret put OPENAI_API_KEY --env production"

echo
echo "✅ Basic environment setup complete!"
echo "Your Cloudflare Pages worker will now have access to these environment variables."