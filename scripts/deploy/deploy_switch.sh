#!/bin/bash
set -e

REMOTE_PATH="/opt/txy2020"

echo "📂 Doing Switchover to New Site..."
cd "$REMOTE_PATH"

# 1. Ensure Old Site is GONE
echo "🛑 Stopping Legacy Site..."
if [ -f docker-compose.prod.yml ]; then
    if command -v docker-compose &> /dev/null; then
        docker-compose -f docker-compose.prod.yml down || true
    else
        docker compose -f docker-compose.prod.yml down || true
    fi
fi

# 2. Cleanup conflict containers just in case
docker stop txy2020-nginx-1 txy2020-web-1 txy2020-db-1 || true
docker rm txy2020-nginx-1 txy2020-web-1 txy2020-db-1 || true

# 3. Start New Site
echo "🚀 Starting New Site..."
if command -v docker-compose &> /dev/null; then
    docker-compose -f docker-compose.new.yml up -d --remove-orphans
elif docker compose version &> /dev/null; then
    docker compose -f docker-compose.new.yml up -d --remove-orphans
else
    echo "❌ Error: Neither 'docker-compose' nor 'docker compose' found!"
    exit 1
fi

echo "✅ Switchover Success! Access https://tongxy.xyz"
