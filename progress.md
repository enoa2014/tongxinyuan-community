# 项目进展日志 (Session Progress Log)

## 阶段: 2026 新官网部署 (Phase 1 Preview)
**日期**: 2026-01-28
**状态**: ✅ Completed

### 关键成就
- **部署成功**: Next.js 网站已成功容器化并运行在本地端口 3000。
- **配置优化**: 确认并应用了 `output: 'standalone'` 和 `docker-compose` 配置。
- **预览就绪**: 此时可以通过 localhost 预览新网站开发进度。



## Session Update: Dynamic Services & Admin Portal V1
**Date:** 2026-01-30
**Status:** ✅ Making Progress (Phase 1.5 & 5)

### 1. Achievements
- **Dynamic Content (Phase 1.5)**:
    - Successfully synced `Services` page with PocketBase.
    - Resolved 403 Forbidden permissions for guest access.
    - Fixed Guest Fetch 400 Error by removing incompatible `sort` parameter.
- **Admin Portal (Phase 5)**:
    - Implemented secure `AdminLayout` with client-side auth redirection.
    - Connected `AdminDashboard` to real PocketBase stats (Volunteers, Services, News).
    - Added "Service Management" list view for admins.

### 2. Technical Learnings
- **PocketBase v0.23+ Schema**: Creating collections via API now requires `fields` property, not `schema`. The `schema` property is ignored, resulting in empty collections.
- **Guest API Limitations**: Unauthenticated (Guest) users cannot use the `sort: 'created'` parameter on the `services` collection.
- **Docker CLI Bypass**: When browser automation fails (network/env issues), use `docker exec txy_pocketbase pocketbase superuser create ...` to generate temp credentials for API scripts. This is more robust than debugging local proxies.
- **[Bug Fix] PocketBase v0.23+ Auth**: The admin login failed with 400 because v0.23+ replaced `pb.admins` with `pb.collection('_superusers')`. Fixed by updating the SDK call.
- **[Bug Fix] Tiptap Hydration**: Tiptap caused a "Hydration Mismatch" error in Next.js. Fixed by setting `immediatelyRender: false` in `useEditor`.
- **[Env] Browser Tool Proxy**: `HTTP_PROXY` env vars caused 502 errors for the browser tool. Fixed by clearing them. Automated tools are now fully operational.

### 3. Next Steps
- Refine Admin Portal (Edit/Delete functionality).
- Begin Phase 2: User Login & Volunteer Workflow.

---

## 阶段: 2025/2026 同心源文档分析与规划
**日期**: 2026-01-27

## Session Update: Legacy Site Dockerization Completed
**Date:** 2026-01-28
**Status:** ✅ Completed

### 1. Achievements
- **Containerization**: Successfully containerized the legacy PHP 7.4 / MySQL 5.7 website (`txy2020`).
- **Data Recovery**: Restored full database from SQL dump and synchronized missing image assets (`statics/images`) from provided archive.
- **Artifacts**: Created `Dockerfile`, `docker-compose.yml` (production-ready), and `deploy_guide_ecs.md`.
- **Packaging**: Delivered `txy2020_deploy.zip` for one-click deployment.

### 2. Technical Troubleshooting (Lessons Learned)
- **Double Encoding (Mojibake)**:
    - *Issue*: Chinese characters appeared as `èŠ±...`.
    - *Cause*: PHP connected with UTF-8, but MySQL 5.7 handshake defaulted to Latin1, causing double-encoding on insert (simulated during import).
    - *Fix*: Forced MySQL server & handshake to `utf8mb4` via `docker-compose` command (`--skip-character-set-client-handshake`).
- **WeChat Anti-Hotlinking**:
    - *Issue*: Images from WeChat Official Account returned 403 Forbidden.
    - *Fix*: Added `<meta name="referrer" content="no-referrer" />` to `header.php`.
- **Missing Assets**:
    - *Issue*: Local `statics/images` directory was empty.
    - *Fix*: Extracted `images.tar.gz` provided by user and mounted volume (`./:/var/www/html`) for hot-reload.
- **PowerShell Syntax (CRITICAL)**:
    - *Issue*: Repeatedly used `&&` to chain commands (e.g., `cmd1 && cmd2`), which fails in PowerShell.
    - *Rule*: **NEVER** use `&&`. Use `;` for chaining, or preferably, use separate `run_command` tool calls for each step to ensure atomic execution and better error handling.

### 3. Deployment Success (v2: with SSL)
- **Challenge**: User requested HTTPS on port 443 with existing certificates.
- **Solution**:
    - Added **Nginx Reverse Proxy** (`nginx:alpine`) to handle SSL termination.
    - Configured automatic HTTP -> HTTPS redirection.
    - Updated deployment pipeline to include `nginx.tar` and certificate files.
- **Result**: Site running on `https://tongxy.xyz` (via ECS IP). Verified Nginx proxying correctly.

### 4. Next Steps
- **New Site Phase 1**: Resume development of the new Next.js portal.
- **Cleanup**: Monitor ECS disk usage.

---

### 已完成事项 (Completed Actions)
- [x] 识别资源文件: `2025同心源工作汇报及2026展望.pptx` 和 `同心源关爱异地求医大病儿童家庭社区支持中心.pdf`。
- [x] 编写并执行 Python 脚本 `extract_pptx_full.py` 提取 PPTX 文本。
- [x] 使用 `baoyu-danger-gemini-web` 技能分析提取的内容。
- [x] 确立对项目战略转型的结构化理解（从“平台依赖”转向“自主生长”）。
- [x] 初始化 Planning-with-Files 结构 (`task_plan.md`, `findings.md`)。
- [x] **产品简报 (Product Brief)**: 使用 BMAD 方法协作定义 2026 平台愿景。
    - 定义“社区支持中心”模式（对比原来的“小家”模式）。
    - 定义 MVP 范围：运营控制台、志愿者端、家庭端。
    - 增加用户请求的功能：**政策助手** 和 **共享厨房**。
- [x] **实施计划 (Implementation Plan)**:
    -以此草拟 Next.js + Supabase 初始计划。
    - 针对中国环境优化（“中国特供版”）：将 Supabase 替换为 **MemFire Cloud**，Vercel 替换为 **腾讯云/阿里云**。
    - 将计划翻译为中文。
- [x] **设计与架构重构 (Design & Architecture REFACTOR, 2026-01-28)**:
    - **统一产品设计**: 创建 `product-design.md`，将分散的需求合并为一个文档。增加了“社工”和“管理者”角色。
    - **战略路线图**: 创建 `roadmap.md`，确立“先做对外门户 (Phase 1)，后做内部系统 (Phase 2)”的策略，以降低初始复杂度。
    - **原型设计**: 创建 `wireframes.md` 和 `review-packet-phase1.md` 供利益相关者评审。
    - **开发 (Phase 1)**: 使用 Next.js 实现了 首页、服务页 和 参与页。

### 关键发现 (Key Discoveries)
- PDF/PPT 内容高度重叠；PPT 包含了战略转型的完整叙述。
- 2026 计划非常具体地指出了“社区支持中心”模式，这是对之前“小家”模式的重大升级。
- 新《慈善法》的合规要求是这些变化的主要驱动力。
- **约束条件**: 国内访问（无 VPN）是硬性要求，必须使用国内云厂商。
- **UX 洞察**: “登录墙”阻碍了品牌传播和筹款的初始目标。Phase 1 必须是开放访问的。

### 4. Session Update: Admin News Image Upload
**Date:** 2026-01-30
**Status:** ✅ Completed

#### 1. Achievements
- **Image Upload Feature**: Implemented direct image upload in Tiptap Rich Text Editor.
    - Integrated with PocketBase `media` collection.
    - Configured admin-only upload security.
    - Added UI for file selection and instant preview.
- **Proxy Optimization**: Optimized Next.js API Proxy to handle large file uploads correctly.

#### 2. Technical Learnings
- **Next.js Proxy & Multipart**: The Next.js API proxy (`fetch`) forwards the `content-length` header from the client request. However, when the body is read and re-streamed, the length might slightly vary (or chunking issues occur), causing upstream 400 errors. **Fix**: Delete `content-length` header in the proxy and let `fetch` calculate it.
- **PocketBase Schema Flattener**: In v0.23+, field options (like `mimeTypes`, `maxSize`) must be **flattened** into the field object, not nested property `options: {}`. Nested options result in null constraints.

### 下一步 (Next Steps)
- **立即执行**: 与利益相关者评审 `review-packet-phase1.md`。
- **随后**: 根据批准的线框图制作高保真视觉稿。
- **稍后**: 在对外门户发布后，恢复 Phase 2（登录/后台）的开发。
