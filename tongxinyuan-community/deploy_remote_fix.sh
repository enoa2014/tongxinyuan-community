#!/bin/bash
set -e

ECS_HOST="ecs"
REMOTE_DIR="/root/tongxinyuan/tongxinyuan-community"

echo "🚀 Starting Remote Build Deployment..."

# 1. Sync Code
echo "📦 Syncing code to ECS..."
rsync -avz --delete \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude '.next' \
    --exclude 'backend/pb_data' \
    /home/ctyun/work/tongxinyuan-community/tongxinyuan-community/ \
    $ECS_HOST:$REMOTE_DIR/

# 2. Remote Build & Deploy
echo "🔧 Executing Remote Build..."
ssh $ECS_HOST << 'EOF'
    set -e
    cd /root/tongxinyuan/tongxinyuan-community

    # Update docker-compose.yml to Build with ARG
    cat > docker-compose.yml <<YAML
version: '3.8'

services:
  pocketbase:
    image: ghcr.io/muchobien/pocketbase:latest
    container_name: txy_pocketbase
    restart: unless-stopped
    ports:
      - "8090:8090"
    volumes:
      - /opt/tongxinyuan/backend/pb_data:/pb_data
      - ./backend/pb_migrations:/pb_migrations
    healthcheck:
      test: [ "CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:8090/api/health" ]
      interval: 5s
      timeout: 5s
      retries: 5

  web:
    container_name: txy_web
    build:
      context: ./apps/web
      dockerfile: Dockerfile
      args:
        NEXT_PUBLIC_API_URL: "https://tongxy.xyz:3000"
    restart: always
    ports:
      - "3001:3000"
    environment:
      - NODE_ENV=production
      - PB_URL=http://txy_pocketbase:8090
    depends_on:
      - pocketbase
YAML

    echo "🏗️ Building and Recreating Containers..."
    docker compose up -d --build --force-recreate

    echo "✅ Remote Deployment Complete!"
EOF
