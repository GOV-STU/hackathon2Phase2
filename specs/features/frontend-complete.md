# Specification: Complete Responsive Frontend for Todo Web Application (Phase II)

**File:** `@specs/features/frontend-complete.md`
**Phase:** II (Full-Stack Web Application – Frontend Focus First)
**Priority:** Critical – must be completed before moving to backend integration details
**Status:** Draft
**Version:** 1.0
**Last Updated:** January 2026

---

## 1. Overall Goal

Build a **modern, clean, responsive, and pleasant-to-use** Next.js 16+ App Router frontend for the Todo application.

This frontend should:
- Feel like a real modern productivity app
- Work beautifully on mobile, tablet, and desktop
- Be fully functional with mock/fake data first (API integration comes later)
- Follow modern Next.js patterns (Server Components first)
- Prepare clean integration points for real authenticated API later

---

## 2. Required Pages / Routes (exact path structure)

```
/                  → Landing / Home page (public)
├── /login         → Sign in page
├── /signup        → Sign up page
├── /app           → Protected layout – main authenticated area
│   ├── /          → Dashboard / All Tasks (default view)
│   ├── /today     → Tasks due today
│   ├── /completed → Completed tasks view
│   └── /[taskId]  → Single task detail page (optional but recommended)
└── /logout        → Simple logout redirect (can be client-side action)
```

---

## 3. Core UI Requirements & Design Language

- **Design system:** Minimal, clean, modern, inspired by Todoist / Things 3 / Linear
- **Primary color:** indigo/blue (indigo-600 / indigo-700 accents)
- **Background:** neutral (gray-50 light / gray-950 dark)
- **Dark mode:** Support automatic via system preference + manual toggle
- **Typography:** Inter or default system sans-serif stack
- **Spacing & sizing:** consistent 4px grid (Tailwind spacing scale)
- **Buttons:** rounded-md, medium padding, clear hover states
- **Cards:** subtle shadow, rounded-lg, slight border in light mode
- **Animations:** very subtle (opacity + scale on interactions)

---

## 4. Must-Have Components (to be created & reused)

### Core Components

1. **`TaskCard`** – Single task display
   - Title
   - Description preview
   - Checkbox for completion
   - Priority badge
   - Due date (if exists)

2. **`TaskList`** – Vertical list of TaskCards
   - Loading/skeleton states
   - Empty state handling
   - Smooth animations

3. **`TaskForm`** – Modal or inline form for create & edit
   - Title (required)
   - Description textarea
   - Priority select
   - Due date picker (optional)

4. **`Header`** – Top navigation bar
   - Logo
   - User avatar/menu
   - Dark mode toggle
   - Logout button

5. **`Sidebar`** – Optional left sidebar
   - All Tasks
   - Today
   - Completed
   - Categories (future)
   - Settings

6. **`EmptyState`** – Friendly message + CTA when no tasks exist

7. **`LoadingSkeleton`** – Nice skeleton loader for task list

8. **`ToastContainer`** + toast component for success/error messages

---

## 5. Page-Specific Requirements

### `/` (Landing Page – public)

**Purpose:** Marketing/welcome page for unauthenticated users

**Requirements:**
- Hero section: "Simple, powerful Todo app" + tagline
- Features list (3–4 cards):
  - Clean UI
  - Secure
  - Fast
  - Future AI features
- Sign Up & Log In prominent buttons
- No authenticated content
- Responsive design

**Components:**
- Hero section
- Feature cards
- CTA buttons

---

### `/login` & `/signup`

**Purpose:** Authentication pages

**Requirements:**
- Beautiful centered auth card
- Email + Password fields
- "Continue with Email" button
- Link to switch between login/signup
- Error messages below fields
- Loading state on submit
- Responsive (mobile-friendly)

**Form Fields:**
- Email (required, validated)
- Password (required, min 8 characters)
- Name (signup only, required)

**States:**
- Idle
- Loading (submitting)
- Error (with message)
- Success (redirect to /app)

---

### `/app/*` (Protected area)

**Purpose:** Main authenticated application area

**Requirements:**
- Must show loading state while checking auth
- Redirect to /login if not authenticated
- Persistent layout with Header + optional Sidebar
- Main content area with good padding/margins
- Responsive (sidebar collapses on mobile)

**Layout Structure:**
```
┌─────────────────────────────────┐
│         Header                  │
├──────────┬──────────────────────┤
│          │                      │
│ Sidebar  │   Main Content       │
│          │                      │
│          │                      │
└──────────┴──────────────────────┘
```

---

### Dashboard (`/app`)

**Purpose:** Main task list view

**Requirements:**
- Header: "My Tasks" or "Inbox"
- Floating "+" button to create new task (bottom-right on mobile)
- Task list grouped by sections (optional):
  - Today
  - Later
  - No date
- Quick filter: All / Pending / Completed
- Search input (can be dummy for now)

**Interactions:**
- Click task → open detail view or edit modal
- Click checkbox → toggle complete
- Click "+" → open create task form
- Click filter → filter task list
- Type in search → filter tasks (can be client-side)

---

### Today (`/app/today`)

**Purpose:** Tasks due today

**Requirements:**
- Similar to Dashboard but filtered to today's tasks
- Show count: "3 tasks due today"
- Empty state if no tasks today

---

### Completed (`/app/completed`)

**Purpose:** View completed tasks

**Requirements:**
- List of completed tasks
- Option to uncomplete (toggle back)
- Option to delete permanently
- Empty state if no completed tasks

---

### Task Detail (`/app/[taskId]`)

**Purpose:** Single task detail view (optional but recommended)

**Requirements:**
- Full task details
- Edit button
- Delete button
- Complete/uncomplete toggle
- Back button to list
- Breadcrumb navigation

---

## 6. Technical & Pattern Requirements (Strict)

### Framework & Routing
- ✅ App Router only – no Pages Router
- ✅ TypeScript – strict mode, no implicit any
- ✅ Server Components by default
- ✅ Use `async` Server Components wherever data fetching is needed
- ✅ Client Components only for interactivity (forms, modals, state)

### Styling
- ✅ Tailwind CSS classes – no inline styles, no CSS modules
- ✅ Responsive design (mobile-first)
- ✅ Dark mode support via Tailwind dark: classes

### Data & API
- ✅ All API calls (even mock) go through centralized `/lib/api.ts`
- ✅ Mock data structure matches future API response format
- ✅ Type-safe interfaces for all data models

### State Management
- ✅ Server Components for data fetching
- ✅ Client Components for interactive state (forms, modals)
- ✅ Optimistic UI updates where appropriate
- ✅ No Redux/Zustand unless absolutely necessary

### Loading & Error States
- ✅ Use `loading.tsx` on route level when practical
- ✅ Use `error.tsx` where meaningful
- ✅ Skeleton loaders for async content
- ✅ Toast notifications for user feedback

### Route Protection
- ✅ Simple middleware check + redirect
- ✅ Mock auth for now (localStorage token check)
- ✅ Prepare for real JWT integration later

---

## 7. Mock Data Structure

### Task Interface

```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string; // ISO date string
  userId: string;
  createdAt: string;
  updatedAt: string;
}
```

### Mock Tasks Example

```typescript
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Complete project proposal',
    description: 'Write and submit the Q1 project proposal',
    completed: false,
    priority: 'high',
    dueDate: '2026-01-15',
    userId: 'user-1',
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-10T10:00:00Z',
  },
  {
    id: '2',
    title: 'Review pull requests',
    description: 'Review and merge pending PRs',
    completed: false,
    priority: 'medium',
    dueDate: '2026-01-13',
    userId: 'user-1',
    createdAt: '2026-01-11T14:30:00Z',
    updatedAt: '2026-01-11T14:30:00Z',
  },
  {
    id: '3',
    title: 'Buy groceries',
    completed: true,
    priority: 'low',
    userId: 'user-1',
    createdAt: '2026-01-12T09:00:00Z',
    updatedAt: '2026-01-13T11:00:00Z',
  },
];
```

---

## 8. Acceptance Criteria (Frontend Only – Mock Data Phase)

### Functional Requirements
- [ ] All required pages exist and are reachable
- [ ] Navigation between pages feels smooth
- [ ] Task list renders nice cards (even with fake data)
- [ ] Create/edit form works (submits to console.log for now)
- [ ] Toggle complete changes UI immediately (optimistic)
- [ ] Delete removes task from UI
- [ ] Search filters tasks (client-side)
- [ ] Filter buttons work (All / Pending / Completed)

### UI/UX Requirements
- [ ] Dark mode toggle works
- [ ] Mobile layout is usable (sidebar collapses or becomes bottom nav)
- [ ] Looks professional and pleasant on all screen sizes
- [ ] Animations are subtle and smooth
- [ ] Loading states are clear
- [ ] Empty states are friendly and helpful
- [ ] Error messages are clear and actionable

### Technical Requirements
- [ ] No console errors/warnings (except maybe auth-related for now)
- [ ] TypeScript strict mode with no errors
- [ ] All components properly typed
- [ ] Responsive on mobile (320px+), tablet (768px+), desktop (1024px+)
- [ ] Accessible (keyboard navigation, ARIA labels)

---

## 9. Component Implementation Priority

### Phase 1: Core Layout & Navigation
1. Root layout with dark mode provider
2. Header component
3. Sidebar component (desktop)
4. Landing page
5. Login/Signup pages (basic)

### Phase 2: Task Components
1. TaskCard component
2. TaskList component
3. LoadingSkeleton component
4. EmptyState component

### Phase 3: Task Management
1. TaskForm component (create/edit)
2. Dashboard page with mock data
3. Task detail page
4. Delete confirmation

### Phase 4: Additional Views
1. Today page
2. Completed page
3. Search functionality
4. Filters

### Phase 5: Polish
1. Toast notifications
2. Animations
3. Mobile optimizations
4. Accessibility improvements

---

## 10. Next Steps After This Spec

Once this frontend is visually & structurally complete with mock data:

1. **Write spec for real API integration**
   - API client implementation
   - Error handling
   - Loading states
   - Retry logic

2. **Write spec for Better Auth integration**
   - JWT token management
   - Session handling
   - Refresh token flow

3. **Write spec for JWT handling & protected routes**
   - Middleware implementation
   - Token validation
   - Redirect logic

---

## 11. Out of Scope (Phase II Frontend)

The following are explicitly **NOT** part of this specification:

- ❌ Real backend API integration (mock data only)
- ❌ Real authentication (mock auth only)
- ❌ Database operations
- ❌ Server-side rendering of user-specific data
- ❌ Advanced features (tags, categories, recurring tasks)
- ❌ Collaboration features
- ❌ AI features
- ❌ Email notifications
- ❌ File attachments

---

## 12. Success Metrics

This specification is successfully implemented when:

1. ✅ A developer can navigate the entire app with mock data
2. ✅ All CRUD operations work in the UI (with mock persistence)
3. ✅ The app looks professional on mobile, tablet, and desktop
4. ✅ Dark mode works correctly
5. ✅ The codebase is clean, typed, and follows Next.js 16+ best practices
6. ✅ The app is ready for real API integration (clean integration points)

---

**Current Priority:** Get the frontend shell + UI + mock data working beautifully. Real API integration comes next.
