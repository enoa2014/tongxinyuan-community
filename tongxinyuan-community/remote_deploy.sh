#!/bin/bash
set -e

# Target Directory
TARGET_DIR="/root/tongxinyuan"
TAR_FILE="/root/tongxinyuan_deploy.tar.gz"

echo "1. Extracting package..."
mkdir -p "$TARGET_DIR"
tar -xzf "$TAR_FILE" -C "$TARGET_DIR"

cd "$TARGET_DIR"

echo "1.1 Loading Offline Images..."
for img in images_*.tar; do
    if [ -f "$img" ]; then
        echo "   -> Loading $img..."
        docker load -i "$img"
    fi
done

echo "2. Stopping previous new services (Port 3000)..."
# Stop specific containers if they exist
echo "   - Stopping Previous txy containers..."
docker stop txy_web txy_nginx txy_api txy_db txy_redis || true
docker rm txy_web txy_nginx txy_api txy_db txy_redis || true

# Helper function for docker compose
dcompose() {
    if command -v docker-compose &> /dev/null; then
        docker-compose "$@"
    else
        docker compose "$@"
    fi
}

echo "   - Ensuring clean state from compose..."
dcompose down --remove-orphans || true

echo "3. Starting New Services..."
# Build (Fast, because it is copy-only)
dcompose up -d --build

echo "4. Cleanup..."
docker system prune -f

echo "闂?Service Status:"
dcompose ps
