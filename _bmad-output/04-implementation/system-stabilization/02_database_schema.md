# 数据库架构与 API 文档 (Database Schema & API Documentation)

本文档概述了同心源社区系统的数据库架构、安全规则和前端 TypeScript 接口。

## 概述 (Overview)

- **后端**: PocketBase (SQLite + Go)
- **前端**: Next.js 14 (TypeScript)
- **SDK**: `pocketbase` (JS SDK)
- **类型生成**: `pocketbase-typegen` -> `apps/web/types/pocketbase-types.ts`

## 1. 集合参考 (Collections Reference)

### 1.1 核心业务数据 (Core Business Data)

#### `services` (服务项目)
前端展示的核心服务模块（如：生活救助、安宁疗护）。
- **访问权限**: 公开读取，员工管理。
- **前端接口**: `ServicesRecord`

| 字段 (Field) | 类型 (Type) | 必填 | 选项/备注 (Options/Notes) |
| :--- | :--- | :--- | :--- |
| `id` | text | 是 | 系统 ID |
| `title` | text | 是 | 服务名称 |
| `description` | text | 否 | 简介 |
| `icon` | text | 否 | Lucide 图标名称 (例如 'heart_handshake') |
| `order` | number | 否 | 显示顺序 (数值越大越靠前) |
| `color_theme` | select | 否 | 选项: `[green, yellow, blue, orange, red, purple, teal, slate]` |
| `created` | autodate | 是 | |
| `updated` | autodate | 是 | |

#### `activities` (活动与事件)
由员工管理的活动和项目。
- **访问权限**: 公开读取，员工管理。
- **规则**: 仅经理 (Manager) 可删除。

| 字段 (Field) | 类型 (Type) | 必填 | 选项/备注 (Options/Notes) |
| :--- | :--- | :--- | :--- |
| `title` | text | 是 | |
| `category` | select | 否 | `[home_care (居家照护), festival (节日活动), school_visit (入校探访), home_visit (入户探访), training (赋能培训), other (其他)]` |
| `status` | select | 否 | `[planning (筹备中), recruiting (招募中), ongoing (进行中), review (复盘中), completed (已结束)]` |
| `start_time` | date | 否 | |
| `end_time` | date | 否 | |
| `location` | text | 否 | |
| `lead_staff` | relation | 否 | -> `staff` (单选) |
| `summary` | editor | 否 | HTML 内容 |
| `photos` | file | 否 | 最多 10 张图片 |

#### `news` / `articles`
新闻更新和文章。（注：系统目前两个集合并存，正逐步合并使用 `news`）。
- **访问权限**: 公开读取，员工管理。

| 字段 (Field) | 类型 (Type) | 必填 | 选项/备注 (Options/Notes) |
| :--- | :--- | :--- | :--- |
| `title` | text | 是 | |
| `category` | select | 否 | `[news (新闻), media (媒体报道), policy (政策解读)]` |
| `content` | editor | 否 | HTML |
| `cover` | file | 否 | |
| `published` | bool | 否 | |

### 1.2 住宿系统 (Accommodation System)

#### `accommodation_units` (房间与床位)
- **访问权限**: **仅限员工**。隐私数据保护。
- **前端接口**: `AccommodationUnitsRecord`

| 字段 (Field) | 类型 (Type) | 必填 | 选项/备注 (Options/Notes) |
| :--- | :--- | :--- | :--- |
| `name` | text | 是 | 房间 101, 床位 A 等 |
| `type` | select | 是 | `[building (楼栋), floor (楼层), room (房间), bed (床位)]` |
| `status` | select | 否 | `[active (可用), maintenance (维护中), occupied (已占用)]` |
| `parent` | relation | 否 | -> `accommodation_units` (层级关系) |
| `tags` | text | 否 | 逗号分隔的标签 (例如 "标准间, 南向") |

#### `accommodation_records` (入住/退房记录)
- **访问权限**: **仅限员工**。
- **前端接口**: `AccommodationRecordsRecord`

| 字段 (Field) | 类型 (Type) | 必填 | 选项/备注 (Options/Notes) |
| :--- | :--- | :--- | :--- |
| `beneficiary` | relation | 是 | -> `beneficiaries` |
| `unit` | relation | 是 | -> `accommodation_units` |
| `record_type` | select | 是 | `[Check-in (入住), Extension (续住), Check-out (退房), Transfer (调房)]` |
| `start_date` | date | 是 | |
| `end_date` | date | 否 | |
| `total_fee` | number | 否 | 财务相关 |
| `is_waived` | bool | 否 | 财务相关 |
| `waiver_reason` | text | 否 | 财务相关 |

### 1.3 人员与 CRM (People & CRM)

#### `beneficiaries` (服务对象)
患儿家庭和服务接收者。
- **访问权限**: **仅限员工**。
- **前端接口**: `BeneficiariesRecord`

| 字段 (Field) | 类型 (Type) | 必填 | 选项/备注 (Options/Notes) |
| :--- | :--- | :--- | :--- |
| `name` | text | 是 | |
| `phone` | text | 否 | |
| `id_card` | text | 否 | |
| `type` | select | 否 | `[illness_child (大病患儿), girl_student (困境女童)]` (Phase 8.2 新增) |
| `status` | select | 否 | `[active (活跃), archived (归档)]` |

> **注意**: 指向 `beneficiaries` 的所有子集合（`family_members`, `medical_logs`, `accommodation_records` 等）均启用了 `cascadeDelete`（级联删除）。删除受益人将自动删除所有相关记录。

#### `family_members` (家庭成员)
- **访问权限**: 仅限员工。
- **前端接口**: `FamilyMember`

| 字段 (Field) | 类型 (Type) | 选项/备注 (Options/Notes) |
| :--- | :--- | :--- |
| `beneficiary` | relation | `cascadeDelete: true` |
| `name` | text | |
| `relation` | select | `[父亲, 母亲, 爷爷, 奶奶...]` |
| `is_caregiver` | bool | 默认: false (是否主要照护人) |
| `is_guardian` | bool | 默认: false (是否监护人) |
| `income_contribution` | bool | 默认: false (是否经济支柱) |

#### `medical_logs` (医疗记录)
- **访问权限**: 仅限员工。
- **前端接口**: `MedicalLogsResponse`

| 字段 (Field) | 类型 (Type) | 选项/备注 (Options/Notes) |
| :--- | :--- | :--- |
| `beneficiary` | relation | `cascadeDelete: true` |
| `hospital` | text | 医院 |
| `department` | text | 科室 |
| `date` | date | 日期 |
| `diagnosis` | text | 诊断 |
| `treatment` | text | 治疗方案 |

#### `volunteer_applications` (志愿者申请)
在线报名表单。
- **访问权限**: **公开创建**，员工读取/管理。
- **前端接口**: (根据 Schema 推断)

| 字段 (Field) | 类型 (Type) | 必填 | 选项/备注 (Options/Notes) |
| :--- | :--- | :--- | :--- |
| `name` | text | 是 | |
| `phone` | text | 是 | |
| `email` | email | 否 | |
| `age` | number | 否 | |
| `skills` | json | 否 | 字符串数组 |
| `status` | select | 否 | `[pending (待审核), approved (已通过), rejected (已拒绝)]` |

#### `service_consultations` (服务咨询)
求助咨询请求。
- **访问权限**: **公开创建**，员工读取/管理。

| 字段 (Field) | 类型 (Type) | 必填 | 选项/备注 (Options/Notes) |
| :--- | :--- | :--- | :--- |
| `name` | text | 是 | |
| `phone` | text | 是 | |
| `service_type` | text | 否 | |
| `status` | select | 否 | `[pending (待处理), contacted (已联系), resolved (已解决)]` |

### 1.4 系统配置 (System & configuration)

#### `site_settings` (站点设置)
全局配置（站点名称、联系方式）。
- **访问权限**: 公开读取，员工写入。

## 2. 认证与角色 (Authentication & Roles)

### 2.1 `staff`集合 (员工 Auth)
主要管理用户。
- **角色 (Roles)**:
    1.  **social_worker (社工)**: 日常操作权限（受益人、住宿、活动）。
    2.  **web_admin (网站管理员)**: 管理网站内容（新闻、服务）。
    3.  **manager (经理)**: 超级管理员权限（删除敏感数据、管理员工）。
- **权限 (Permissions)**:
    - **查看/列表**: 仅限已认证员工（员工名录）。
    - **更新**: 用户仅可更新自己的资料 (`id = @request.auth.id`)。

### 2.2 `users`集合 (用户 Auth)
公开注册用户（志愿者、捐赠者）。
- **权限 (Permissions)**:
    - **查看/列表/更新**: 仅限自己的资料。
    - **创建**: 开放公开注册。

## 3. 前端集成 (Frontend Integration)

### 使用类型 (Using Types)
从 `@/types/pocketbase-types` 导入类型。

```typescript
import { ServicesResponse, ActivitiesResponse } from "@/types/pocketbase-types"

// Fetching Example
const records = await pb.collection('services').getList<ServicesResponse>(1, 50);
```

### API 规则摘要 (API Rules Summary)
| 集合 (Collection) | 读取范围 (Read) | 写入范围 (Write) | 删除范围 (Delete) |
| :--- | :--- | :--- | :--- |
| `services`, `news`, `activities` | **公开 (Public)** | 员工 (Staff) | 经理 (Manager) |
| `site_settings` | **公开 (Public)** | 员工 (Staff) | 经理 (Manager) |
| `volunteer_applications` | 员工 (Staff) | **公开 (Public Create)** | 经理 (Manager) |
| `service_consultations` | 员工 (Staff) | **公开 (Public Create)** | 经理 (Manager) |
| `beneficiaries` | 员工 (Staff) | 员工 (Staff) | 经理 (Manager) |
| `accommodation_*` | 员工 (Staff) | 员工 (Staff) | 经理 (Manager) |
| `staff` | 员工 (Staff) | 管理员/自己 | 管理员 (Admin) |

**注**: 所有集合现在都包含 `created` 和 `updated` 字段（自动日期），以支持标准化排序。
