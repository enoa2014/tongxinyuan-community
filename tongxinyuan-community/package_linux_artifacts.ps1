$ErrorActionPreference = "Stop"
$WorkDir = $PSScriptRoot
$DistDir = Join-Path $WorkDir "deploy_pkg_linux"
$ZipFile = Join-Path $WorkDir "tongxinyuan_deploy.tar.gz"

Write-Host "📦 Starting Linux Artifact Packaging..."

# 1. Cleanup
if (Test-Path $DistDir) { Remove-Item -Recurse -Force $DistDir }
if (Test-Path $ZipFile) { Remove-Item -Force $ZipFile }
New-Item -ItemType Directory -Force -Path $DistDir | Out-Null
$WebDistDir = Join-Path $DistDir "apps\web"
New-Item -ItemType Directory -Force -Path $WebDistDir | Out-Null

# 2. Extract Linux Artifacts
Write-Host "🐳 Extracting artifacts from txy-linux-builder..."
# Check if container exists from previous run and remove
if (docker ps -a -q -f name=temp_linux_extractor) { docker rm -f temp_linux_extractor }
docker create --name temp_linux_extractor txy-linux-builder

try {
    # Destination paths
    $StandaloneDest = Join-Path $WebDistDir ".next\standalone"
    $StaticDest = Join-Path $WebDistDir ".next\static"
    $PublicDest = Join-Path $WebDistDir "public"

    New-Item -ItemType Directory -Force -Path $StandaloneDest | Out-Null
    New-Item -ItemType Directory -Force -Path $StaticDest | Out-Null
    New-Item -ItemType Directory -Force -Path $PublicDest | Out-Null

    # Copy
    # Use /. to copy content of directory
    docker cp "temp_linux_extractor:/app/.next/standalone/." "$StandaloneDest"
    docker cp "temp_linux_extractor:/app/.next/static/." "$StaticDest"
    docker cp "temp_linux_extractor:/app/public/." "$PublicDest"
    
    Write-Host "✅ Artifacts extracted."
}
catch {
    Write-Error "Failed to extract artifacts: $_"
    exit 1
}
finally {
    docker rm -f temp_linux_extractor
}

# 3. Setup Dockerfile.prod
Copy-Item "$WorkDir\apps\web\Dockerfile.prod" "$WebDistDir\Dockerfile"
# Also need to create empty directories if needed by older logic? No.

# 4. Copy Services & Configs
Write-Host "📂 Copying Service Configs..."
# AI Agent
Copy-Item "$WorkDir\apps\ai-agent" "$DistDir\apps\" -Recurse -Container
# Nginx
Copy-Item "$WorkDir\nginx" "$DistDir\" -Recurse -Container
# Docker Compose
Copy-Item "$WorkDir\docker-compose.yml" "$DistDir\"

# 5. Compress
Write-Host "🗜️ Compressing to $ZipFile..."
# Tar command (available in Win 10+)
# Note: tar on windows might need correct execution path or relative paths
# Use consistent relative path
cd $DistDir
tar -czf "$ZipFile" .
cd $WorkDir

Write-Host "✨ Deployment Package Ready: $ZipFile"
