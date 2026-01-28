# Tongxinyuan (同心源) Project Context

> **Last Updated**: 2026-01-27
> **Status**: Legacy Site Deployed (ECS), New Site Planning Completed
> **Tech Stack**: 
> - **Legacy**: PHP 7.4 + MySQL (Dockerized on ECS)
> - **New**: Next.js + MemFire Cloud (China)

## 4. Project Map & Deployment Reference (2026 Update)

### 4.1 Locations (Code & Server)

| Component | Local Path (Windows) | Remote Path (ECS) | Description |
|---|---|---|---|
| **Legacy Site** | `res\txy2020` | `/opt/txy2020` | Old PHP Grace website (Archive/Reference) |
| **New Site** | `tongxinyuan-community` | `/opt/tongxinyuan` | New Next.js Community Platform |
| **Deployment Scripts** | Root (`ws\2026\tongxy`) | `/tmp/` (during execution) | Automation scripts (`.ps1`, `.sh`) |

### 4.2 Port Mappings

| Environment | Legacy Site (PHP) | New Site (Next.js) | Notes |
|---|---|---|---|
| **Local Dev** | `http://localhost:8000` | `http://localhost:3000` | Modified legacy to 8000 to avoid conflict |
| **ECS Prod** | `https://tongxy.xyz` (443) | `https://tongxy.xyz:3000` | Nginx handles SSL for both (Legacy on 443, Proxy 3000->3001) |

### 4.3 Deployment Cheat Sheet

*   **Deploying Updates (New or Legacy)**
    *   **PowerShell**: `.\deploy_dual.ps1 -ServerIP ecs`
    *   **Effect**: Updates configs, restarts containers, ensures both sites are running.

*   **Local Development**
    *   **Legacy**: `cd res/txy2020; docker-compose up -d`
    *   **New**: `cd tongxinyuan-community; npm run dev`

## 1. Core Strategic Shift (2025 -> 2026)
- **From**: "Platform Reliance" (Dependent on Public Foundations, high risk).
- **To**: "Self-Growth" (Independent fundraising, Community Support Center model).
- **Key Driver**: Compliance with new Charity Law ("Penetrating Management") and need for sustainable funding.

## 2. Product Vision: Community Support Center
A digital + physical platform serving:
1.  **Families**: Accommodation, Respite Services, Life Education, Policy Aid.
2.  **Volunteers**: Structured growth (Level 1-3), standardized ops.
3.  **Public/Donors**: Transparent impact data, easy access to public events.

## 3. Critical Requirements (The "Must Haves")
- **China Accessible**: NO VPN required. Must use domestic cloud (MemFire, Tencent/Aliyun).
- **Multi-Platform Sync**: Web (PC/Mobile) + WeChat Mini Program must share ONE database.
- **Operations First**: Focus on solving "Social Worker Efficiency" (no more manual Excel).
- **Data Sovereignty**: Ops data (Service Logs, Resources) must be digital and auditable.

## 4. Feature Roadmap (MVP)
- **Ops Console**: Family Mgmt, Event Scheduling, Data Dashboard.
- **Volunteer App**: Sign-up, QR Check-in, Service Logs.
- **Family App**: Service Requests, **Policy Assistant**, **Kitchen Booking**.
- **Public Gateway**: SEO-friendly Official Site, Simplified Event Registration (Guest Mode).

## 5. Key Documentation
- **Product Brief**: `_bmad-output/planning-artifacts/product-brief-tongxy-2026-01-27.md` (Detailed specs)
- **Tech Plan**: `_bmad-output/planning-artifacts/implementation-plan-tongxy-2026-01-27.md` (Architecture)
- **Research**: `findings.md` (Analysis of original PPT/PDF)
