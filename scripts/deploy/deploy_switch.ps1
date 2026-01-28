param(
    [Parameter(Mandatory = $true)]
    [string]$ServerIP,
    [string]$User = "root"
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting Switchover to New Site on $ServerIP..." -ForegroundColor Cyan

# 1. Upload Configs
Write-Host "📦 Uploading new configs..."
scp .\res\txy2020\docker-compose.new.yml $User@$ServerIP":/opt/txy2020/docker-compose.new.yml"
scp .\res\txy2020\nginx_new.conf $User@$ServerIP":/opt/txy2020/nginx_new.conf"
scp .\deploy_switch.sh $User@$ServerIP":/tmp/deploy_switch.sh"

# 2. Execute Remote Switch Script
Write-Host "⚙️ Executing remote switch..." -ForegroundColor Yellow
ssh $User@$ServerIP "chmod +x /tmp/deploy_switch.sh && /tmp/deploy_switch.sh"

if ($LASTEXITCODE -eq 0) {
    Write-Host "🎉 New Site Live! Access https://$($ServerIP)" -ForegroundColor Green
}
else {
    Write-Error "Switchover failed!"
}
