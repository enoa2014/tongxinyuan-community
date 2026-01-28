# Tongxinyuan (同心源) Project (2026)

This repository contains the source code, documentation, and deployment scripts for the new Tongxinyuan Community Platform and the legacy website archive.

## 📂 Directory Structure

### `tongxinyuan-community/` (The New Platform)
*   **Stack**: Next.js, MemFire Cloud, Python AI Agent.
*   **Port**: `3000` (Local/ECS Prod).

### `res/txy2020/` (The Legacy Archive)
*   **Stack**: PHP 7.4, MySQL 5.7 (Dockerized).
*   **Port**: `8000` (Local), `443/80` (ECS Prod).
*   **Note**: Kept for historical data and reference.

### `scripts/`
*   **`deploy/`**: Automation scripts for ECS deployment.
    *   `deploy_dual.ps1`: **[Recommended]** Main script to deploy both sites to ECS.
*   **`tools/`**: Python utilities for data extraction (PPTX/PDF).

## 📄 Key Documentation (In Root)
*   `project-context.md`: **[Core]** Master index of project status, tech stack, and locations.
*   `task_plan.md`: Original execution plan and roadmap.
*   `progress.md`: Detailed development log and troubleshoot history.
*   `findings.md`: Analysis of original PPTX/PDF requirements.

### `archive/`
*   Intermediate analysis results and temporary files.

## 🛠 Deployment Quick Start

**To deploy updates to ECS:**
```powershell
.\scripts\deploy\deploy_dual.ps1 -ServerIP <ECS_IP>
```

**To run locally:**
```bash
# Legacy Site
cd res/txy2020
docker-compose up -d  # Access at http://localhost:8000

# New Site
cd tongxinyuan-community
npm run dev           # Access at http://localhost:3000
```
