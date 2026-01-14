# Constitutional-Aware Frontend Implementation Tasks

**File:** `@specs/tasks/frontend-constitutional-tasks.md`
**Phase:** II – Full-Stack Web Application (Frontend)
**Based On:**
- `@CONSTITUTION.md` - Project constitution
- `@specs/plans/frontend-beautiful-implementation-plan.md` - Implementation plan
- `@specs/plans/visual-design-tokens.md` - Design specifications
**Status:** Ready for Implementation
**Version:** 1.0
**Last Updated:** January 2026

---

## Overview

This document provides a **constitutional-aware task breakdown** for frontend implementation. Each task explicitly references constitutional requirements to ensure compliance with the project's binding rules.

**Key Constitutional Requirements:**
1. **Spec-First Development** - Never write production code manually
2. **Type Safety** - TypeScript strict mode, no implicit any
3. **Technology Stack** - Next.js 16+ App Router, Tailwind CSS only
4. **Code Quality** - Consistent naming, proper structure
5. **AI-Driven** - All code generated via Claude Code

---

## Phase 1: Global Setup & Foundation (8 tasks)

### Task 1.1: Initialize Next.js 16+ Project
**Constitutional Alignment:**
- ✅ Technology Stack: Next.js 16+ (App Router only) - CONSTITUTION §3
- ✅ TypeScript strict mode - CONSTITUTION §4
- ✅ Tailwind CSS - CONSTITUTION §3
- ✅ No manual coding - CONSTITUTION §1.1

**Description:** Bootstrap Next.js 16+ project with TypeScript and Tailwind CSS

**Constitutional Compliance Checklist:**
- [ ] Next.js 16+ installed (not 15 or earlier)
- [ ] App Router structure (not Pages Router)
- [ ] TypeScript configured
- [ ] Tailwind CSS configured
- [ ] No manual code written (use create-next-app)

**Commands:**
```bash
cd frontend
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir
```

**Acceptance Criteria:**
- [ ] Next.js 16+ installed
- [ ] TypeScript configured in strict mode
- [ ] Tailwind CSS installed and configured
- [ ] Project runs with `npm run dev`
- [ ] No console errors
- [ ] Follows monorepo structure (CONSTITUTION §8)

---

### Task 1.2: Configure Custom Tailwind Theme
**Constitutional Alignment:**
- ✅ Tailwind CSS only (no CSS-in-JS) - CONSTITUTION §3
- ✅ Design tokens from visual-design-tokens.md
- ✅ Naming conventions: camelCase for config - CONSTITUTION §4

**Description:** Set up custom Tailwind configuration with exact color palette, typography, and spacing from visual-design-tokens.md

**Constitutional Compliance Checklist:**
- [ ] Uses exact hex codes from visual-design-tokens.md
- [ ] No CSS-in-JS or CSS modules
- [ ] Follows 4px spacing grid
- [ ] Dark mode configured (class strategy)
- [ ] No inline styles anywhere

**Files to Modify:**
- `tailwind.config.ts`

**Acceptance Criteria:**
- [ ] Custom colors defined (indigo primary, gray neutrals, priority colors)
- [ ] Custom spacing scale (4px grid)
- [ ] Custom typography scale with line-heights
- [ ] Dark mode configured (class strategy)
- [ ] Custom border radius values
- [ ] Custom shadows from specification
- [ ] Backdrop blur for glass effects

---

### Task 1.3: Install and Configure Inter Font
**Constitutional Alignment:**
- ✅ Typography standards - CONSTITUTION §4
- ✅ Modern best practices - CONSTITUTION §2.6

**Description:** Set up Inter variable font for premium typography

**Constitutional Compliance Checklist:**
- [ ] Uses next/font (Next.js best practice)
- [ ] Variable font for performance
- [ ] Proper fallback fonts
- [ ] No FOUT (Flash of Unstyled Text)

**Files to Create/Modify:**
- `app/layout.tsx`

**Acceptance Criteria:**
- [ ] Inter variable font loaded via next/font
- [ ] Font applied globally
- [ ] Fallback fonts configured
- [ ] Font displays correctly in browser
- [ ] No layout shift on font load

---

### Task 1.4: Set Up Dark Mode Provider
**Constitutional Alignment:**
- ✅ Modern UX patterns - CONSTITUTION §2
- ✅ Client Component only when needed - CONSTITUTION §4

**Description:** Implement dark mode support with system preference detection and manual toggle

**Constitutional Compliance Checklist:**
- [ ] Uses next-themes (recommended library)
- [ ] Client Component only for provider
- [ ] Server Components for rest of app
- [ ] No flash of unstyled content

**Files to Create/Modify:**
- `app/providers.tsx` (Client Component)
- `app/layout.tsx` (Server Component)

**Acceptance Criteria:**
- [ ] Dark mode provider installed (next-themes)
- [ ] System preference detection works
- [ ] Manual toggle capability
- [ ] Dark mode persists across page reloads
- [ ] No flash of unstyled content
- [ ] Follows Client/Server Component pattern

---

### Task 1.5: Create Global CSS Resets
**Constitutional Alignment:**
- ✅ Consistent base styles - CONSTITUTION §2.6
- ✅ Accessibility - CONSTITUTION §2.5

**Description:** Add global CSS resets and base typography styles

**Constitutional Compliance Checklist:**
- [ ] Uses Tailwind @layer base
- [ ] Accessible focus styles
- [ ] Smooth scrolling
- [ ] No custom CSS outside Tailwind

**Files to Create:**
- `app/globals.css`

**Acceptance Criteria:**
- [ ] CSS reset applied
- [ ] Base typography styles defined
- [ ] Smooth scrolling enabled
- [ ] Focus visible styles for accessibility
- [ ] All styles use Tailwind utilities

---

### Task 1.6: Set Up Project Directory Structure
**Constitutional Alignment:**
- ✅ Clean separation of concerns - CONSTITUTION §2.4
- ✅ Monorepo structure - CONSTITUTION §8

**Description:** Create organized directory structure for components, lib, types

**Constitutional Compliance Checklist:**
- [ ] Follows monorepo structure from CONSTITUTION §8
- [ ] Clear separation: components, lib, types
- [ ] Naming: kebab-case for folders - CONSTITUTION §4

**Directories to Create:**
```
app/
components/
  ├── ui/           (reusable UI components)
  ├── auth/         (authentication components)
  ├── tasks/        (task-related components)
  └── layout/       (layout components)
lib/                (utilities, API client)
types/              (TypeScript type definitions)
public/             (static assets)
```

**Acceptance Criteria:**
- [ ] All directories created
- [ ] Structure matches specification
- [ ] Follows naming conventions
- [ ] README.md in each major directory (optional)

---

### Task 1.7: Configure TypeScript Strict Mode
**Constitutional Alignment:**
- ✅ Type safety everywhere - CONSTITUTION §2.3
- ✅ Strictest possible tsconfig - CONSTITUTION §4

**Description:** Ensure TypeScript is configured with strictest settings

**Constitutional Compliance Checklist:**
- [ ] `strict: true` enabled
- [ ] `noImplicitAny: true`
- [ ] `strictNullChecks: true`
- [ ] `noUnusedLocals: true`
- [ ] `noUnusedParameters: true`

**Files to Modify:**
- `tsconfig.json`

**Acceptance Criteria:**
- [ ] `strict: true` in tsconfig.json
- [ ] `noImplicitAny: true`
- [ ] `strictNullChecks: true`
- [ ] `noUnusedLocals: true`
- [ ] `noUnusedParameters: true`
- [ ] No TypeScript errors in project

---

### Task 1.8: Install Required Dependencies
**Constitutional Alignment:**
- ✅ Recommended libraries - CONSTITUTION §3
- ✅ Modern tooling - CONSTITUTION §2

**Description:** Install all required npm packages for the project

**Constitutional Compliance Checklist:**
- [ ] Only approved libraries (no Prisma, no CSS-in-JS)
- [ ] Framer Motion for animations
- [ ] Lucide React for icons
- [ ] Sonner for toasts

**Commands:**
```bash
npm install framer-motion lucide-react clsx tailwind-merge sonner next-themes
```

**Acceptance Criteria:**
- [ ] Framer Motion installed
- [ ] Lucide React (icons) installed
- [ ] clsx and tailwind-merge installed
- [ ] Sonner (toast) installed
- [ ] next-themes installed
- [ ] All dependencies in package.json
- [ ] No deprecated packages

---

## Phase 2: Design System Foundation Components (10 tasks)

### Task 2.1: Create Button Component
**Constitutional Alignment:**
- ✅ TypeScript strict mode - CONSTITUTION §4
- ✅ Tailwind CSS only - CONSTITUTION §3
- ✅ Accessibility - CONSTITUTION §2.5
- ✅ Reusable components - CONSTITUTION §2.4

**Description:** Build reusable Button component with multiple variants and sizes

**Constitutional Compliance Checklist:**
- [ ] TypeScript with proper types (no `any`)
- [ ] Tailwind classes only (no inline styles)
- [ ] Accessible (ARIA labels, keyboard nav)
- [ ] Follows design tokens exactly

**Files to Create:**
- `components/ui/Button.tsx`

**Acceptance Criteria:**
- [ ] Variants: primary, secondary, ghost, danger
- [ ] Sizes: sm, md, lg
- [ ] Loading state with spinner
- [ ] Disabled state
- [ ] Proper TypeScript types
- [ ] Accessible (ARIA labels, keyboard support)
- [ ] Uses exact colors from visual-design-tokens.md
- [ ] Hover/focus states with proper transitions
- [ ] No `any` types

---

### Task 2.2: Create Input Component
**Constitutional Alignment:**
- ✅ TypeScript strict mode - CONSTITUTION §4
- ✅ Tailwind CSS only - CONSTITUTION §3
- ✅ Accessibility - CONSTITUTION §2.5

**Description:** Build Input component with floating label and error states

**Constitutional Compliance Checklist:**
- [ ] TypeScript with proper types
- [ ] Tailwind classes only
- [ ] Accessible (labels, ARIA)
- [ ] Error handling patterns

**Files to Create:**
- `components/ui/Input.tsx`

**Acceptance Criteria:**
- [ ] Floating label animation
- [ ] Error state styling
- [ ] Success state styling
- [ ] Disabled state
- [ ] Proper TypeScript types
- [ ] Accessible (ARIA labels, error messages)
- [ ] Uses design tokens
- [ ] Focus ring from specification

---

### Task 2.3: Create Textarea Component
**Constitutional Alignment:**
- ✅ TypeScript strict mode - CONSTITUTION §4
- ✅ Tailwind CSS only - CONSTITUTION §3
- ✅ Accessibility - CONSTITUTION §2.5

**Description:** Build Textarea component similar to Input

**Constitutional Compliance Checklist:**
- [ ] TypeScript with proper types
- [ ] Tailwind classes only
- [ ] Accessible
- [ ] Auto-resize functionality

**Files to Create:**
- `components/ui/Textarea.tsx`

**Acceptance Criteria:**
- [ ] Auto-resize capability
- [ ] Error state styling
- [ ] Character count (optional)
- [ ] Proper TypeScript types
- [ ] Accessible
- [ ] Uses design tokens

---

### Task 2.4: Create Select/Dropdown Component
**Constitutional Alignment:**
- ✅ TypeScript strict mode - CONSTITUTION §4
- ✅ Tailwind CSS only - CONSTITUTION §3
- ✅ Accessibility - CONSTITUTION §2.5

**Description:** Build custom Select component with beautiful styling

**Constitutional Compliance Checklist:**
- [ ] TypeScript with proper types
- [ ] Tailwind classes only
- [ ] Keyboard navigation
- [ ] Accessible (ARIA)

**Files to Create:**
- `components/ui/Select.tsx`

**Acceptance Criteria:**
- [ ] Custom dropdown styling
- [ ] Keyboard navigation
- [ ] Search capability (optional)
- [ ] Proper TypeScript types
- [ ] Accessible (ARIA, keyboard)
- [ ] Uses design tokens

---

### Task 2.5: Create Badge Component
**Constitutional Alignment:**
- ✅ TypeScript strict mode - CONSTITUTION §4
- ✅ Tailwind CSS only - CONSTITUTION §3
- ✅ Priority colors from specification

**Description:** Build Badge component for priority levels and status

**Constitutional Compliance Checklist:**
- [ ] TypeScript with proper types
- [ ] Uses exact priority colors from visual-design-tokens.md
- [ ] Tailwind classes only

**Files to Create:**
- `components/ui/Badge.tsx`

**Acceptance Criteria:**
- [ ] Variants: priority (high, medium, low), status
- [ ] Proper colors for each variant (from design tokens)
- [ ] Sizes: sm, md
- [ ] Proper TypeScript types
- [ ] No inline styles

---

### Task 2.6: Create Checkbox Component
**Constitutional Alignment:**
- ✅ TypeScript strict mode - CONSTITUTION §4
- ✅ Tailwind CSS only - CONSTITUTION §3
- ✅ Accessibility - CONSTITUTION §2.5
- ✅ Animations from specification

**Description:** Build custom Checkbox with beautiful animation

**Constitutional Compliance Checklist:**
- [ ] TypeScript with proper types
- [ ] Tailwind + Framer Motion for animation
- [ ] Accessible (ARIA, keyboard)
- [ ] Animation duration from design tokens

**Files to Create:**
- `components/ui/Checkbox.tsx`

**Acceptance Criteria:**
- [ ] Smooth check animation (200ms, ease-premium)
- [ ] Indeterminate state
- [ ] Disabled state
- [ ] Proper TypeScript types
- [ ] Accessible (ARIA, keyboard)
- [ ] Uses design tokens for colors and timing

---

### Task 2.7: Create Toggle Component
**Constitutional Alignment:**
- ✅ TypeScript strict mode - CONSTITUTION §4
- ✅ Tailwind CSS only - CONSTITUTION §3
- ✅ Accessibility - CONSTITUTION §2.5

**Description:** Build Toggle/Switch component for dark mode

**Constitutional Compliance Checklist:**
- [ ] TypeScript with proper types
- [ ] Tailwind + Framer Motion
- [ ] Accessible (ARIA, keyboard)

**Files to Create:**
- `components/ui/Toggle.tsx`

**Acceptance Criteria:**
- [ ] Smooth toggle animation
- [ ] Disabled state
- [ ] Proper TypeScript types
- [ ] Accessible (ARIA, keyboard)
- [ ] Uses design tokens

---

### Task 2.8: Create Card Component
**Constitutional Alignment:**
- ✅ TypeScript strict mode - CONSTITUTION §4
- ✅ Tailwind CSS only - CONSTITUTION §3
- ✅ Glass effects from specification

**Description:** Build Card component with multiple variants

**Constitutional Compliance Checklist:**
- [ ] TypeScript with proper types
- [ ] Tailwind classes only
- [ ] Glass effect uses exact backdrop-blur values
- [ ] Shadows from design tokens

**Files to Create:**
- `components/ui/Card.tsx`

**Acceptance Criteria:**
- [ ] Variants: elevated, bordered, glassmorphic
- [ ] Hover effects
- [ ] Proper shadows from design tokens
- [ ] Proper TypeScript types
- [ ] Glass variant uses exact values from specification

---

### Task 2.9: Create Avatar Component
**Constitutional Alignment:**
- ✅ TypeScript strict mode - CONSTITUTION §4
- ✅ Tailwind CSS only - CONSTITUTION §3

**Description:** Build Avatar component with initials fallback

**Constitutional Compliance Checklist:**
- [ ] TypeScript with proper types
- [ ] Tailwind classes only
- [ ] Proper image handling

**Files to Create:**
- `components/ui/Avatar.tsx`

**Acceptance Criteria:**
- [ ] Image support
- [ ] Initials fallback
- [ ] Status dot (online/offline)
- [ ] Sizes: sm, md, lg
- [ ] Proper TypeScript types
- [ ] Uses design tokens

---

### Task 2.10: Set Up Toast System
**Constitutional Alignment:**
- ✅ Approved library (Sonner) - CONSTITUTION §3
- ✅ Tailwind CSS only - CONSTITUTION §3
- ✅ TypeScript strict mode - CONSTITUTION §4

**Description:** Configure Sonner toast system with custom styling

**Constitutional Compliance Checklist:**
- [ ] Uses Sonner (approved library)
- [ ] Custom styling with Tailwind
- [ ] TypeScript types
- [ ] Works in light/dark mode

**Files to Create:**
- `components/ui/Toast.tsx`
- `lib/toast.ts`

**Acceptance Criteria:**
- [ ] Sonner configured
- [ ] Custom toast styling with Tailwind
- [ ] Success, error, info variants
- [ ] Proper positioning
- [ ] Works in light/dark mode
- [ ] TypeScript types
- [ ] Uses design tokens for colors

---

## Phase 3: Navigation & Layout Shell (6 tasks)

### Task 3.1: Create Header Component
**Constitutional Alignment:**
- ✅ TypeScript strict mode - CONSTITUTION §4
- ✅ Tailwind CSS only - CONSTITUTION §3
- ✅ Server Components first - CONSTITUTION §4
- ✅ Responsive design - CONSTITUTION §2

**Description:** Build top navigation bar with logo, search, user menu, dark mode toggle

**Constitutional Compliance Checklist:**
- [ ] Server Component where possible
- [ ] Client Component only for interactive parts
- [ ] TypeScript with proper types
- [ ] Tailwind classes only
- [ ] Responsive (mobile-first)

**Files to Create:**
- `components/layout/Header.tsx` (Server Component)
- `components/layout/UserMenu.tsx` (Client Component)
- `components/layout/DarkModeToggle.tsx` (Client Component)

**Acceptance Criteria:**
- [ ] Logo/brand
- [ ] Search input (can be dummy)
- [ ] User menu dropdown (Client Component)
- [ ] Dark mode toggle (Client Component)
- [ ] Responsive (mobile-friendly)
- [ ] Proper TypeScript types
- [ ] Uses design tokens
- [ ] Follows Server/Client Component pattern

---

### Task 3.2: Create Sidebar Component
**Constitutional Alignment:**
- ✅ TypeScript strict mode - CONSTITUTION §4
- ✅ Tailwind CSS only - CONSTITUTION §3
- ✅ Responsive design - CONSTITUTION §2

**Description:** Build sidebar with navigation links and collapsible behavior

**Constitutional Compliance Checklist:**
- [ ] Client Component (for interactivity)
- [ ] TypeScript with proper types
- [ ] Tailwind classes only
- [ ] Responsive (collapses on mobile)

**Files to Create:**
- `components/layout/Sidebar.tsx` (Client Component)
- `components/layout/SidebarLink.tsx`

**Acceptance Criteria:**
- [ ] Navigation links (All Tasks, Today, Completed)
- [ ] Active state indicators
- [ ] Hover effects from design tokens
- [ ] Collapsible on mobile
- [ ] Fixed on desktop
- [ ] Proper TypeScript types
- [ ] Uses design tokens

---

### Task 3.3: Create Main Content Wrapper
**Constitutional Alignment:**
- ✅ TypeScript strict mode - CONSTITUTION §4
- ✅ Tailwind CSS only - CONSTITUTION §3
- ✅ Server Component - CONSTITUTION §4

**Description:** Build main content wrapper with proper padding and max-width

**Constitutional Compliance Checklist:**
- [ ] Server Component
- [ ] TypeScript with proper types
- [ ] Tailwind classes only
- [ ] Responsive

**Files to Create:**
- `components/layout/MainContent.tsx` (Server Component)

**Acceptance Criteria:**
- [ ] Proper padding (from design tokens)
- [ ] Max-width constraint
- [ ] Responsive
- [ ] Works with sidebar layout
- [ ] TypeScript types

---

### Task 3.4: Create Mobile Bottom Navigation (Optional)
**Constitutional Alignment:**
- ✅ TypeScript strict mode - CONSTITUTION §4
- ✅ Tailwind CSS only - CONSTITUTION §3
- ✅ Responsive design - CONSTITUTION §2

**Description:** Build bottom navigation bar for mobile devices

**Constitutional Compliance Checklist:**
- [ ] Client Component
- [ ] TypeScript with proper types
- [ ] Tailwind classes only
- [ ] Shows only on mobile

**Files to Create:**
- `components/layout/BottomNav.tsx` (Client Component)

**Acceptance Criteria:**
- [ ] Shows only on mobile
- [ ] Navigation icons
- [ ] Active state
- [ ] Fixed to bottom
- [ ] TypeScript types
- [ ] Uses design tokens

---

### Task 3.5: Create App Layout
**Constitutional Alignment:**
- ✅ TypeScript strict mode - CONSTITUTION §4
- ✅ Tailwind CSS only - CONSTITUTION §3
- ✅ Server Component - CONSTITUTION §4
- ✅ Monorepo structure - CONSTITUTION §8

**Description:** Build protected app layout combining Header, Sidebar, and Main Content

**Constitutional Compliance Checklist:**
- [ ] Server Component
- [ ] TypeScript with proper types
- [ ] Tailwind classes only
- [ ] Follows monorepo structure

**Files to Create:**
- `app/(app)/layout.tsx` (Server Component)

**Acceptance Criteria:**
- [ ] Header at top
- [ ] Sidebar on left (desktop)
- [ ] Main content area
- [ ] Responsive layout
- [ ] Proper TypeScript types
- [ ] Uses design tokens

---

### Task 3.6: Create Root Layout
**Constitutional Alignment:**
- ✅ TypeScript strict mode - CONSTITUTION §4
- ✅ Server Component - CONSTITUTION §4
- ✅ Monorepo structure - CONSTITUTION §8

**Description:** Set up root layout with providers and global styles

**Constitutional Compliance Checklist:**
- [ ] Server Component
- [ ] TypeScript with proper types
- [ ] Providers wrapped correctly
- [ ] Metadata configured

**Files to Modify:**
- `app/layout.tsx` (Server Component)

**Acceptance Criteria:**
- [ ] Dark mode provider
- [ ] Font configuration
- [ ] Global styles
- [ ] Metadata configuration
- [ ] Proper TypeScript types
- [ ] Follows Next.js 16+ patterns

---

## Constitutional Compliance Summary

### Technology Stack Compliance
- ✅ Next.js 16+ App Router (not Pages Router)
- ✅ TypeScript strict mode (no implicit any)
- ✅ Tailwind CSS only (no CSS-in-JS, no CSS modules)
- ✅ Approved libraries only (Framer Motion, Sonner, Lucide, next-themes)

### Code Quality Compliance
- ✅ Server Components by default
- ✅ Client Components only when needed
- ✅ Type safety everywhere
- ✅ Proper naming conventions
- ✅ Clean separation of concerns

### Development Process Compliance
- ✅ Spec-first development
- ✅ AI-driven code generation
- ✅ No manual coding
- ✅ Follows monorepo structure

---

## Next Steps

After completing Phase 1-3 tasks:
1. Continue with Phase 4: Core Todo Components
2. Continue with Phase 5: Public Pages
3. Continue with Phase 6: Authenticated App Experience
4. Continue with Phase 7: Micro-interactions & Delight
5. Continue with Phase 8: Responsiveness & Polish Pass

**Note:** Full task breakdown for Phases 4-8 available in `@specs/tasks/frontend-implementation-tasks.md`

---

## Related Documents

- **Constitution:** `@CONSTITUTION.md`
- **Frontend Specification:** `@specs/features/frontend-complete.md`
- **Implementation Plan:** `@specs/plans/frontend-beautiful-implementation-plan.md`
- **Visual Design Tokens:** `@specs/plans/visual-design-tokens.md`
- **Complete Task Breakdown:** `@specs/tasks/frontend-implementation-tasks.md`

---

**Status:** Ready for implementation with full constitutional compliance.
