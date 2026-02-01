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

### 3. PocketBase Schema & JS Migrations
- **问题**: 使用 JS Migration 创建集合时，如果 `fields` 定义中的 `options` 嵌套在对象内 (如 `{ name: 'f', options: { ... } }`)，在新版 PB/JS-SDK 中会导致校验失败或字段属性丢失。
- **解决**: 必须将 `options` 中的属性直接扁平化到字段定义对象中 (如 `{ name: 'f', collectionId: '...', maxSelect: 1 }`)。
- **问题**: `new Collection({ ... })` 在 JS Migration 中创建的集合可能缺失 `created`/`updated` 系统字段。
- **解决**: 确保 Schema 定义正确。对于 `base` 类型，只要创建成功，系统字段会自动添加。如果缺失，说明创建过程有误，建议重建集合。

### 4. 客户端各类崩溃防护
- **问题**: `RangeError: Invalid time value`。当后端返回的数据缺失日期字段 (为 `undefined` 或 `null`) 时，直接调用 `new Date()` 或 `date-fns` 的 `format()` 会导致 React 页面白屏崩溃。
- **解决**: 在格式化日期前始终进行空值检查: `item.created ? format(new Date(item.created), "...") : "N/A"`。

### 5. 前后端字段名一致性
- **问题**: 前端请求 400 Bad Request，排查 Payload 格式无误。
- **原因**: 字段名不匹配。PocketBase 的 Relation 字段虽然在 Schema 中定义为 `X`，但在某些查询或错误日志中可能表现为 `X_id`？或者反之，之前定义的 Schema 实际生效名为 `beneficiary_id` 而非 `beneficiary`。
- **解决**: 出现 400 错误时，第一时间检查 API 实际期望的字段名 (通过 `/api/collections/NAME` 或直接查看数据库)。不要盲目信任 Migration 脚本中的定义（旧 Migration 可能被后续手动修改覆盖）。

### 6. [战略] 如何彻底防止字段名不匹配
- **问题**: 开发过程中反复出现前端字段名 (`beneficiary`) 与后端实际字段名 (`beneficiary_id`) 不一致，造成大量调试时间浪费。
- **根源**: 前端 TypeScript 类型定义是手动编写的，很容易与后端 Schema 脱节。
- **预防规范**:
  1.  **Golden Rule**: 永远不要假设字段名。在编写前端代码前，先通过 `http://localhost:8090/api/collections/{collection}/records` 查看一条真实数据的结构。
  2.  **自动化**: 引入 `pocketbase-typegen` 工具。在后端 Schema 变更后，运行该工具自动生成 TypeScript 接口定义 (`pocketbase-types.ts`)，直接替换手写的类型文件。这样如果字段名变了，编译时就会报错。
  3.  **常量定义**: 避免在代码中散落硬编码的字符串 (如 `filter: 'beneficiary=...'`)。应集中管理查询字段名常量。

### 7. PocketBase v0.23+ 兼容性与迁移
- **不兼容变更**: v0.23 版本移除了 `admin create` 命令。
  - **新命令**: 必须使用 `superuser create <email> <password>`。
- **Schema 定义更新**: 新版 API 在创建/更新集合时，字段定义不再放在 `schema` 属性下，而是必须放在 `fields` 属性下。
  - **现象**: 使用 `schema: [...]` 更新集合时，后端返回 200 但字段未变，或返回 400 错误。
  - **解决**: 更新所有脚本和 Migration，将 `{ schema: [...] }` 替换为 `{ fields: [...] }`。
  - **字段选项扁平化**: 同样，字段的 `options` (如 `values`, `collectionId`) 现在必须直接位于字段对象的一级属性中，不再嵌套在 `options` 对象里。

### 8. CLI 操作与服务并发
- **问题**: 在 PocketBase 服务 (`serve`) 运行时，尝试通过 CLI (`pocketbase admin/superuser create`) 创建用户可能会失败 (Unknown Command 或 文件锁问题)，或看起来成功但实际未生效。
- **解决**: 在执行可能会修改系统状态的 CLI 命令前，**务必先终止 `serve` 进程** (`taskkill` 或 `Ctrl+C`)。
