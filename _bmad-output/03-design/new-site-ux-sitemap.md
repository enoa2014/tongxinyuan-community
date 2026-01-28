# 新版网站 UX 设计与交互规划 (UX & User Flows)

> **版本**: 2026.01.28 (Phase 1: Public Portal)
> **目标**: 清晰展示机构服务，引导用户参与，确保合规性。

## 1. 网站地图 (Sitemap - Phase 1)

```mermaid
graph TD
    Home[首页 /] --> About[关于我们 /about]
    Home --> Services[服务中心 /services]
    Home --> GetInvolved[参与支持 /get-involved]
    Home --> Resources[资源与透明度 /resources]

    subgraph "About Module"
        About --> Story[我们的故事 /about/story]
        About --> Team[团队介绍 /about/team]
        About --> Locations[服务网点 /about/locations]
    end

    subgraph "Services Module"
        Services --> LifeSupport[关爱小家 (生活支持)]
        Services --> Fun[儿童康乐 (阅读/保护)]
        Services --> Respite[心理支持 (生命教育)]
        Services --> Training[志愿者培育 (赋能)]
    end

    subgraph "Get Involved Module"
        GetInvolved --> Volunteer[志愿者招募 /get-involved/volunteer]
        GetInvolved --> Donate[捐赠指引 /get-involved/donate]
        GetInvolved --> Partners[合作伙伴 /get-involved/partners]
    end

    subgraph "Resources Module"
        Resources --> Policies[政策查询 /resources/policy]
        Resources --> Reports[年报与财报 /resources/reports]
    end
```

    subgraph "Auth & Portals (Phase 2 - 需登录)"
        Login[统一登录页 /login] --> Router{角色路由}
        
        Router --新用户--> Onboarding[身份准入 /onboarding]
        Router --家庭--> FamilyDashboard[家庭工作台 /family]
        Router --志愿者--> VolunteerDashboard[志愿者任务中心 /volunteer]
        Router --社工/管理--> AdminDashboard[数智管理后台 /admin]
        
        subgraph "Identity Verification"
            Onboarding --> RoleSelect[选择身份]
            RoleSelect --> FillForm[填写建档资料]
            FillForm --> Pending[等待审核]
        end
        
        FamilyDashboard -.-> Settings[个人设置 /account]
        VolunteerDashboard -.-> Settings
        AdminDashboard -.-> Settings
        
        subgraph "User Center (Common)"
            Settings --> Profile[个人资料 (头像/昵称)]
            Settings --> Security[账号安全 (密码/手机/微信绑定)]
        end
        
        FamilyDashboard --> FamilyApply[入住申请/物资申领]
        VolunteerDashboard --> VolJobs[任务大厅/签到]
        AdminDashboard --> CaseMgmt[个案管理]
        AdminDashboard --> DataBoard[管理驾驶舱]
        AdminDashboard --> FieldOps[现场作业模式 (Mobile) /admin/field]
    end

### Flow 2: 捐赠意向 (Donation Intent)
*   **场景**: 爱心人士李先生被机构故事打动，想捐款。
*   **路径**:
    1.  **故事页**: 阅读完 "异乡的家" 故事。
    2.  **引导**: 底部浮层 [支持我们]。
    3.  **指引页**:
        *   看到 "腾讯公益" 按钮 -> 点击跳转至腾讯公益小程序/网页完成支付。
        *   看到 "物资捐赠" -> 拨打显示的行政电话。
    4.  **合规**: 全程未看到个人收款码，增加了信任感。

### Flow 3: 寻找服务点 (Find Location)
*   **场景**: 患儿家长刚到南宁，想找最近的同心源小家。
*   **路径**:
    1.  **导航栏**: 点击 [关于我们] -> [服务网点]。
    2.  **列表页**: 看到 "万秀"、"北湖"、"兴宁" 三个卡片。
    3.  **详情**: 点击 "万秀中心"，展开地图、详细地址及 "一键导航" 按钮。

## 3. 关键页面交互设计 (Wireframe Specs)

### 3.1 首页 (Home)
*   **第一屏 (Hero)**: 全屏感性图片 (真实笑脸)，文案 "为异地求医家庭在这个城市安一个家"。
*   **数据栏 (Impact)**: 实时数字滚动 (累计服务人次 / 志愿者工时)。
*   **服务概览 (Features)**: 四宫格卡片，鼠标 Hover 显示简短介绍。

### 3.2 服务网点页 (Locations)
*   **布局**: 左侧列表，右侧地图 (或上下结构)。
*   **卡片内容**:
    *   图片 (门头照)。
    *   名称 (例如：同心源万秀小家)。
    *   标签 (例如：住宿, 厨房, 阅览室)。
    *   地址文本 (支持复制)。
*   **CMS支持**: 此页面数据需从 CMS 读取，方便搬家时修改。

### 3.3 捐赠指引页 (Donation)
*   **警告/提示**: 顶部显眼标注 "本机构未开通直接转账，请通过官方合作平台捐赠"。
*   **平台列表**: 大按钮设计 (腾讯公益 Logo, 支付宝公益 Logo)。
*   **物资捐赠**: 列表展示当前急需物资 (米、油、绘本)，并附联系方式。

## 4. 导航栏设计 (Navigation)
*   **Desktop**:
    *   Logo (左)
    *   首页 | 服务中心 | 参与支持 | 资源与披露 | 关于我们 (中)
    *   [捐赠指引] 高亮按钮 (右)
*   **Mobile**:
    *   汉堡菜单 (展开所有二级选项)。
    *   底部固定栏 (仅在特定页面出现): [联系社工] [支持我们]。
