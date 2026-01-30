# 任务计划: 同心源文档分析与 2026 规划准备
<!-- 
  WHAT: 这是整个任务的路线图。可以看作是“磁盘上的工作记忆”。
  WHY: 经过多次工具调用后，最初的目标容易被遗忘。此文件保持目标的清晰。
  WHEN: 首先创建此文件，然后在开始任何工作之前。每个阶段完成后更新。
-->

## 目标 (Goal)
<!-- 
  WHAT: 用一句话清晰描述你要实现的目标。
  WHY: 这是你的北极星。重读它让你专注于最终状态。
-->
分析“同心源”2025/2026 文档，提取关于新“社区支持中心”模式的关键见解，并为项目实施准备结构化知识。

## 当前阶段 (Current Phase)
<!-- 
  WHAT: 你当前正在进行的阶段（例如，“Phase 1”，“Phase 3”）。
  WHY: 快速参考你在任务中的位置。随着进度更新此项。
-->
Phase 3: 网站规划与设计 (Website Planning & Design)

## 阶段 (Phases)
<!-- 
  WHAT: 将任务分解为 3-7 个逻辑阶段。每个阶段都应该是可完成的。
  WHY: 将工作分解为阶段可以防止不知所措，并使进度可见。
  WHEN: 完成每个阶段后更新状态：pending → in_progress → complete
-->

### Phase 1: 内容提取与初步分析
<!-- 
  WHAT: 从 PPTX/PDF 中提取文本并总结关键点。
  WHY: 后续所有工作的基础。需要理解项目从“平台依赖”到“自主生长”的转变。
-->
- [x] 从 PPTX 和 PDF 中提取文本 (已通过脚本完成)
- [x] 使用 Gemini 分析内容 (已完成)
- [x] 在 `findings.md` 中记录关键发现
- **状态:** complete

### Phase 2: 结构化知识组织
<!-- 
  WHAT: 将发现组织成可执行的类别（服务、志愿者体系、目标）。
  WHY: 以便在构建网站或编写文案时轻松引用具体细节。
-->
- [x] 完善 `findings.md`，包含以下结构化章节：
    - 背景 (Why - 合规问题)
    - 新模式 (社区支持中心)
    - 志愿者体系 (Level 1-3)
- [x] 验证是否有任何细节缺失或不清楚
- **状态:** complete

### Phase 3: 网站规划与设计
<!-- 
  WHAT: 定义网站结构、技术栈和内容策略。
  WHY: 确保网站直接支持 2026 战略目标（筹款、志愿者）。
-->
- [x] 创建 `implementation_plan.md` (架构、技术栈)
- [x] 将“政策助手”和“开放厨房”需求纳入计划
- [x] **[进行中]** 与用户讨论并细化详细需求
- [x] 定义“设计系统” (使用 UI/UX Pro Max 技能，颜色：温暖/治愈，字体)
- [x] 创建每一产品设计文档 `product-design.md` (网站地图, UX 策略, 社工/管理者工作流)
- [x] **[新增]** 创建 `roadmap.md` 以阐明“先对外，后登录”的策略。
- [x] **[新增]** 创建低保真 `wireframes.md` 和 `review-packet-phase1.md`。
- **状态:** complete

### Phase 4: 网站开发 (路线图: 公众门户优先)
<!-- 
  WHAT: 构建核心的面向公众的页面 (Phase 1)。
  WHY: 立即建立品牌形象和筹款渠道。
-->
- [x] 初始化 Next.js 项目
- [x] 实施设计系统 (Tailwind)
- [x] 构建主页 (Hero, 影响力, 捐赠引导)
- [x] 构建“社区中心”服务页面 (动态数据)
- [x] 构建“参与” (志愿者/捐赠) 页面
- [x] 构建“新闻”页面 (动态数据)
- [x] **[检查点]** 创建 Phase 1 设计评审包
- **Status:** complete

### Phase 5: 内部管理系统 (Internal Admin)
<!-- 
  WHAT: 志愿者与社工的后台管理系统。
  WHY: 支持业务运营 (Phase 2 目标)。
-->
- [x] **Allow Reordering** (2026-01-30) <!-- id: 5 -->
    - [x] Create detail view page: `apps/web/app/admin/(protected)/volunteers/[id]/page.tsx`
- [x] Add "Status" badge component
- [x] Add "Approve/Reject" action buttons
- [x] Implement server action for status updates
- [x] Add filtering/sorting to the list (optional but good for VX)
- [x] **Debug Volunteer Visibility Issue** (Fixed Auth Proxy)<!-- id: 8 -->
- [x] **[基建]** 搭建 Admin 基础框架 (Protected Routes, Client-side Auth)
- [x] **[Dash]** 实现管理端 Dashboard 数据概览
- [x] **[列表]** 实现“服务项目”列表视图
- [x] **[列表]** 实现“新闻动态”列表视图
- [x] **[列表]** 实现“志愿者”列表视图
- [x] **[CRUD]** 实现服务的编辑 (Edit) 和删除 (Delete)
- [x] **[CRUD]** 实现新闻的发布 (Create) 和编辑 (Edit)
- [x] **[RichText]** 集成 Tiptap 富文本编辑器 (News Editors) <!-- id: 9 -->
- [x] **[RichText]** 实现富文本编辑器图片直接上传功能 (Polishing) <!-- id: 10 -->
- [x] **[RichText]** 实现富文本编辑器图片直接上传功能 (Polishing) <!-- id: 10 -->
- [x] **[Flow]** 志愿者审核流程 (Approve/Reject)
- [x] **[Feature]** 服务咨询管理 (Service Consultations)
    - [x] Admin Page & Columns (`apps/web/app/admin/(protected)/consultations`)
    - [x] "Mark Contacted/Resolved" Actions
    - [x] Sidebar Integration
- [x] **[Feature]** Admin Batch Actions (Batch Operations)
    - [x] Implement row selection in DataTable
    - [x] Add checkbox column to Volunteers and Service Consultations
    - [x] Implement "Batch Approve/Reject" for Volunteers
    - [x] Implement "Batch Status Update" for Service Consultations
    - [x] Implement "Batch Delete" and "Single Delete" for Volunteers and Consultations
- [x] **[Feature]** System Settings (Global Config)
    - [x] Create `site_settings` singleton collection
    - [x] Build `/admin/settings` page with form
    - [x] Connect public footer/header to dynamic settings (Optional - skipped for now)
- **Status:** complete

### Phase 6: Architecture Upgrade (RBAC)
<!-- 
  WHAT: Implement Role-Based Access Control to separate Staff, Admin, and Manager.
-->
- [ ] **[Feature]** Role-Based Access Control (RBAC)
    - [x] Design: Define permissions matrix (Social Worker vs Admin vs Manager)
    - [ ] Schema: Create `staff` collection with role field
    - [ ] Auth: Migrate `/admin/login` to use `staff` collection
    - [ ] UI: Update Sidebar to filter menu items by role

### Phase 7: Core Domain Upgrade (Schema V2)
<!-- 
  WHAT: Implement the new "Beneficiary" and "Activity" models.
-->
- [ ] **[Feature]** Domain Schema V2
    - [ ] Schema: Create `beneficiaries` collection (Polymorphic)
    - [ ] Schema: Create `activities` & `activity_participations`
    - [ ] Migration: Migrate existing volunteer/consultation data to new schema (optional/TBD)

### Phase 8: Deployment & Handover
<!-- 
  WHAT: Add high-value user-facing features.
-->
- [ ] **[Feature]** Application Status Check
    - [ ] Create generic "check-status" API (secure proxy)
    - [x] **[Pending]** UI Page for checking status by phone
- **Status:** in_progress

### Phase 7: Deployment & Handover
<!--
  WHAT: 部署上线。
-->
- [ ] Deploy to Production (Vercel/Docker)
- [ ] Set up persistent Backup Strategy
- [ ] User Training (Admin Manual)

## 关键问题 (Key Questions)
1. “穿透式管理”部分提到的具体合规要求是什么？（在 findings 中部分回答）
2. 2026 社区支持中心启动的时间表是什么？（需要检查文档细节）

## 已做决策 (Decisions Made)
| 决策 | 理由 |
|---|---|
| 使用 Gemini Web Skill | 文档复杂 (PPTX/PDF)，需要高层次的理解和总结 |
| 基于脚本的提取 | 直接文本提取确保没有内容因 OCR 问题而丢失 |
| 分阶段实施 (Phase 1 First) | 优先解决品牌传播和筹款痛点，降低初始技术复杂度 |

## 遇到的错误 (Errors Encountered)
| 错误 | 尝试次数 | 解决方案 |
|---|---|---|
| PDF 搜索失败 | 1 | 用户确认 PDF 相关；切换到通过 python 脚本提取内容 |
| PS 编码错误 | 1 | 确保传递提示时使用 UTF-8 编码 |
| Proxy Sort 400 Error | 1 | 切换为客户端排序 (Client-side Sorting) 以避开 Proxy 参数解析问题 |
