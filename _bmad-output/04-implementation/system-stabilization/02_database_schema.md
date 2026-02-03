# Database Schema & API Documentation

This document outlines the database schema, security rules, and frontend TypeScript interfaces for the Tongxinyuan Community system.

## Overview

- **Backend**: PocketBase (SQLite + Go)
- **Frontend**: Next.js 14 (TypeScript)
- **SDK**: `pocketbase` (JS SDK)
- **Type Generation**: `pocketbase-typegen` -> `apps/web/types/pocketbase-types.ts`

## 1. Collections Reference

### 1.1 Core Business Data

#### `services` (Service Projects)
Core service modules displayed on the frontend (e.g., Life Support, Palliative Care).
- **Access**: Public Read, Staff Manage.
- **Frontend Interface**: `ServicesRecord`

| Field | Type | Required | Options/Notes |
| :--- | :--- | :--- | :--- |
| `id` | text | Yes | System ID |
| `title` | text | Yes | Service Name |
| `description` | text | No | Summary |
| `icon` | text | No | Lucide icon name (e.g., 'heart_handshake') |
| `order` | number | No | Display order (Highest first) |
| `color_theme` | select | No | Options: `[green, yellow, blue, orange, red, purple, teal, slate]` |
| `created` | autodate | Yes | |
| `updated` | autodate | Yes | |

#### `activities` (Activities & Events)
Events and programs managed by staff.
- **Access**: Public Read, Staff Manage.
- **Rules**: Delete restricted to Manager.

| Field | Type | Required | Options/Notes |
| :--- | :--- | :--- | :--- |
| `title` | text | Yes | |
| `category` | select | No | `[home_care, festival, school_visit, home_visit, training, other]` |
| `status` | select | No | `[planning, recruiting, ongoing, review, completed]` |
| `start_time` | date | No | |
| `end_time` | date | No | |
| `location` | text | No | |
| `lead_staff` | relation | No | -> `staff` (Single) |
| `summary` | editor | No | HTML content |
| `photos` | file | No | Max 10 images |

#### `news` / `articles`
News updates and articles. (Note: System currently has both collections, usage consolidating to `news`).
- **Access**: Public Read, Staff Manage.

| Field | Type | Required | Options/Notes |
| :--- | :--- | :--- | :--- |
| `title` | text | Yes | |
| `category` | select | No | `[news, media, policy]` |
| `content` | editor | No | HTML |
| `cover` | file | No | |
| `published` | bool | No | |

### 1.2 Accommodation System

#### `accommodation_units` (Rooms & Beds)
- **Access**: **Staff Only**. Privacy data protection.
- **Frontend Interface**: `AccommodationUnitsRecord`

| Field | Type | Required | Options/Notes |
| :--- | :--- | :--- | :--- |
| `name` | text | Yes | Room 101, Bed A, etc. |
| `type` | select | Yes | `[building, floor, room, bed]` |
| `status` | select | No | `[active, maintenance, occupied]` |
| `parent` | relation | No | -> `accommodation_units` (Hierarchy) |

#### `accommodation_records` (Check-in/Out)
- **Access**: **Staff Only**.
- **Frontend Interface**: `AccommodationRecordsRecord`

| Field | Type | Required | Options/Notes |
| :--- | :--- | :--- | :--- |
| `beneficiary` | relation | Yes | -> `beneficiaries` |
| `unit` | relation | Yes | -> `accommodation_units` |
| `record_type` | select | Yes | `[Check-in, Extension, Check-out, Transfer]` |
| `start_date` | date | Yes | |
| `end_date` | date | No | |
| `total_fee` | number | No | Finance |
| `is_waived` | bool | No | Finance |
| `waiver_reason` | text | No | Finance |

### 1.3 People & CRM

#### `beneficiaries` (Service Objects)
Patient families and service recipients.
- **Access**: **Staff Only**.
- **Frontend Interface**: `BeneficiariesRecord`

| Field | Type | Required | Options/Notes |
| :--- | :--- | :--- | :--- |
| `name` | text | Yes | |
| `phone` | text | No | |
| `id_card` | text | No | |
| `type` | select | No | `[illness_child, girl_student]` (Added Phase 8.2) |
| `status` | select | No | `[active, archived]` |

> **Note**: `cascadeDelete` is enabled for all child collections (`family_members`, `medical_logs`, `accommodation_records`, etc.) pointing to `beneficiaries`. Deleting a beneficiary will automatically remove all associated records.

#### `family_members`
- **Access**: Staff Only.
- **Frontend Interface**: `FamilyMember`

| Field | Type | Options |
| :--- | :--- | :--- |
| `beneficiary` | relation | `cascadeDelete: true` |
| `name` | text | |
| `relation` | select | `[父亲, 母亲, 爷爷, 奶奶...]` |
| `is_caregiver` | bool | Default: false |
| `is_guardian` | bool | Default: false |
| `income_contribution` | bool | Default: false |

#### `medical_logs`
- **Access**: Staff Only.
- **Frontend Interface**: `MedicalLogsResponse`

| Field | Type | Options |
| :--- | :--- | :--- |
| `beneficiary` | relation | `cascadeDelete: true` |
| `hospital` | text | |
| `department` | text | |
| `date` | date | |
| `diagnosis` | text | |
| `treatment` | text | |

#### `volunteer_applications`
Online signup forms.
- **Access**: **Public Create**, Staff Read/Manage.
- **Frontend Interface**: (Inferred from Schema)

| Field | Type | Required | Options/Notes |
| :--- | :--- | :--- | :--- |
| `name` | text | Yes | |
| `phone` | text | Yes | |
| `email` | email | No | |
| `age` | number | No | |
| `skills` | json | No | Array of strings |
| `status` | select | No | `[pending, approved, rejected]` |

#### `service_consultations`
Incoming requests for help.
- **Access**: **Public Create**, Staff Read/Manage.

| Field | Type | Required | Options/Notes |
| :--- | :--- | :--- | :--- |
| `name` | text | Yes | |
| `phone` | text | Yes | |
| `service_type` | text | No | |
| `status` | select | No | `[pending, contacted, resolved]` |

### 1.4 System & configuration

#### `site_settings`
Global configs (Site Name, Contact Info).
- **Access**: Public Read, Staff Write.

## 2. Authentication & Roles

### 2.1 `staff` Collection (Auth)
The primary administrative users.
- **Roles**:
    1.  **social_worker**: Standard access to day-to-day operations (Beneficiaries, Accommodation, Activities).
    2.  **web_admin**: Manages website content (News, Services).
    3.  **manager**: Super-admin permissions (Delete sensitive data, Manage staff).
- **Permissions**:
    - **View/List**: Restricted to authenticated staff (Staff Directory).
    - **Update**: Users can update their own profile (`id = @request.auth.id`).

### 2.2 `users` Collection (Auth)
Public registered users (Volunteers, Donors).
- **Permissions**:
    - **View/List/Update**: Own profile only.
    - **Create**: Public registration enabled.

## 3. Frontend Integration

### Using Types
Import types from `@/types/pocketbase-types`.

```typescript
import { ServicesResponse, ActivitiesResponse } from "@/types/pocketbase-types"

// Fetching Example
const records = await pb.collection('services').getList<ServicesResponse>(1, 50);
```

### API Rules Summary
| Collection | Read Scope | Write Scope | Delete Scope |
| :--- | :--- | :--- | :--- |
| `services`, `news`, `activities` | **Public** | Staff | Manager |
| `site_settings` | **Public** | Staff | Manager |
| `volunteer_applications` | Staff | **Public (Create)** | Manager |
| `service_consultations` | Staff | **Public (Create)** | Manager |
| `beneficiaries` | Staff | Staff | Manager |
| `accommodation_*` | Staff | Staff | Manager |
| `staff` | Staff (Internal) | Admin/Self | Admin |

**Note**: All collections now include `created` and `updated` fields (autodate) to support standardized sorting.
