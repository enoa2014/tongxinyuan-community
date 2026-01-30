# 核心领域模型设计 (Domain Model V2)

**日期**: 2026-01-31
**背景**: 根据用户提供的业务深度描述，我们需要将系统从简单的“信息发布站”升级为“专业社工业务系统 (NGO ERP)”。

## 1. 核心实体：服务对象 (Service Objects / Beneficiaries)

我们将“大病患儿家庭”抽象为通用的**“服务对象” (Beneficiary)**，通过 `type` 字段区分不同人群，并使用 `profile` (JSON) 存储特有字段。

### 集合: `beneficiaries`
| 字段名 | 类型 | 说明 |
| :--- | :--- | :--- |
| `name` | text | 姓名/家长姓名 |
| `phone` | text | 联系电话 (唯一索引) |
| `type` | select | `patient_family` (大病家庭), `teenage_girl` (花季女童), `sexual_abuse_victim` (受性侵儿童), `palliative_care` (安宁疗护), `public` (大众) |
| `status` | select | `active` (服务中), `archived` (归档/结案), `blacklisted` (黑名单) |
| `tags` | json | 标签（如：特困、急需物资） |
| `profile` | **JSON** | **多态数据结构** (见下文) |
| `created_by` | relation | 关联 `staff` (建档社工) |

#### Profile 数据结构定义 (JSON Schema)

*   **A. 大病患儿家庭 (`patient_family`)**
    ```json
    {
      "patient_name": "患儿姓名",
      "diagnosis": "白血病/肿瘤...",
      "hospital": "就诊医院",
      "first_diagnosis_date": "2024-01-01",
      "treatment_plan": "化疗/移植/康复",
      "hometown": "籍贯"
    }
    ```

*   **B. 花季女童 (`teenage_girl`)**
    ```json
    {
      "school": "所在学校",
      "grade_class": "年级班级",
      "family_relations": "单亲/留守/...",
      "family_relations": "单亲/留守/...",
      "economic_status_raw": "田地3亩, 鸡鸭10只 (文本记录)",
      "home_visit_count": 5
    }
    ```

*   **C. 普通大众 (`public`)**
    ```json
    {
      "interest": "急救培训/心理讲座",
      "source": "活动现场/公众号"
    }
    ```

---

## 2. 核心流程：活动/项目 (Activities / Projects)

响应用户描述的“通用活动流程”：0-N位社工协同 + 招募志愿者 + 服务对象。

### 集合: `activities`
| 字段名 | 类型 | 说明 |
| :--- | :--- | :--- |
| `title` | text | 活动名称 (如：2026六一儿童节游园会) |
| `category` | select | `home_care` (小家关怀), `festival` (节日活动), `school_visit` (入校活动), `home_visit` (家访) |
| `lead_staff` | relation | **负责人** (关联 `staff` 表) |
| `team_members` | relation | **协同社工** (多选，关联 `staff`) |
| `status` | select | `planning` (策划), `recruiting` (招募中), `ongoing` (实施中), `review` (复盘/盘点), `completed` (归档) |
| `start_time` | date | 开始时间 |
| `end_time` | date | 结束时间 |
| `location` | text | 地点 |
| `plan_docs` | file | 策划案文档 |
| `summary` | editor | 活动总结/复盘记录 |
| `photos` | file | 活动照片 (多图) |

### 集合: `activity_participations` (关联表)
用于记录“谁参加了什么活动”，实现多对多关联。

| 字段名 | 类型 | 说明 |
| :--- | :--- | :--- |
| `activity_id` | relation | 关联活动 |
| `participant_id` | relation | 关联 `users` (志愿者) 或 `beneficiaries` (服务对象) |
| `role` | select | `volunteer` (长期), `guest` (临时), `beneficiary` (受助者) |
| `guest_info` | json | **临时参与者信息** (姓名/电话) - 仅当关联不到 ID 时使用 |
| `check_in_time` | date | 签到时间 |
| `feedback` | text | 参与反馈/心得 |

---

### 3.2 志愿者参与模式 (Volunteer Participation)

*   **A. 长期志愿者 (Registered)**
    *   **账号**: 拥有系统账号 (`users` 表)。
    *   **权益**: 记录累计工时、接收定向推送、查看历史服务证书、撰写深度心得。
    *   **数据**: 关联 `skills` (专业技能)。

*   **B. 临时志愿者 (Guest/One-off)**
    *   **账号**: 无需注册，仅在活动报名表填写信息。
    *   **数据**: 存入 `activity_participations` 表的 `guest_info` (JSON) 字段 (姓名/电话)。
    *   **转化**: 后期可匹配电话号码邀请注册为长期志愿者。

### 3.3 隐私与评估控制
*   **司法援助/受性侵儿童**: 
    *   **策略**: 逻辑隔离。
    *   **权限**: 仅标记为 `manager` 或特定 `social_worker` (专案组) 可见。无需物理分库。
*   **经济评估**: 
    *   **策略**: 结构化记录 (JSON) 但暂不自动计算。
    *   **字段**: `assets_description` (文本/JSON), `income_level` (手动评级)。预留 `score` 字段。

---

## 4. 补充流程：服务申请 (Service Requests)

针对“服务对象主动提出的申请” (上传照片、文档、心得)。

### 集合: `service_requests`
| 字段名 | 类型 | 说明 |
| :--- | :--- | :--- |
| `beneficiary_id` | relation | 关联 `beneficiaries` |
| `type` | select | `material` (物资申请), `stay` (住宿申请), `feedback` (心得反馈) |
| `content` | text | 申请说明 |
| `attachments` | file | 照片/文档/凭证 |
| `status` | select | `pending`, `approved`, `rejected` |
| `handled_by` | relation | 处理社工 (`staff`) |

---

## 总结
这套模型将系统职能进行了维度升级：
1.  从“简单的表单列表”升级为**“多态档案系统”** (能管人)。
2.  从“只有志愿者管理”升级为**“通用活动管理”** (能管事)。
3.  通过 **RBAC** 权限体系，让社工在这些模块中发挥“发起人/领导者”的作用。
