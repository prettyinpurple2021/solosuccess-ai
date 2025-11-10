# Generate JWT Secret Script
# This script generates a secure random JWT secret key

Write-Host "Generating JWT Secret..." -ForegroundColor Green
Write-Host ""

# Method 1: Using OpenSSL (if available)
if (Get-Command openssl -ErrorAction SilentlyContinue) {
    Write-Host "Using OpenSSL:" -ForegroundColor Cyan
    $jwtSecret = openssl rand -base64 32
    Write-Host $jwtSecret -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Add this to your .env.local file:" -ForegroundColor Green
    Write-Host "JWT_SECRET=$jwtSecret" -ForegroundColor White
} else {
    # Method 2: Using PowerShell (native)
    Write-Host "Using PowerShell:" -ForegroundColor Cyan
    $rng = [System.Security.Cryptography.RNGCryptoServiceProvider]::Create()
    $bytes = New-Object byte[] 32
    $rng.GetBytes($bytes)
    $jwtSecret = [Convert]::ToBase64String($bytes)
    Write-Host $jwtSecret -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Add this to your .env.local file:" -ForegroundColor Green
    Write-Host "JWT_SECRET=$jwtSecret" -ForegroundColor White
}

Write-Host ""
Write-Host "Press any key to copy to clipboard..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
Set-Clipboard -Value "JWT_SECRET=$jwtSecret"
Write-Host "Copied to clipboard!" -ForegroundColor Green

