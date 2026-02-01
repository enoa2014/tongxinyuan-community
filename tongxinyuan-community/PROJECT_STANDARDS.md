# Project Standards & Field SSOT

> [!IMPORTANT]
> This document is the **Single Interpretation of Truth (SSOT)** for this project.
> All developers (Human & AI) MUST follow these rules.
> **Location**: Project Root. Do not delete.

## 1. PocketBase v0.23+ strict Operational Guide

### 1.1 CLI Commands changed
The `admin` command group is **REMOVED**.
- **Create Admin**: `.\pocketbase.exe superuser create <email> <password>`
- **List Admins**: `.\pocketbase.exe superuser list`

### 1.2 Schema Definitions Strategy
v0.23+ JS Migrations are strict.
- **Property Name**: Use `fields` instead of `schema`.
- **Options Flattening**: `collectionId`, `maxSelect`, `values` must be at the field's top level.

**Correct Example:**
```javascript
new Collection({
    fields: [
        {
            name: "role",
            type: "select",
            maxSelect: 1,      // Flattened (was in options.maxSelect)
            values: ["A", "B"] // Flattened (was in options.values)
        }
    ]
})
```

### 1.3 Concurrency (CRITICAL)
> **NEVER** run CLI commands (create user, migration) while `serve` is running.
> Windows file locks will silently fail or corrupt state.
1. `taskkill /IM pocketbase.exe /F`
2. Run Maintenance Command
3. `.\pocketbase.exe serve`

---

## 2. SSOT: Field Naming Convention

> [!WARNING]
> Before implementing ANY feature, check this table.
> **Rule**: If Frontend and Backend naming disagrees, Backend Schema wins, but Frontend *should* match Backend.

### 2.1 Global Rules
- **Case**: `snake_case` only.
- **Forbidden Names**: `type`, `group`, `order`, `limit`, `offset`.
- **Relations**: Always name the relation field `beneficiary`, `user`, etc. (NOT `beneficiary_id`).

### 2.2 Module Definitions

#### Accommodation (`accommodation_records`)
| Field | Type | Details |
| :--- | :--- | :--- |
| `beneficiary` | Relation | -> `beneficiaries` (Max 1, Cascade) |
| `room_number` | Text | |
| `record_type` | Select | Check-in, Check-out, Transfer, Extension |
| `start_date` | Date | Time appended automatically by frontend |
| `end_date` | Date | Optional |
| `notes` | Text | |

#### Medical Logs (`medical_records`) [Phase 7]
| Field | Type | Details |
| :--- | :--- | :--- |
| `beneficiary` | Relation | -> `beneficiaries` (Max 1, Cascade) |
| `visit_date` | Date | |
| `hospital` | Text | |
| `department` | Text | |
| `diagnosis` | Text | |
| `treatment_plan`| Text | |
| `attachments` | File | Images/PDF |

#### Activity Timeline (`activity_logs`) [Phase 8]
| Field | Type | Details |
| :--- | :--- | :--- |
| `beneficiary` | Relation | -> `beneficiaries` |
| `activity_name` | Text | |
| `activity_date` | Date | |
| `location` | Text | |
| `photos` | File | |
