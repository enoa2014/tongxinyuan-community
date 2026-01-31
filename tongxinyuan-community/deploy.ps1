
# Deploy Script for Windows (Production)
Write-Host "Starting Deployment Process..." -ForegroundColor Green

# 1. Stop existing containers
Write-Host "Stopping containers..."
docker-compose -f docker-compose.prod.yml down

# 2. Build new images
Write-Host "Building images (this may take a while)..."
docker-compose -f docker-compose.prod.yml build --no-cache

# 3. Start services
Write-Host "Starting services..."
docker-compose -f docker-compose.prod.yml up -d

# 4. Prune old images (optional, to save space)
Write-Host "Pruning old images..."
docker image prune -f

Write-Host "Deployment Complete! Web: http://localhost:3001, PB: http://localhost:8090" -ForegroundColor Cyan
