# 同心源数字化平台 - 实施路线图

> **Status Update (2026-01-30)**: 
> *   **Track A (公众门户)**: ✅ 核心页面已上线 (Home, Services, Get Involved, News).
> *   **Track B (内部系统)**: 🔄 **[进行中]** 后台管理系统正在开发 (Dashboard, Services List, Volunteer List).

---

## 📅 Phase 1 (Track A): 公众门户与品牌重塑
**目标**: 让陌生人能看懂同心源在做什么，并愿意捐赠或加入。

*   **1.1 基础架构** ✅
    *   Next.js 初始化
    *   设计系统 (Design System) 落地
*   **1.2 核心展示页** ✅
    *   首页 (Home): 愿景与信任建立。
    *   服务中心 (Services): 动态对接 PocketBase 数据。
    *   参与中心 (Get Involved): 志愿者分级说明。
    *   新闻中心 (News): 动态对接 PocketBase 数据。
*   **1.3 内容完善** ✅
    *   关于我们 (About)。
    *   SEO 优化 (基础元数据配置)。

---

## 📅 Phase 2 (Track B): 内部管理与服务闭环
**目标**: 提升机构运营效率，实现数据驱动。

*   **2.1 后台基础 (Admin Core)** ✅
    *   **Dashboard**: 数据概览 (志愿者/服务/新闻统计)。
    *   **架构**: AdminLayout, Auth Redirection (Client-side).
*   **2.2 模块开发 (Modules)** 🔄 *(进行中)*
    *   **服务管理 (Services)**: 列表查看 (✅), 编辑/删除 (✅), 拖拽排序 (✅).
    *   **新闻管理 (News)**: 列表查看 (✅), 编辑/发布 (✅), **图片上传 (✅)**.
    *   **志愿者管理 (Volunteers)**: 列表查看 (✅), 审核流程 (🚧 Pending).
    *   **咨询管理 (Consultations)**: 列表查看 (✅).

---

## 📅 Phase 3: 用户体系 (User Portal)
**目标**: 志愿者与家庭的自助服务端。

*   **3.1 统一认证 (Auth)**
    *   登录/注册页面 (Login/Register).
    *   角色分流 (Admin vs User).
*   **3.2 志愿者端**
    *   服务报名 & 签到.
*   **3.3 家庭端**
    *   服务申请 & 进度查询.

---

## 📌 当前策略 (Current Strategy)
1.  **完善 Admin**: 优先完成管理端的增删改查 (CRUD)，确保运营人员可以管理数据。
2.  **发布 Phase 1**: 准备部署公众门户到生产环境 (可与 Admin 开发并行)。
3.  **启动 Phase 3**: Admin 完善后，再开发面向大众的登录/注册功能。
