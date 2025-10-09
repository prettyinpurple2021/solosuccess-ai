#!/bin/bash

# 🚀 SoloSuccess AI - Complete Cloudflare Pages Deployment Script
# This script handles the complete deployment of your app to Cloudflare Pages

set -e  # Exit on any error

echo "🌟 Starting SoloSuccess AI deployment to Cloudflare Pages..."
echo "🔗 Custom Domain: solobossai.fun"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${PURPLE}=== $1 ===${NC}"
}

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    print_error "Wrangler CLI not found. Installing..."
    npm install -g wrangler
fi

# Check if user is logged in to Cloudflare
print_header "Checking Cloudflare Authentication"
if ! wrangler whoami &> /dev/null; then
    print_warning "Not logged in to Cloudflare. Please log in..."
    wrangler login
else
    print_success "Already logged in to Cloudflare"
fi

# Build the application for Cloudflare
print_header "Building Application for Cloudflare Pages"
print_status "Running production build with OpenNext..."
npm run build:cf

if [ $? -eq 0 ]; then
    print_success "Build completed successfully!"
else
    print_error "Build failed. Please check the errors above."
    exit 1
fi

# Check if build output exists
if [ ! -d ".open-next" ]; then
    print_error "Build output directory .open-next not found!"
    exit 1
fi

print_success "Build output verified in .open-next directory"

# Deploy to Cloudflare Pages
print_header "Deploying to Cloudflare Pages"
print_status "Deploying to production environment..."

# Deploy the built application
wrangler pages deploy .open-next --project-name=solosuccess-ai-production --env=production

if [ $? -eq 0 ]; then
    print_success "Deployment to Cloudflare Pages completed!"
else
    print_error "Deployment failed. Please check the errors above."
    exit 1
fi

# Deploy AI Workers
print_header "Deploying AI Workers"

# Deploy OpenAI Worker
if [ -d "workers/openai-worker" ]; then
    print_status "Deploying OpenAI Worker..."
    cd workers/openai-worker
    wrangler deploy --env production
    cd ../..
    print_success "OpenAI Worker deployed"
fi

# Deploy Google AI Worker
if [ -d "workers/google-ai-worker" ]; then
    print_status "Deploying Google AI Worker..."
    cd workers/google-ai-worker
    wrangler deploy --env production
    cd ../..
    print_success "Google AI Worker deployed"
fi

# Deploy Competitor Worker
if [ -d "workers/competitor-worker" ]; then
    print_status "Deploying Competitor Worker..."
    cd workers/competitor-worker
    wrangler deploy --env production
    cd ../..
    print_success "Competitor Worker deployed"
fi

# Deploy Intelligence Worker
if [ -d "workers/intelligence-worker" ]; then
    print_status "Deploying Intelligence Worker..."
    cd workers/intelligence-worker
    wrangler deploy --env production
    cd ../..
    print_success "Intelligence Worker deployed"
fi

# Verify deployment
print_header "Verifying Deployment"
print_status "Checking if the application is accessible..."

# Wait a moment for deployment to propagate
sleep 10

# Test the health endpoint
if curl -f -s https://solobossai.fun/api/health > /dev/null; then
    print_success "✅ Health check passed - Application is accessible!"
else
    print_warning "⚠️  Health check failed - Application may still be propagating"
fi

# Final success message
print_header "Deployment Complete! 🎉"
echo ""
echo -e "${CYAN}🌟 Your SoloSuccess AI app is now live at:${NC}"
echo -e "${GREEN}   🔗 https://solobossai.fun${NC}"
echo ""
echo -e "${PURPLE}📊 Next Steps:${NC}"
echo "   1. Test all app features at your custom domain"
echo "   2. Verify authentication flows work correctly"
echo "   3. Check that AI agents are responding"
echo "   4. Test file uploads and briefcase functionality"
echo "   5. Verify payment processing (if applicable)"
echo ""
echo -e "${BLUE}🛠️  Useful Commands:${NC}"
echo "   • View logs: wrangler pages deployment tail --project-name=solosuccess-ai-production"
echo "   • Update secrets: wrangler pages secret put SECRET_NAME --env production"
echo "   • Check status: curl https://solobossai.fun/api/health"
echo ""
echo -e "${GREEN}🚀 Deployment successful! Your holographic AI platform is ready to dominate! 💜${NC}"