# Implementation Plan - Media Module (Step 3: Photo Wall)

## Goal
Implement a "Photo Wall" feature for beneficiaries to manage life, medical, and activity photos with granual privacy controls (Public vs Internal).

## Proposed Changes

### Backend (PocketBase)

#### [NEW] Collection: `beneficiary_media`
Store individual media files with metadata.
- `beneficiary`: **Relation** (Single, Cascade Delete) -> `beneficiaries`
- `file`: **File** (Images only, max 5MB, separate storage path)
- `caption`: **Text** (Description)
- `category`: **Select** (Options: Life, Medical, Document, Other)
- `is_public`: **Bool** (Default: False. If True, visible on public portal)
- `captured_date`: **Date** (Optional, for timeline sorting)

### Frontend (Next.js)

#### [NEW] Component: `MediaGallery`
- Grid layout to display photos.
- Badges for `Public`/`Internal`.
- Click to view full size (Lightbox).

#### [NEW] Component: `MediaUploadDialog`
- Drag & drop upload.
- Fields: Caption, Category, Is Public toggle.

#### [MODIFY] Page: `apps/web/app/admin/(protected)/beneficiaries/[id]/page.tsx`
- Implement the "Media" tab (`value="media"`).
- Embed `MediaGallery` component.

## Verification Plan

### Manual Verification
1. Upload a photo with "Public" setting.
2. Upload a sensitive photo with "Internal" setting.
3. Verify badges appear correctly.
4. Verify delete functionality.
