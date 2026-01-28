param(
    [string]$ServerIP = "ecs",
    [string]$User = "root"
)

Write-Host "🔍 Diagnosing ECS Status on $ServerIP..." -ForegroundColor Cyan

$LocalScript = ".\diagnose_remote.sh"
$RemoteScript = "/root/diagnose_remote.sh"

# Ensure LF
$Content = Get-Content -Raw $LocalScript
$ContentWithLF = $Content -replace "`r`n", "`n"
[IO.File]::WriteAllText($LocalScript, $ContentWithLF)

Write-Host "📦 Uploading diagnosis script..."
scp $LocalScript "${User}@${ServerIP}:${RemoteScript}"

Write-Host "🔍 Executing..."
ssh "${User}@${ServerIP}" "chmod +x ${RemoteScript} && ${RemoteScript}"
