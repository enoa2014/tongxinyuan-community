# 同心源社区支持中心平台 | Tongxinyuan Community Platform

<div align="center">

**关爱异地求医大病儿童家庭的数字化社区支持平台**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15.x-black)](https://nextjs.org/)
[![MemFire Cloud](https://img.shields.io/badge/MemFire-Cloud-green)](https://memfiredb.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED)](https://www.docker.com/)

[官网](https://tongxy.xyz) · [文档](#-项目文档) · [贡献指南](#-参与贡献)

</div>

---

## 📖 项目简介

同心源（Tongxinyuan）是一个为异地求医大病儿童家庭提供综合支持服务的非营利组织。本项目旨在通过数字化转型，将传统的"小家"模式升级为"社区支持中心"模式，提供更高效、透明、可持续的社会服务。

### 核心特点

- 🏥 **家庭服务**: 提供临时住宿、喘息服务、生命教育、政策咨询
- 🤝 **志愿者管理**: 结构化志愿者成长体系（L1-L3）
- 📊 **运营数字化**: 告别手工 Excel，实现数据驱动的运营管理
- 🌐 **全平台同步**: Web（PC/移动）+ 微信小程序共享统一数据库
- 🇨🇳 **国内优化**: 无需 VPN，基于国内云服务（MemFire Cloud）

---

## 🏗 项目架构

本项目采用**双系统并行**架构：

```
tongxy/
├── tongxinyuan-community/    # 🆕 新平台（Next.js + MemFire Cloud）
│   ├── apps/                  # Monorepo 应用
│   │   ├── web/              # 官网主站
│   │   └── admin/            # 运营后台（规划中）
│   ├── design-system/        # UI 组件库
│   └── docker-compose.yml    # 生产部署配置
│
├── res/txy2020/              # 📦 遗留系统存档（PHP 7.4 + MySQL 5.7）
│   ├── Dockerfile            # 容器化配置
│   └── docker-compose.yml    # 独立运行环境
│
├── scripts/                  # 🛠 自动化工具
│   ├── deploy/               # 部署脚本（PowerShell/Bash）
│   └── tools/                # 数据提取工具（Python）
│
├── _bmad-output/             # 📋 产品设计与开发流程文档
│   ├── 01-analysis/          # 需求分析
│   ├── 02-design/            # 产品设计
│   ├── 03-architecture/      # 技术架构
│   └── 04-process/           # 开发流程
│
└── documentation/            # 📚 项目核心文档
```

---

## 🚀 快速开始

### 环境要求

- **Node.js**: 18.x 或更高版本
- **Docker**: 20.x 或更高版本
- **Git**: 用于版本控制
- **PowerShell**: Windows 用户需要 5.1+（用于部署脚本）

### 本地开发

#### 1. 运行新平台（Next.js）

```bash
# 克隆仓库
git clone https://github.com/your-org/tongxy.git
cd tongxy/tongxinyuan-community

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 **http://localhost:3000** 查看新平台。

#### 2. 运行遗留系统（可选，用于参考）

```bash
cd res/txy2020

# 启动 Docker 容器
docker-compose up -d

# 查看日志
docker-compose logs -f
```

访问 **http://localhost:8000** 查看旧版网站。

---

## 📦 生产部署

### 方式一：使用自动化脚本（推荐）

```powershell
# 部署到腾讯云 ECS
.\scripts\deploy\deploy_dual.ps1 -ServerIP <你的服务器IP>
```

该脚本将自动：
- ✅ 打包 Docker 镜像
- ✅ 上传到远程服务器
- ✅ 配置 Nginx 反向代理（HTTPS）
- ✅ 启动容器服务

### 方式二：手动 Docker Compose

```bash
# 在服务器上
cd /opt/tongxinyuan
docker-compose up -d

# 查看运行状态
docker-compose ps
```

### 端口映射

| 环境 | 遗留系统（PHP） | 新平台（Next.js） | 备注 |
|------|----------------|------------------|------|
| **本地开发** | `localhost:8000` | `localhost:3000` | 避免端口冲突 |
| **生产环境** | `https://tongxy.xyz` (443) | `https://tongxy.xyz:3000` | Nginx SSL 终止 |

---

## 🛠 技术栈

### 新平台（Next.js）

| 分类 | 技术选型 | 说明 |
|------|---------|------|
| **前端框架** | Next.js 15.x | React 全栈框架 |
| **后端服务** | MemFire Cloud | Supabase 中国替代方案（BaaS） |
| **UI 组件** | Shadcn/ui + Tailwind CSS | 现代化组件库 |
| **状态管理** | React Context / Zustand | 轻量级状态管理 |
| **部署平台** | 腾讯云 ECS | 容器化部署 |

### 遗留系统（存档）

| 分类 | 技术选型 |
|------|---------|
| **后端** | PHP 7.4 |
| **数据库** | MySQL 5.7 |
| **Web 服务器** | Nginx + PHP-FPM |

---

## 📋 项目文档

### 核心文档索引

| 文档 | 路径 | 说明 |
|------|------|------|
| **项目上下文** | `project-context.md` | 技术栈、部署信息、战略背景 |
| **开发日志** | `progress.md` | 详细的开发历程与问题解决记录 |
| **任务计划** | `task_plan.md` | 项目路线图与执行计划 |
| **产品简报** | `_bmad-output/01-analysis/product-brief.md` | 需求分析与产品定位 |
| **技术架构** | `_bmad-output/03-architecture/` | 系统架构设计文档 |
| **线框图** | `_bmad-output/02-design/wireframes.md` | UI/UX 设计原型 |

### 开发流程（BMAD 方法论）

项目采用 **Business Model Agile Development (BMAD)** 方法论：

1. **Phase 1 - 分析**: 需求调研、利益相关者访谈
2. **Phase 2 - 设计**: 产品设计、UX 原型
3. **Phase 3 - 架构**: 技术选型、系统设计
4. **Phase 4 - 实施**: 迭代开发、测试、部署

详细流程请参考 `_bmad-output/04-process/development-process.md`。

---

## 🎯 产品功能

### Phase 1: 对外门户网站（已完成）

- ✅ 品牌展示页
- ✅ 服务介绍页
- ✅ 志愿者招募页
- ✅ 捐赠入口
- ✅ SEO 优化

### Phase 2: 内部运营系统（规划中）

#### 运营控制台
- [ ] 家庭档案管理
- [ ] 活动排期系统
- [ ] 数据可视化仪表板
- [ ] 志愿者排班管理

#### 志愿者端
- [ ] 在线报名与审核
- [ ] 二维码签到
- [ ] 服务时长记录
- [ ] 成长积分体系

#### 家庭服务端
- [ ] 服务申请工单
- [ ] **政策助手**（AI 驱动）
- [ ] **共享厨房预订系统**
- [ ] 活动报名

---

## 🔧 开发指南

### 代码规范

```bash
# 代码格式化
npm run format

# 代码检查
npm run lint

# 类型检查（TypeScript）
npm run type-check
```

### Git 提交规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/)：

```
feat: 新增共享厨房预订功能
fix: 修复志愿者签到二维码失效问题
docs: 更新部署文档
chore: 升级依赖包版本
```

### 分支策略

- `master`: 生产环境代码
- `develop`: 开发主分支
- `feature/*`: 功能开发分支
- `hotfix/*`: 紧急修复分支

---

## 🐛 已知问题与解决方案

### 1. 字符编码问题（遗留系统）

**症状**: 中文显示为乱码（如 `è¿™æ˜¯...`）

**原因**: MySQL 5.7 默认 handshake 使用 Latin1 编码

**解决方案**:
```yaml
# docker-compose.yml
command: --character-set-server=utf8mb4 --skip-character-set-client-handshake
```

### 2. 微信图片防盗链

**症状**: 微信公众号图片返回 403 Forbidden

**解决方案**:
```html
<!-- header.php -->
<meta name="referrer" content="no-referrer" />
```

### 3. PowerShell 脚本兼容性

**症状**: 使用 `&&` 连接命令导致脚本失败

**解决方案**: 使用 `;` 或分离命令调用

更多问题请查看 `progress.md` 中的故障排查记录。

---

## 📊 项目里程碑

### 已完成 ✅

- [x] **2026-01-27**: 完成遗留系统 Docker 化并部署到 ECS
- [x] **2026-01-27**: 完成产品需求分析与设计
- [x] **2026-01-28**: 实现新平台 Phase 1（对外门户）
- [x] **2026-01-28**: 配置 Nginx SSL 反向代理

### 进行中 🚧

- [ ] **Phase 1 评审**: 利益相关者评审与反馈收集
- [ ] **高保真设计**: UI/UX 视觉设计稿制作

### 计划中 📅

- [ ] **Phase 2 启动**: 运营控制台开发
- [ ] **小程序开发**: 微信生态集成
- [ ] **AI 政策助手**: 基于 LLM 的智能问答

---

## 🤝 参与贡献

我们欢迎所有形式的贡献！

### 贡献方式

1. **Fork 本仓库**
2. **创建功能分支** (`git checkout -b feature/AmazingFeature`)
3. **提交更改** (`git commit -m 'feat: Add some AmazingFeature'`)
4. **推送到分支** (`git push origin feature/AmazingFeature`)
5. **提交 Pull Request**

### 贡献者公约

请阅读 [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) 了解行为准则。

---

## 📄 许可证

本项目采用 **MIT License** - 详见 [LICENSE](LICENSE) 文件。

---

## 🙏 致谢

### 技术支持
- [Next.js](https://nextjs.org/) - React 全栈框架
- [MemFire Cloud](https://memfiredb.com/) - 国产开源 BaaS 平台
- [Docker](https://www.docker.com/) - 容器化技术

### 设计灵感
- [Shadcn/ui](https://ui.shadcn.com/) - 组件库设计
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架

### 项目方法论
- **BMAD (Business Model Agile Development)** - 业务模型敏捷开发方法

---

## 📞 联系我们

- **官网**: [https://tongxy.xyz](https://tongxy.xyz)
- **Email**: contact@tongxy.xyz
- **微信公众号**: 同心源社区支持中心

---

<div align="center">

**用技术温暖每一个家庭** ❤️

Made with ❤️ by Tongxinyuan Team

</div>
