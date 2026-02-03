# Test Data & Credentials

## 1. Test Accounts (Staff Login)

Use these accounts to log in to the Admin Dashboard (`/admin/login`).

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Manager** | `dev@manager.com` | `12345678` | **Full Access**. Can delete records. Can manage staff. |
| **Web Admin** | `dev@admin.com` | `12345678` | **Content Management** (News, Services). Cannot see sensitive housing/beneficiary data. |
| **Social Worker** | `social@worker.com` | `12345678` | **Operational Access**. Beneficiaries, Activities, Accommodation. Cannot delete records. |

## 2. Data Seeder (Bulk Test Data)

A tool is available to quickly populate the database with dummy records for testing.

### How to Use
1.  Log in as **Manager**.
2.  Navigate to **System Settings** (`/admin/settings`).
3.  Scroll to the bottom card: **"测试数据管理" (Test Data Management)**.

### Features
*   **Generate 10 Users**:
    *   Creates 10 `Beneficiaries` (Name: `[Test] Beneficiary X` or Realistic Names like `[Test] 林雨桐`).
    *   **Features Enhanced (Phase 8.2)**:
        *   **Realistic Profiles**: Generates gender, birth date, hometown, and beneficiary type (`illness_child`/`girl_student`).
        *   **Family Network**: Automatically creates 2-4 family members per beneficiary (Parents, Grandparents), assigning roles like "Primary Caregiver" or "Income Contributor".
        *   **Medical History**: Generates 3-5 medical logs (Diagnosis, Chemotherapy records) for each beneficiary.
    *   Creates 5 `Volunteers` (Name: `[Test] Volunteer X`).
*   **Clear Test Data**:
    *   Permanently deletes **ALL** records where the name starts with `[Test]`.
    *   Safe for production as it only targets clearly marked test data.
