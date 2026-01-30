param(
    [string]$ServerIP = "ecs",
    [string]$User = "root"
)

$ErrorActionPreference = "Stop"
$ProjectRoot = "$PSScriptRoot\..\.."
$RemoteRoot = "/opt/tongxinyuan"

Write-Host "🚀 Starting ECS Deployment (Dual Run Mode: New App on Port 3000)..." -ForegroundColor Cyan

# 1. Package
Write-Host "📦 Packaging..." 
$BuildDir = Join-Path $ProjectRoot ".deploy_tmp"
if (Test-Path $BuildDir) { Remove-Item $BuildDir -Recurse -Force }
New-Item -ItemType Directory -Path $BuildDir | Out-Null

# Copy Apps/Web
New-Item -ItemType Directory -Path "$BuildDir\apps\web" | Out-Null
Copy-Item "$ProjectRoot\apps\web\*" "$BuildDir\apps\web" -Recurse -Exclude "node_modules", ".next", ".git"

# Copy Backend Data
New-Item -ItemType Directory -Path "$BuildDir\backend" | Out-Null
Copy-Item "$ProjectRoot\backend\pb_data" "$BuildDir\backend" -Recurse
Copy-Item "$ProjectRoot\backend\pb_migrations" "$BuildDir\backend" -Recurse

# Copy Config
Copy-Item "$ProjectRoot\docker-compose.ecs.yml" "$BuildDir\docker-compose.yml"

# Create Tar
$TarFile = "$ProjectRoot\deploy_v2.tar.gz"
tar -czf $TarFile -C $BuildDir .
Remove-Item $BuildDir -Recurse -Force

# 2. Upload
Write-Host "📤 Uploading..."
scp $TarFile "${User}@${ServerIP}:/tmp/deploy_v2.tar.gz"

# 3. Remote Execute
$RemoteScript = @"
set -e
cd $RemoteRoot

echo "📦 Extracting..."
# Note: Use --overwrite to ensure we replace old files
tar -xzf /tmp/deploy_v2.tar.gz -C .

echo "🖼️ Linking Legacy Images..."
mkdir -p /opt/txy2020/statics

echo "🚀 Starting Services (Port 3000/8090)..."
# Only start new services, do NOT touch legacy
docker compose down --remove-orphans || true
docker compose up -d --build

echo "🧹 Cleanup..."
rm /tmp/deploy_v2.tar.gz
docker image prune -f

echo "✨ Done! Access at http://8.148.186.60:3000"
"@

# Execute
$RemoteScriptPath = "/tmp/install_v2.sh"
$RemoteScriptUnix = $RemoteScript -replace "`r`n", "`n"
[IO.File]::WriteAllText("$ProjectRoot\install_v2.sh", $RemoteScriptUnix)

scp "$ProjectRoot\install_v2.sh" "${User}@${ServerIP}:$RemoteScriptPath"
ssh "${User}@${ServerIP}" "bash $RemoteScriptPath"

Remove-Item "$ProjectRoot\install_v2.sh"
Write-Host "✅ Deployment Success!" -ForegroundColor Green
