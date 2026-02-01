# 任务计划：家庭基因图谱 (Family Genogram) 实现

## 阶段 1：数据模型与类型 [完成]
- [x] 创建 PocketBase 集合 `family_members` <!-- id: 1 -->
- [x] 定义 FamilyMember TypeScript 接口 <!-- id: 2 -->
- [x] 验证数据模型迁移完整性 <!-- id: 3 -->

## 阶段 2：前端组件开发 [完成]
- [x] 安装 mermaid.js <!-- id: 4 -->
- [x] 完成 `FamilyMemberForm` 组件开发 (添加/编辑) <!-- id: 5 -->
- [x] 完成 `GenogramView` 组件开发 (Mermaid 可视化) <!-- id: 6 -->
- [x] 集成到 `beneficiaries/[id]/page.tsx` <!-- id: 7 -->

## 阶段 3：集成与验证 [完成]
- [x] 手动测试：添加家庭成员并验证列表更新 <!-- id: 8 -->
- [x] 手动测试：验证基因图谱自动渲染 <!-- id: 9 -->
- [x] 编写/运行自动化测试 (E2E / Robot) <!-- id: 10 -->
