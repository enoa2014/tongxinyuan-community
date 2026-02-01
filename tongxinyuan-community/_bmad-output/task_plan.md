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
- [-] 编写/运行自动化测试 (E2E / Robot) [由于未安装 Test Runner，已用浏览器代理手动验证替代] <!-- id: 10 -->

## 阶段 4：影像模块 (Photo Wall) [完成]
- [x] 后端：创建 `beneficiary_media` 集合 <!-- id: 11 -->
- [x] 前端：创建 `MediaGallery` 组件 (展示/预览) <!-- id: 12 -->
- [x] 前端：创建 `MediaUpload` 组件 (上传/属性设置) <!-- id: 13 -->
- [x] 集成到 `beneficiaries/[id]/page.tsx` <!-- id: 14 -->

## 阶段 5：文档附件 (Documents) [完成]
- [x] 后端：创建 `beneficiary_documents` 集合 (File upload) <!-- id: 15 -->
- [x] 前端：创建 `DocumentList` 组件 (列表/下载/删除) <!-- id: 16 -->
- [x] 前端：创建 `DocumentUpload` 组件 (支持 PDF/Docx) <!-- id: 17 -->
- [x] 集成到 `beneficiaries/[id]/page.tsx` <!-- id: 18 -->
- [x] 增强：支持图片格式上传 (.jpg/.png) <!-- id: 19 -->
- [x] 修复：解决上传时间与列表加载 400 错误 (Schema 重建/字段名修正) <!-- id: 20 -->

## 阶段 6：住宿记录 (Accommodation History) [完成]
- [x] 后端：创建/完善 `accommodation_records` 集合 <!-- id: 21 -->
- [x] 前端：创建 `AccommodationHistory` 组件 (时间轴/列表) <!-- id: 22 -->
- [x] 前端：创建 `AccommodationForm` 组件 (入住/退房登记) <!-- id: 23 -->
- [x] 集成到 `beneficiaries/[id]/page.tsx` <!-- id: 24 -->

## 阶段 7：医疗日志 (Medical Logs) [待办]
- [ ] 后端：创建 `medical_records` 集合 (诊断/医嘱/阶段) <!-- id: 25 -->
- [ ] 前端：创建 `MedicalLogForm` 组件 <!-- id: 26 -->
- [ ] 前端：创建 `MedicalTimeline` 组件 <!-- id: 27 -->
- [ ] 集成到 `beneficiaries/[id]/page.tsx` <!-- id: 28 -->

## 阶段 8：活动轨迹 (Activity Timeline) [待办]
- [ ] 后端：创建 `activity_logs` 集合 <!-- id: 29 -->
- [ ] 前端：创建 `ActivityTimeline` 组件 <!-- id: 30 -->
- [ ] 集成到 `beneficiaries/[id]/page.tsx` <!-- id: 31 -->
