# deploy_packager.ps1
$ErrorActionPreference = "Stop"

Write-Host "📦 Starting Deployment Package Process..." -ForegroundColor Cyan

# 1. Define Paths
$RootDir = Get-Location
$WebDir = "$RootDir\apps\web"
$DistDir = "$RootDir\deploy_dist"
$ZipPath = "$RootDir\tongxinyuan_deploy.zip"

# 2. Build Next.js (Ensure we have the latest)
Write-Host "🛠️  Building Next.js Application..." -ForegroundColor Yellow
Set-Location $WebDir
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "Build failed!"
}
Set-Location $RootDir

# 3. Clean Setup
if (Test-Path $DistDir) {
    Remove-Item -Path $DistDir -Recurse -Force
}
if (Test-Path $ZipPath) {
    Remove-Item -Path $ZipPath -Force
}
New-Item -ItemType Directory -Path $DistDir | Out-Null

# 4. Copy Structure
Write-Host "📂 Copying files..." -ForegroundColor Yellow

# Create structure
New-Item -ItemType Directory -Path "$DistDir\apps\web" | Out-Null
New-Item -ItemType Directory -Path "$DistDir\apps\web\.next" | Out-Null

# Copy Configs
Copy-Item "$RootDir\docker-compose.yml" "$DistDir\"
Copy-Item "$RootDir\nginx" "$DistDir\" -Recurse

# Copy Web Artifacts
Copy-Item "$WebDir\Dockerfile" "$DistDir\apps\web\"
Copy-Item "$WebDir\public" "$DistDir\apps\web\" -Recurse
Copy-Item "$WebDir\.next\standalone" "$DistDir\apps\web\.next\" -Recurse
Copy-Item "$WebDir\.next\static" "$DistDir\apps\web\.next\" -Recurse

# 5. Zip It
Write-Host "🤐 Zipping artifacts..." -ForegroundColor Yellow
Compress-Archive -Path "$DistDir\*" -DestinationPath $ZipPath

# 6. Cleanup
Remove-Item -Path $DistDir -Recurse -Force

Write-Host "✅ Package Ready: $ZipPath" -ForegroundColor Green
Write-Host "🚀 Upload this zip file to your ECS server to deploy." -ForegroundColor Cyan
