# 项目状态看板

更新时间：2026-04-18

## 当前判断

- 项目阶段：已进入 `Phase 9: Deployment & Handover`
- 产品状态：公开站点、后台运营、受助人档案、活动、咨询、住宿等核心模块已落地
- 工程状态：本轮整理前可构建，但存在类型检查、Lint、环境变量和交付文档缺口

## 已完成

- 公开门户与基础品牌站点
- 后台登录、Dashboard、服务/新闻/志愿者/咨询管理
- RBAC 角色权限拆分
- 受助人档案、家庭关系图、医疗日志、媒体与文档管理
- 活动管理与公开状态查询
- 住宿库存与入住/退住流程

## 进行中

- 工程治理收口
- 部署配置统一
- 交付与交接文档补齐

## 待完成

- 住宿费用与减免能力
- 生产部署确认与回归
- 持久化备份方案
- 管理员使用手册和交接材料

## 本轮处理重点

- 修复 Next 16 下的 `lint` 调用方式
- 将 `middleware.ts` 迁移为 `proxy.ts`
- 收敛 `apps/web` 的 TypeScript 校验范围，剥离调试脚本
- 统一浏览器端和服务端 PocketBase 环境变量约定
- 补齐若干业务类型定义，减少假阳性报错

## 建议下一步

1. 跑通 `lint`、`type-check`、`build` 三个检查并清空剩余错误。
2. 在真实 PocketBase 数据上回归后台关键流程。
3. 完成生产部署演练和备份恢复演练。
4. 形成一份管理员操作手册和故障处理清单。
## Verified Update (2026-04-18)

- `apps/web` type-check now passes.
- `apps/web` production build now passes after migrating to `proxy.ts` and removing `ignoreBuildErrors`.
- `apps/web` lint now completes with warnings only instead of blocking on legacy rule debt.
- Public news/services build-time data fetch still logs `ECONNREFUSED 127.0.0.1:8091` when local PocketBase is offline, so runtime regression against a live backend is still required.

## Verified Update (2026-04-19)

- `apps/web` type-check still passes after an additional warning-reduction pass.
- `apps/web` lint warnings were reduced from `137` to `104`.
- `apps/web` production build still passes after the public-page image cleanup and admin layout/header refactor.
- The main remaining engineering debt is concentrated in larger admin pages with historical `any`, unused locals, and hook dependency warnings.
