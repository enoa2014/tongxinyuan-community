# 旧版网站 (txy2020) 功能深度解析

## 1. 系统概览
*   **开发框架**: phpGrace (MVC架构)
*   **数据库**: MySQL 5.7
*   **技术架构**: 单体应用 (服务端渲染 SSR)
*   **核心模块**: 公众门户 (Home), 用户中心 (Member), 后台管理 (Backend/Manager).

## 2. 公众门户 (Frontend)

### 2.1 内容架构 (CMS)
网站的主要功能是作为一个内容管理系统 (CMS)，所有功能均基于 **分类** (`txy_article_categories`) 进行组织。
*   **新闻与动态**:
    *   **机构动态** (ID 30): 展示近期活动。
    *   **媒体报道** (ID 31): 展示外部公关报道。
*   **静态信息**:
    *   **关于我们** (ID 13): 使命、愿景介绍。
    *   **机构介绍** (ID 14)。
    *   **项目点** (ID 16): "万秀"、"北湖"、"兴宁" 三个服务点的介绍。
*   **参与互动 (基于内容)**:
    *   **志愿者招募** (ID 34): 仅展示招募信息的文章（**无**在线报名表单）。
    *   **我要捐款** (ID 35): 仅展示银行账户/二维码的文章（**无**在线支付网关）。

### 2.2 社区功能 (交互类)
不同于纯静态网站，旧版包含一个具备社交属性的“用户中心”：
*   **用户账户**: 注册 (`register.php`)、登录 (`login.php`)。
*   **论坛 / 话题**: 用户可以发布“话题” (`txy_topics`)。
*   **评论系统**: 用户可以对文章和话题进行评论 (`txy_comments`)。

## 3. 用户中心 (Member Dashboard)
**控制器**: `home/controllers/account.php`
*   **个人资料管理**:
    *   修改昵称 / 个人信息。
    *   头像上传 (支持本地存储 & 阿里云 OSS)。
    *   修改密码。
*   **内容管理**:
    *   `mytopics`: 查看和编辑自己发布的话题。
    *   `mycomments`: 查看和删除自己的评论。

## 4. 后台管理 (Admin Backend)
**入口控制器**: `admin/app/controllers/index.php`
*   **权限控制 (RBAC)**:
    *   `manager_roles`: 定义角色和权限集。
    *   `managers`: 关联角色的管理员账户。
*   **内容管理**:
    *   `articles.php`: 全站内容（新闻、关于、项目等）的增删改查。
    *   `categories.php`: 管理菜单结构。
    *   `imgnews.php`: 管理首页轮播图/图片新闻。
*   **用户管理**:
    *   `members.php`: 管理注册用户。
    *   `comments.php`: 审核用户评论。
    *   `topics.php`: 审核用户话题。

## 5. 数据模型 (Schema)

| 表名 | 用途 | 关键字段 |
|---|---|---|
| `txy_articles` | 核心内容表 | `article_title` (标题), `article_content` (内容), `article_cate` (分类), `article_img_url` (封面图) |
| `txy_article_categories` | 菜单/结构表 | `cate_name` (名称), `cate_id` (ID) |
| `txy_members` | 终端用户表 | `u_username` (用户名), `u_phone` (手机), `u_openid_wx` (微信OpenID), `u_face` (头像) |
| `txy_topics` | 用户发帖表 | `t_title` (标题), `t_content` (内容), `t_uid` (用户ID) |
| `txy_comments` | 互动/评论表 | `comments_contents` (内容), `comments_uid` (用户ID), `comments_reply_id` (回复ID) |
| `txy_managers` | 管理员表 | `manager_username` (账号), `manager_role_id` (角色ID) |

## 6. 迁移关键洞察 (Critical Observations)
1.  **捐款与志愿者**: 目前这两个功能仅为**信息展示页**。新系统计划将其升级为**事务性功能**（如在线表单报名、在线捐款），这属于从 0 到 1 的重大升级。
2.  **微信集成**: 旧版数据库 (`txy_members`) 中已经存储了 `u_openid_wx` 和 `u_unionid_wx`。这些数据对于将老用户无缝迁移到新平台非常有价值。
3.  **数据迁移策略**:
    *   `txy_articles` -> 迁移至新 CMS 系统。
    *   `txy_members` -> 迁移至 MemFire Cloud Auth（需仔细映射字段）。
