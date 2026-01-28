# 同心源项目开发流程规范 (Development Process)

> **原则**: 文档先行，设计确认，再写代码。 (Design First, Code Later)

## 1. 核心工作流 (Core Workflow)

### 1️⃣ 概念/需求阶段 (Concept & Requirements)
*   **输入**: 用户需求草稿、政策文件、旧版分析。
*   **产出**: 
    *   `product-design.md`: 需求规格说明书 (PRD)，包含用户画像、核心功能、合规要求。
    *   `roadmap.md`: 实施路线图。
*   **动作**: 只有当需求文档被用户 **批准 (Approved)** 后，才进入下一阶段。

### 2️⃣ 设计阶段 (Design & UX)
*   **输入**: 已批准的 PRD。
*   **产出**:
    *   `new-site-ux-sitemap.md`: 网站地图、用户交互流程图 (User Flows)。
    *   `wireframes.md`: 关键页面线框图。
    *   `design-system.md`: 视觉规范 (UI Kit)。
*   **动作**: 与用户确认交互细节，确保“所见即所得”的预期一致。

### 3️⃣ 规划阶段 (Technical Planning)
*   **输入**: 设计稿。
*   **产出**:
    *   `implementation-plan.md`: 技术实施计划 (API 设计、数据库 Schema)。
    *   `task.md`: 细粒度的开发任务拆解。
*   **动作**: 评估技术可行性，规避风险（如国内网络环境限制）。

### 4️⃣ 开发阶段 (Implementation)
*   **输入**: 拆解的任务清单。
*   **产出**: 代码提交 (Commits)。
*   **策略**: 
    *   **Phase 1 (Public)**: 优先开发无登录墙的公开页面 (Home, Services, About)。
    *   **Phase 2 (Private)**: 后续开发涉及 Auth、数据库写的后台功能。

### 5️⃣ 验证与交付 (Verification)
*   **输入**: 运行中的应用。
*   **产出**: 
    *   `walkthrough.md`: 演示录屏/截图。
    *   部署上线 (Deploy to ECS)。

---

## 2. 文档维护规范
*   **单一来源 (Single Source of Truth)**: `documentation_index.md` 是所有文档的入口。
*   **及时更新**: 代码变更引发的需求变更，必须同步回 `product-design.md`。
*   **双语要求**: 所有交付给用户的文档必须使用 **中文**。

## 3. 合规性红线 (Compliance)
*   **募捐红线**: 严禁在官网直接放置收款码或银行账号（除非取得公募资格）。
*   **数据红线**: 严禁在代码库中硬编码敏感信息 (API Keys, Passwords)。
