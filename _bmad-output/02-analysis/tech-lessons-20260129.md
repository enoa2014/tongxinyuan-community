# Technical Decision Record & Lessons Learned (2026-01-29)

## 1. Local Development Environment (Infrastructure)

### [DECISION] Nginx Local Port Strategy
- **Context**: Port 443 and sometimes Port 80 on Windows are frequently hijacked by system services (IIS, Skype, Antivirus) or browsers enforce HSTS caching that breaks local HTTP/HTTPS switching.
- **Decision**: Use **Port 8080** as the primary local entry point for Nginx.
- **Implementation**: Map `8080:80` in `docker-compose.yml`.
- **Benifit**: Avoids all privilege/hijack issues. Provides a clean, reliable entry point `http://localhost:8080`.

### [LESSON] Docker Volume & Next.js Cache
- **Issue**: Modifying code in `apps/web` sometimes doesn't reflect in the container despite bind mounts, often due to stale `.next` build cache or file locking.
- **Solution**: When in doubt, strictly clear cache: `docker exec txy_web sh -c "rm -rf .next/*"` then restart. simple restart is not always enough.

---

## 2. Design System (UI/UX)

### [DECISION] Global Layout Standardization
- **Context**: Fixed Navbar caused content overlap on inner pages (`/about`, `/services`, etc.). Manual `pt-20` or `py-12` fixes were inconsistent.
- **Decision**: Created `InnerPageWrapper` component.
- **Standard**:
  - Top Padding: `pt-32` (128px) to safely clear navbar.
  - Horizontal Padding: `px-6 md:px-12` + Global Container `padding: 2rem` in Tailwind.
  - Usage: All inner pages MUST wrap content in `<InnerPageWrapper>`.

### [LESSON] "Premium" Aesthetics
- **Grid Layouts**: Avoid placing text explicitly next to "nothing" (whitespace), which looks unbalanced. Use Cards/Containers with backgrounds to create visual weight.
- **Empty States**: Never use gray placeholder boxes. Use AI-generated illustrations (flat vector/Memphis style) to maintain emotional connection.

---

## 3. Production Deployment Strategy
- **Context**: Target Server (Aliyun ECS) has 2GB RAM.
- **Decision**: **External Build Strategy**.
  - **NEVER** run `npm install` or `npm run build` inside the production Docker container.
  - **Process**:
    1. Build locally (`npm run build` -> `.next/standalone`).
    2. Package artifacts (ZIP/Tar).
    3. Dockerfile uses `COPY` only (no build steps).

### 4. ECS Deployment Strategy (Dual Stack & Offline)

### 4.1 Deployment Architecture (Port 3000 Co-existence)
To minimize risk, we adopted a **Dual Stack** strategy:
-   **Legacy Site (PHP/MySQL)**: Remains on Port 80/443.
-   **New Site (Next.js)**: Deployed on Port 3000 (HTTPS).

**Challenge 1: Legacy Port Conflict**
-   **Issue**: Legacy container `txy2020-web-1` was binding `0.0.0.0:3000` despite not using it externally. This caused "Bind address already in use" errors for the new Nginx.
-   **Fix**: Modified legacy `docker-compose.prod.yml` to remove `3000:3000` mapping and restarted the legacy container. Created `scripts/deploy/release_legacy_port.sh` to automate this safety check.

**Challenge 2: SSL Protocol Error (HSTS)**
-   **Issue**: Browsers forced HTTPS on `tongxy.xyz`, but Port 3000 was initially configured as HTTP-only. Accessing `tongxy.xyz:3000` resulted in `ERR_SSL_PROTOCOL_ERROR`.
-   **Fix**: Configured New Nginx to listen on Port 443 (internally inside Docker) and mapped Host 3000 -> Container 443. Reused existing legacy certificates (`/etc/nginx/certs`) to support valid HTTPS.

### 4.2 Offline Deployment (Network Restrictions)
-   **Issue**: ECS server failed to pull Docker images from Docker Hub due to network timeouts (`i/o timeout`).
-   **Solution**: "Offline Mode"
    1.  **Local Pull**: Pull images (`node:20-slim`, `nginx:alpine`, etc.) on development machine.
    2.  **Save**: `docker save -o images_xxx.tar <image>`.
    3.  **Bundle**: Included `.tar` images in the deployment package.
    4.  **Load**: Updated deployment script to `docker load -i` images before starting containers.

### 4.3 Script Consolidation
All ad-hoc fixes have been consolidated into the standard deployment scripts:
-   `deploy_to_ecs.ps1`: Main entry point. Handles "Legacy Port Release" automatically.
-   `package_linux_artifacts.ps1`: Bundles offline images and correct SSL configs.
-   `docker-compose.prod.yml`: Pre-configured for SSL on Port 3000.

### [DISCOVERY] Legacy Environment (txy2020)
- **Source**: `scripts/deploy/complete_switchover.sh`
- **Finding**: The legacy system runs on containers named:
  - `txy2020-nginx-1`
  - `txy2020-web-1`
  - `txy2020-db-1`
- **Action**: Deployment scripts must explicitly stop these containers to release Port 80/443.
