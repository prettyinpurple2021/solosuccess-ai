#!/bin/bash

# 🚀 SoloSuccess AI - Complete Cloudflare Pages Deployment Script
# This script handles the complete deployment of your app to Cloudflare Pages

set -e  # Exit on any error

# Configuration variables
CUSTOM_DOMAIN="solobossai.fun"
PROJECT_NAME="solosuccess-ai-production"
ENVIRONMENT="production"
BUILD_OUTPUT_DIR=".open-next"
# Correct deployment directory as per package.json and documentation
DEPLOY_OUTPUT_DIR=".open-next"

echo "🌟 Starting SoloSuccess AI deployment to Cloudflare Pages..."
echo "🔗 Custom Domain: ${CUSTOM_DOMAIN}"
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

# Function to deploy a worker with proper error handling
deploy_worker() {
    local worker_name="$1"
    local worker_dir="workers/${worker_name}"
    
    if [ -d "$worker_dir" ]; then
        print_status "Deploying ${worker_name} Worker..."
        
        # Store current directory
        local original_dir=$(pwd)
        
        # Change to worker directory
        cd "$worker_dir" || {
            print_error "Failed to change to ${worker_dir} directory"
            return 1
        }
        
        # Deploy with proper error handling
        if wrangler deploy --env "$ENVIRONMENT"; then
            # Only change back if deployment succeeded
            cd "$original_dir" || {
                print_error "Failed to return to original directory after successful deployment"
                return 1
            }
            print_success "${worker_name} Worker deployed successfully"
            return 0
        else
            # Capture deployment failure, then change back
            local deploy_exit_code=$?
            cd "$original_dir" || {
                print_error "Failed to return to original directory AND deployment failed"
                return 1
            }
            print_error "Failed to deploy ${worker_name} Worker (exit code: ${deploy_exit_code})"
            return 1
        fi
    else
        print_warning "${worker_name} Worker directory not found, skipping..."
        return 0
    fi
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to verify deployment
verify_deployment() {
    local url="$1"
    print_status "Checking if the application is accessible at ${url}..."
    
    # Wait a moment for deployment to propagate
    sleep 10
    
    if curl -f -s "$url" > /dev/null; then
        print_success "✅ Application is accessible at ${url}!"
        return 0
    else
        print_warning "⚠️  Application may still be propagating at ${url}"
        return 1
    fi
}

# Check if wrangler is installed
if ! command_exists wrangler; then
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
if [ ! -d "$BUILD_OUTPUT_DIR" ]; then
    print_error "Build output directory $BUILD_OUTPUT_DIR not found!"
    exit 1
fi

print_success "Build output verified in $BUILD_OUTPUT_DIR directory"

# Deploy to Cloudflare Pages
print_header "Deploying to Cloudflare Pages"
print_status "Deploying to $ENVIRONMENT environment..."

# Determine correct deployment directory
# Check if .open-next/output exists (newer OpenNext versions)
if [ -d "$BUILD_OUTPUT_DIR/output" ]; then
    ACTUAL_DEPLOY_DIR="$BUILD_OUTPUT_DIR/output"
    print_status "Using OpenNext output directory: $ACTUAL_DEPLOY_DIR"
else
    ACTUAL_DEPLOY_DIR="$BUILD_OUTPUT_DIR"
    print_status "Using build directory: $ACTUAL_DEPLOY_DIR"
fi

# Deploy the built application
if wrangler pages deploy "$ACTUAL_DEPLOY_DIR" --project-name="$PROJECT_NAME" --env="$ENVIRONMENT"; then
    print_success "Deployment to Cloudflare Pages completed!"
else
    print_error "Deployment failed. Please check the errors above."
    exit 1
fi

# Deploy AI Workers
print_header "Deploying AI Workers"

# List of workers to deploy
WORKERS=("openai-worker" "google-ai-worker" "competitor-worker" "intelligence-worker")

# Track deployment failures
failed_workers=()

# Deploy each worker using the reusable function
for worker in "${WORKERS[@]}"; do
    if ! deploy_worker "$worker"; then
        failed_workers+=("$worker")
    fi
done

# Report on failed deployments
if [ ${#failed_workers[@]} -gt 0 ]; then
    print_warning "Some workers failed to deploy: ${failed_workers[*]}"
    print_warning "Main application deployment will continue, but some features may not work properly"
else
    print_success "All AI workers deployed successfully"
fi

# Verify deployment
print_header "Verifying Deployment"
verify_deployment "https://${CUSTOM_DOMAIN}/api/health"

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