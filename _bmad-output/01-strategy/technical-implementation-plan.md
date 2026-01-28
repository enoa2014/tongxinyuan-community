# 技术实施计划：同心源社区支持中心 (Technical Implementation Plan)

> **状态**: 此文档为最新的技术执行标准，取代旧版 `implementation_plan.md`。
> **核心约束**: 中国大陆部署 (Webify/OSS) + MemFire Cloud 后端 + 严格的慈善法合规。

## 1. 架构概览 (Architecture)

### 1.1 技术栈 (The "China-Stack")
| 组件 | 选型 | 理由 |
| :--- | :--- | :--- |
| **前端框架** | **Next.js 14+ (App Router)** | SEO 友好，利于公益传播；React 生态丰富。 |
| **样式库** | **Tailwind CSS** + `shadcn/ui` | 快速开发，移动端适配能力强。 |
| **后端/DB** | **MemFire Cloud** | Supabase 的国内替代品 (PostgreSQL + Auth + Storage)，无墙，速度快。 |
| **部署托管** | **腾讯云 Webify** / 阿里云 OSS | 静态资源托管，配合 CDN 加速。 |
| **认证** | MemFire Auth (微信登录) | 符合国内用户习惯 (Phase 2 实现)。 |
| **移动端** | **PWA + Taro (小程序)** | Phase 1 使用 PWA 覆盖移动端；Phase 2 开发 Taro 小程序以调用摄像头/LBS能力。 |
| **响应式** | **Mobile-First RWD** | 必须覆盖: Mobile (<640px), Tablet (768px+), Laptop (1024px+), Desktop (1280px+). |

### 1.2 关键合规设计 (Compliance by Design)
*   **资金流**: 系统 **绝不** 触碰资金流。
    *   ❌ 禁止：集成微信支付/支付宝 SDK 进行自建收款。
    *   ❌ 禁止：在数据库存储用户银行卡号。
    *   ✅ 允许：仅存储“跳转事件”日志 (点击了哪个公益项目的捐赠按钮)。
*   **数据隐私**:
    *   所有受助家庭的敏感数据 (身份证、病历) 必须存储在 RLS (Row Level Security) 保护的表中，仅授权社工可读。

### 1.3 身份路由策略 (Identity Routing)
> **One Login, Many Worlds**
*   **Middleware (中间件)**: 在 `Next.js Middleware` 层拦截 `/login` 请求。
*   **Logic**:
    *   Role == `admin/worker` -> Redirect to `/admin` (Workstation).
    *   Role == `volunteer` -> Redirect to `/volunteer` (Tasks).
    *   Role == `family` -> Redirect to `/family` (Services).
    *   No Role -> Redirect to `/onboarding`.

## 2. 数据库设计 (Schema - MemFire/PostgreSQL)

### 2.1 核心表结构
*   **`profiles`**: 用户档案 (One user, one profile)。
    *   `role`: 'admin' | 'volunteer' | 'family' | 'donor'
*   **`service_locations` (服务网点)**: Phase 1 核心。
    *   `name`: 网点名称 (万秀小家)
    *   `address`: 详细地址
    *   `geo_location`: 经纬度
    *   `contact_phone`: 公开联系电话
    *   `features`: 标签 (['厨房', '住宿'])
    *   `status`: 'active' | 'closed'
*   **`articles` (内容管理)**:
    *   `title`, `content`, `cover_image`
    *   `category`: 'news' | 'story' | 'report' | 'policy'
    *   `published_at`: 发布时间 (用于迁移旧版数据)

### 2.2 迁移策略 (Legacy Data)
*   **表 `txy_articles` -> `articles`**:
    *   编写 SQL 脚本，清洗 HTML 内容 (去除旧的各种 style 标签)。
    *   提取旧文章中的图片链接，下载并上传到 MemFire Storage，替换 URL。

## 3. 分阶段实施细节

### Phase 1: 公众门户 (Web Only)
> **重点**: 静态化为主，CMS 为辅。
1.  **初始化**: `npx create-next-app`。
2.  **组件开发**: 
    *   `DonationGuideCard` (包含跳转逻辑)。
    *   `LocationMap` (使用百度/高德地图 SDK)。
    *   `VolunteerLevelCards` (展示 L1-L3)。
3.  **API 对接**:
    *   读取 `service_locations` 表渲染网点页。
    *   读取 `articles` 表渲染故事墙。

### Phase 2: 用户系统 (Web + Mobile)
> **重点**: 权限控制。
1.  **Auth 集成**: 配置 MemFire 微信登录回调。
2.  **家庭端**: `ApplicationForm` (建档表单)，文件上传组件。
3.  **后台**: 基于 Ant Design Pro 或 shadcn/ui 的管理面板。

## 4. 部署流水线 (CI/CD)
*   **本地**: `npm run build` -> 生成 `.next/out` (Static Export)。
*   **发布**: 使用 `cloudbase` CLI 将静态文件推送到腾讯云 Webify。

## 5. 风险控制
*   **图片审核**: 用户上传的图片 (头像/证明材料) 需对接阿里云/腾讯云的内容安全检测 API。
*   **备份**: 开启 MemFire 的每日自动备份 (PITR)。
