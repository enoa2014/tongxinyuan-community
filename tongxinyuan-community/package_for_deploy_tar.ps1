# package_for_deploy_tar.ps1
$ErrorActionPreference = "Stop"

Write-Host "📦 Starting Deployment Package Process (TAR mode)..." -ForegroundColor Cyan

# 1. Define Paths
$RootDir = Get-Location
$WebDir = "$RootDir\apps\web"
$DistDir = "$RootDir\deploy_dist_tar"
$TarPath = "$RootDir\tongxinyuan_deploy.tar.gz"

# 2. Build Next.js (Skipping build if recently done to save time, assume user wants speed now)
# Write-Host "🛠️  Building Next.js Application..." -ForegroundColor Yellow
# Set-Location $WebDir
# npm run build
# Set-Location $RootDir

# 3. Clean Setup
if (Test-Path $DistDir) {
    Remove-Item -Path $DistDir -Recurse -Force
}
if (Test-Path $TarPath) {
    Remove-Item -Path $TarPath -Force
}
New-Item -ItemType Directory -Path $DistDir | Out-Null

# 4. Copy Structure
Write-Host "📂 Copying files..." -ForegroundColor Yellow

# Create structure
New-Item -ItemType Directory -Path "$DistDir\apps\web" | Out-Null
New-Item -ItemType Directory -Path "$DistDir\apps\web\.next" | Out-Null
New-Item -ItemType Directory -Path "$DistDir\apps\ai-agent" | Out-Null

# Copy Configs
Copy-Item "$RootDir\docker-compose.yml" "$DistDir\"
Copy-Item "$RootDir\nginx" "$DistDir\" -Recurse

# Copy Web Artifacts
Copy-Item "$WebDir\Dockerfile" "$DistDir\apps\web\"
Copy-Item "$WebDir\public" "$DistDir\apps\web\" -Recurse
Copy-Item "$WebDir\.next\standalone" "$DistDir\apps\web\.next\" -Recurse
Copy-Item "$WebDir\.next\static" "$DistDir\apps\web\.next\" -Recurse

# Copy AI Agent Artifacts
Copy-Item "$RootDir\apps\ai-agent\*" "$DistDir\apps\ai-agent\" -Recurse

# 5. Tar It
Write-Host "🤐 Tarring artifacts..." -ForegroundColor Yellow
Set-Location $DistDir
tar -czf $TarPath .
Set-Location $RootDir

# 6. Cleanup
Remove-Item -Path $DistDir -Recurse -Force

Write-Host "✅ Package Ready: $TarPath" -ForegroundColor Green
