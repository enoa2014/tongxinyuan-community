# 同心源设计规范 (Tongxinyuan Design System) - Design Specification

> **Version**: 2.0.0 (Detailed)
> **Ref**: "Organic Healing" Strategy
> **Parent Document**: [Strategic Brand Guidelines](../01-strategy/design-system.md)

---

## 01. 视觉基础体系 (Visual Foundation)

该系统采用 **"有机疗愈 (Organic Healing)"** 设计语言，结合现代扁平风格与医疗行业的专业信任感，传递“家”的温度。

### 色彩策略 (Color Palette)
*   **背景层 (Background)**:
    *   **Concept**: "Clean Paper" (洁净纸张)。使用极淡的 `Green-50` (`#F0FDF4`) 作为核心底色，而非刺眼的纯白，营造护眼、柔和的阅读环境。
*   **主体层 (Foreground)**:
    *   **Primary**: `Green-600` (`#16A34A`) - 用于核心行动点（捐赠、加入）。象征生命力。
    *   **Secondary**: `Yellow-400` (`#FACC15`) - 用于高频互动点（链接、图标背景）。象征阳光与希望。
*   **文字层 (Typography Role)**:
    *   **Headings**: `Slate-900` (`#0F172A`) - 高对比度，确保信息传达清晰。
    *   **Body**: `Slate-600` (`#475569`) - 降低黑度，减少长文阅读疲劳。

### 字体策略 (Typography Strategy)
1.  **标题 (Headings)**: **Figtree**.
    *   几何感强，但在转角处带有柔和的弧度，兼具现代感与亲和力。
    *   *Usage*: H1-H3, Hero Slogans.
2.  **正文 (Body)**: **Noto Sans SC**.
    *   中性、清晰，用作长文阅读和信息展示。
3.  **数据 (Data)**: **Figtree (Tabular nums)**.
    *   用于筹款金额、志愿者时长显示，强调数据的专业性。

---

## 02. 布局逻辑 (Layout Logic)

### #Global Container (全局容器)
采用 **"Breathtaking Box" (会呼吸的盒子)** 策略。
*   **Max Width**: `1400px` (2XL Screen)。
*   **Side Padding (安全距)**: 强制全局 `2rem` (32px)。
    *   *Rationale*: 无论屏幕多宽，内容永远不会贴边，保持尊贵的留白感。

### #Vertical Rhythm (垂直韵律)
*   **Section Spacing**: `py-24` (96px) 或 `py-32` (128px)。
    *   不同板块之间必须有巨大的透气空间，避免信息拥挤带来的焦虑感。
*   **Inner Page Top (内页避让)**: `pt-32` (128px)。
    *   为了配合 **Glassmorphism Navbar** (80px)，内页内容必须下沉，确保首屏视觉焦点不被遮挡。

### #Card Grid (卡片网格)
*   **Symmetry**: 左右分栏布局（如 `/get-involved`）必须保持视觉重量平衡。左侧文案若对齐右侧卡片，必须包裹在同样的 `bg-white p-8 rounded-2xl` 容器中。

---

## 03. 组件详细规范 (Component Specs)

### 03.01 Hero 板块 (Hero Section)
*   **排版**: 采用超大号标题 `text-4xl sm:text-6xl`, 行高紧凑 (`leading-tight`, `tracking-tight`)。
*   **对齐**:
    *   **Home**: 居中对齐 (Center Aligned)，强调宏大愿景。
    *   **Inner**: 左对齐 (Left Aligned)，强调阅读效率。
*   **背景**: 必须包含插画或环境图，禁止纯色背景。

### 03.02 功能性卡片 (Feature Cards)
*   **结构**: Icon (Top Left) -> Title -> Description.
*   **样式**:
    *   `border-l-4`: 左侧色条 (`border-brand-yellow` etc.) 用于区分信息层级。
    *   `shadow-sm`: 默认状态仅有极淡的阴影。
*   **交互 (Interaction)**:
    *   **Hover**: `shadow-md`, `border-slate-200` darken. 卡片整体上浮不可超过 2px，保持稳重感。

### 03.03 导航栏 (Navigation Bar)
*   **材质**: Glassmorphism (毛玻璃)。
    *   `bg-white/90 backdrop-blur-md`.
*   **行为**:
    *   **Top**: 透明背景，白色文字（融入 Hero 背景）。
    *   **Scrolled**: 白色背景，深色文字（确保可读性），阴影 `shadow-sm` 浮现。

---

## 04. 动效表现 (Motion)

### 数据可视化 (Metrics)
*   **Loading**: 页面加载时，关键数字（如筹款额）应执行 **CountUp** 动画（从 0 滚动至最终值，耗时 1.5s）。

### 交互反馈 (Micro-interactions)
*   **Button Click**: `active:scale-95`. 细腻的缩放反馈，模拟物理按键的触感。
*   **Link Hover**: 颜色加深，或底部出现下划线动画 (`width: 0 -> 100%`)。

### 页面转场 (Page Transition)
*   **Fade In Up**: 核心内容块（标题、卡片）在加载时应执行 `translate-y-4` -> `0` 及 `opacity-0` -> `1` 的缓动上浮。
    *   *Duration*: 700ms.
    *   *Easing*: `ease-out`.

---

## 05. 技术预设 (Technical Presets)
此规范已固化在以下配置文件中，由代码强制执行：
1.  **Tailwind Config**: `colors.brand`, `container.padding`.
2.  **Wrapper Component**: `InnerPageWrapper` (`pt-32`).
3.  **Global CSS**: `body { @apply bg-background text-foreground }`.
