# Visual Design Tokens & Guidelines

**File:** `@specs/plans/visual-design-tokens.md`
**Phase:** II – Full-Stack Web Application (Frontend)
**Priority:** Critical – Exact specifications for premium UI implementation
**Status:** Final
**Version:** 1.0
**Last Updated:** January 2026

---

## Overview

This document provides **exact, production-ready design tokens** for implementing the Todo application frontend. Every value has been carefully chosen to create a premium, cohesive visual experience inspired by Linear, Notion, and modern productivity tools.

**Usage:** These tokens should be configured in `tailwind.config.ts` and referenced throughout the application for perfect consistency.

---

## 1. Color Palette (Exact Hex Codes)

### Primary Colors (Indigo)

```typescript
// Light Mode Primary
primary: {
  50:  '#eef2ff',  // Lightest tint
  100: '#e0e7ff',
  200: '#c7d2fe',
  300: '#a5b4fc',
  400: '#818cf8',
  500: '#6366f1',  // Primary accent
  600: '#4f46e5',  // Primary default (buttons, links)
  700: '#4338ca',  // Primary hover
  800: '#3730a3',
  900: '#312e81',
  950: '#1e1b4b',
}

// Dark Mode Primary
// Use 500 as default, 400 for hover in dark mode
```

### Neutral Colors (Gray Scale)

```typescript
// Cool Gray (for professional feel)
gray: {
  50:  '#f9fafb',  // Light mode background
  100: '#f3f4f6',  // Light mode surface alt
  200: '#e5e7eb',  // Light mode borders
  300: '#d1d5db',
  400: '#9ca3af',  // Dark mode text secondary
  500: '#6b7280',
  600: '#4b5563',  // Light mode text secondary
  700: '#374151',
  800: '#1f2937',  // Dark mode borders
  900: '#111827',  // Dark mode surface
  950: '#030712',  // Dark mode background
}
```

### Semantic Colors

```typescript
// Success (Green)
success: {
  light: '#10b981',  // #10b981 (emerald-500)
  dark:  '#34d399',  // #34d399 (emerald-400)
}

// Error (Red)
error: {
  light: '#ef4444',  // #ef4444 (red-500)
  dark:  '#f87171',  // #f87171 (red-400)
}

// Warning (Amber)
warning: {
  light: '#f59e0b',  // #f59e0b (amber-500)
  dark:  '#fbbf24',  // #fbbf24 (amber-400)
}

// Info (Blue)
info: {
  light: '#3b82f6',  // #3b82f6 (blue-500)
  dark:  '#60a5fa',  // #60a5fa (blue-400)
}
```

### Priority Colors (Task Management)

```typescript
priority: {
  high: {
    light: '#ef4444',  // red-500
    dark:  '#f87171',  // red-400
    bg: {
      light: '#fee2e2',  // red-100
      dark:  '#7f1d1d',  // red-950 with opacity
    }
  },
  medium: {
    light: '#f59e0b',  // amber-500
    dark:  '#fbbf24',  // amber-400
    bg: {
      light: '#fef3c7',  // amber-100
      dark:  '#78350f',  // amber-950 with opacity
    }
  },
  low: {
    light: '#3b82f6',  // blue-500
    dark:  '#60a5fa',  // blue-400
    bg: {
      light: '#dbeafe',  // blue-100
      dark:  '#1e3a8a',  // blue-950 with opacity
    }
  }
}
```

### Background Gradients

```typescript
gradients: {
  hero: {
    light: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    dark:  'linear-gradient(135deg, #4338ca 0%, #312e81 100%)',
  },
  subtle: {
    light: 'linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)',
    dark:  'linear-gradient(180deg, #111827 0%, #030712 100%)',
  },
  card: {
    light: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
    dark:  'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
  }
}
```

---

## 2. Typography System

### Font Family

```typescript
fontFamily: {
  sans: [
    'Inter Variable',
    'Inter',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
  mono: [
    'JetBrains Mono',
    'Fira Code',
    'Consolas',
    'Monaco',
    'monospace',
  ],
}
```

### Font Sizes with Line Heights & Letter Spacing

```typescript
fontSize: {
  // Display (Hero text)
  '5xl': ['3rem', {      // 48px
    lineHeight: '1.1',
    letterSpacing: '-0.02em',
    fontWeight: '700',
  }],
  '4xl': ['2.25rem', {   // 36px
    lineHeight: '1.2',
    letterSpacing: '-0.01em',
    fontWeight: '700',
  }],

  // Headings
  '3xl': ['1.875rem', {  // 30px
    lineHeight: '1.25',
    letterSpacing: '-0.01em',
    fontWeight: '700',
  }],
  '2xl': ['1.5rem', {    // 24px
    lineHeight: '1.3',
    letterSpacing: '-0.005em',
    fontWeight: '600',
  }],
  'xl': ['1.25rem', {    // 20px
    lineHeight: '1.4',
    letterSpacing: '0',
    fontWeight: '600',
  }],

  // Body
  'lg': ['1.125rem', {   // 18px
    lineHeight: '1.6',
    letterSpacing: '0',
    fontWeight: '400',
  }],
  'base': ['1rem', {     // 16px
    lineHeight: '1.5',
    letterSpacing: '0',
    fontWeight: '400',
  }],
  'sm': ['0.875rem', {   // 14px
    lineHeight: '1.5',
    letterSpacing: '0',
    fontWeight: '400',
  }],
  'xs': ['0.75rem', {    // 12px
    lineHeight: '1.4',
    letterSpacing: '0.01em',
    fontWeight: '500',
  }],
}
```

### Font Weights

```typescript
fontWeight: {
  normal:    400,
  medium:    500,
  semibold:  600,
  bold:      700,
}
```

---

## 3. Spacing System (4px Grid)

```typescript
spacing: {
  px: '1px',
  0:  '0',
  0.5: '2px',   // 0.5 * 4px
  1:  '4px',    // 1 * 4px
  1.5: '6px',   // 1.5 * 4px
  2:  '8px',    // 2 * 4px
  2.5: '10px',  // 2.5 * 4px
  3:  '12px',   // 3 * 4px
  3.5: '14px',  // 3.5 * 4px
  4:  '16px',   // 4 * 4px
  5:  '20px',   // 5 * 4px
  6:  '24px',   // 6 * 4px
  7:  '28px',   // 7 * 4px
  8:  '32px',   // 8 * 4px
  9:  '36px',   // 9 * 4px
  10: '40px',   // 10 * 4px
  11: '44px',   // 11 * 4px
  12: '48px',   // 12 * 4px
  14: '56px',   // 14 * 4px
  16: '64px',   // 16 * 4px
  20: '80px',   // 20 * 4px
  24: '96px',   // 24 * 4px
  28: '112px',  // 28 * 4px
  32: '128px',  // 32 * 4px
}
```

---

## 4. Border Radius Scale

```typescript
borderRadius: {
  none: '0',
  sm:   '4px',   // Small elements (badges, tags)
  DEFAULT: '6px', // Default (inputs, small buttons)
  md:   '8px',   // Medium (buttons, cards)
  lg:   '12px',  // Large (modals, large cards)
  xl:   '16px',  // Extra large (hero sections)
  '2xl': '20px', // Very large (special cards)
  '3xl': '24px', // Huge (landing page sections)
  full: '9999px', // Circular (avatars, FAB)
}
```

---

## 5. Shadow System

### Elevation Shadows (Light Mode)

```typescript
boxShadow: {
  // Subtle elevation
  'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',

  // Default card elevation
  'sm': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',

  // Hover state
  'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',

  // Elevated cards
  'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',

  // Modals and popovers
  'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',

  // Maximum elevation
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',

  // Inner shadow (for pressed states)
  'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
}
```

### Dark Mode Shadows

```typescript
// In dark mode, use lighter shadows with lower opacity
boxShadow: {
  'sm-dark':  '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px -1px rgba(0, 0, 0, 0.3)',
  'md-dark':  '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.4)',
  'lg-dark':  '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -4px rgba(0, 0, 0, 0.5)',
  'xl-dark':  '0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 8px 10px -6px rgba(0, 0, 0, 0.6)',
  '2xl-dark': '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
}
```

---

## 6. Glass Effect (Glassmorphism)

### Glass Card Style

```css
/* Light Mode Glass */
.glass-light {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
}

/* Dark Mode Glass */
.glass-dark {
  background: rgba(17, 24, 39, 0.7);
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
}
```

### Tailwind Config for Glass

```typescript
// Add to tailwind.config.ts
backdropBlur: {
  xs: '2px',
  sm: '4px',
  DEFAULT: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '40px',
  '3xl': '64px',
}

backdropSaturate: {
  0: '0',
  50: '.5',
  100: '1',
  150: '1.5',
  180: '1.8',
  200: '2',
}
```

---

## 7. Animation System

### Duration Scale

```typescript
transitionDuration: {
  fastest: '75ms',    // Micro-interactions (hover, focus)
  faster:  '100ms',   // Quick feedback
  fast:    '150ms',   // Default transitions
  DEFAULT: '200ms',   // Standard animations
  slow:    '300ms',   // Deliberate animations
  slower:  '500ms',   // Page transitions
  slowest: '700ms',   // Special effects
}
```

### Easing Functions

```typescript
transitionTimingFunction: {
  // Standard easings
  linear:    'linear',
  in:        'cubic-bezier(0.4, 0, 1, 1)',
  out:       'cubic-bezier(0, 0, 0.2, 1)',
  'in-out':  'cubic-bezier(0.4, 0, 0.2, 1)',

  // Custom premium easings
  'ease-smooth':   'cubic-bezier(0.4, 0.0, 0.2, 1)',      // Smooth, natural
  'ease-bounce':   'cubic-bezier(0.68, -0.55, 0.265, 1.55)', // Playful bounce
  'ease-elastic':  'cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Elastic feel
  'ease-premium':  'cubic-bezier(0.16, 1, 0.3, 1)',      // Premium feel (Linear-style)
}
```

### Common Animation Patterns

```typescript
// Fade in
animation: {
  'fade-in': 'fadeIn 200ms ease-premium',
  'fade-out': 'fadeOut 200ms ease-premium',

  // Slide animations
  'slide-in-up': 'slideInUp 300ms ease-premium',
  'slide-in-down': 'slideInDown 300ms ease-premium',
  'slide-in-left': 'slideInLeft 300ms ease-premium',
  'slide-in-right': 'slideInRight 300ms ease-premium',

  // Scale animations
  'scale-in': 'scaleIn 200ms ease-premium',
  'scale-out': 'scaleOut 200ms ease-premium',

  // Spin (for loaders)
  'spin-slow': 'spin 1.5s linear infinite',

  // Pulse (for notifications)
  'pulse-subtle': 'pulse 2s ease-premium infinite',

  // Shimmer (for skeletons)
  'shimmer': 'shimmer 2s ease-in-out infinite',
}

// Keyframes
keyframes: {
  fadeIn: {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  },
  fadeOut: {
    '0%': { opacity: '1' },
    '100%': { opacity: '0' },
  },
  slideInUp: {
    '0%': { transform: 'translateY(10px)', opacity: '0' },
    '100%': { transform: 'translateY(0)', opacity: '1' },
  },
  slideInDown: {
    '0%': { transform: 'translateY(-10px)', opacity: '0' },
    '100%': { transform: 'translateY(0)', opacity: '1' },
  },
  slideInLeft: {
    '0%': { transform: 'translateX(-10px)', opacity: '0' },
    '100%': { transform: 'translateX(0)', opacity: '1' },
  },
  slideInRight: {
    '0%': { transform: 'translateX(10px)', opacity: '0' },
    '100%': { transform: 'translateX(0)', opacity: '1' },
  },
  scaleIn: {
    '0%': { transform: 'scale(0.95)', opacity: '0' },
    '100%': { transform: 'scale(1)', opacity: '1' },
  },
  scaleOut: {
    '0%': { transform: 'scale(1)', opacity: '1' },
    '100%': { transform: 'scale(0.95)', opacity: '0' },
  },
  shimmer: {
    '0%': { backgroundPosition: '-1000px 0' },
    '100%': { backgroundPosition: '1000px 0' },
  },
}
```

---

## 8. Z-Index Scale

```typescript
zIndex: {
  0:      0,
  10:     10,    // Dropdown content
  20:     20,    // Sticky headers
  30:     30,    // Fixed sidebars
  40:     40,    // Modals backdrop
  50:     50,    // Modals content
  60:     60,    // Popovers
  70:     70,    // Tooltips
  80:     80,    // Toast notifications
  90:     90,    // Loading overlays
  100:    100,   // Maximum (critical UI)
}
```

---

## 9. Breakpoints (Responsive Design)

```typescript
screens: {
  'xs':  '375px',   // Small phones
  'sm':  '640px',   // Large phones
  'md':  '768px',   // Tablets
  'lg':  '1024px',  // Small laptops
  'xl':  '1280px',  // Desktops
  '2xl': '1536px',  // Large desktops
}
```

---

## 10. Component-Specific Tokens

### Buttons

```typescript
button: {
  height: {
    sm: '32px',   // 8 * 4px
    md: '40px',   // 10 * 4px
    lg: '48px',   // 12 * 4px
  },
  padding: {
    sm: '0 12px',
    md: '0 16px',
    lg: '0 24px',
  },
  fontSize: {
    sm: '14px',
    md: '16px',
    lg: '18px',
  },
  borderRadius: {
    sm: '6px',
    md: '8px',
    lg: '10px',
  },
}
```

### Inputs

```typescript
input: {
  height: {
    sm: '36px',
    md: '44px',
    lg: '52px',
  },
  padding: {
    sm: '0 12px',
    md: '0 16px',
    lg: '0 20px',
  },
  fontSize: {
    sm: '14px',
    md: '16px',
    lg: '18px',
  },
  borderRadius: '8px',
  borderWidth: '1px',
  focusRingWidth: '2px',
  focusRingOffset: '2px',
}
```

### Cards

```typescript
card: {
  padding: {
    sm: '16px',
    md: '24px',
    lg: '32px',
  },
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
  },
  borderWidth: '1px',
}
```

### Task Card Specific

```typescript
taskCard: {
  height: 'auto',
  minHeight: '72px',
  padding: '16px',
  borderRadius: '8px',
  borderLeftWidth: '3px',  // For priority indicator
  hoverTransform: 'translateY(-2px)',
  hoverShadow: 'lg',
  transitionDuration: '200ms',
  transitionTiming: 'ease-premium',
}
```

---

## 11. Icon Sizes

```typescript
iconSize: {
  xs:  '12px',
  sm:  '16px',
  md:  '20px',
  lg:  '24px',
  xl:  '32px',
  '2xl': '40px',
}
```

---

## 12. Focus Ring System

```typescript
focusRing: {
  width: '2px',
  offset: '2px',
  color: {
    light: '#4f46e5',  // indigo-600
    dark:  '#6366f1',  // indigo-500
  },
  style: 'solid',
  opacity: '0.5',
}

// Tailwind classes
// focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2
```

---

## 13. Opacity Scale

```typescript
opacity: {
  0:    '0',
  5:    '0.05',
  10:   '0.1',
  20:   '0.2',
  30:   '0.3',
  40:   '0.4',
  50:   '0.5',
  60:   '0.6',
  70:   '0.7',
  80:   '0.8',
  90:   '0.9',
  95:   '0.95',
  100:  '1',
}
```

---

## 14. Practical Usage Examples

### Premium Button

```tsx
<button className="
  h-10 px-4
  bg-indigo-600 hover:bg-indigo-700
  text-white font-medium text-sm
  rounded-md
  shadow-sm hover:shadow-md
  transition-all duration-200 ease-premium
  focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2
  active:scale-95
">
  Create Task
</button>
```

### Glass Card

```tsx
<div className="
  p-6 rounded-lg
  bg-white/70 dark:bg-gray-900/70
  backdrop-blur-md backdrop-saturate-180
  border border-white/30 dark:border-white/10
  shadow-xl
">
  Content
</div>
```

### Task Card with Hover

```tsx
<div className="
  p-4 rounded-lg
  bg-white dark:bg-gray-900
  border border-gray-200 dark:border-gray-800
  border-l-4 border-l-red-500
  shadow-sm hover:shadow-lg
  transition-all duration-200 ease-premium
  hover:-translate-y-0.5
  cursor-pointer
">
  Task content
</div>
```

### Floating Action Button

```tsx
<button className="
  fixed bottom-6 right-6
  w-14 h-14
  bg-indigo-600 hover:bg-indigo-700
  text-white
  rounded-full
  shadow-lg hover:shadow-xl
  transition-all duration-200 ease-premium
  hover:scale-110
  active:scale-95
  focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2
">
  <PlusIcon className="w-6 h-6" />
</button>
```

---

## 15. Implementation Checklist

### Tailwind Configuration
- [ ] Copy all color tokens to `tailwind.config.ts`
- [ ] Configure custom font family
- [ ] Add custom spacing scale
- [ ] Configure border radius scale
- [ ] Add custom shadows
- [ ] Configure animations and keyframes
- [ ] Set up breakpoints
- [ ] Configure backdrop filters

### Global Styles
- [ ] Import Inter Variable font
- [ ] Set up base typography styles
- [ ] Configure focus ring styles
- [ ] Add smooth scrolling
- [ ] Set up dark mode class strategy

### Component Library
- [ ] Create reusable button variants
- [ ] Create input components with focus states
- [ ] Create card variants (default, glass, elevated)
- [ ] Create badge components with priority colors
- [ ] Create loading skeletons with shimmer

---

## 16. Quality Assurance

### Visual Consistency Checks
- [ ] All spacing uses 4px grid
- [ ] All colors from defined palette
- [ ] All shadows from shadow scale
- [ ] All animations use defined durations
- [ ] All border radius from scale
- [ ] Typography hierarchy is consistent

### Accessibility Checks
- [ ] Color contrast ratios meet WCAG AA (4.5:1 for text)
- [ ] Focus indicators are visible
- [ ] Interactive elements have min 44x44px touch targets
- [ ] Animations respect prefers-reduced-motion

### Performance Checks
- [ ] No layout shifts (CLS)
- [ ] Smooth 60fps animations
- [ ] Optimized font loading
- [ ] Efficient CSS (no unused styles)

---

## Related Documents

- **Implementation Plan:** `@specs/plans/frontend-beautiful-implementation-plan.md`
- **Frontend Specification:** `@specs/features/frontend-complete.md`
- **Task Breakdown:** `@specs/tasks/frontend-implementation-tasks.md`

---

**Status:** Production-ready design tokens. Use these exact values for implementation.
