# Google Cloud Deployment Script for Solo Boss AI Platform (PowerShell)
# Make sure you have gcloud CLI installed and authenticated

param(
    [string]$ProjectId = $env:PROJECT_ID,
    [string]$Region = "us-central1"
)

$ErrorActionPreference = "Stop"

# Configuration
$SERVICE_NAME = "solo-boss-ai-platform"

if (-not $ProjectId -or $ProjectId -eq "your-project-id") {
    $ProjectId = Read-Host "Enter your Google Cloud Project ID"
    if (-not $ProjectId) {
        Write-Host "❌ Project ID is required." -ForegroundColor Red
        exit 1
    }
}

$IMAGE_NAME = "gcr.io/$ProjectId/$SERVICE_NAME"

Write-Host "🚀 Starting deployment to Google Cloud Run..." -ForegroundColor Green
Write-Host "Project ID: $ProjectId" -ForegroundColor Cyan
Write-Host "Region: $Region" -ForegroundColor Cyan
Write-Host "Service: $SERVICE_NAME" -ForegroundColor Cyan
Write-Host ""

# Check if gcloud is installed
try {
    gcloud version | Out-Null
} catch {
    Write-Host "❌ Google Cloud CLI (gcloud) is not installed." -ForegroundColor Red
    Write-Host "   Please install it from: https://cloud.google.com/sdk/docs/install" -ForegroundColor Yellow
    exit 1
}

# Check if Docker is installed
try {
    docker version | Out-Null
} catch {
    Write-Host "❌ Docker is not installed." -ForegroundColor Red
    Write-Host "   Please install Docker and try again." -ForegroundColor Yellow
    exit 1
}

try {
    # Set the project
    Write-Host "🔧 Setting Google Cloud project..." -ForegroundColor Yellow
    gcloud config set project $ProjectId

    # Enable required APIs
    Write-Host "🔧 Enabling required Google Cloud APIs..." -ForegroundColor Yellow
    gcloud services enable cloudbuild.googleapis.com
    gcloud services enable run.googleapis.com
    gcloud services enable containerregistry.googleapis.com

    # Build the Docker image using Cloud Build
    Write-Host "🏗️ Building Docker image with Cloud Build..." -ForegroundColor Yellow
    gcloud builds submit --tag $IMAGE_NAME .

    # Deploy to Cloud Run
    Write-Host "🚢 Deploying to Google Cloud Run..." -ForegroundColor Yellow
    gcloud run deploy $SERVICE_NAME `
        --image $IMAGE_NAME `
        --region $Region `
        --platform managed `
        --allow-unauthenticated `
        --port 8080 `
        --memory 2Gi `
        --cpu 1 `
        --min-instances 0 `
        --max-instances 100 `
        --timeout 900s `
        --concurrency 1000

    # Get the service URL
    Write-Host "✅ Deployment completed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Getting service URL..." -ForegroundColor Yellow
    $SERVICE_URL = (gcloud run services describe $SERVICE_NAME --region=$Region --format='value(status.url)').Trim()

    Write-Host ""
    Write-Host "🎉 Deployment successful!" -ForegroundColor Green
    Write-Host "📱 Your app is now live at: $SERVICE_URL" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "💡 Next steps:" -ForegroundColor Yellow
    Write-Host "   1. Set up custom domain (optional): gcloud run domain-mappings create --service=$SERVICE_NAME --domain=yourdomain.com --region=$Region"
    Write-Host "   2. Configure environment variables if needed"
    Write-Host "   3. Set up monitoring and alerting"
    Write-Host "   4. Configure CI/CD pipeline"
    Write-Host ""
    Write-Host "📊 Useful commands:" -ForegroundColor Yellow
    Write-Host "   • View logs: gcloud logs tail --service=$SERVICE_NAME"
    Write-Host "   • View service details: gcloud run services describe $SERVICE_NAME --region=$Region"
    Write-Host "   • Update service: gcloud run services update $SERVICE_NAME --region=$Region"

} catch {
    Write-Host "❌ Deployment failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
