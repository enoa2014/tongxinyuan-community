param(
    [Parameter(Mandatory = $true)]
    [string]$ServerIP,
    
    [string]$User = "root",
    [string]$TarPath = ".\txy2020_deploy.tar.gz",
    [string]$DeployScript = ".\deploy.sh",
    [string]$MysqlImage = ".\mysql.tar",
    [string]$AppImage = "..\txy2020_app.tar",
    [string]$NginxImage = ".\nginx.tar"
)

$ErrorActionPreference = "Stop"

function Upload-IfChanged {
    param($LocalPath, $RemotePath, $HostName)
    
    if (-not (Test-Path $LocalPath)) {
        Write-Error "File not found: $LocalPath"
        return
    }

    Write-Host "🔍 Checking $LocalPath ..." -NoNewline
    
    $LocalHash = (Get-FileHash $LocalPath -Algorithm MD5).Hash.ToLower()
    $RemoteHash = ssh $User@$HostName "if [ -f $RemotePath ]; then md5sum $RemotePath | awk '{print `$1}'; else echo 'MISSING'; fi"
    if ($RemoteHash) { $RemoteHash = $RemoteHash.Trim() }

    if ($LocalHash -eq $RemoteHash) {
        Write-Host " [SKIP] (Match: $LocalHash)" -ForegroundColor Gray
    }
    else {
        Write-Host " [UPLOAD] ($LocalHash vs $RemoteHash)" -ForegroundColor Yellow
        scp $LocalPath $User@$HostName":$RemotePath"
        if ($LASTEXITCODE -ne 0) { throw "SCP Failed for $LocalPath" }
    }
}

Write-Host "🚀 Starting Deployment (Offline + SSL) to $ServerIP..." -ForegroundColor Cyan

# Locate images
if (-not (Test-Path $AppImage)) {
    if (Test-Path ".\txy2020_app.tar") { $AppImage = ".\txy2020_app.tar" }
}

# 1. Stop Containers
Write-Host "🛑 Stopping containers..." -ForegroundColor Yellow
ssh $User@$ServerIP "docker ps -q | xargs -r docker stop" 2>$null

# 2. Smart Upload Large Images
Write-Host "📦 Syncing Images..." -ForegroundColor Yellow
Upload-IfChanged -LocalPath $MysqlImage -RemotePath "/tmp/mysql.tar" -HostName $ServerIP
Upload-IfChanged -LocalPath $AppImage -RemotePath "/tmp/txy2020_app.tar" -HostName $ServerIP
Upload-IfChanged -LocalPath $NginxImage -RemotePath "/tmp/nginx.tar" -HostName $ServerIP

# 3. Upload Code & Configs
Write-Host "   Uploading application code..."
scp $TarPath $User@$ServerIP":/tmp/txy2020_deploy.tar.gz"

Write-Host "   Uploading deploy script..."
scp $DeployScript $User@$ServerIP":/tmp/deploy.sh"

# 4. Upload Certs (Directly to destination, handled by mkdir in script)
# We can upload certs to /opt/txy2020/certs now or via the tarball.
# Since tarball includes 'res/txy2020', it includes 'nginx.conf' and 'certs' folder structure?
# Wait, tar was: tar -czf txy2020_deploy.tar.gz -C res txy2020
# 'res/txy2020' contains 'certs' folder.
# So extracting 'txy2020' contents into '/opt/txy2020' will put 'certs' in '/opt/txy2020/certs'.
# Correct. No extra SCP needed for certs if we repackage.

# 5. Execute Remote Script
Write-Host "⚙️ Executing remote deployment..." -ForegroundColor Yellow
ssh $User@$ServerIP "chmod +x /tmp/deploy.sh && /tmp/deploy.sh"

if ($LASTEXITCODE -eq 0) {
    Write-Host "🎉 All Done! Access https://$($ServerIP) (Accept self-signed if needed)" -ForegroundColor Green
}
else {
    Write-Error "Remote deployment script failed!"
}
