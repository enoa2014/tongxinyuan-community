#!/bin/bash
set -e

# 1. Stop Legacy TXY2020
echo "🛑 Stopping Legacy Site (txy2020)..."
docker stop txy2020-nginx-1 txy2020-web-1 txy2020-db-1 || true
docker rm txy2020-nginx-1 txy2020-web-1 txy2020-db-1 || true
# Ensure we also down the compose project if it exists
cd /opt/txy2020 && docker-compose -f docker-compose.prod.yml down || true

# 2. Setup New Site Configs
echo "🔧 Configuring New Site (/opt/tongxinyuan)..."
cd /opt/tongxinyuan
mv docker-compose.yml docker-compose.bak.yml || true
mv /tmp/docker-compose-ecs-final.yml docker-compose.yml

# 3. Start New Site
echo "🚀 Starting New Site..."
# Using --no-build to ensure we use the explicit image
if command -v docker-compose &> /dev/null; then
    docker-compose up -d --remove-orphans
elif docker compose version &> /dev/null; then
    docker compose up -d --remove-orphans
else
    echo "❌ Error: Neither 'docker-compose' nor 'docker compose' found!"
    exit 1
fi

echo "✅ Switchover Complete! New site running on ports 80/443 (Host Mode)."
