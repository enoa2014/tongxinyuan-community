# 同心源数字化平台 - 项目文档索引 (Project Index)

> **Last Updated**: 2026-02-01
> **Status**: Phase 1 (Complete) / Phase 5 (In Progress)

本文档是“同心源关爱计划”数字化转型项目的核心导航索引。

## 📂 01-Strategy (战略与规划)
项目的核心愿景、路线图和产品定义。

- **[roadmap.md](./01-strategy/roadmap.md)**: 实施路线图 (Track A/B 并行策略)。
- **[product-brief.md](./01-strategy/product-brief.md)**: 产品简报与核心价值定义。
- **[product-design.md](./01-strategy/product-design.md)**: 统一产品设计文档 (功能、角色、UX)。
- **[sprint-status.md](./01-strategy/sprint-status.md)**: 当前冲刺状态 (Tasks & Risks)。

## 📂 02-Analysis (分析与研究)
对现有资产、文档和需求的深入分析。

- **[findings.md](../findings.md)**: **(Root)** 关键技术发现与决策记录 (e.g., 环境修复, 代理冲突)。
- **[requirements.md](./02-analysis/requirements.md)**: 详细功能需求列表。
- **[legacy-analysis.md](./02-analysis/legacy-analysis.md)**: 旧版系统分析 (PHP/MySQL)。

## 📂 03-Design (设计与架构)
技术架构、数据库设计与 UI/UX 规范。

- **[design-system.md](./03-design/design-system.md)**: UI 设计系统 (Colors, Typography, Components)。
- **[architecture.md](./03-design/architecture.md)**: 系统架构图 (Next.js + PocketBase + Docker)。
- **[database-schema.md](./03-design/database-schema.md)**: 数据库模型设计 (Services, News, Users)。
- **[wireframes.md](./03-design/wireframes.md)**: 低保真原型图。

## 📂 04-Implementation (实施与开发)
功能开发计划与实施记录。

### Feature: Family Genogram (家庭基因图谱)
- **[01_task_plan.md](../04-implementation/feature-genogram/01_task_plan.md)**: 基因图谱功能开发计划。
- **[02_findings.md](../04-implementation/feature-genogram/02_findings.md)**: 技术发现 (Zod验证, React控制组件)。
- **[03_walkthrough.md](../04-implementation/feature-genogram/03_walkthrough.md)**: 功能演示与验证报告。
- **[04_progress_log.md](../04-implementation/feature-genogram/04_progress_log.md)**: 开发进度日志。

## 📂 04-Process (流程与规范)
开发流程、部署指南与最佳实践。

- **[deploy_guide_ecs.md](../deploy_guide_ecs.md)**: **(Root)** 阿里云 ECS 部署指南。
- **[development-guide.md](./04-process/development-guide.md)**: 本地开发环境配置指南 (含 Windows 避坑)。

## 📂 99-Archive (归档)
历史文档与不再使用的计划。

- **[implementation_plan.md](../implementation_plan.md)**: 早期实施计划 (Phase 1)。
- **[implementation_plan_reorder.md](../implementation_plan_reorder.md)**: 服务排序功能专项计划。

---

## 🚀 快速链接 (Quick Links)

- **当前任务**: [task_plan.md](../task_plan.md)
- **进度日志**: [progress.md](../progress.md)
- **本地服务**: [http://localhost:3000](http://localhost:3000) (Web), [http://localhost:8090/_/](http://localhost:8090/_/) (Admin)
