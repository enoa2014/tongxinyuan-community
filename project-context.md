# 同心源 (Tongxinyuan) 项目上下文

> **最后更新**: 2026-01-27
> **状态**: 旧版网站已部署 (ECS), 新版网站规划完成
> **技术栈**: 
> - **旧版**: PHP 7.4 + MySQL (Dockerized on ECS)
> - **新版**: Next.js + PocketBase (Self-hosted Go+SQLite)

## 4. 项目地图与部署参考 (2026 更新)

### 4.1 位置 (代码与服务器)

| 组件 | 本地路径 (Windows) | 远程路径 (ECS) | 说明 |
|---|---|---|---|
| **旧版网站** | `res\txy2020` | `/opt/txy2020` | 旧版 PHP Grace 网站 (归档/参考) |
| **新版网站** | `tongxinyuan-community` | `/opt/tongxinyuan` | 新版 Next.js 社区平台 |
| **部署脚本** | Root (`ws\2026\tongxy`) | `/tmp/` (执行期间) | 自动化脚本 (`.ps1`, `.sh`) |

### 4.2 端口映射

| 环境 | 旧版网站 (PHP) | 新版网站 (Next.js) | 备注 |
|---|---|---|---|
| **本地开发** | `http://localhost:8000` | `http://localhost:3000` | 修改旧版为 8000 以避免冲突 |
| **ECS 生产** | `https://tongxy.xyz` (443) | `https://tongxy.xyz:3000` | Nginx 处理两者的 SSL (旧版在 443, 代理 3000->3001) |

### 4.3 部署速查表

*   **部署更新 (新版或旧版)**
    *   **PowerShell**: `.\deploy_dual.ps1 -ServerIP ecs`
    *   **效果**: 更新配置，重启容器，确保两个站点都运行。

*   **本地开发**
    *   **旧版**: `cd res/txy2020; docker-compose up -d`
    *   **新版**: `cd tongxinyuan-community; npm run dev`

## 1. 核心战略转型 (2025 -> 2026)
- **从**: "平台依赖" (依赖公募基金会，高风险)。
- **到**: "自我成长" (独立筹款，社区支持中心模式)。
- **关键驱动力**: 符合新慈善法 ("穿透式管理") 和可持续资金需求。

## 2. 产品愿景: 社区支持中心
服务于以下的数字化 + 物理平台:
1.  **家庭**: 住宿，喘息服务，生命教育，政策援助。
2.  **志愿者**: 结构化成长 (Level 1-3)，标准化运营。
3.  **公众/捐赠者**: 透明的影响力数据，便捷参与公开活动。

## 3. 关键需求 ("必须有")
- **国内访问**: 无需 VPN。必须使用国内云 (MemFire, 腾讯/阿里云)。
- **多端同步**: Web (PC/手机) + 微信小程序必须共享同一个数据库。
- **运营优先**: 专注于解决 "社工效率" (不再使用手动 Excel)。
- **数据主权**: 运营数据 (服务日志，资源) 必须数字化且可审计。

## 4. 功能路线图 (MVP)
- **运营控制台**: 家庭管理，活动排期，数据仪表盘。
- **志愿者 App**: 注册，扫码签到，服务日志。
- **家庭 App**: 服务申请，**政策助手**，**共享厨房预订**。
- **公众门户**: SEO 友好的官网，简化的活动报名 (访客模式)。

## 5. 关键文档
- **产品简报**: `_bmad-output/01-strategy/product-brief.md` (原始需求事实来源)
- **技术计划**: `_bmad-output/01-strategy/technical-implementation-plan.md` (架构)
- **调研**: `_bmad-output/02-analysis/findings.md` (原始 PPT/PDF 分析)

## 6. 关键工程规则 (Critical Engineering Rules)
> **必须严格遵守的本地环境约束**
> **🔴 最高优先级 (HIGHEST PRIORITY): 阶段门禁 (Phase Gate Control)**
> *   **禁止自动推进**: 严禁在未获得用户**明确打字确认**的情况下，自动进入下一个主要阶段 (Phase) 或子阶段。
> *   **Explicit Confirmation**: DO NOT proceed to the next stage without typed user confirmation.

1.  **PowerShell 兼容性**:
    *   **禁止使用 `&&`**: PowerShell 不支持 `&&` 运算符（除非在 PowerShell 7+ 且配置正确，但默认环境不可靠）。
    *   **替代方案**: 使用 `;` 分隔命令，或将多个命令拆分为独立的 `run_command` 调用。
2.  **图片资源**:
    *   **路径**: 所有静态图片必须存放在 `apps/web/public/images/`。
    *   **引用**: 代码中引用时，路径始终以 `/images/` 开头（例如 `/images/banner.png`）。
3.  **Docker 缓存**:
    *   如果修改了代码但 Docker 容器未更新，**必须**执行 `docker exec ... rm -rf .next` 并重启容器。单纯重启往往无效。

## 7. 疑难排查与经验沉淀 (Troubleshooting & Lessons Learned)

### 2026-01-29: Admin 400 错误与 Schema 丢失事件

#### 问题描述
后台管理列表 `/admin/volunteers` 在按时间排序 (`sort=-created`) 时报错 `400 Bad Request`。同时，数据库中部分记录显示为 "Invalid Date" 且无字段内容。

#### 根本原因 (Root Causes)
1.  **PocketBase Schema 语法变动 (v0.20+ -> v0.26+)**:
    *   在旧版脚本中习惯使用 `schema: [...]` 定义字段。
    *   **现状**: 新版 SDK 废弃了 `schema` 属性，改为 `fields`。导致表被创建为空壳 (Empty Shell)，只有 ID，没有 `name`/`created` 等字段。这也是 400 错误的直接原因 (字段不存在)。
2.  **Next.js 15 Route Handler 破坏性更新**:
    *   **现状**: `params` 参数变成了 **Promise**。直接访问 `params.path` 会导致 Proxy 崩溃 (500 Error)。
    *   **修复**: 必须使用 `const { path } = await params`。

#### 解决方案与规范
1.  **Schema 修复**: 使用 `pb.collections.import()` 配合正确的新版 `fields` 语法进行覆盖更新。**禁止**简单的“删除重造” (Delete & Recreate)，因为可能因外键约束失败。
2.  **Proxy 规范**: 手动代理 (`route.ts`) 必须处理好 Headers 清洗和 Params awaiting。
3.  **数据清洗**: 编写脚本 (`scripts/cleanup-bad-data.ts`) 清理因 Schema 错误产生的幽灵数据。

### 2026-01-29: 业务流闭环与审计日志

#### 8.1 业务状态机
为了解决误操作问题，放弃了单向状态流（如只能 Pending -> Approved），改为**全联通状态机**：
*   **允许悔棋**: 任意状态均可重置为 `Pending` (待审核/待处理)。
*   **安全门禁**: 凡是**逆向操作**（如 Approved -> Rejected, Resolved -> Pending），前端必须弹出 `<AlertDialog>` 二次确认。

#### 8.2 审计日志 (Audit Log) 标准
所有关键业务表（志愿者、咨询、捐赠）均应包含 `history` (JSON) 字段，存储不可变的操作记录。
**数据结构**:
```json
[
  {
    "action": "通过申请",      // 动作描述
    "date": "ISO8601 Sting",   // 2026-01-29T12:00:00.000Z
    "operator": "Admin",       // 操作人标识
    "prevStatus": "pending"    // 修改前状态
  }
]
```
**展示要求**: 在详情页 Dialog 底部以时间轴形式渲染。

