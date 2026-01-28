# 同心源设计系统 (Design System - Pro Max Edition)

> **核心理念**: **"Organic Healing" (有机疗愈)**.
> 拒绝冰冷的医疗感，打造一个像"家"一样温暖、包容、充满生命力的数字空间。

## 1. 视觉基础 (Visual Foundation)

### 1.1 多肤色主题体系 (Multi-Theme System)
为了满足不同场景（如节日活动、季节变化）的需求，系统采用 **语义化 CSS 变量** 构建色彩系统，支持一键换肤。

#### (A) 核心主题定义
| 主题名 | 关键词 | 主色 (Primary) | 辅色 (Secondary) | 适用场景 |
| :--- | :--- | :--- | :--- | :--- |
| **Organic (默认)** | 疗愈/生命 | **Emerald** (生命绿) | **Amber** (阳光暖) | 日常、小家服务 |
| **Ocean (宁静)** | 信任/清凉 | **Sky** (天空蓝) | **Indigo** (沉静蓝) | 财务披露、夏季 |
| **Sunrise (活力)** | 热情/行动 | **Rose** (玫瑰红) | **Orange** (活力橙) | 志愿者日、筹款 |

#### (B) 语义化 Token (Semantic Tokens)
我们在开发中**不直接使用颜色名** (如 `bg-green-500`)，而是使用**语义名** (如 `bg-primary`)。

*   **Primary (主品牌色)**: `var(--primary)` - 用于按钮、高亮文本。
*   **Secondary (辅助色)**: `var(--secondary)` - 用于装饰元素、徽章。
*   **Accent (点缀色)**: `var(--accent)` - 用于重要行动点 (Give/Join)。
*   **Background (背景色)**:
    *   `--background`: 页面底色 (Day: 米白 / Night: 深灰)。
    *   `--surface`: 卡片底色 (Day: 纯白 / Night: 浅灰)。

#### (C) 颜色映射表 (Mapping)
```css
/* Theme: Organic (Default) */
:root {
  --primary: 16 185 129;  /* Emerald-500 */
  --secondary: 245 158 11; /* Amber-500 */
  --background: 250 250 249; /* Stone-50 */
}

/* Theme: Ocean */
[data-theme='ocean'] {
  --primary: 14 165 233;   /* Sky-500 */
  --secondary: 99 102 241; /* Indigo-500 */
  --background: 240 249 255; /* Sky-50 */
}

/* Theme: Sunrise */
[data-theme='sunrise'] {
  --primary: 244 63 94;    /* Rose-500 */
  --secondary: 249 115 22; /* Orange-500 */
  --background: 255 241 242; /* Rose-50 */
}
```

### 1.2 排版 (Typography)
*   **Display (标题)**: **[Outfit](https://fonts.google.com/specimen/Outfit)**.
    *   几何感强但带有圆形特征，现代且亲和。
    *   *Usage*: 首页大标题、Slogan、数字看板。
*   **Body (正文)**: **[Noto Sans SC](https://fonts.google.com/noto/specimen/Noto+Sans+SC)**.
    *   高可读性，多字重支持。
*   **Accent (情感化)**: **[Ma Shan Zheng](https://fonts.google.com/specimen/Ma+Shan+Zheng)** (马善政毛笔楷书).
    *   *Usage*: 节日海报、"异乡的家" 等感性标语。

### 1.3 形状与质感 (Shapes & Textures)
*   **Radius**: 全局使用 **`rounded-2xl` (16px)** 或 **`rounded-3xl` (24px)**。
    *   *Rationale*: 圆角传递安全感（"没有棱角的小家"）。
*   **Glassmorphism (磨砂玻璃)**:
    *   用于浮层、导航栏。
    *   `bg-white/70 backdrop-blur-md border-white/20`
*   **Organic Blobs (有机斑点)**:
    *   作为背景装饰，打破矩形布局的僵硬感。
*   **Noise Texture (颗粒杂色)**:
    *   叠加极细微的杂色纹理，增加纸质书般的温暖触感。

---

## 2. 组件设计 (Component Architecture)

### 2.1 移动优先 (Mobile First)
针对社工和家庭的高频手机操作场景。

*   **触控目标**: 所有按钮/链接点击区域最小 **44x44px**。
*   **Bottom Sheet (底部抽屉)**:
    *   替代传统的 Modal 弹窗。
    *   用于：填写表单、查看详情、筛选条件。
    *   *优点*: 单手操作友好。
*   **Skeleton Loading (骨架屏)**:
    *   拒绝原本的 "Loading..." 转圈。
    *   展示内容轮廓的脉冲动画，缓解等待焦虑。

### 2.2 关键组件规范

#### (A) 情感化卡片 (Emotive Cards)
用于展示受助故事、活动回顾。
*   **结构**: 全出血图片 (Full-bleed image) + 底部渐变蒙层文字。
*   **交互**: Hover 时图片微放大 (Scale 1.05)，卡片上浮 (Translate-Y -4px)，阴影加深。

#### (B) 信任感表单 (Trust Forms)
用于捐赠、志愿者报名。
*   **分步引导 (Steppers)**: 将长表单拆分为 "3步走"，降低心理负担。
*   **即时反馈**: 输入正确时给予绿色微动画 (Checkmark)。

#### (C) 快速操作栏 (Fab/Action Bar)
用于社工移动端。
*   **悬浮**: 固定在屏幕右下角或底部。
*   **功能**: [📷 拍照] [📝 记事] [📍 签到]

---

## 3. 动效设计 (Motion & Micro-interactions)

> **原则**: "Slow In, Slow Out" (缓入缓出)，如呼吸般自然。

*   **页面转场**:
    *   内容块按顺序 **Staggered Fade Up** (交错上浮)。
    *   `duration-500 ease-out delay-[100ms]`
*   **点赞/捐赠反馈**:
    *   点击爱心时，爆发出粒子效果 (Confetti)。
    *   给用户强烈的正向心理奖赏。

### 3.2 交互反馈规范 (Feedback & States)

#### (A) 全局提示 (Toast)
*   **位置**: 移动端顶部居中，PC端右上角。
*   **样式**: 胶囊型，磨砂玻璃背景，带语义图标。
    *   Success: `bg-emerald-50 text-emerald-700 icon-check`
    *   Error: `bg-red-50 text-red-700 icon-alert` (文案需温柔)
*   **动效**: Slide Down from Top + Fade Out (3s).

#### (B) 模态对话框 (Dialog/Modal)
*   **Mobile**: **优选 Bottom Sheet (底部半屏弹窗)**。
    *   *场景*: 二次确认、选择器、简短说明。
    *   *理由*: 拇指热区友好，交互打断感弱于居中弹窗。
*   **Desktop**: 居中圆角卡片，背景遮罩模糊 (`backdrop-blur-sm`)。

#### (C) 空状态 (Empty State)
*   **构成**: 
    1.  **插画**: 灰色调/品牌色线条画 (如: 空空的收纳箱)。
    2.  **文案**: 充满人情味的提示 (如 "这里很安静，还没有消息")。
    3.  **CTA**: 引导行动的按钮 (如 "去看看活动")。
*   **原则**: **Never Dead End** (绝不让用户无路可走)。

---

## 4. 技术实现指南 (Frontend Implementation)

### 4.1 Tailwind Config (Dynamic Theming)
```javascript
module.exports = {
  darkMode: ["class"], // 支持手动切换深色模式
  theme: {
    extend: {
      colors: {
        // 使用 CSS 变量绑定颜色，支持完全的动态换肤
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
      },
      borderRadius: {
        '3xl': '1.5rem', // 24px - 核心圆角
      }
    }
  }
}
```

### 4.2 必要的库
*   **Subject**: `next-themes` (用于管理多主题切换，兼容 SSR)。
*   **Icons**: `lucide-react`.
*   **Components**: `shadcn/ui` (Radix Primitives + Tailwind).
