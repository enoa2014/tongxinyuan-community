# Add Nginx Reverse Proxy for SSL

## Goal
Configure HTTPS (SSL) for the legacy website on ECS using Nginx as a reverse proxy. This allows SSL termination without modifying the legacy Apache container and enables forcing HTTP->HTTPS redirection.

## Proposed Changes

### Configuration
#### [NEW] [nginx.conf](file:///c:/Users/86152/work/2026/tongxy/res/txy2020/nginx.conf)
- Listen on 80 (redirect to 443) and 443 (SSL).
- Proxy `proxy_pass http://web:80;` (Apache container).
- SSL path: `/etc/nginx/certs/`.

### Infrastructure
#### [MODIFY] [docker-compose.prod.yml](file:///c:/Users/86152/work/2026/tongxy/res/txy2020/docker-compose.prod.yml)
- Add `nginx` service.
- Map ports `80:80` and `443:443` to Nginx (remove public ports from `web`).
- Mount `nginx.conf` and `certs/`.

### Deployment Scripts
#### [MODIFY] [deploy_to_ecs.ps1](file:///c:/Users/86152/work/2026/tongxy/deploy_to_ecs.ps1)
- Add logic to upload `nginx.tar`.
- Add logic to upload `res/txy2020/certs/`.
- Add logic to upload `res/txy2020/nginx.conf`.

#### [MODIFY] [deploy.sh](file:///c:/Users/86152/work/2026/tongxy/deploy.sh)
- Add `docker load -i nginx.tar`.

## Verification Plan
1.  **Deploy**: Run `.\deploy_to_ecs.ps1`.
2.  **Verify**:
    -   `ssh ecs "docker ps"`: Check if nginx container is running.
    -   `curl -I http://ecs`: Should return 301 Redirect to https.
    -   `curl -k -I https://ecs`: Should return 200 OK (using -k because cert matches domain, not IP).
    -   Browser visit `https://tongxy.xyz` (if DNS is resolved).
