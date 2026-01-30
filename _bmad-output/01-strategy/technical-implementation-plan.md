# 技术实施计划 v2: PocketBase 架构

> **状态**: 此文档为最新的技术执行标准，取代旧版 MemFire 方案。
> **核心约束**: 中国大陆部署 + 数据完全私有化 + 轻量级服务器资源 (2GB RAM)。

## 1. 架构概览

### 1.1 技术栈 (The "Indie Stack")
| 组件 | 选型 | 理由 |
| :--- | :--- | :--- |
| **前端框架** | **Next.js 14+ (App Router)** | SEO 友好，利于公益传播；React 生态丰富。 |
| **样式库** | **Tailwind CSS** + `shadcn/ui` | 快速开发，移动端适配能力强。 |
| **后端/DB** | **PocketBase** | 基于 Go + SQLite 的超轻量级后端。单一二进制文件，含 Auth, DB, Realtime, Dashboard。 |
| **部署托管** | **ECS 自托管** | 前后端均部署在同一台 ECS 上，数据不离境，不依懒第三方云服务。 |
| **认证** | PocketBase Auth | 内置 Email/Password 认证，支持 OAuth2。 |
| **对象存储** | 本地文件系统 | PocketBase 自动管理 `pb_data/storage`，支持图片缩放。 |

### 1.2 关键合规与隐私设计
*   **资金流**: 系统 **绝不** 触碰资金流 (与 Phase 1 保持一致)。
*   **数据隐私**:
    *   所有数据存储在 ECS 本地磁盘 (`pb_data/data.db`)。
    *   使用 PocketBase 的 **API Rules** 实现行级安全控制 (RLS)。
    *   受助家庭敏感数据 (身份证、病历) 设置 `View Rule: @request.auth.role = 'admin'`。

### 1.3 身份路由策略 (使用中间件)
*   **Middleware (中间件)**: 拦截 `/login` 请求，校验 PB Cookie。
*   **Logic**:
    *   Role == `admin` -> Redirect to `/admin` (PB Dashboard 或 自建后台).
    *   Role == `volunteer` -> Redirect to `/volunteer`.
    *   Role == `family` -> Redirect to `/family`.

## 2. 数据库设计 (PocketBase Collections)

### 2.1 核心集合 (Collections)
*   **`users`** (系统预置):
    *   `name`, `avatar`, `email`
    *   `role`: 'admin' | 'volunteer' | 'family' | 'donor' (Select 字段)
    *   `phone`: 联系电话
*   **`service_locations` (服务网点)**:
    *   `name` (Text)
    *   `address` (Text)
    *   `geo_location` (Text/JSON)
    *   `status`: 'active' | 'closed'
*   **`articles` (内容管理)**:
    *   `title` (Text)
    *   `content` (Editor/HTML)
    *   `cover_image` (File)
    *   `category`: 'news' | 'story' (Select)
*   **`volunteer_applications` (志愿者申请)**:
    *   `applicant` (Relation -> users)
    *   `skills` (JSON/Tags)
    *   `status`: 'pending' | 'approved' | 'rejected'

## 3. 分阶段实施细节

### Phase 2a: 后端基础 (Current Focus)
1.  **环境准备**:
    *   Windows: 下载 `pocketbase_0.22.x_windows_amd64.zip`。
    *   启动: `./pocketbase serve` (默认端口 8090)。
2.  **Schema 初始化**:
    *   手动在 `http://127.0.0.1:8090/_/` 创建 Collections。
    *   或者编写 `pb_migrations` 脚本 (推荐手动 MVP)。
3.  **前端集成**:
    *   `npm install pocketbase`。
    *   封装 `lib/pocketbase.ts` 单例客户端。

### Phase 2b: 业务功能对接
1.  **Web 注册/登录**:
    *   实现 `/login` 和 `/register` 页面，调用 `pb.collection('users').authWithPassword()`.
2.  **志愿者报名**:
    *   对接 `/get-involved` 表单 -> `pb.collection('volunteer_applications').create()`.
3.  **服务咨询**:
    *   对接 Dialog 表单 -> 存入数据库。

## 4. 部署方案
*   **Artifact**: 一个 Next.js standalone 文件夹 + 一个 PocketBase.exe。
*   **进程管理**: 使用 Docker Compose 编排两个容器，或者在 ECS 上使用 PM2/Systemd 管理。
    *   **推荐**: 纯 Docker Compose (App + PocketBase)。
    *   **Volume**: 挂载 `./pb_data` 到宿主机，确保持久化。

## 5. 风险控制
*   **备份**: 定期 Rsync 备份 `pb_data` 目录到异地/OSS。
*   **性能**: SQLite 在高并发写入时可能锁表 (对于公益项目 <1000 QPS 几乎不可能触发)。
