# Todo App – Hackathon II
## Phase II – Full-Stack Web Application
## Project Constitution
Version 1.0 · January 2026

---

## Focus
Build a **modern, secure, multi-user Todo web application** using contemporary full-stack technologies, with strong emphasis on:

- User data isolation and security by design
- Type-safe frontend & backend
- Clean separation of concerns
- Maximum leverage of AI-assisted spec-driven development
- Clear foundation for future evolution toward AI agents, containerization and cloud-native architecture

The application must clearly demonstrate the evolution from a basic concept (simple task management) → professional multi-user web product.

---

## Success Criteria – Phase II
The project will be considered successful when it meets **all** of the following conditions:

- Users can independently sign up, sign in, and sign out
- Complete data isolation: each authenticated user can only see and modify **their own** tasks
- All 5 core operations work end-to-end through beautiful, responsive UI:
  - Create new task
  - Read/list all own tasks
  - Update task
  - Delete task
  - Toggle complete/incomplete status
- Persistent storage in Neon Serverless PostgreSQL
- Every line of production application code was generated via **Claude Code + Spec-Kit Plus** from written specifications
- JWT-based authentication works correctly across frontend ↔ backend boundary
- All API endpoints are protected and ownership is validated on server-side
- Application follows modern best practices in structure, naming, error handling and developer experience
- Project structure matches the recommended monorepo layout from hackathon documentation

---

## Target Audience
Primary users during Phase II evaluation:

1. Hackathon judges & Panaversity core team
2. Potential future users of the Todo application (individuals & small teams)
3. Developers & AI-engineering students who will study the codebase as an example of:
   - Spec-driven development
   - Modern full-stack architecture (Next.js 16+ App Router + FastAPI + SQLModel)
   - Secure multi-user application patterns
   - Preparation for cloud-native & agentic evolution

---

## Technology Stack – Locked Decisions for Phase II

| Category                | Technology / Decision                                 | Rationale / Constraint |
|------------------------|-------------------------------------------------------|------------------------|
| Frontend Framework      | Next.js 16+ (App Router only) + TypeScript            | Modern React, server-first, excellent DX |
| Styling                 | Tailwind CSS                                          | Rapid development, consistency, no CSS-in-JS |
| Backend                 | FastAPI + Python 3.12+                                | High-performance API, excellent type support |
| ORM / Models            | SQLModel + Pydantic v2                                | Type-safe models for DB & API, single source |
| Database                | Neon Serverless PostgreSQL                            | Scalable, developer-friendly Postgres |
| Authentication          | Better Auth (JWT issuance mode)                       | Modern, flexible, works well with Next.js |
| JWT Verification        | PyJWT + python-jose                                   | Reliable, widely used combination |
| API Client (Frontend)   | Custom centralized client (`/lib/api.ts`)             | Automatic JWT handling, clean usage |
| Linting/Formatting      | ruff + black + isort (Python) • ESLint + Prettier (TS)| Industry standard, minimal config fights |
| Spec-Driven Tooling     | Claude Code + Spec-Kit Plus                           | Core requirement of the hackathon |
| Deployment Target       | Vercel (frontend) + Render/Fly.io/DigitalOcean (backend) | Easy preview & production-like environment |

---

## Clearly Articulates the Evolution

This Phase II application serves as **the critical bridge** between:

← Phase I (simple in-memory console prototype)
   ↓
**Phase II** (professional, secure, persistent, multi-user web application)
   ↓
Phase III (AI-powered conversational interface & agents)
   ↓
Phase IV–V (cloud-native, containerized, event-driven distributed system)

**Phase II must therefore be built with intention:**

- Clean domain boundaries (services, use-cases)
- Explicit ownership & authorization patterns
- Extensible data model (ready for due dates, priorities, recurring, reminders…)
- REST API contract that can naturally evolve into agent/MCP tools
- Architecture that can be containerized without major surgery
- Security model suitable for cloud exposure

---

## 1. Core Philosophy & First Principles

1. We build **spec-first, AI-driven** — never write production code manually
2. The **specification is the Single Source of Truth** (except for this Constitution)
3. Human's primary creative role = writing, refining & critiquing specifications
4. AI's primary role = code generation, refactoring, documentation, testing patterns
5. We maximize **reusability of intelligence** — patterns should become agent skills/sub-agents when possible
6. Favor **simplicity & explicitness** over cleverness
7. Errors belong in specifications first — fix the spec → fix the code
8. We build for **evolvability** — every phase must be a logical, refactor-friendly evolution of previous phase

---

## 2. Non-Negotiable Project Values (ordered by priority)

1. Correctness > Performance > Features > Aesthetics
2. Security & data isolation between users > Developer convenience
3. Type safety & static analysis wherever reasonably possible
4. Clear separation of concerns (Clean Architecture influences)
5. Testability even when we don't write many tests yet
6. Observability/readability of logs & error messages
7. Minimal magic / maximal explicit configuration

---

## 3. Technology & Tooling Constitution

### Must Use
- Spec-Driven Development workflow (Claude Code + Spec-Kit Plus)
- Phase I   → Python 3.13+ / UV
- Phase II  → Next.js 16+ App Router + TypeScript + Tailwind
- Phase II  → FastAPI + SQLModel + Pydantic v2
- Phase II  → Neon Serverless PostgreSQL
- Phase II  → Better Auth (JWT mode) + same secret on frontend & backend
- All phases → GitHub monorepo structure as recommended in hackathon materials

### Must NOT Use (Phase II)
- Class-based Next.js pages (only App Router)
- Prisma / Drizzle / SQLAlchemy / Tortoise-ORM → SQLModel only
- JWT libraries other than PyJWT + python-jose (recommended combo)
- Inline styles / CSS modules / styled-components → Tailwind only
- Client-side only state management for core data → server components + fetch first

---

## 4. Code Style & Quality Constitution

### Python (Backend)
- Black + isort + ruff (all default or very close)
- Type hints **everywhere** feasible
- Prefer dataclasses / SQLModel over plain dicts for API models
- Use `Annotated` + `Depends` for dependency injection
- Route dependencies for auth → current_user dependency

### TypeScript / Next.js (Frontend)
- Strictest possible tsconfig (strict: true, no implicit any)
- Prefer Server Components
- Client Components only when: useState, useEffect, event handlers, browser APIs
- Use `async` Server Components + loading.tsx + error.tsx patterns
- Route Handlers over API routes when possible
- Colocation: keep related component + types + styles together

### Naming Conventions
- Database/models: snake_case
- API payloads/response: camelCase (JavaScript convention)
- URL paths: kebab-case
- Environment variables: SCREAMING_SNAKE_CASE
- Feature folders: kebab-case
- Components: PascalCase

---

## 5. Security Constitution (Phase II)

1. Every task operation MUST be filtered by authenticated user_id
2. Never trust client — re-validate ownership on backend
3. JWT secret **must** be the same on frontend & backend (via env)
4. Never log full tokens / sensitive data
5. Use HTTPS in production (Vercel + DOKS provide this)
6. Rate limiting on auth & critical endpoints (bonus level)
7. Input validation & size limits on all user input

---

## 6. Error Handling Philosophy

- Expected errors → nice user messages (409 conflict, 403 forbidden, etc)
- Unexpected errors → generic message + unique error id for logs
- Frontend shows user-friendly toast/notification
- Backend returns consistent error shape:

```typescript
{
  "error": true,
  "code": "TASK_NOT_FOUND" | "UNAUTHORIZED" | "VALIDATION_ERROR" | ...,
  "message": "Human readable message",
  "details"?: Record<string, any>    // optional
}
```

---

## 7. Specific Section Required – Binding Rules & Commandments

### Security & Ownership (Non-negotiable)
1. Every task operation **must** be filtered by `current_user.id`
2. Backend **always** re-validates task ownership — client is never trusted
3. All non-public endpoints **require** valid JWT → 401/403 otherwise
4. JWT secret **identical** in frontend & backend (via environment)
5. Never log tokens, credentials, or sensitive payloads

### Error Handling Standard (both sides)
```typescript
{
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  }
}
```

---

## 8. Monorepo Structure (Required)

```
/
├── .spec-kit/
│   └── config.yaml
├── specs/
│   ├── overview.md
│   ├── features/
│   ├── api/
│   ├── database/
│   └── ui/
├── CONSTITUTION.md (this file)
├── CLAUDE.md (root guidance)
├── frontend/
│   ├── CLAUDE.md
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── ...
├── backend/
│   ├── CLAUDE.md
│   ├── app/
│   ├── models/
│   ├── services/
│   └── ...
└── README.md
```

---

## 9. Development Workflow (Mandatory)

1. **Write or read specifications** (Spec-Kit Plus)
2. **Generate an implementation plan**
3. **Break work into granular, testable tasks**
4. **Implement code ONLY via Claude Code**
5. **Iterate by updating specs if requirements change**

🚫 Manual coding is NOT allowed
🚫 Skipping specs or tasks is NOT allowed

Evaluation will be based on:
- Specs
- Prompts
- Planning
- Task breakdown
- Iterations
- Final implementation

---

## 10. Prohibited Actions

🚫 No AI features beyond scope
🚫 No Kubernetes (Phase II)
🚫 No manual database edits
🚫 No bypassing authentication
🚫 No undocumented endpoints
🚫 No deviation from specs
🚫 No manual code writing

---

## Final Note

This Constitution is **immutable** unless explicitly updated via formal specification process. When in doubt, refer back to these principles. The Constitution exists to ensure consistency, quality, and alignment with hackathon evaluation criteria.

**Remember:** Specifications are the Single Source of Truth. This Constitution is the framework within which those specifications operate.
