# 实施计划：角色权限分离体系 (RBAC System)

## 目标 (Goal)
将后台按照职能划分为三个独立角色：**社工**、**网站管理员**、**机构管理者**。改变目前“所有人都是超级管理员”的现状，确保数据安全、隐私保护和权责分明。

## 1. 角色定义与权限矩阵 (Roles & Permissions)

| 权限模块 | 🟢 社工 (Social Worker) | 🔵 网站管理员 (Web Admin) | 🟣 机构管理者 (Manager) |
| :--- | :--- | :--- | :--- |
| **核心职责** | 业务执行、服务交付 | 系统运维、内容配置 | 经营决策、监管、审批 |
| **Dashboard** | 仅看自己/本组数据 | 系统健康状态 | **全盘数据、趋势图表** |
| **志愿者管理** | **审批、排班、评价、基本信息修改** <br> *(无权删除账号/重置密码)* | 账号异常处理、**硬删除**、重置密码 | 查看统计、高层审批 |
| **个案/咨询** | **完全读写 (建档/记录)** | ❌ **无权查看 (隐私)** | 查看详情 (抽查/监管) |
| **内容发布** | 仅限“项目动态” | **全站内容 (新闻/公告)** | 审核发布 (可选) |
| **系统设置** | ❌ 无权 | **完全控制** | 仅查看 |
| **账号管理** | ❌ 无权 | **创建/禁用员工账号** | 查看员工列表 |

## 2. 技术架构变更 (Technical Architecture)

### A. 数据库层 (PocketBase)
*   **不再使用 `_superusers`**: 目前的登录方式直接使用了 PB 的超级管理员表，拥有无限权限，无法限制。
*   **新增 `staff` 集合**:
    *   字段: `username`, `email`, `password`, `name`, `role` (select: `social_worker`, `web_admin`, `manager`), `avatar`.
    *   API Rules: 利用 PB 强大的 `@request.auth.role` 进行细粒度控制。
        *   *Example (System Settings)*: `createRule = @request.auth.role = 'web_admin'`
        *   *Example (Case Files)*: `viewRule = @request.auth.role = 'social_worker' || @request.auth.role = 'manager'`

### B. 认证层 (Auth Layer)
*   修改 `/admin/login`: 登录目标从 `admins.authWithPassword` 改为 `pb.collection('staff').authWithPassword`.
*   兼容性: 保留一个 Super Admin 入口（开发者用）。

### C. 应用层 (Next.js)
*   **中间件/RBAC Guard**: 在进入页面前检查 `user.role`。
*   **动态侧边栏**: `AdminSidebar` 能够根据当前用户的角色隐藏不可见的菜单项（如社工看不到“系统设置”）。

## 3. 实施步骤
1.  **Schema**: 创建 `staff` 集合，并预设 3 个测试账号（分别对应 3 种角色）。
2.  **Auth**: 升级登录页和 API Proxy，支持 `staff` 集合认证。
3.  **Sidebar**: 改造侧边栏，增加权限过滤逻辑。
4.  **Pages**: 为关键页面（Consultations, Settings）添加权限检查。

## 4. 验证计划
1.  登录“社工”账号 -> 尝试访问 `/admin/settings` -> 应被拦截或看不到入口。
2.  登录“管理员”账号 -> 尝试查看“咨询详情” -> 应被显示“无权访问”或数据为空。
3.  登录“管理者”账号 -> 能够看到 Dashboard 完整数据。
