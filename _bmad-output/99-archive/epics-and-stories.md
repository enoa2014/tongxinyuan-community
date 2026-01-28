# Epics & User Stories (Phase 1 Development - Finalized)

根据最终确认的 MVP 范围（含 Taro 小程序、ECS 资源限制），重新梳理的一期开发任务。

## Epic 1: 基础设施与地基 (Foundation & Ops)
**目标**: 搭建 Docker 环境，跑通 Next.js + Python 双后端，确保 CI/CD 流程就绪。
*   **Story 1.1**: [Done] 搭建 Docker Compose 本地开发环境 (Next.js + FastAPI + Postgres + Redis)。
*   **Story 1.2**: [Done] 配置 ECS 生产环境（Swap 分区、Docker External Build Strategy）、域名解析及 SSL 证书配置 (Nginx Host Mode + IPTables)。
*   **Story 1.3**: [Done] 初始化 Monorepo 结构（包含 `apps/web`，预留 `apps/miniprogram` 目录）。

## Epic 2: 用户中心与权限 (Identity & Access)
**目标**: 实现安全的身份验证系统，优先支持 Web 端。
*   **Story 2.1**: [In Progress] 数据库建模 (User, Profile) 及 pgvector 初始化。
*   **Story 2.2**: [In Progress] [Web] 实现 NextAuth 登录 UI 与路由架构 (Login Page & Dual-Mode Layout Completed)。
*   **Story 2.3**: [Phase 2] 实现微信小程序登录接口 (code2session) 并颁发 JWT。
*   **Story 2.4**: [Phase 2] 实现小程序端的“微信一键登录”及 Token 存储。

## Epic 3: AI 社工工作台 (Social Worker Intelligent Ops)
**目标**: 通过 AI 赋能，提升社工效率 (SOP + 政策)。
*   **Story 3.1**: [Python] 搭建 LangChain/LLM 基础调用服务 (通义千问 API)。
*   **Story 3.2**: [Web/AI] 活动策划生成器 - 输入主题，生成 SOP JSON 并存储。
*   **Story 3.3**: [Web] 活动发布页 - 渲染 SOP JSON，允许社工修改并发布。
*   **Story 3.4**: [Python] 政策哨兵爬虫 (MVP: 仅爬取指定的 2 个官网并存库)。

## Epic 4: 自住/志愿者核心业务 (Core Business)
**目标**: 解决最紧迫的入住、物资与服务记录（优先适配手机网页版）。
*   **Story 4.1**: [Web-Mobile] 家庭入住申请表单与审批流。
*   **Story 4.2**: [Web-Mobile] 共享厨房预约功能。
*   **Story 4.3**: [Web-Mobile] 志愿者活动报名列表。
*   **Story 4.4**: [Phase 2] 志愿者活动现场扫码签到（小程序版）。

## Epic 5: 移动驾驶舱与内容 (Mobile Ops & Content)
**目标**: 即使在手机上，社工也能干活（通过手机浏览器）。
*   **Story 5.1**: [Web-Mobile] 社工端：活动现场拍照上传（Web版上传组件）。
*   **Story 5.2**: [In Progress] [Web] 官网主页与动态展示 (Landing Page UI Implemented)。
*   **Story 5.3**: [Web] 捐赠落地页（静态收款码/外链）。

---

## 🚫 Out of Scope (已移至 Phase 2)
*   **微信小程序客户端 (Taro)**
*   智能传播 (Photo-to-Video)
*   AI 情感化感谢信
*   AI 积分激励系统
