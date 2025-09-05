# PowerShell script to start Temporal development server
Write-Host "Starting Temporal development server..." -ForegroundColor Green

# Try to start Temporal server using Docker
try {
    Write-Host "Starting Temporal server with Docker..." -ForegroundColor Yellow
    docker run -d -p 7233:7233 -p 8080:8080 --name temporal-dev-server temporalio/auto-setup:latest
    
    Write-Host "Waiting for server to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
    
    # Check if container is running
    $containerStatus = docker ps --filter "name=temporal-dev-server" --format "table {{.Status}}"
    if ($containerStatus -match "Up") {
        Write-Host "✅ Temporal server is running!" -ForegroundColor Green
        Write-Host "🌐 Temporal Web UI: http://localhost:8080" -ForegroundColor Cyan
        Write-Host "🔗 Temporal Server: localhost:7233" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Failed to start Temporal server" -ForegroundColor Red
        Write-Host "Container logs:" -ForegroundColor Yellow
        docker logs temporal-dev-server
    }
} catch {
    Write-Host "❌ Error starting Temporal server: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Please make sure Docker is running and try again." -ForegroundColor Yellow
}
