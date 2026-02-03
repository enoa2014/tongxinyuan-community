#!/bin/bash
set -e

# Configuration
ECS_HOST="ecs"
TARGET_DIR="/root/tongxinyuan/tongxinyuan-community" # Use a new clean dir to avoid messing old one

echo "🚀 Starting Deployment to $ECS_HOST..."

# 1. Sync Files (Exclude node_modules, .git, etc.)
echo "📦 Syncing files..."
rsync -avz --delete \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude '.next' \
    --exclude 'backend/pb_data' \
    /home/ctyun/work/tongxinyuan-community/tongxinyuan-community/ \
    $ECS_HOST:$TARGET_DIR/

# 2. Remote Execution
echo "🔧 Executing remote setup..."
ssh $ECS_HOST << 'EOF'
    set -e
    cd /root/tongxinyuan/tongxinyuan-community

    # Ensure docker-compose.yml uses port 3000:3000
    sed -i 's/"3001:3000"/"3000:3000"/g' docker-compose.yml

    # Stop Old Service (If it's txy_web on 3000 or 3001)
    # We try to stop any container using port 3000
    OLD_CONTAINER=$(docker ps -q --filter "publish=3000")
    if [ ! -z "$OLD_CONTAINER" ]; then
        echo "🛑 Stopping container on port 3000: $OLD_CONTAINER"
        docker stop $OLD_CONTAINER
    fi

    # SPECIAL HANDLING: Nginx might be listening on 3000 (Host Mode)
    # We attempt to disable it to free up the port for our new container
    echo "🔍 Checking for Nginx listening on 3000..."
    if grep -r "listen 3000" /root/tongxinyuan/nginx/conf.d/ 2>/dev/null; then
        echo "⚠️ Found Nginx config listening on 3000. Disabling it..."
        sed -i 's/listen 3000/listen 3030/g' /root/tongxinyuan/nginx/conf.d/*.conf
        echo "🔄 Reloading Nginx..."
        docker exec 0a0fc788f7d6 nginx -s reload || echo "Warning: Failed to reload Nginx"
    fi
    
    # 3. Clean up old txy containers
    docker compose down --remove-orphans || true

    # 4. Build and Up
    echo "🏗️ Building and Starting..."
    docker compose build
    docker compose up -d

    echo "✅ Deployment Complete!"
    docker ps | grep txy_web
EOF
