## Design System: Tongxinyuan

### Brand Assets
- **Logo Source**: `res/logo.png` (Project Root)
- **Web Path**: `/logo.png` (Mapped to `apps/web/public/logo.png`)
- **Visual**: Green Water Drop + Hand (Life & Hope)

### Pattern
- **Name:** Community/Forum Landing
- **Conversion Focus:** Show active community (member count, posts today). Highlight benefits. Preview content. Easy onboarding.
- **CTA Placement:** Join button prominent + After member showcase
- **Color Strategy:** Warm, welcoming. Member photos add humanity. Topic badges in brand colors. Activity indicators green.
- **Sections:** 1. Hero (community value prop), 2. Popular topics/categories, 3. Active members showcase, 4. Join CTA

### Style
- **Name:** Accessible & Ethical
- **Keywords:** High contrast, large text (16px+), keyboard navigation, screen reader friendly, WCAG compliant, focus state, semantic
- **Best For:** Government, healthcare, education, inclusive products, large audience, legal compliance, public
- **Performance:** 鈿?Excellent | **Accessibility:** 鉁?WCAG AAA

### Colors
| Role | Hex | Tailwind | Meaning |
|------|-----|----------|---------|
| **Primary** | #16A34A | `green-600` | **生命之绿**: 匹配 LOGO 主色，用于主按钮、导航栏、图标。代表生机与健康。 |
| **Secondary** | #FACC15 | `yellow-400` | **阳光之黄**: 辅助色，用于强调、通知、Tag。代表温暖与希望。 |
| **Accent** | #15803D | `green-700` | **深绿**: 用于文字悬停、深色背景块。 |
| **Background**| #F0FDF4 | `green-50` | **极浅绿**: 页面底色，营造清新的医疗/社区氛围。 |
| **Text** | #1E293B | `slate-800` | **深灰**: 正文颜色，比纯黑更柔和。标题可用深绿 (#14532D)。 |

*Notes: 基于 LOGO (绿色水滴) 定制的“同心源”专属色系。*

### Typography
- **Heading:** Figtree
- **Body:** Noto Sans
- **Mood:** medical, clean, accessible, professional, healthcare, trustworthy
- **Best For:** Healthcare, medical clinics, pharma, health apps, accessibility
- **Google Fonts:** https://fonts.google.com/share?selection.family=Figtree:wght@300;400;500;600;700|Noto+Sans:wght@300;400;500;700
- **CSS Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600;700&family=Noto+Sans:wght@300;400;500;700&display=swap');
```

### Key Effects
Clear focus rings (3-4px), ARIA labels, skip links, responsive design, reduced motion, 44x44px touch targets

### Avoid (Anti-patterns)
- Bright neon colors
- Motion-heavy animations
- AI purple/pink gradients

### Pre-Delivery Checklist
- [ ] No emojis as icons (use SVG: Heroicons/Lucide)
- [ ] cursor-pointer on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard nav
- [ ] prefers-reduced-motion respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px

