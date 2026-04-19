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

## Verified Update (2026-04-19, Later Pass)

- `apps/web` type-check still passes after the service-admin typing cleanup and another admin warning pass.
- `apps/web` lint warnings were reduced further from `104` to `29`.
- `apps/web` production build still passes after this cleanup pass.
- The remaining warnings are now mostly concentrated in `beneficiaries`, `accommodation`, `news`, and a small number of quote/dependency warnings rather than being spread across the whole admin surface.
- No new build regression was introduced during this pass, but browser regression with a live PocketBase backend is still outstanding.

## Verified Update (2026-04-19, Validation Tightening Pass)

- `apps/web` type-check passes after the latest admin cleanup.
- `apps/web` production build passes after the form/dialog rewrites and remaining detail-page typing fixes.
- `apps/web` lint warnings were reduced further from `29` to `2`.
- Remaining warnings are now limited to one React Compiler / TanStack Table compatibility notice in `components/admin/data-table.tsx` and one legacy `any` in `components/admin/news/rich-text-editor.tsx`.
- Build output still logs `ECONNREFUSED 127.0.0.1:8091` for public `news/services` fetches when local PocketBase is offline, so live-backend regression is still required before treating this as deployment-ready.

## Verified Update (2026-04-19, Accommodation Finance Pass)

- `apps/web` lint now passes cleanly with `0` warnings.
- `apps/web` type-check still passes.
- `apps/web` production build still passes after the accommodation finance changes.
- The accommodation manager now includes a working `records` tab instead of a placeholder, and accommodation forms/dialogs now support fee tracking and waiver notes.
- Local schema support was extended for `accommodation_records` finance fields: `fee_amount`, `payment_status`, and `waiver_reason`.
- The remaining blocker for calling Phase 8.2 fully complete is environment rollout: the live PocketBase schema still needs to be patched and the accommodation finance workflow still needs browser-level regression against a real backend.
