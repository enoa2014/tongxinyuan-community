# Epics & User Stories (Phase 1 Development)

根据架构设计和产品简报，我们将一期开发划分为 6 个史诗 (Epics)。

## Epic 1: 基础设施与地基 (Foundation & Ops)
**目标**: 搭建 Docker 环境，跑通 Next.js + Python 双后端，确保 CI/CD 流程就绪。
*   **Story 1.1**: 搭建 Docker Compose 本地开发环境 (Next.js + FastAPI + PG + Redis)。
*   **Story 1.2**: 初始化 PostgreSQL 数据库及 pgvector 扩展，配置自动备份脚本。
*   **Story 1.3**: 配置 Shadcn/UI 组件库及 Tailwind Design System (配色/字体/圆角)。

## Epic 2: 用户中心与权限 (Identity & Access)
**目标**: 实现安全的身份验证系统，区分家庭、志愿者和管理员。
*   **Story 2.1**: 实现 NextAuth 登录（支持手机号/微信）。
*   **Story 2.2**: 设计 RBAC 权限模型（Admin, Volunteer, Family）。
*   **Story 2.3**: 用户个人资料页 (Profile) 及实名认证流程。

## Epic 3: 社工智能工作台 (Social Worker Intelligent Ops)
**目标**: 通过 AI 赋能，极大提升社工效率。
*   **Story 3.1 [AI]**: 活动策划生成器 - 输入主题，调用 LLM 生成活动 SOP JSON。
*   **Story 3.2**: 活动发布管理 - 将 JSON 渲染为活动页面，支持社工手动微调。
*   **Story 3.3 [AI]**: 政策哨兵后端 - Python 爬虫定抓取民政官网，存入向量库。

## Epic 4: 家庭服务核心 (Family Service Core)
**目标**: 解决家庭最紧迫的“住”和“吃”的问题。
*   **Story 4.1**: 线上入住申请流程（替代纸质表及发微信）。
*   **Story 4.2**: 共享厨房预约系统（日历视图 + 时段选择）。
*   **Story 4.3**: "My Home" 家庭端主页（查看申请状态、预约记录）。

## Epic 5: 志愿者管理 (Volunteer Management)
**目标**: 规范化志愿者招募与服务记录。
*   **Story 5.1**: 志愿者活动报名大厅。
*   **Story 5.2**: 服务签到打卡（二维码方案）。
*   **Story 5.3**: 志愿服务时长统计与证书展示。

## Epic 6: 公众传播与筹款 (Public & Donation)
**目标**: 吸引外部支持，沉淀私域流量。
*   **Story 6.1**: 机构对外官网首页（动态/故事库）。
*   **Story 6.2**: 捐赠落地页（集成支付二维码或第三方链接）。

---

## 优先级建议 (Priority Recommendation)
建议 **Sprint 1 (前两周)** 聚焦于 **Epic 1 (基建)** 和 **Epic 3 (智能工作台)**。
*   理由：基建是根本；优先做出 AI 活动策划功能，能最快让一线社工感受到“AI 提效”的震撼，争取内部支持。
