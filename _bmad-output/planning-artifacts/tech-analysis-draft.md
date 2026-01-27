# 技术选型与 AI 架构分析报告 (Tech Analysis & AI Strategy)

本报告由 BMAD 专家组（架构师、PM、技术专家）联合编写，旨在回应您关于**阿里云 ECS 部署**、**Docker 容器化**以及**深度 AI 集成**的需求。

## 1. 基础设施与部署选型 (Infrastructure & Deployment)

### 1.1 核心决策：阿里云 ECS + Docker
您拥有强大的 C/Linux 背景，这是巨大的优势。相比于全托管的 Serverless (如 Vercel/MemFire)，**自建 ECS + Docker** 方案赋予了您完全的掌控力（Root Access），且在长期运行中通常更具成本效益。

| 维度 | 方案 A: 传统二进制部署 | 方案 B: Docker 容器化 (推荐) |
| :--- | :--- | :--- |
| **原理** | 直接在 Linux 上安装 Node, Nginx, Postgres 等 | 将应用及其依赖封装在镜像中，通过 Engine 运行 |
| **一致性** | 差（"我本地是好的，服务器上不行"） | **极佳**（环境即代码，Dockerfile 固化一切） |
| **迁移性** | 困难，依赖特定 OS 版本和库 | **极强**，可以在任意装有 Docker 的机器上运行 |
| **维护成本** | 高，需要手动管理依赖冲突、版本升级 | **低**，升级只需拉取新镜像重启 |
| **适合您吗** | 适合，但容易把服务器环境“弄脏” | **最适合**，发挥您的 Linux 优势，且保持系统洁净 |

### 1.2 推荐架构：Docker Compose 单机编排
对于初期和中期规模，不需要复杂的 K8s。使用 **Docker Compose** 即可在一个文件中管理所有服务。

**架构图 (Architecture Diagram):**
```mermaid
graph TD
    User((User)) --> Nginx[Nginx (Reverse Proxy)]
    subgraph Docker Host (ECS)
        Nginx --> App[Next.js App (Frontend + API)]
        Nginx --> PythonAPI[Python API (AI Agent / RAG)]
        App --> DB[(Postgres DB)]
        PythonAPI --> DB
        PythonAPI --> VectorDB[(Vector DB / PGVector)]
    end
    PythonAPI --> AliyunModel[Aliyun Qwen / DeepSeek]
```

### 1.3 风险与开销 (Risks & Costs)
*   **运维负担**: 需要自己配置防火墙 (Security Group)、备份策略、日志监控。
    *   *对策*: 编写 Shell 脚本自动化备份（利用您的 Linux 技能）。
*   **单点故障**: ECS 宕机则全站不可用。
    *   *对策*: 购买云盘快照；数据库定期冷备到 OSS。

## 2. AI 深度集成方案 (Deep AI Integration)

我们要让 AI 不仅仅是聊天机器人，而是业务流程的加速器。

### 2.1 场景一：社工赋能 (Empowerment) - 标准化 + 个性化

**需求**: 
1.  **SOP生成**: 输入极简信息 -> 生成全套策划。
2.  **个性化开发**: 社工利用 AI 搭建页面。

**解决方案**: **Headless CMS + AI Page Builder**
*   **核心逻辑**: 我们不把页面写死，而是定义一套“积木”（JSON Schema）。
*   **流程**:
    1.  **社工输入**: "我想做一个‘小小营养师’活动，针对白血病康复期儿童，风格要活泼。"
    2.  **AI (LLM)**: 生成一份 JSON 配置，包含：
        *   `layout`: 顶部 Banner + 活动介绍 + 报名表单 + 往期回顾 Gallery。
        *   `content`: 自动生成的文案、建议配图 Prompt。
        *   `workflow`: 生成任务清单（SOP）。
    3.  **系统**: 将 JSON 渲染为网页。
    4.  **社工干预**: 社工可以在可视化界面上微调（改字、换图、增减模块），发挥主观能动性。

### 2.2 场景二：政策风控哨兵 (Policy Watchdog)

**需求**: 自动抓取更新，评估风险，辅助申请。

**技术实现**: **周期性爬虫 + RAG (检索增强生成)**
1.  **Crawler (Python/Go)**: 每周运行，抓取民政网、医保局官网。您擅长 Linux，可以用 Cron Job + Python Scrapy/BeautifulSoup 管理。
2.  **Vector DB**: 将抓取的政策切片存入向量数据库（PGVector，不仅存DB，还不用额外部署服务）。
3.  **Matching Engine**:
    *   当新政策入库时，AI 扫描活跃家庭档案（已脱敏）。
    *   Prompt: *"根据这条新发布的《大病救助办法》，判断家庭 A（白血病，低保户）是否符合申请条件？"*
    *   如有匹配，推送通知给对应负责社工。

### 2.3 场景三：专业知识库 (Knowledge Base)

**需求**: 疾病、膳食、心理、历史记录分析。

**策略**: **私有数据清洗 + 通用大模型**
*   **历史记录**: 将机构过去的文档（社工日志、活动记录）进行 OCR 和清洗，作为机构的“大脑”。
*   **外部知识**: 结合通用的医学指南（需注明来源，AI 仅做辅助索引，不做医疗诊断）。
*   **Usage**: 社工遇到棘手个案时，可以问：“以前有没有处理过这种不想吃饭、抗拒治疗的 5 岁孩子？以前是怎么解决的？” 系统检索历史日志给出参考。

## 3. 下一步建议 (Next Steps)

1.  **确认技术栈**:
    *   **OS**: Ubuntu 22.04 LTS or 24.04 LTS (ECS 标准镜像).
    *   **Container**: Docker + Docker Compose.
    *   **App**: Next.js (React) for Fullstack Web.
    *   **AI Backend**: Python (FastAPI) - 方便处理爬虫和与 LLM 交互，适合您的技术背景。
    *   **Database**: PostgreSQL (with pgvector extension) - 一个库搞定关系数据和 AI 向量数据。

2.  **POC (概念验证)**:
    *   优先搭建 Docker Compose 环境。
    *   写一个简单的 Python 脚本，试着调用通义千问 API 生成一个“活动策划 JSON”，并在前端展示出来。

请审阅以上分析。如果您同意这个技术方向，我将开始着手设计详细的一期架构文档。
