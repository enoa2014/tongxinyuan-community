#!/bin/bash
set -e

ECS_HOST="ecs"
REMOTE_DIR="/root/tongxinyuan/tongxinyuan-community"
IMAGE_NAME="txy-web-prod"
IMAGE_TAR="txy-web-prod.tar.gz"

echo "🏗️  Building Docker Image Locally..."
# Use host network to avoid build context issues, simple build
echo 'dongdongO0@' | sudo -S docker build -f apps/web/Dockerfile \
  --build-arg NEXT_PUBLIC_API_URL=https://tongxy.xyz:3000 \
  -t $IMAGE_NAME apps/web

echo "📦 Saving Image to Tarball..."
echo 'dongdongO0@' | sudo -S docker save $IMAGE_NAME | gzip > $IMAGE_TAR

echo "🚀 Transferring Image to ECS..."
# Ensure remote dir exists (it should from previous step)
ssh $ECS_HOST "mkdir -p $REMOTE_DIR"
scp $IMAGE_TAR $ECS_HOST:$REMOTE_DIR/

echo "🔧 Deploying on ECS..."
ssh $ECS_HOST << EOF
    set -e
    cd $REMOTE_DIR
    
    echo "📥 Loading Docker Image..."
    gunzip -c $IMAGE_TAR | docker load
    
    echo "⚙️  Updating docker-compose.yml to use Image..."
    # Replace 'build: ...' with 'image: txy-web-prod'
    # We use a temp file safely
    sed -i -e 's|build:|image: $IMAGE_NAME\n    # build:|' \
           -e 's|context: ./apps/web|# context: ./apps/web|' \
           -e 's|dockerfile: Dockerfile|# dockerfile: Dockerfile|' \
           docker-compose.yml
           
    echo "🚀 Starting Services..."
    # We remove 'build' from command
    docker compose up -d --no-build

    echo "✅ Deployment Complete!"
    docker ps | grep txy_web
EOF
