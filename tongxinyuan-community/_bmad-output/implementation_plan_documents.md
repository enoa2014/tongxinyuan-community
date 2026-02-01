# Implementation Plan - Phase 5: Documents (Files) Module

# Goal Description
Enable the management of non-image file attachments (PDF, Word, Excel, etc.) for beneficiaries. This is distinct from the Media module (which focuses on visual content) and handles "paperwork" like medical reports, government documents, and agreements.

## User Review Required
> [!NOTE]
> Maximum file size will be set to 10MB by default. Allowed types: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT.

## Proposed Changes

### Backend (PocketBase)
#### [NEW] [1770000001_create_beneficiary_documents.js](file:///c:/Users/86152/work/2026/tongxy/tongxinyuan-community/backend/pb_migrations/1770000001_create_beneficiary_documents.js)
Create `beneficiary_documents` collection:
- `beneficiary`: Relation to `beneficiaries` (cascade delete).
- `file`: File field (max 10MB, restricted mime types).
- `title`: Text (Display name of the document).
- `category`: Select (Medical Report, ID Document, Application Form, Agreement, Other).
- `uploaded_by`: Relation to `staff` (optional).

### Frontend (Web App)
#### [NEW] [types/document.ts](file:///c:/Users/86152/work/2026/tongxy/tongxinyuan-community/apps/web/types/document.ts)
Define `BeneficiaryDocument` interface.

#### [NEW] [components/admin/documents/document-list.tsx](file:///c:/Users/86152/work/2026/tongxy/tongxinyuan-community/apps/web/components/admin/documents/document-list.tsx)
- Table or List view of documents.
- Columns: Icon (by type), Title, Category, Size, Upload Date, Actions (Download, Delete).
- "Download" button opens file in new tab.

#### [NEW] [components/admin/documents/document-upload.tsx](file:///c:/Users/86152/work/2026/tongxy/tongxinyuan-community/apps/web/components/admin/documents/document-upload.tsx)
- File input (accepts .pdf, .doc, etc.).
- Fields: Title (auto-fill from filename), Category.
- Progress bar.

#### [MODIFY] [app/admin/(protected)/beneficiaries/[id]/page.tsx](file:///c:/Users/86152/work/2026/tongxy/tongxinyuan-community/apps/web/app/admin/(protected)/beneficiaries/[id]/page.tsx)
- Add "文档附件" (Documents) tab.
- Integrate `DocumentList` and `DocumentUpload` (via Dialog).

## Verification Plan

### Automated Tests (E2E)
- **Upload**: Upload a PDF file, verify success.
- **List**: Verify document appears in the list with correct metadata.
- **Download**: Click download/view link (check URL).
- **Delete**: Verify deletion with `AlertDialog`.

### Manual Verification
- Check file type restrictions.
- Verify large file handling (limit check).
