param(
    [Parameter(Mandatory = $true)]
    [string]$ServerIP,
    [string]$User = "root"
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Executing Final Switchover to Tongxinyuan Community on $ServerIP..." -ForegroundColor Cyan

# Upload patched compose file and script
Write-Host "📦 Uploading configs..."
scp .\docker-compose-ecs-final.yml $User@$ServerIP":/tmp/docker-compose-ecs-final.yml"
scp .\complete_switchover.sh $User@$ServerIP":/tmp/complete_switchover.sh"

# Execute
Write-Host "⚙️ Running switchover..." -ForegroundColor Yellow
ssh $User@$ServerIP "chmod +x /tmp/complete_switchover.sh && /tmp/complete_switchover.sh"

if ($LASTEXITCODE -eq 0) {
    Write-Host "🎉 SUCCESS! New site is live." -ForegroundColor Green
}
else {
    Write-Error "Switchover failed!"
}
