param(
    [Parameter(Mandatory = $true)]
    [string]$ServerIP,
    [string]$User = "root"
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Executing Dual-Stack Deployment on $ServerIP..." -ForegroundColor Cyan
Write-Host "   - Legacy Site -> Port 80"
Write-Host "   - New Site    -> Port 3000"

# Upload
# Upload New Site Config (Moving to 3001)
scp .\docker-compose-ecs-dual.yml $User@$ServerIP":/tmp/docker-compose-ecs-dual.yml"
scp .\deploy_dual.sh $User@$ServerIP":/tmp/deploy_dual.sh"

# Execute
Write-Host "⚙️ Applying changes..." -ForegroundColor Yellow
# 1. Update New Site (Restart to move port 3000 -> 3001)
ssh $User@$ServerIP "chmod +x /tmp/deploy_dual.sh && /tmp/deploy_dual.sh"
# 2. Update Legacy Nginx (Restart to take over port 3000)
ssh $User@$ServerIP "cd /opt/txy2020 && docker compose -f docker-compose.prod.yml up -d --remove-orphans nginx"


if ($LASTEXITCODE -eq 0) {
    Write-Host "🎉 SUCCESS! Both sites are running." -ForegroundColor Green
}
else {
    Write-Error "Deployment failed!"
}
