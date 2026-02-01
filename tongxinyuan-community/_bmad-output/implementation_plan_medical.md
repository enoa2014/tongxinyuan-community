# 实施计划 - 医疗日志 (Medical Logs)

## 目标
为受益人建立完整的医疗档案，记录就医历史、诊断结果、医嘱和治疗方案。通过时间轴形式直观展示病程发展。

## 用户审查 (User Review Required)
> [!IMPORTANT]
> **Schema 字段命名**: 吸取之前的教训，我们将严格定义字段名。
> - 关联字段统一命名为 `beneficiary` (Relation)。
> - 避免使用 `type` 等保留字，如有分类需求使用 `record_type` 或 `category`。

## 拟定变更 (Proposed Changes)

### 后端 (Backend) - PocketBase
#### [NEW] `medical_records` Collection
创建一个新的集合用于存储医疗记录。

| Field Name | Type | Options | Description |
| :--- | :--- | :--- | :--- |
| `beneficiary` | Relation | Collection: `beneficiaries`, Max: 1, Cascade Delete | 关联受助人 |
| `visit_date` | Date | Required | 就诊日期 |
| `hospital` | Text | | 就诊医院 |
| `department` | Text | | 科室 |
| `diagnosis` | Text | | 诊断结果/病名 |
| `treatment_plan` | Text | | 治疗方案/医嘱 |
| `attachments` | File | MimeTypes: Images/PDF, Max: 5 | 病历/检查单照片 |
| `notes` | Text | | 备注 |

### 前端 (Frontend) - Next.js
#### [NEW] Components
1.  `apps/web/components/admin/medical/medical-timeline.tsx`
    - 使用时间轴样式 (`ol/li` 或 Radix 组件) 展示就医记录。
    - 按 `visit_date` 倒序排列。
    - 每条记录展示：日期、医院、诊断、简要治疗方案。
    - 支持展开查看详情或图片。

2.  `apps/web/components/admin/medical/medical-form.tsx`
    - 表单字段：
        - 就诊日期 (Date Picker)
        - 医院 (Input)
        - 科室 (Input)
        - 诊断结果 (Textarea)
        - 治疗方案 (Textarea)
        - 附件上传 (File Input) - *注：可能暂复用通用上传或简化版*

#### [MODIFY] Beneficiary Detail Page
- `apps/web/app/admin/beneficiaries/[id]/page.tsx`
    - 新增 "医疗日志" Tab。
    - 集成 `MedicalTimeline` 和 `MedicalForm` (Dialog 模式或内嵌)。

## 验证计划 (Verification Plan)

### 自动化测试 (如果是手动验证则跳过)
- 暂无 CI 环境，采用手动验证。

### 手动验证 (Manual Verification)
1.  **创建记录**: 填写完整表单（含图片），提交成功。
2.  **列表展示**: 确认新记录出现在时间轴顶部，日期格式正确。
3.  **编辑记录**: 修改诊断内容，保存，确认更新。
4.  **删除记录**: 删除一条记录，确认消失。
5.  **字段检查**: 重点通过 API 确认 `beneficiary` 关联字段写入正确。
