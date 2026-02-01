# 发现与记录

## 数据模型变更
- 我们正在从 `beneficiaries` 集合中的 JSON 字段 `family_members` 迁移到独立的 `family_members` 集合。
- 这样可以更好地支持复杂查询和关系管理 (如健康状况、收入贡献等)。

## 技术栈选择
- **可视化**: 使用 `mermaid.js` 渲染家庭成员关系的基因图谱。
- **后端**: PocketBase，使用 `relation` 字段链接到 `beneficiaries`。
- **前端**: Next.js + React Hook Form + Radix UI。

## 故障排除与最佳实践 [NEW]
### 1. React "Uncontrolled Input" 警告
- **问题**: 当 `input` 的 `value` 属性从 `undefined` 变为具体值时，React 会发出警告。
- **解决**: 始终确保 `value` 不为 `undefined`。使用 `value={field.value ?? ''}`。

### 2. Zod 数字字段验证
- **问题**: HTML `input type="number"` 返回空字符串时，Zod 的 `z.number()` 会因类型不匹配而验证失败 (Expected number, received string)。
- **解决**: 使用联合类型并进行转换: `z.union([z.string(), z.number()]).optional().transform(v => v === "" ? null : Number(v))`。这允许空置字段被正确处理为 null 或 undefined。
