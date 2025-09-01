# Google Cloud Run Deployment Script for Windows PowerShell
# Make sure you have gcloud CLI installed and authenticated

param(
    [string]$ProjectId = "soloboss-ai-v3",
    [string]$ServiceName = "soloboss-ai-platform",
    [string]$Region = "us-central1"
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting deployment to Google Cloud Run..." -ForegroundColor Green

# Check if gcloud is authenticated
try {
    $authStatus = gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>$null
    if (-not $authStatus) {
        Write-Host "❌ Please authenticate with Google Cloud first:" -ForegroundColor Red
        Write-Host "   gcloud auth login" -ForegroundColor Yellow
        exit 1
    }
    Write-Host "✅ Authenticated as: $authStatus" -ForegroundColor Green
} catch {
    Write-Host "❌ gcloud CLI not found or not working. Please install and configure gcloud CLI." -ForegroundColor Red
    exit 1
}

# Set the project
Write-Host "📋 Setting project to $ProjectId..." -ForegroundColor Cyan
gcloud config set project $ProjectId

# Enable required services
Write-Host "🔧 Enabling required Google Cloud services..." -ForegroundColor Cyan
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable secretmanager.googleapis.com
gcloud services enable artifactregistry.googleapis.com

# Check if Docker is running
try {
    docker version | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running. Please start Docker Desktop and try again." -ForegroundColor Red
    exit 1
}

# Build the Docker image
Write-Host "🏗️ Building Docker image..." -ForegroundColor Cyan
$imageName = "us-central1-docker.pkg.dev/$ProjectId/$ServiceName/$ServiceName"
docker build -t $imageName .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker build failed!" -ForegroundColor Red
    exit 1
}

# Push the image to Artifact Registry
Write-Host "📦 Pushing image to Artifact Registry..." -ForegroundColor Cyan
gcloud auth configure-docker us-central1-docker.pkg.dev
docker push $imageName

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker push failed!" -ForegroundColor Red
    exit 1
}

# Deploy to Cloud Run
Write-Host "🚀 Deploying to Cloud Run..." -ForegroundColor Cyan
gcloud run deploy $ServiceName `
  --image $imageName `
  --platform managed `
  --region $Region `
  --allow-unauthenticated `
  --memory 2Gi `
  --cpu 2 `
  --max-instances 5 `
  --min-instances 0 `
  --concurrency 80 `
  --timeout 900 `
  --set-env-vars NODE_ENV=production

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Cloud Run deployment failed!" -ForegroundColor Red
    exit 1
}

# Get the service URL
Write-Host "🔍 Getting service URL..." -ForegroundColor Cyan
$serviceUrl = gcloud run services describe $ServiceName --region $Region --format 'value(status.url)'

Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
Write-Host "🌐 Your application is available at: $serviceUrl" -ForegroundColor Green

# Test the health endpoint
Write-Host "🏥 Testing health endpoint..." -ForegroundColor Cyan
try {
    $healthResponse = Invoke-RestMethod -Uri "$serviceUrl/api/health" -Method Get -TimeoutSec 10
    Write-Host "✅ Health check passed: $($healthResponse.status)" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Health check failed or timed out. Service might still be starting up." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Next steps:" -ForegroundColor Cyan
Write-Host "1. Your environment variables are already configured in Google Secret Manager" -ForegroundColor White
Write-Host "2. Configure your domain (if needed)" -ForegroundColor White
Write-Host "3. Monitor the service in Google Cloud Console" -ForegroundColor White

# Open the application in browser
Write-Host "🔍 Opening application in browser..." -ForegroundColor Cyan
Start-Process $serviceUrl
