# 实施计划 - 修复字段名不匹配引致的 400 错误

## 目标
解决前端因使用 `beneficiary` 而后端实际字段名为 `beneficiary_id` 导致的 400 Bad Request 错误。

## 变更内容

### Frontend

#### [MODIFY] [page.tsx](file:///c:/Users/86152/work/2026/tongxy/tongxinyuan-community/apps/web/app/admin/(protected)/beneficiaries/[id]/page.tsx)
- Update fetch filter: `filter: beneficiary='${id}'` -> `filter: beneficiary_id='${id}'`

#### [MODIFY] [document-upload.tsx](file:///c:/Users/86152/work/2026/tongxy/tongxinyuan-community/apps/web/components/admin/documents/document-upload.tsx)
- Update formData append: `formData.append("beneficiary", beneficiaryId)` -> `formData.append("beneficiary", beneficiaryId)`
- **Wait**, upload should still use the defined field name?
- If I change filter to `beneficiary_id`, that's for FINDING.
- For UPLOADING, PB expects the defined field name.
- If Schema check showed `beneficiary_id`, then create payload must use `beneficiary_id`.
- I will verify if I need to change upload payload too. Safe bet is YES if Schema check showed it.

## 验证计划
1. **浏览器验证**: 再次运行验证脚本。
