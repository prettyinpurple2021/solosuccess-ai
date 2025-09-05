# Setup Custom Domain for SoloBoss AI Platform
# This script helps configure solobossai.fun domain for Google Cloud Run

param(
    [string]$ProjectId = "soloboss-ai-v3",
    [string]$ServiceName = "soloboss-ai-platform",
    [string]$Region = "us-central1",
    [string]$Domain = "solobossai.fun"
)

Write-Host "Setting up custom domain: $Domain" -ForegroundColor Cyan
Write-Host "Project: $ProjectId" -ForegroundColor White
Write-Host "Service: $ServiceName" -ForegroundColor White
Write-Host "Region: $Region" -ForegroundColor White
Write-Host ""

# Check if gcloud is authenticated
Write-Host "Checking authentication..." -ForegroundColor Yellow
$authStatus = gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>$null
if (-not $authStatus) {
    Write-Host "❌ Not authenticated with gcloud. Please run: gcloud auth login" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Authenticated as: $authStatus" -ForegroundColor Green

# Set the project
Write-Host "Setting project to $ProjectId..." -ForegroundColor Yellow
gcloud config set project $ProjectId

# Create domain mapping
Write-Host "Creating domain mapping for $Domain..." -ForegroundColor Yellow
try {
    gcloud run domain-mappings create --service=$ServiceName --domain=$Domain --region=$Region
    Write-Host "✅ Domain mapping created successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to create domain mapping: $_" -ForegroundColor Red
    Write-Host "This might be because:" -ForegroundColor Yellow
    Write-Host "1. Domain is already mapped" -ForegroundColor White
    Write-Host "2. You don't own the domain" -ForegroundColor White
    Write-Host "3. Domain verification is required" -ForegroundColor White
}

# Get the DNS records needed
Write-Host ""
Write-Host "📋 DNS Configuration Required:" -ForegroundColor Cyan
Write-Host "You need to add these DNS records to your domain registrar:" -ForegroundColor White
Write-Host ""

# Get the domain mapping details
Write-Host "Getting DNS records..." -ForegroundColor Yellow
try {
    $domainMapping = gcloud run domain-mappings describe $Domain --region=$Region --format="value(status.resourceRecords[].name,status.resourceRecords[].type,status.resourceRecords[].rrdata)" 2>$null
    
    if ($domainMapping) {
        Write-Host "DNS Records to add:" -ForegroundColor Green
        Write-Host "Type: A" -ForegroundColor White
        Write-Host "Name: @ (root domain)" -ForegroundColor White
        Write-Host "Value: [IP addresses from Google Cloud Run]" -ForegroundColor White
        Write-Host ""
        Write-Host "Type: CNAME" -ForegroundColor White
        Write-Host "Name: www" -ForegroundColor White
        Write-Host "Value: ghs.googlehosted.com" -ForegroundColor White
    } else {
        Write-Host "Could not retrieve DNS records. Please check the domain mapping status." -ForegroundColor Yellow
    }
} catch {
    Write-Host "Could not retrieve DNS records. Domain mapping might not be ready yet." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🔧 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Go to your domain registrar (where you bought solobossai.fun)" -ForegroundColor White
Write-Host "2. Add the DNS records shown above" -ForegroundColor White
Write-Host "3. Wait for DNS propagation (can take up to 24 hours)" -ForegroundColor White
Write-Host "4. Test your domain: https://$Domain" -ForegroundColor White
Write-Host ""
Write-Host "📚 For more help, see: https://cloud.google.com/run/docs/mapping-custom-domains" -ForegroundColor Blue
