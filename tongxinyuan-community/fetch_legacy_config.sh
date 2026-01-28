#!/bin/bash
echo "=== LIST /opt/txy2020 ==="
ls -la /opt/txy2020

echo "=== CONTENT: docker-compose.prod.yml ==="
cat /opt/txy2020/docker-compose.prod.yml 2>/dev/null || echo "Not found"

echo "=== CONTENT: docker-compose.yml ==="
cat /opt/txy2020/docker-compose.yml 2>/dev/null || echo "Not found"
