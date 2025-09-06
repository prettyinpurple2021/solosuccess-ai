# Google Cloud Deployment Guide

This guide will help you deploy your Solo Boss AI Platform to Google Cloud Run, taking advantage of your Google Cloud for AI Startups program credits.

## Prerequisites

Before deploying, ensure you have:

1. **Google Cloud Account**: With the AI Startups program credits activated
2. **Google Cloud CLI**: Install from [https://cloud.google.com/sdk/docs/install](https://cloud.google.com/sdk/docs/install)
3. **Docker**: Install from [https://www.docker.com/get-started](https://www.docker.com/get-started)
4. **Google Cloud Project**: Create a new project or use an existing one

## Setup Instructions

### 1. Install Google Cloud CLI

#### Windows:
```powershell
# Download and install from the official website
# Or use Chocolatey
choco install gcloudsdk
```

#### macOS:
```bash
# Using Homebrew
brew install --cask google-cloud-sdk

# Or download from the official website
```

#### Linux:
```bash
# Add the Cloud SDK distribution URI as a package source
echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list

# Import the Google Cloud public key
curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key --keyring /usr/share/keyrings/cloud.google.gpg add -

# Update and install the Cloud SDK
sudo apt-get update && sudo apt-get install google-cloud-cli
```

### 2. Authenticate with Google Cloud

```bash
# Login to your Google account
gcloud auth login

# Set your default project
gcloud config set project YOUR_PROJECT_ID

# Enable Application Default Credentials for local development
gcloud auth application-default login
```

### 3. Create a Google Cloud Project (if needed)

```bash
# Create a new project
gcloud projects create YOUR_PROJECT_ID --name="Solo Boss AI Platform"

# Set the project
gcloud config set project YOUR_PROJECT_ID

# Enable billing (required for Cloud Run)
gcloud beta billing projects link YOUR_PROJECT_ID --billing-account=YOUR_BILLING_ACCOUNT_ID
```

## Deployment Options

### Option 1: Quick Deployment (Recommended)

#### For Windows (PowerShell):
```powershell
# Make sure you're in the project directory
cd path\to\your\project

# Run the deployment script
.\deploy-gcloud.ps1 -ProjectId "your-project-id" -Region "us-central1"
```

#### For macOS/Linux (Bash):
```bash
# Make sure you're in the project directory
cd /path/to/your/project

# Make the script executable
chmod +x deploy-gcloud.sh

# Run the deployment script
./deploy-gcloud.sh
```

### Option 2: Manual Deployment

1. **Enable Required APIs**:
```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

2. **Build the Docker Image**:
```bash
# Build and push to Google Container Registry
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/solo-boss-ai-platform .
```

3. **Deploy to Cloud Run**:
```bash
gcloud run deploy solo-boss-ai-platform \
  --image gcr.io/YOUR_PROJECT_ID/solo-boss-ai-platform \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --memory 2Gi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 100 \
  --timeout 900s \
  --concurrency 1000
```

## Environment Variables

Set your environment variables in Google Cloud Run:

```bash
# Set environment variables
gcloud run services update solo-boss-ai-platform \
  --region us-central1 \
  --set-env-vars="NODE_ENV=production,NEXT_TELEMETRY_DISABLED=1" \
  --set-secrets="DATABASE_URL=database-url:latest,OPENAI_API_KEY=openai-key:latest"
```

### Required Environment Variables:
- `DATABASE_URL`: Your Neon/PostgreSQL database connection string
- `OPENAI_API_KEY`: Your OpenAI API key
- `JWT_SECRET`: Secret for JWT token signing
- `ENCRYPTION_KEY`: Key for data encryption
- `NODE_ENV`: Set to "production"

## Domain Setup (Optional)

### 1. Map a Custom Domain

```bash
# Add domain mapping
gcloud run domain-mappings create \
  --service solo-boss-ai-platform \
  --domain yourdomain.com \
  --region us-central1
```

### 2. Update DNS Records

Add the following DNS records in your domain provider:
- Type: CNAME
- Name: www (or your subdomain)
- Value: ghs.googlehosted.com

## Monitoring and Logs

### View Application Logs
```bash
# Real-time logs
gcloud logs tail --service=solo-boss-ai-platform

# Filtered logs
gcloud logs read "resource.type=cloud_run_revision AND resource.labels.service_name=solo-boss-ai-platform" --limit 50
```

### Monitor Performance
```bash
# Get service details
gcloud run services describe solo-boss-ai-platform --region us-central1

# List revisions
gcloud run revisions list --service solo-boss-ai-platform --region us-central1
```

## Cost Optimization

Since you're using Google Cloud for AI Startups program credits:

### 1. Set Budget Alerts
```bash
# Create a budget (adjust amount as needed)
gcloud billing budgets create \
  --billing-account=YOUR_BILLING_ACCOUNT_ID \
  --display-name="Solo Boss AI Platform Budget" \
  --budget-amount=100USD
```

### 2. Configure Auto-Scaling
The deployment is configured with:
- **Min Instances**: 0 (scales to zero when not in use)
- **Max Instances**: 100 (adjust based on expected traffic)
- **Memory**: 2Gi (optimize based on your app's needs)
- **CPU**: 1 core (adequate for most Next.js apps)

## Health Checks

Your app includes health check endpoints:
- **Basic Health**: `GET /api/health`
- **Dependencies**: `GET /api/health/deps`

These endpoints are used by Cloud Run to determine if your service is healthy.

## Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check Dockerfile syntax
   - Ensure all dependencies are in package.json
   - Verify build context size (should be < 10GB)

2. **Deployment Failures**:
   - Check service account permissions
   - Verify enabled APIs
   - Check quotas and limits

3. **Runtime Errors**:
   - Check environment variables
   - Review application logs
   - Verify database connectivity

### Debug Commands:
```bash
# Check service status
gcloud run services list

# Get detailed service info
gcloud run services describe solo-boss-ai-platform --region us-central1

# View recent deployments
gcloud run revisions list --service solo-boss-ai-platform --region us-central1

# Check build history
gcloud builds list --limit 10
```

## CI/CD Setup (Optional)

For automated deployments, you can set up Cloud Build triggers:

1. **Connect Repository**:
```bash
gcloud source repos create solo-boss-ai-platform
```

2. **Create Build Trigger**:
```bash
gcloud builds triggers create github \
  --repo-name=your-repo \
  --repo-owner=your-username \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml
```

## Security Considerations

1. **Use Secret Manager** for sensitive environment variables
2. **Enable VPC** for database connections if needed
3. **Configure IAM** roles properly
4. **Use HTTPS** (automatically provided by Cloud Run)
5. **Set up monitoring** and alerting

## Support

If you encounter issues:
1. Check the [Google Cloud Run documentation](https://cloud.google.com/run/docs)
2. Review application logs
3. Check the health check endpoints
4. Verify environment variables and secrets

## Costs

With your Google Cloud AI Startups program credits, you should have significant free usage. Cloud Run pricing:
- **CPU and Memory**: Only pay when requests are being handled
- **Requests**: First 2 million requests per month are free
- **Networking**: Egress charges may apply

Your current configuration (2Gi RAM, 1 CPU) should handle most workloads efficiently while staying within reasonable cost limits.
