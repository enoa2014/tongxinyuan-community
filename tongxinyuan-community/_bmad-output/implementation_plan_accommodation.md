# 实施计划: 住宿记录模块 (Accommodation Module)

## 目标
实现“住宿记录”功能，允许管理员记录受助人的入住、退房及房间信息。

## 变更内容

### 后端 [数据迁移]
#### [NEW] [1770000018_create_accommodation.js](file:///c:/Users/86152/work/2026/tongxy/tongxinyuan-community/backend/pb_migrations/1770000018_create_accommodation.js)
- 创建集合 `accommodation_records`。
- 字段结构 (Schema):
  - `beneficiary`: 关联字段 -> `beneficiaries` (最大数量 1, 级联删除 Cascade Delete)。
  - `room_number`: 文本 (必填)。
  - `start_date`: 日期 (必填)。
  - `end_date`: 日期 (选填)。
  - `type`: 下拉选择 (`入住`, `续住`, `退房`, `转房`) (存储英文 Key: `Check-in`, `Extension`, `Check-out`, `Transfer`)。
  - `notes`: 文本 (备注)。
- 访问规则: 所有操作仅限已登录用户 (`@request.auth.id != ''`)。

### 前端 [组件开发]
#### [NEW] [accommodation-form.tsx](file:///c:/Users/86152/work/2026/tongxy/tongxinyuan-community/apps/web/components/admin/accommodation/accommodation-form.tsx)
- 使用 React Hook Form + Zod 进行校验 (特别是日期必填)。
- 表单字段: 房间号, 起止日期, 类型, 备注。

#### [NEW] [accommodation-history.tsx](file:///c:/Users/86152/work/2026/tongxy/tongxinyuan-community/apps/web/components/admin/accommodation/accommodation-history.tsx)
- 以表格或时间轴形式展示历史记录。
- 提供编辑/删除操作入口。
- 默认按 `start_date` 倒序排列。

#### [MODIFY] [page.tsx](file:///c:/Users/86152/work/2026/tongxy/tongxinyuan-community/apps/web/app/admin/(protected)/beneficiaries/[id]/page.tsx)
- 替换 `TabsContent value="accommodation"` 中的占位符。
- 添加 `fetchAccommodation()` 数据获取逻辑。
- 集成 `AccommodationHistory` 列表和 `AccommodationForm` (弹窗模式)。

## 类型定义
#### [NEW] [accommodation.ts](file:///c:/Users/86152/work/2026/tongxy/tongxinyuan-community/apps/web/types/accommodation.ts)
- 定义 TS 接口 `AccommodationRecord`。

## 验证计划
### 浏览器手动验证
1.  **添加记录**: 登记一条“入住”记录。
2.  **查看列表**: 验证其是否出现在列表/时间轴中，且排序正确。
3.  **编辑记录**: 修改房间号，保存并验证更新。
4.  **删除记录**: 删除该条记录并确认消失。
