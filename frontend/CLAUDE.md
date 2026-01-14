# Frontend - Todo App Phase II
## Guidance for Next.js Frontend Development

**Last Updated:** January 2026
**Scope:** `/frontend/` directory
**Agent:** nextjs-frontend-engineer

---

## 🎯 Frontend Mission

Build a **beautiful, responsive, type-safe** Next.js web application that provides a secure, intuitive interface for multi-user task management with JWT-based authentication.

---

## 📜 Required Reading (Before Any Work)

1. **`/CONSTITUTION.md`** - Project constitution
2. **`/CLAUDE.md`** - Root project guidance
3. **`/specs/overview.md`** - Phase II overview
4. **`/specs/ui/`** - UI specifications
5. **`/specs/api/`** - API contract specifications

---

## 🛠️ Technology Stack (Locked)

### Core Framework
- **Next.js 16+** with App Router (ONLY)
- **TypeScript** in strict mode
- **React 19+** (comes with Next.js 16)

### Styling
- **Tailwind CSS** (utility-first, no CSS-in-JS)
- Responsive design (mobile-first)
- Dark mode support (optional for Phase II)

### Authentication
- **Better Auth** (JWT issuance mode)
- JWT tokens stored securely
- Automatic token attachment to API requests

### State Management
- **Server Components first** (default)
- Client Components only when needed
- React Server Actions for mutations
- No Redux/Zustand unless absolutely necessary

### API Communication
- Centralized API client (`/lib/api.ts`)
- Automatic JWT header injection
- Type-safe request/response handling

---

## 🏗️ Directory Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home/landing page
│   ├── (auth)/            # Auth route group
│   │   ├── signin/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── (app)/             # Protected app routes
│   │   ├── layout.tsx     # App layout with nav
│   │   └── tasks/
│   │       └── page.tsx
│   ├── api/               # Route handlers (if needed)
│   └── not-found.tsx
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── auth/             # Auth-related components
│   └── tasks/            # Task-related components
├── lib/                  # Utilities and helpers
│   ├── api.ts           # API client
│   ├── auth.ts          # Auth utilities
│   └── utils.ts         # General utilities
├── types/               # TypeScript type definitions
│   ├── api.ts          # API types
│   └── models.ts       # Domain models
├── public/             # Static assets
├── CLAUDE.md          # This file
├── package.json
├── tsconfig.json      # Strict TypeScript config
├── tailwind.config.ts
└── next.config.js
```

---

## 🔐 Authentication Implementation

### Better Auth Setup

```typescript
// lib/auth.ts
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET!,
  jwt: {
    enabled: true,
    expiresIn: "7d",
  },
  // ... other config
});
```

### JWT Token Management

```typescript
// lib/api.ts
class ApiClient {
  private getAuthToken(): string | null {
    // Get JWT from Better Auth session
    return localStorage.getItem('auth_token');
  }

  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const token = this.getAuthToken();

    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options?.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new ApiError(response);
    }

    return response.json();
  }
}
```

---

## 🎨 Component Patterns

### Server Components (Default)

```typescript
// app/tasks/page.tsx
import { TaskList } from '@/components/tasks/TaskList';

export default async function TasksPage() {
  // This runs on the server
  // Can fetch data directly here if needed

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Tasks</h1>
      <TaskList />
    </div>
  );
}
```

### Client Components (When Needed)

```typescript
// components/tasks/TaskForm.tsx
"use client";

import { useState } from 'react';
import { createTask } from '@/lib/api';

export function TaskForm() {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createTask({ title });
      setTitle('');
      // Trigger revalidation or update state
    } catch (error) {
      console.error('Failed to create task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-4 py-2 border rounded"
        placeholder="Task title..."
      />
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {loading ? 'Creating...' : 'Create Task'}
      </button>
    </form>
  );
}
```

---

## 🔒 Security Requirements

### Client-Side Security Checklist

- [ ] Never store sensitive data in localStorage (only JWT token)
- [ ] Always validate user input before sending to API
- [ ] Handle authentication errors gracefully (redirect to signin)
- [ ] Clear tokens on logout
- [ ] Implement CSRF protection (Better Auth handles this)
- [ ] Sanitize user-generated content before rendering
- [ ] Use HTTPS in production (Vercel provides this)

### Protected Routes Pattern

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token');

  if (!token && request.nextUrl.pathname.startsWith('/tasks')) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/tasks/:path*', '/profile/:path*'],
};
```

---

## 📡 API Client Pattern

### Centralized API Client

```typescript
// lib/api.ts
import { Task, CreateTaskDto, UpdateTaskDto } from '@/types/models';

class ApiClient {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Tasks
  async getTasks(): Promise<Task[]> {
    return this.request<Task[]>('/api/tasks');
  }

  async createTask(data: CreateTaskDto): Promise<Task> {
    return this.request<Task>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTask(id: string, data: UpdateTaskDto): Promise<Task> {
    return this.request<Task>(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTask(id: string): Promise<void> {
    return this.request<void>(`/api/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleTaskComplete(id: string): Promise<Task> {
    return this.request<Task>(`/api/tasks/${id}/complete`, {
      method: 'PATCH',
    });
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    // Implementation with JWT injection
  }
}

export const api = new ApiClient();
```

---

## 🎨 Tailwind CSS Guidelines

### Utility-First Approach

```typescript
// Good: Utility classes
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
  <h2 className="text-xl font-semibold">Task Title</h2>
  <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
    Edit
  </button>
</div>

// Bad: Inline styles
<div style={{ display: 'flex', padding: '16px' }}>
  ...
</div>
```

### Responsive Design

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns */}
</div>
```

---

## 📝 TypeScript Standards

### Strict Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  }
}
```

### Type Definitions

```typescript
// types/models.ts
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  completed?: boolean;
}

// types/api.ts
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
```

---

## 🚫 Prohibited Patterns

### DO NOT Use:
- ❌ Pages Router (use App Router only)
- ❌ CSS Modules or styled-components (use Tailwind)
- ❌ Inline styles (use Tailwind utilities)
- ❌ `any` type (use proper types)
- ❌ Client Components by default (use Server Components)
- ❌ Direct fetch calls (use centralized API client)
- ❌ Hardcoded API URLs (use environment variables)

---

## ✅ Pre-Implementation Checklist

Before starting any frontend work:

- [ ] Read and understand CONSTITUTION.md
- [ ] Read relevant UI specifications in `/specs/ui/`
- [ ] Read API specifications in `/specs/api/`
- [ ] Verify specifications are approved
- [ ] Understand the authentication flow
- [ ] Know which components are Server vs Client
- [ ] Have API client patterns ready

---

## 🎯 Success Criteria

Frontend is successful when:

- [ ] Beautiful, responsive UI works on all screen sizes
- [ ] Users can sign up, sign in, sign out
- [ ] All 5 CRUD operations work through UI
- [ ] JWT authentication integrated with Better Auth
- [ ] API client automatically attaches tokens
- [ ] Error handling provides good UX
- [ ] TypeScript strict mode with no errors
- [ ] All styling via Tailwind CSS
- [ ] Server Components used by default
- [ ] Code generated via Claude Code (no manual coding)

---

## 🆘 When in Doubt

1. **Check specifications** - `/specs/ui/` and `/specs/api/`
2. **Prefer Server Components** - Only use Client when necessary
3. **Use Tailwind** - No custom CSS
4. **Type everything** - No `any` types
5. **Centralize API calls** - Use the API client
6. **Security first** - Always validate and sanitize

---

**Remember:** You are the nextjs-frontend-engineer agent. Your job is to implement the frontend according to approved specifications, following all constitutional requirements and best practices for Next.js 16+ App Router development.
