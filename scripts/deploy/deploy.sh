#!/bin/bash
set -e

REMOTE_PATH="/opt/txy2020"

echo "📂 Preparing directory $REMOTE_PATH..."
mkdir -p "$REMOTE_PATH/certs"
cd "$REMOTE_PATH"

echo "📦 Extracting package..."
tar -xzf /tmp/txy2020_deploy.tar.gz -C "$REMOTE_PATH" --strip-components=1

echo "💿 Loading Docker Images (Offline Mode)..."
if [ -f /tmp/mysql.tar ]; then
    echo "   Loading MySQL image..."
    docker load -i /tmp/mysql.tar
fi
if [ -f /tmp/txy2020_app.tar ]; then
    echo "   Loading App image (txy2020:latest)..."
    docker load -i /tmp/txy2020_app.tar
fi
if [ -f /tmp/nginx.tar ]; then
    echo "   Loading Nginx image..."
    docker load -i /tmp/nginx.tar
fi

echo "🔒 Fixing permissions..."
chown -R 33:33 statics/ home/ phpGrace/ || echo "Warning: chown failed, ignoring..."

echo "🚀 Starting Docker containers..."
if command -v docker-compose &> /dev/null; then
    docker-compose -f docker-compose.prod.yml up -d --remove-orphans --force-recreate
elif docker compose version &> /dev/null; then
    docker compose -f docker-compose.prod.yml up -d --remove-orphans --force-recreate
else
    echo "❌ Error: Neither 'docker-compose' nor 'docker compose' found!"
    exit 1
fi

# Cleanup
rm -f /tmp/txy2020_deploy.tar.gz /tmp/mysql.tar /tmp/txy2020_app.tar /tmp/nginx.tar
echo "✅ Deployment Success!"
