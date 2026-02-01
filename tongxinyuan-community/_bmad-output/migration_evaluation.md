# PocketBase vs Supabase 迁移评估报告

**结论先行**：建议 **暂时维持 PocketBase**，但通过优化开发流程解决“调试难”的问题。迁移到 Supabase 成本过高，且会引入新的运维复杂度。

## 1. 现状分析
*   **后端耦合度**：极低（无自定义 Go 代码，仅数据文件）。
*   **前端耦合度**：**高**。核心业务逻辑通过 `apps/web/lib/pocketbase.ts` 强绑定。
*   **脚本生态耦合度**：**极高**。您有大量维护脚本 (`apps/web/scripts/*.ts`) 依赖 PocketBase SDK。迁移意味着需要重写几十个数据清洗、初始化和修复脚本。

## 2. 深度对比

| 维度 | PocketBase (现状) | Supabase (迁移后) | 影响评估 |
| :--- | :--- | :--- | :--- |
| **开发体验** | 单一二进制文件，启动即用。报错有时含糊。 | 完整的 Postgres 生态。强类型 SQL，工具链丰富。 | WB: 开发体验提升，但初期配置繁琐。 |
| **Docker 部署** | **极简**。单一容器，资源占用 < 30MB 内存。 | **极重**。完整自托管需要约 10 个容器 (Kong, Auth, PG, Realtime, Storage...)，需 2GB+ 内存。 | **负面**。极大增加本地和服务器部署负担。 |
| **调试难度** | 依赖 Admin UI 和日志。 | 可直接连接 PSQL 数据库，调试能力极强。 | 正面。数据库级调试是 Supabase 强项。 |
| **迁移成本** | N/A | **高**。1. 数据倒腾 (CSV) 2. 脚本全重写 3. 鉴权逻辑变更。 | **负面**。至少需要 1-2 周的重构时间。 |

## 3. 为什么您觉得 PocketBase "难调试"？
目前的痛点主要在于：
1.  **Schema 变更导致的前后端类型不一致**（字段改名、类型错误）。
2.  **API 错误信息不直观**（400 Bad Request 往往不告诉你是哪个字段错了）。
3.  **数据状态不仅可见**（需要频繁进 Admin UI 查看）。

## 4. 替代方案：优化 PocketBase 而非迁移
既然迁移成本主要在脚本和部署，我们可以通过以下方式解决 "Pain Points"：

1.  **引入 `pocketbase-typegen`**：
    自动生成 TypeScript 类型定义。一旦后端 Schema 变更，前端代码直接编译报错，而不是运行时才发现 400 错误。
    *成本：0.5 小时*

2.  **增强 API 错误拦截器**：
    在 `pocketbase.ts` 中全局通过 `hooks` 拦截 400 错误，并打印出详细的 `data` 字段（PocketBase 其实返回了详细错误，只是默认不显示）。
    ```typescript
    pb.beforeSend = function (url, options) {
        // ... logging
        return { url, options };
    };
    ```
    *成本：0.5 小时*

3.  **继续完善维护脚本**：
    您现有的脚本体系其实非常棒，这是 Supabase 这种 BaaS 很难提供的灵活性。继续坚持用脚本管理 Schema 是正确的路。

## 5. 最终推荐
**不建议迁移**。对于 `Tongxinyuan Community` 这样规模的项目，PocketBase 的“单文件部署”优势无可比拟。如果换到 Supabase，光是维护那套 Docker Compose 就会消耗您大量精力。

**下一步建议**：
让我们把精力花在**改善 PocketBase 开发体验**上，比如为您配置自动类型生成，或者优化错误日志输出。
