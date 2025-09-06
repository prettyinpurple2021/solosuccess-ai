#!/bin/bash

# Google Cloud Deployment Script for Solo Boss AI Platform
# Make sure you have gcloud CLI installed and authenticated

set -e  # Exit on any error

# Configuration
PROJECT_ID="${PROJECT_ID:-your-project-id}"  # Set this to your Google Cloud Project ID
REGION="${REGION:-us-central1}"              # Change region if needed
SERVICE_NAME="solo-boss-ai-platform"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo "🚀 Starting deployment to Google Cloud Run..."
echo "Project ID: $PROJECT_ID"
echo "Region: $REGION"
echo "Service: $SERVICE_NAME"
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud CLI (gcloud) is not installed."
    echo "   Please install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed."
    echo "   Please install Docker and try again."
    exit 1
fi

# Prompt for project ID if not set
if [ "$PROJECT_ID" = "your-project-id" ]; then
    echo "⚠️  Please set your Google Cloud Project ID:"
    read -p "Enter your Google Cloud Project ID: " PROJECT_ID
    
    if [ -z "$PROJECT_ID" ]; then
        echo "❌ Project ID is required."
        exit 1
    fi
    
    IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"
fi

# Set the project
echo "🔧 Setting Google Cloud project..."
gcloud config set project $PROJECT_ID

# Enable required APIs
echo "🔧 Enabling required Google Cloud APIs..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Build the Docker image using Cloud Build
echo "🏗️  Building Docker image with Cloud Build..."
gcloud builds submit --tag $IMAGE_NAME .

# Deploy to Cloud Run
echo "🚢 Deploying to Google Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_NAME \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --memory 2Gi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 100 \
  --timeout 900s \
  --concurrency 1000

# Get the service URL
echo "✅ Deployment completed!"
echo ""
echo "🌐 Getting service URL..."
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format='value(status.url)')

echo ""
echo "🎉 Deployment successful!"
echo "📱 Your app is now live at: $SERVICE_URL"
echo ""
echo "💡 Next steps:"
echo "   1. Set up custom domain (optional): gcloud run domain-mappings create --service=$SERVICE_NAME --domain=yourdomain.com --region=$REGION"
echo "   2. Configure environment variables if needed"
echo "   3. Set up monitoring and alerting"
echo "   4. Configure CI/CD pipeline"
echo ""
echo "📊 Useful commands:"
echo "   • View logs: gcloud logs tail --service=$SERVICE_NAME"
echo "   • View service details: gcloud run services describe $SERVICE_NAME --region=$REGION"
echo "   • Update service: gcloud run services update $SERVICE_NAME --region=$REGION"
