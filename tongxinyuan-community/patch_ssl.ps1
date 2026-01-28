param(
    [string]$ServerIP = "ecs",
    [string]$User = "root",
    [string]$WorkDir = "c:\Users\86152\work\2026\tongxy\tongxinyuan-community"
)

Write-Host "🔧 Applying SSL Patch to $ServerIP..." -ForegroundColor Cyan

# 1. Upload Nginx Config
$NginxConf = Join-Path $WorkDir "nginx\conf.d\default.conf"
Write-Host "   Uploading Nginx Config..."
scp $NginxConf "${User}@${ServerIP}:/root/tongxinyuan/nginx/conf.d/default.conf"

# 2. Upload Docker Compose (Local prod -> Remote docker-compose.yml)
$Compose = Join-Path $WorkDir "docker-compose.prod.yml"
Write-Host "   Uploading Docker Compose..."
scp $Compose "${User}@${ServerIP}:/root/tongxinyuan/docker-compose.yml"

# 3. Upload Certs (Just in case)
Write-Host "   Syncing Certs..."
scp -r "$WorkDir\nginx\certs" "${User}@${ServerIP}:/root/tongxinyuan/nginx/"

# 4. Restart Nginx
Write-Host "🔄 Restarting Nginx Container..."
$RestartCmd = "cd /root/tongxinyuan && docker compose up -d --force-recreate nginx"
ssh "${User}@${ServerIP}" $RestartCmd

Write-Host "✨ Patch Complete! Verify https://tongxy.xyz:3000" -ForegroundColor Green
