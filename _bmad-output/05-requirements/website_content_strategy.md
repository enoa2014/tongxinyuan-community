# 网站内容管理系统需求细化 (Website Content & CMS Requirements)

基于您的描述及参考图片（关于捐赠与项目进展的公示长图），以下是对“同心源”官网内容板块的详细需求拆解。

## 1. 信息披露 (Information Disclosure)
**目标**：建立信任，展示机构的透明度与行动力。

### A. 核心数据公示 (Quarterly/Annual Data)
需要动态展示关键运营指标，支持按季度/年度筛选。
*   **数据项**:
    *   季度/年度支出总额 (Total Expenses)
    *   收到捐赠笔数/总额 (Donations Received)
    *   服务家庭数量 (Families Served)
    *   志愿服务时长 (Volunteer Hours)
*   **功能需求**:
    *   **后台**: 录入季度/年度统计数据。
    *   **前台**: 数据看板 (Dashboard)，使用简单的图表或大号数字展示。

### B. 大额捐赠与物资公示 (Major Donations)
参考图片中的 `#01 爱心午餐捐赠`, `#02 暖冬计划` 格式。
*   **内容结构**:
    *   **项目名称**: (如：暖冬计划物资捐赠)
    *   **捐赠方/人**: (如：某某基金会、某某爱心人士)
    *   **捐赠内容**: (金额 12345 元 或 物资清单如“棉被30床”)
    *   **时间**: (日期)
    *   **图片集**: 现场交接图、物资图。
*   **实现建议**: 
    *   新增 `donations` (捐赠公示) 集合，区别于财务流水，专门用于对外展示的“光荣榜”。

### C. 审计与财报 (Reports)
*   **内容**: 审计报告扫描件、年度财务报表。
*   **形式**: PDF 下载或图片长廊。

---

## 2. 内容中心 (Content Hub - 暖心故事)
**目标**：传播社区温暖，促进UGC（用户生成内容）。

### 分类 (Categories)
1.  **暖心故事 (Stories)**: 机构官方视角的深度报道，记录患儿家庭的抗癌历程。
2.  **志愿者/家长投稿 (User Submissions)**: 
    *   需注明“作者/投稿人”。
    *   后台需有“审核”流程。
3.  **媒体报道 (Media Coverage)**: 转载外部媒体对同心源的报道（包含原文链接）。

### 功能需求
*   **富文本编辑器**: 支持图文混排、视频嵌入。
*   **标签系统**: #白血病 #志愿者 #爱心午餐。
*   **关联**: 文章可关联到具体的“项目”或“活动”。

---

## 3. 活动发布与报名 (Activities & Projects)
**目标**：动员参与，连接受助人与资源。

### A. 活动类型
1.  **公开课/讲座**: 线上或线下的知识分享。
2.  **目前进行的项目**: 长期项目介绍（如：爱心厨房、心理咨询）。
3.  **临时活动**: 节日派对、义卖等。

### B. 报名功能 (Registration)
*   **报名方式 (混合模式)**:
    *   **方式一：扫码报名** (支持上传微信群二维码/金数据/问卷星二维码)。
    *   **方式二：系统内报名** (使用目前的 `activity_participations` 系统，用户登录后点击“报名”)。
*   **状态管理**:
    *   报名中 (Open)
    *   已截止 (Closed)
    *   活动结束 (Ended)

---

## 4. CMS 数据模型建议 (Database Schema Plan)

为支持上述需求，建议扩展现有的 PocketBase 集合：

### [Existing] `news` (新闻/文章)
*   新增字段 `category`: 
    *   `official` (官方故事)
    *   `submission` (投稿)
    *   `media` (媒体报道)
*   新增字段 `author_name` (用于展示投稿人姓名)

### [Existing] `activities` (活动)
*   新增字段 `registration_type`: `internal` (系统内), `external_link` (外链), `qrcode` (扫码).
*   新增字段 `qrcode_image`: 图片字段。

### [New] `public_donations` (捐赠公示)
*   Fields: `donor_name`, `project_name` (关联项目), `amount` (金额/物资描述), `donate_date`, `images` (多图).

### [New] `op_stats` (运营数据 - 用于图表)
*   Fields: `period` (e.g. "2025-Q1"), `total_donation`, `total_expense`, `families_served`, `notes`.

---

## 5. UI 规划 (Website Sections)

1.  **首页**: 
    *   Banner 轮播 (重要活动/大额捐赠)
    *   数据概览 (年度服务人次等)
    *   最新故事 (3篇)
2.  **透明公益 (Transparency)**: 
    *   左侧导航: 财务审计 | 捐赠列表 | 运营年报
3.  **活动中心 (Events)**:
    *   卡片式布局，右上角标明状态（报名中/已结束）。
4.  **社区故事 (Blog)**:
    *   支持按“标签”或“分类”筛选。
