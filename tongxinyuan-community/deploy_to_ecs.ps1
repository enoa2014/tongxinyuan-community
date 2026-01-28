param(
    [Parameter(Mandatory = $false)]
    [string]$ServerIP = "ecs",
    [string]$User = "root"
)

$ErrorActionPreference = "Stop"
$ProjectRoot = $PSScriptRoot
$TarFile = "tongxinyuan_deploy.tar.gz"
$LocalPath = Join-Path $ProjectRoot $TarFile
$RemotePath = "/root/$TarFile"

# 1. Check artifact
if (-not (Test-Path $LocalPath)) {
    Write-Error "Deploy artifact not found: $LocalPath. Run package_linux_artifacts.ps1 first."
    exit 1
}

Write-Host "🚀 Starting Deployment to $User@$ServerIP"
Write-Host "----------------------------------------"

# 2. Upload
Write-Host "📦 Uploading $TarFile..."
scp $LocalPath "${User}@${ServerIP}:${RemotePath}"
if ($LASTEXITCODE -ne 0) { throw "SCP upload failed" }

# 3. Remote Execute
# 2.9 Ensure Legacy Port 3000 is Released
Write-Host "🔧 Checking Legacy System Ports..."
$PatchScript = Join-Path $ProjectRoot "scripts\deploy\release_legacy_port.sh"
$RemotePatchPath = "/root/release_legacy_port.sh"

$PatchContent = Get-Content -Raw $PatchScript
$PatchContentLF = $PatchContent -replace "`r`n", "`n"
[IO.File]::WriteAllText($PatchScript, $PatchContentLF)

scp $PatchScript "${User}@${ServerIP}:${RemotePatchPath}"
if ($LASTEXITCODE -ne 0) { throw "SCP patch script failed" }

ssh "${User}@${ServerIP}" "chmod +x ${RemotePatchPath} && ${RemotePatchPath}"


# 3. Setup Remote Deploy Script
Write-Host "🔧 Uploading remote deploy script..."
$LocalScript = Join-Path $ProjectRoot "scripts\deploy\remote_deploy.sh"
$RemoteScriptPath = "/root/remote_deploy.sh"

if (-not (Test-Path $LocalScript)) {
    throw "Remote script not found: $LocalScript"
}

# Ensure LF line endings before upload (Crucial for Windows -> Linux)
$Content = Get-Content -Raw $LocalScript
$ContentWithLF = $Content -replace "`r`n", "`n"
[IO.File]::WriteAllText($LocalScript, $ContentWithLF)

scp $LocalScript "${User}@${ServerIP}:${RemoteScriptPath}"
if ($LASTEXITCODE -ne 0) { throw "SCP script failed" }

# 4. Execute
Write-Host "🚀 Executing remote deployment..."
ssh "${User}@${ServerIP}" "chmod +x ${RemoteScriptPath} && ${RemoteScriptPath}"


Write-Host "----------------------------------------"
Write-Host "✨ Deployment Complete. Visit http://$ServerIP"
