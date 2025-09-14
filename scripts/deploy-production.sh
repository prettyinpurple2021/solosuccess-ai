#!/bin/bash

# SoloSuccess AI - Production Deployment Script
# This script helps you deploy your app to production

echo "🚀 SoloSuccess AI - Production Deployment Script"
echo "================================================"

# Check if required tools are installed
check_dependencies() {
    echo "📋 Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        echo "❌ npm is not installed. Please install npm first."
        exit 1
    fi
    
    echo "✅ Node.js and npm are installed"
}

# Check environment variables
check_env_vars() {
    echo "📋 Checking environment variables..."
    
    if [ ! -f ".env.local" ]; then
        echo "⚠️  .env.local file not found. Creating from template..."
        if [ -f ".env.production.example" ]; then
            cp .env.production.example .env.local
            echo "✅ Created .env.local from template"
            echo "⚠️  Please edit .env.local with your actual production values before continuing"
            echo "Press Enter when you've updated .env.local..."
            read
        else
            echo "❌ .env.production.example not found. Please create .env.local manually."
            exit 1
        fi
    fi
    
    echo "✅ Environment file found"
}

# Build the application
build_app() {
    echo "🔨 Building application..."
    
    # Install dependencies
    echo "📦 Installing dependencies..."
    npm install --legacy-peer-deps
    
    # Run type check
    echo "🔍 Running type check..."
    npm run typecheck
    
    # Run linting
    echo "🧹 Running linting..."
    npm run lint
    
    # Build the app
    echo "🏗️  Building for production..."
    npm run build
    
    if [ $? -eq 0 ]; then
        echo "✅ Build successful!"
    else
        echo "❌ Build failed. Please fix the errors and try again."
        exit 1
    fi
}

# Test the build locally
test_build() {
    echo "🧪 Testing production build locally..."
    
    echo "Starting production server on port 3000..."
    echo "Open http://localhost:3000 to test your app"
    echo "Press Ctrl+C to stop the server when you're done testing"
    echo ""
    
    npm start
}

# Deploy to Vercel
deploy_vercel() {
    echo "🚀 Deploying to Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        echo "📦 Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    echo "🔐 Logging into Vercel..."
    vercel login
    
    echo "🚀 Deploying to production..."
    vercel --prod
    
    echo "✅ Deployment complete!"
    echo "📋 Don't forget to:"
    echo "   1. Set environment variables in Vercel dashboard"
    echo "   2. Configure your custom domain"
    echo "   3. Test all features on the live site"
}

# Main menu
show_menu() {
    echo ""
    echo "What would you like to do?"
    echo "1) Check dependencies and environment"
    echo "2) Build application"
    echo "3) Test build locally"
    echo "4) Deploy to Vercel"
    echo "5) Full deployment (all steps)"
    echo "6) Exit"
    echo ""
    read -p "Enter your choice (1-6): " choice
    
    case $choice in
        1)
            check_dependencies
            check_env_vars
            show_menu
            ;;
        2)
            check_dependencies
            check_env_vars
            build_app
            show_menu
            ;;
        3)
            test_build
            show_menu
            ;;
        4)
            deploy_vercel
            show_menu
            ;;
        5)
            check_dependencies
            check_env_vars
            build_app
            echo ""
            read -p "Test the build locally? (y/n): " test_choice
            if [ "$test_choice" = "y" ] || [ "$test_choice" = "Y" ]; then
                test_build
            fi
            echo ""
            read -p "Deploy to Vercel now? (y/n): " deploy_choice
            if [ "$deploy_choice" = "y" ] || [ "$deploy_choice" = "Y" ]; then
                deploy_vercel
            fi
            ;;
        6)
            echo "👋 Goodbye!"
            exit 0
            ;;
        *)
            echo "❌ Invalid choice. Please try again."
            show_menu
            ;;
    esac
}

# Run the script
echo "Welcome to the SoloSuccess AI deployment script!"
echo "This script will help you deploy your app to production."
echo ""

show_menu
