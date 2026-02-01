# 实施计划 - 支持图片格式文档上传

## 目标
响应用户需求，允许在“文档附件”模块上传图片格式的文件（如手机拍摄的证明材料）。后端 `beneficiary_documents` 集合已支持图片 MIME 类型，仅需更新前端组件。

## 变更内容

### Components

#### [MODIFY] [document-upload.tsx](file:///c:/Users/86152/work/2026/tongxy/tongxinyuan-community/apps/web/components/admin/documents/document-upload.tsx)
- 更新 `<Input type="file">` 的 `accept` 属性，添加图片格式：
  - `.jpg`
  - `.jpeg`
  - `.png`
  - `.webp` (可选，视后端支持而定，当前后端明确支持 png/jpeg，建议仅添加这两个以匹配后端校验)

#### [MODIFY] [document-list.tsx](file:///c:/Users/86152/work/2026/tongxy/tongxinyuan-community/apps/web/components/admin/documents/document-list.tsx)
- 更新 `getFileIcon` 函数，为图片文件显示 `ImageIcon` (from lucide-react)。
- 支持扩展名: `jpg`, `jpeg`, `png`。

## 验证计划

1. **手动验证 (Browser Subagent)**
   - 导航至受助人详情页。
   - 打开上传对话框，确认文件选择器允许选择图片。
   - 模拟上传一张 JPG 图片。
   - 验证列表显示图片文件，且图标为图片图标而非默认文件图标。
