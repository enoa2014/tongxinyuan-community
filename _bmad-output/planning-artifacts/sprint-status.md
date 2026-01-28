# Sprint Status Report

**Date**: 2026-01-28
**Sprint Goal**: 完成核心基础设施搭建、登录页重构及生产环境部署 (MVP Foundation)。

## 📊 Sprint Overview
*   **Status**: 🟢 ON TRACK (Sprint Completed)
*   **Focus**: Infrastructure, Auth UI, Deployment
*   **Completeness**: 100% of planned tasks.

## ✅ Completed Items
1.  **Infrastructure**:
    *   Docker Compose Environment (Local & Prod).
    *   Aliyun ECS Setup (Swap, Docker, Security Group).
    *   **Host Mode Networking** implementation.
    *   **SSL/HTTPS** via Let's Encrypt/Aliyun Free Cert.

2.  **Frontend (Web)**:
    *   **Login Page Redesign**: Medical Trust System (Shadcn + Tailwind).
    *   **Architecture**: Dual-Mode Layout (Public vs Dashboard).
    *   **Landing Page**: Basic UI structure implementation.

3.  **DevOps**:
    *   **External Build Strategy**: Solved Windows->Linux cross-compilation.
    *   **CI/CD Scripts**: `package_linux_artifacts.ps1`.

## 🚧 In Progress / Next Up
1.  **Backend Logic (Auth)**:
    *   Connecting Login UI to NextAuth.js actual logic.
    *   Database persistence for Users.

2.  **Dashboard Features**:
    *   Implementing the actual "Social Worker Workbench".

## ⚠️ Risks & Issues
*   **ECS Memory**: 2GB is tight. `node_modules` installation on server is strictly forbidden. Must stick to "External Build".
*   **Port 80**: OS-level blocking requires persistent `iptables` rules.

## 📝 Decision Log
*   **2026-01-28**: Switch to Docker **Host Network Mode** to resolve inter-container communication issues on Alibaba Cloud ECS.
*   **2026-01-28**: Use **iptables NAT** to forward port 80 to 8080.
