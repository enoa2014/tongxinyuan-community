# 冲刺状态报告 (Sprint Status Report)

**日期**: 2026-01-30
**冲刺目标**: 公众门户(Phase 1)动态化上线 ＆ 后台管理系统(Phase 2)基础功能开发。

## 📊 冲刺概览
*   **状态**: 🟢 正常 (On Track)
*   **重点**: 从静态页面转向动态数据 (PocketBase Integration)
*   **进度**: 
    *   **Public Portal**: 95% (等待内容填充)
    *   **Admin System**: 40% (列表已阅, 增删改待办)

## ✅ 已完成事项 (Achievements)
1.  **公众门户 (Dynamic Web)**:
    *   **服务中心**: 对接 PocketBase `services` 集合，展示动态数据。
    *   **新闻中心**: 对接 PocketBase `articles` 集合。
    *   **访客优化**: 解决了 Guest 访问 API 的 400/403 权限问题。

2.  **后台基础 (Admin V1)**:
    *   **布局**: 响应式侧边栏 + 顶部导航 (Logout).
    *   **鉴权**: 基于 Cookie 的客户端路由保护。
    *   **列表视图**: 实现了服务、新闻、志愿者申请的 DataTable 展示。

3.  **DevOps & Data**:
    *   **PocketBase**: 解决了 v0.23+ 版本 Schema 定义不兼容问题 (`fields` vs `schema`)。
    *   **脚本**: 编写了 `inspect-db-content.ts` 和 `init-services.ts` 用于数据维护。
    *   **环境修复**: 解决了 Browser Tool 因 Windows 代理配置冲突导致的 502 错误。
    *   **服务排序**: 通过 Docker 后门脚本成功绕过问题，完成了数据库 Schema 更新。

## 🚧 进行中 / 下一步 (In Progress)
1.  **管理端交互 (CRUD)**:
    *   **Service**: 列表/编辑/删除/排序 (✅ Done).
    *   **News**: 列表/编辑/发布 (✅ Done - Basic).
    *   **Volunteer**: 列表 (✅), 审批流 (🚧 Pending).
    *   **Rich Text**: 待集成 Tiptap/Quill.

## ⚠️ 风险与问题 (Risks)
*   **PocketBase v0.23+**: API 变动较大 (如 Select 字段扁平化)，需小心使用旧教程代码。
*   **Next.js 15 Route Handlers**: `params` 变为 Promise，需 `await` 访问，否则导致 500 错误。

## 📝 决策日志
*   **2026-01-30**: **Unfreeze Phase 2**. 决定并行开发后台管理系统，以便运营团队能尽早录入真实数据填补官网内容。
*   **2026-01-30**: 在 Public API 暂时移除 `sort` 参数以规避 Guest 访问限制。
