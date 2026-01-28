#!/bin/bash
set -e

# 1. Restore Legacy Site (Port 80/443)
echo "🔄 Restoring Legacy Site (txy2020) on Port 80..."
cd /opt/txy2020
if command -v docker-compose &> /dev/null; then
    docker-compose -f docker-compose.prod.yml up -d --remove-orphans
else
    # Fallback for newer Docker versions
    docker compose -f docker-compose.prod.yml up -d --remove-orphans
fi

# 2. Deploy New Site (Port 3000)
echo "🚀 Deploying New Site (Port 3000)..."
cd /opt/tongxinyuan
mv /tmp/docker-compose-ecs-dual.yml docker-compose.yml
if command -v docker-compose &> /dev/null; then
    docker-compose up -d --remove-orphans
else
    docker compose up -d --remove-orphans
fi

# 3. Verify
echo "✅ Dual Deployment Complete!"
echo "   - Legacy Site: http://localhost:80 (HTTPS enabled)"
echo "   - New Site:    https://localhost:3000 (Internal Port 3001)"
docker ps | grep "txy"
