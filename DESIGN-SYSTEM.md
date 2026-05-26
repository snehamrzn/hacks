# Monolith — Design System

A monochrome, high-contrast design system inspired by the modern AI-lab visual
language (x.ai-style): black/white minimalism, geometric grotesk type, monospace
eyebrow labels, hairline borders, a single restrained blue accent, and smooth
expo-out motion.

> **Branding is placeholder** ("Monolith"). This documents a generic design
> *language* and original token values — no third-party logos, trademarks, or
> copy are reproduced.

---

## 1. Foundations

### 1.1 Color

| Token | Value | Use |
|---|---|---|
| `bg` | `#000000` | Page background |
| `surface` | `#0A0A0A` | Cards, panels |
| `elevated` | `#141414` | Raised surfaces, inputs, hover fills |
| `fg` | `#FFFFFF` | Primary text |
| `muted` | `#A1A1AA` | Secondary text |
| `subtle` | `#71717A` | Tertiary text, captions, labels |
| `border` | `rgba(255,255,255,0.10)` | Hairline dividers/borders |
| `border-strong` | `rgba(255,255,255,0.20)` | Hover/focus borders |
| `accent` | `#2D7FF9` | Links, primary CTA, focus ring |
| `accent-hover` | `#5499FB` | Accent hover state |

**Rules:** Monochrome first. The accent appears only on focus, the primary
action, and key links. Depth comes from hairline borders and surface lifts,
**not** drop shadows.

### 1.2 Typography

- **Sans (grotesk):** Inter — UI + headings, tight tracking at large sizes.
- **Mono:** JetBrains Mono — eyebrow labels, code, metadata (uppercase, wide tracking).

| Role | Size / line-height | Weight | Tracking |
|---|---|---|---|
| Display | `clamp(3rem, 7vw, 6rem)` / 1.0 | 600 | -0.03em |
| H1 | `clamp(2.25rem, 4vw, 3.5rem)` / 1.05 | 600 | -0.02em |
| H2 | `2rem` / 1.1 | 600 | -0.02em |
| H3 | `1.25rem` / 1.3 | 500 | -0.01em |
| Body | `1rem` / 1.6 | 400 | 0 |
| Small | `0.875rem` / 1.5 | 400 | 0 |
| Eyebrow (mono) | `0.75rem` / 1 | 500 | 0.15em · UPPERCASE |

### 1.3 Spacing & layout

- Base spacing scale: 4px steps (4, 8, 12, 16, 24, 32, 48, 64, 96…).
- Section rhythm: `section` = `clamp(5rem, 12vh, 9rem)` vertical padding.
- Container max-width: `1200px`; gutter `1.5rem` mobile → `2rem` desktop.
- Grid: 12-col desktop, collapsing to 2-col / 1-col on smaller screens.
- Breakpoints: **390** mobile · **768** tablet · **1024** laptop · **1440** desktop.

### 1.4 Radius & borders

- `radius-sm` 6px · `radius` 10px · `radius-lg` 16px · `radius-full` 9999px.
- Buttons/cards use `radius`; pills use `radius-full`. Corners stay restrained.
- Borders are 1px hairlines — they carry hierarchy instead of shadow.

### 1.5 Elevation

- Avoid drop shadows on dark UI. Use `border` + background lift (`surface` → `elevated`).
- Optional accent glow for the hero CTA: `0 0 0 1px accent, 0 8px 30px rgba(45,127,249,0.25)`.

---

## 2. Motion

Signature easing:
- **Entrances** → expo-out `cubic-bezier(0.16, 1, 0.3, 1)`
- **Hovers / state changes** → standard `cubic-bezier(0.4, 0, 0.2, 1)`

| Interaction | Trigger | Properties | From → To | Duration | Easing | Notes |
|---|---|---|---|---|---|---|
| Section reveal | scroll-into-view | opacity, translateY | 0,24px → 1,0 | 700ms | expo-out | once |
| List stagger | scroll-into-view | opacity, translateY | 0,16px → 1,0 | 600ms | expo-out | 80ms step |
| Button hover | hover | bg, border, translateY | base → -1px lift | 200ms | standard | + border-strong |
| Button press | active | scale | 1 → 0.98 | 120ms | standard | |
| Link underline | hover | underline width | 0 → 100% | 250ms | standard | left-anchored draw |
| Card hover | hover | border, bg | border→strong, surface→elevated | 250ms | standard | |
| Nav on scroll | scroll-progress | bg blur/opacity | transparent → blurred | 300ms | standard | past 8px scroll |
| Focus ring | focus-visible | box-shadow | none → accent ring | 150ms | standard | always on (a11y) |
| Marquee | continuous | translateX | 0 → -50% | 30s | linear | infinite loop |
| Text gradient sweep | continuous | background-position | loop | 6s | linear | optional hero accent |

All non-essential motion is gated behind `prefers-reduced-motion: reduce`.

---

## 3. Components

### Container
Centered, `max-w-1200px`, responsive gutters. Wraps every section's content.

### Section
Vertical rhythm wrapper using the `section` spacing token; optional top hairline.

### Eyebrow
Monospace, uppercase, `0.15em` tracking, `subtle` color, with a short leading
hairline rule. Signature label above headings.

### Badge / Pill
`radius-full`, monospace eyebrow text. Variants: `default` (border + muted) and
`accent` (translucent accent bg + accent-hover text).

### Button
- Variants: **primary** (`fg` bg, `bg` text), **secondary** (transparent + border),
  **ghost** (transparent, hover fill).
- Sizes: sm (h36) · md (h44) · lg (h52).
- Motion: -1px hover lift, 0.98 press scale, visible focus ring.

### Card
`surface` bg, hairline border, `radius-lg`, padding 24. Hover → `border-strong`
+ `elevated` bg over 250ms.

### Nav
Fixed, transparent at top; past 8px scroll gains a hairline bottom border and
`backdrop-blur` over a 70%-opacity `bg`. Links use the left-anchored underline draw.

### Marquee
Seamless infinite strip (content duplicated, `translateX 0 → -50%` over 30s),
with left/right gradient edge fades.

### Footer
Hairline top border, multi-column link groups with monospace group labels,
plus a bottom legal row.

### Motion wrappers
- **Reveal** — fades + slides content up once in view (expo-out, once).
- **Stagger / Stagger.Item** — parent staggers children 80ms apart into view.

---

## 4. Accessibility

- Visible `focus-visible` ring on all interactive elements (2px accent + 2px offset).
- Color contrast: `fg`/`bg` and `muted`/`bg` meet WCAG AA for their sizes.
- Semantic structure (`header`/`nav`/`main`/`footer`, heading order).
- `prefers-reduced-motion` disables transitions/animations and smooth scroll.

---

## 5. Theming

The system draws from one source of truth. To re-theme, change the color and
type tokens in §1 (or `tailwind.config.ts` if using the code scaffold) and the
entire system updates — components reference tokens, never hard-coded values.
