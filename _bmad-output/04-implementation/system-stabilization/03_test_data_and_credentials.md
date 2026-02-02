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
    *   Creates 10 `Beneficiaries` (Name: `[Test] Beneficiary X`).
    *   Creates 5 `Volunteers` (Name: `[Test] Volunteer X`).
*   **Clear Test Data**:
    *   Permanently deletes **ALL** records where the name starts with `[Test]`.
    *   Safe for production as it only targets clearly marked test data.
