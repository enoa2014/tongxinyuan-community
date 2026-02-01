# 实施计划 - 修复缺失的上传时间

## 目标
解决 `beneficiary_documents` 集合中缺失 `created` 和 `updated` 字段导致前端显示 "N/A" 的问题。

## 方案
使用 PocketBase 迁移脚本直接执行 SQL 语句，手动添加缺失的数据库列。这是因为通过 `Collection` 对象保存可能无法触发对系统字段的修复。

## 变更内容

### Backend Migrations

#### [NEW] [1770000015_add_timestamps_sql.js](file:///c:/Users/86152/work/2026/tongxy/tongxinyuan-community/backend/pb_migrations/1770000015_add_timestamps_sql.js)
- Up:
  - Check if `created` column exists (via `try/catch` or logic, or just try adding).
  - `ALTER TABLE beneficiary_documents ADD COLUMN created TEXT DEFAULT ''`
  - `ALTER TABLE beneficiary_documents ADD COLUMN updated TEXT DEFAULT ''`
  - `UPDATE beneficiary_documents SET created = strftime('%Y-%m-%d %H:%M:%S.000Z', 'now'), updated = strftime('%Y-%m-%d %H:%M:%S.000Z', 'now') WHERE created = ''`
- Down:
  - `ALTER TABLE beneficiary_documents DROP COLUMN created` (SQLite supports DROP COLUMN in newer versions, or ignore)

## 验证计划
1. **执行迁移**: 运行 `pocketbase serve` 自动应用。
2. **前端验证**: 刷新受助人文档页，确认 "上传时间" 列不再显示 "N/A"，而是显示当前时间（因为旧数据被填充了当前时间）。
3. **新上传验证**: 上传新文件，确认显示正确的时间。
