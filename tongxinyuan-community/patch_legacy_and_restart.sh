#!/bin/bash
FILE="/opt/txy2020/docker-compose.yml"

echo "Checking $FILE for port 3000..."

if grep -q "3000:3000" "$FILE"; then
    echo "Found 3000:3000 port mapping. Disabling..."
    
    # Backup
    cp "$FILE" "$FILE.bak"
    
    # Comment out the line containing 3000:3000
    # Use -i for in-place edit
    sed -i '/3000:3000/s/^/#/' "$FILE"
    
    echo "Port 3000 disabled in config."
    grep "3000:3000" "$FILE"
    
    echo "Restarting legacy containers to apply changes..."
    cd /opt/txy2020
    if command -v docker-compose &> /dev/null; then
        docker-compose up -d
    else
        docker compose up -d
    fi
    echo "Legacy restart complete."
else
    echo "Port 3000 mapping not found in $FILE (or already disabled)."
fi
