# Todo App - Phase II Overview Specification

**Spec ID:** `SPEC-OVERVIEW-001`
**Version:** 1.0.0
**Status:** Draft
**Last Updated:** 2026-01-13
**Related Specs:** All specifications in `/specs/` directory
**Constitutional Authority:** @CONSTITUTION.md, @CLAUDE.md

---

## 1. Project Vision

Transform a simple in-memory Python console Todo application into a **professional, secure, multi-user web application** with persistent storage. This Phase II implementation serves as the critical bridge between a basic prototype and a cloud-native, AI-powered system.

### Evolution Path

```
Phase I (Console App)
    ↓
Phase II (Web Application) ← CURRENT PHASE
    ↓
Phase III (AI-Powered Interface)
    ↓
Phase IV-V (Cloud-Native, Distributed System)
```

### Core Objectives

1. **Multi-User Support** - Multiple users can independently manage their own tasks
2. **Data Isolation** - Complete separation of user data with server-side enforcement
3. **Persistent Storage** - All data stored in Neon PostgreSQL database
4. **Modern Web Experience** - Beautiful, responsive UI built with Next.js 16+
5. **Secure Authentication** - JWT-based authentication across frontend and backend
6. **Spec-Driven Development** - Every line of code generated via Claude Code + Spec-Kit Plus

---

## 2. Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         Next.js 16+ Frontend (App Router)              │ │
│  │  - Server Components (default)                         │ │
│  │  - Client Components (interactivity)                   │ │
│  │  - Better Auth (JWT issuance)                          │ │
│  │  - Tailwind CSS styling                                │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS + JWT in Authorization header
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    FastAPI Backend                           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  API Layer (FastAPI routes)                            │ │
│  │  - JWT validation (PyJWT + python-jose)                │ │
│  │  - Request validation (Pydantic v2)                    │ │
│  │  - Dependency injection (current_user)                 │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Service Layer                                          │ │
│  │  - Business logic                                       │ │
│  │  - Ownership validation                                 │ │
│  │  - Data transformation                                  │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Data Layer (SQLModel)                                  │ │
│  │  - Database models                                      │ │
│  │  - Query building                                       │ │
│  │  - User filtering                                       │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ SQL queries
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              Neon Serverless PostgreSQL                      │
│  - users table (managed by Better Auth)                     │
│  - tasks table (user_id foreign key)                        │
│  - Indexes for performance                                  │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

#### Frontend (Next.js 16+)
- **Server Components**: Data fetching, initial rendering, SEO
- **Client Components**: User interactions, form handling, real-time updates
- **Better Auth**: User authentication, JWT token issuance
- **API Client**: Centralized HTTP client with automatic JWT injection
- **UI Components**: Reusable, accessible components with Tailwind CSS

#### Backend (FastAPI)
- **Authentication Middleware**: JWT validation on every protected endpoint
- **Authorization Logic**: Server-side ownership validation
- **Business Logic**: Task CRUD operations with user filtering
- **Data Validation**: Pydantic models for request/response validation
- **Database Access**: SQLModel for type-safe database operations

#### Database (Neon PostgreSQL)
- **Users Table**: Managed by Better Auth (id, email, password_hash, etc.)
- **Tasks Table**: User tasks with foreign key to users (id, user_id, title, description, completed, created_at, updated_at)
- **Indexes**: Optimized queries for user_id filtering
- **Constraints**: Foreign keys, NOT NULL, unique constraints

---

## 3. Technology Stack

### Frontend Stack

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| Next.js | 16+ | React framework | Modern, server-first, excellent DX |
| TypeScript | 5.x | Type safety | Catch errors at compile time |
| Tailwind CSS | 3.x | Styling | Rapid development, consistency |
| Better Auth | Latest | Authentication | Modern, flexible, JWT support |
| React | 19+ | UI library | Industry standard |

### Backend Stack

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| FastAPI | 0.115+ | API framework | High performance, excellent types |
| Python | 3.12+ | Language | Modern Python features |
| SQLModel | 0.0.22+ | ORM | Type-safe, Pydantic integration |
| Pydantic | 2.x | Validation | Robust data validation |
| PyJWT | 2.x | JWT handling | Reliable JWT library |
| python-jose | 3.x | JWT verification | Cryptographic operations |

### Database

| Technology | Purpose | Rationale |
|------------|---------|-----------|
| Neon PostgreSQL | Persistent storage | Serverless, scalable, developer-friendly |

### Development Tools

| Tool | Purpose |
|------|---------|
| Claude Code | Code generation |
| Spec-Kit Plus | Specification management |
| Black + isort + ruff | Python formatting/linting |
| ESLint + Prettier | TypeScript formatting/linting |

---

## 4. Security Model

### Authentication Flow

```
1. User signs up/signs in via Better Auth
   ↓
2. Better Auth validates credentials
   ↓
3. Better Auth issues JWT token (contains user_id)
   ↓
4. Frontend stores JWT (httpOnly cookie or localStorage)
   ↓
5. Frontend includes JWT in Authorization header for all API requests
   ↓
6. Backend validates JWT signature and expiration
   ↓
7. Backend extracts user_id from validated token
   ↓
8. Backend uses user_id to filter all database queries
```

### Security Principles (Non-Negotiable)

1. **JWT Secret Synchronization**
   - Same JWT secret in frontend and backend (via environment variables)
   - Secret must be cryptographically strong (minimum 32 characters)

2. **Server-Side Validation**
   - Backend ALWAYS re-validates JWT on every protected endpoint
   - Backend NEVER trusts client-provided user_id
   - Backend extracts user_id from validated JWT token only

3. **Data Isolation**
   - Every database query filtered by authenticated user_id
   - Users can ONLY access their own tasks
   - Ownership validation on all update/delete operations

4. **Error Handling**
   - No sensitive data in error messages
   - Generic error messages for authentication failures
   - Detailed errors only in development mode

5. **Input Validation**
   - All user inputs validated on backend
   - Size limits on text fields
   - SQL injection prevention via parameterized queries (SQLModel)

### Security Checklist

Every implementation MUST satisfy:

- [ ] JWT authentication enforced on all protected endpoints
- [ ] User ID extracted from validated JWT token (never from request body)
- [ ] All database queries filtered by `user_id`
- [ ] Ownership validation on server-side for update/delete operations
- [ ] Proper error handling (no sensitive data leakage)
- [ ] Input validation on all user inputs
- [ ] HTTPS in production (handled by deployment platforms)
- [ ] JWT secret stored in environment variables (never in code)
- [ ] No logging of tokens or sensitive data

---

## 5. API Design Principles

### RESTful Conventions

- **Resource-based URLs**: `/api/tasks`, `/api/tasks/{id}`
- **HTTP methods**: GET (read), POST (create), PUT/PATCH (update), DELETE (delete)
- **Status codes**: 200 (success), 201 (created), 400 (bad request), 401 (unauthorized), 403 (forbidden), 404 (not found), 422 (validation error), 500 (server error)

### Request/Response Format

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Success Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { ... }
  }
}
```

### Naming Conventions

- **API Payloads**: camelCase (JavaScript convention)
- **Database Fields**: snake_case (SQL convention)
- **URL Paths**: kebab-case (REST convention)

---

## 6. Data Model Overview

### Users Table (Managed by Better Auth)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tasks Table

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_tasks_user_id (user_id)
);
```

### Relationships

- **One-to-Many**: One user has many tasks
- **Foreign Key**: tasks.user_id → users.id
- **Cascade Delete**: Deleting a user deletes all their tasks

---

## 7. Development Workflow

### Spec-First Approach (Mandatory)

```
1. Write Specification
   ↓
2. Review & Approve Specification
   ↓
3. Generate Implementation Plan
   ↓
4. Break into Granular Tasks
   ↓
5. Implement via Claude Code
   ↓
6. Test & Validate
   ↓
7. Iterate (update specs if needed)
```

### Agent Workflow

1. **spec-architect** (CURRENT)
   - Creates all specifications in `/specs/` directory
   - Ensures alignment with CONSTITUTION.md
   - Defines acceptance criteria and technical details

2. **architecture-planner**
   - Reviews specifications
   - Creates implementation plan
   - Identifies dependencies and sequence

3. **nextjs-frontend-engineer**
   - Implements frontend based on `/specs/ui/` and `/specs/api/`
   - Generates all frontend code via Claude Code
   - Scope: `/frontend/` directory only

4. **fastapi-backend-engineer**
   - Implements backend based on `/specs/api/` and `/specs/database/`
   - Generates all backend code via Claude Code
   - Scope: `/backend/` directory only

5. **integration-tester**
   - Tests end-to-end functionality
   - Verifies user isolation and security
   - Validates all acceptance criteria

### Prohibited Actions

- ❌ Writing code manually
- ❌ Skipping specifications
- ❌ Bypassing authentication
- ❌ Trusting client-side data
- ❌ Deviating from CONSTITUTION.md
- ❌ Using prohibited technologies

---

## 8. Success Criteria

The Phase II project is successful when ALL of the following are met:

### Functional Requirements

- [ ] Users can sign up with email and password
- [ ] Users can sign in with valid credentials
- [ ] Users can sign out
- [ ] Users can create new tasks
- [ ] Users can view all their own tasks (and ONLY their own)
- [ ] Users can update task title, description
- [ ] Users can toggle task completion status
- [ ] Users can delete tasks
- [ ] All data persists in Neon PostgreSQL
- [ ] Complete data isolation between users

### Technical Requirements

- [ ] Every line of production code generated via Claude Code + Spec-Kit Plus
- [ ] JWT authentication works across frontend ↔ backend
- [ ] All API endpoints protected (except auth endpoints)
- [ ] Server-side ownership validation on all operations
- [ ] Type safety: TypeScript (strict mode) + Python type hints
- [ ] Responsive UI works on mobile, tablet, desktop
- [ ] Proper error handling with user-friendly messages
- [ ] Code follows style guidelines (Black, ESLint, Prettier)

### Security Requirements

- [ ] JWT secret synchronized between frontend and backend
- [ ] User ID extracted from validated JWT (never from request)
- [ ] All database queries filtered by user_id
- [ ] No sensitive data in error messages
- [ ] Input validation on all user inputs
- [ ] HTTPS in production

### Quality Requirements

- [ ] Clean, readable code
- [ ] Consistent naming conventions
- [ ] Proper separation of concerns
- [ ] Comprehensive specifications
- [ ] Clear documentation

---

## 9. Out of Scope for Phase II

The following features are explicitly OUT OF SCOPE for Phase II:

- ❌ AI-powered features (Phase III)
- ❌ Conversational interface (Phase III)
- ❌ Containerization with Docker/Kubernetes (Phase IV)
- ❌ Event-driven architecture (Phase IV)
- ❌ Microservices (Phase IV)
- ❌ Advanced task features (due dates, priorities, recurring tasks, reminders)
- ❌ Task sharing or collaboration
- ❌ Real-time updates (WebSockets)
- ❌ File attachments
- ❌ Task categories or tags
- ❌ Search functionality
- ❌ Pagination (unless task list becomes very large)
- ❌ Email notifications
- ❌ Password reset flow
- ❌ OAuth/social login
- ❌ Rate limiting (bonus, not required)
- ❌ Comprehensive test suite (basic testing only)

---

## 10. Acceptance Criteria

### Overall Project Acceptance

The Phase II implementation is accepted when:

1. **All 5 CRUD operations work end-to-end:**
   - Create task via UI → persists in database → appears in task list
   - Read tasks via UI → fetches from database → displays only user's tasks
   - Update task via UI → updates in database → reflects in task list
   - Delete task via UI → removes from database → disappears from task list
   - Toggle complete via UI → updates in database → reflects in task list

2. **Authentication flow works completely:**
   - New user can sign up → account created → JWT issued
   - Existing user can sign in → credentials validated → JWT issued
   - User can sign out → JWT cleared → redirected to login
   - Unauthenticated user cannot access protected pages → redirected to login

3. **Data isolation is enforced:**
   - User A cannot see User B's tasks
   - User A cannot modify User B's tasks
   - User A cannot delete User B's tasks
   - Attempting to access another user's task returns 403 Forbidden

4. **UI is beautiful and responsive:**
   - Clean, modern design
   - Works on mobile (320px+), tablet (768px+), desktop (1024px+)
   - Smooth interactions and transitions
   - Loading states and error messages
   - Accessible (keyboard navigation, ARIA labels)

5. **Code quality meets standards:**
   - All code generated via Claude Code
   - Follows CONSTITUTION.md principles
   - Passes linting (ESLint, Black, ruff)
   - Type-safe (no TypeScript errors, Python type hints)
   - Proper error handling

---

## 11. Related Specifications

This overview specification is the foundation for all other specifications:

### Feature Specifications
- @specs/features/authentication.md - User authentication flows
- @specs/features/task-management.md - Task CRUD operations
- @specs/features/user-isolation.md - Data isolation requirements

### API Specifications
- @specs/api/overview.md - API design principles and standards
- @specs/api/task-endpoints.md - Task API endpoints

### Database Specifications
- @specs/database/schema.md - Complete database schema
- @specs/database/migrations.md - Migration strategy

### UI Specifications
- @specs/ui/design-system.md - Design system and Tailwind configuration
- @specs/ui/components.md - Reusable component specifications
- @specs/ui/authentication-pages.md - Authentication page specifications
- @specs/ui/task-pages.md - Task page specifications

---

## 12. Testing Strategy

### Manual Testing (Phase II)

For Phase II, testing will be primarily manual:

1. **Authentication Testing**
   - Sign up with new account
   - Sign in with valid credentials
   - Sign in with invalid credentials (should fail)
   - Sign out
   - Access protected page without authentication (should redirect)

2. **Task CRUD Testing**
   - Create task with title only
   - Create task with title and description
   - View task list
   - Update task title
   - Update task description
   - Toggle task completion
   - Delete task

3. **Data Isolation Testing**
   - Create two user accounts
   - Create tasks for User A
   - Sign in as User B
   - Verify User B cannot see User A's tasks
   - Attempt to access User A's task via direct API call (should fail)

4. **UI/UX Testing**
   - Test on mobile device (or Chrome DevTools mobile view)
   - Test on tablet
   - Test on desktop
   - Verify responsive layout
   - Verify loading states
   - Verify error messages

### Automated Testing (Future)

Automated testing will be added in future phases:
- Unit tests for backend services
- Integration tests for API endpoints
- E2E tests with Playwright/Cypress
- Component tests with React Testing Library

---

## 13. Deployment Strategy

### Frontend Deployment (Vercel)

- **Platform**: Vercel (recommended for Next.js)
- **Build Command**: `npm run build`
- **Environment Variables**:
  - `NEXT_PUBLIC_API_URL` - Backend API URL
  - `BETTER_AUTH_SECRET` - JWT secret (must match backend)
  - `BETTER_AUTH_URL` - Frontend URL

### Backend Deployment (Render/Fly.io/DigitalOcean)

- **Platform**: Render, Fly.io, or DigitalOcean App Platform
- **Runtime**: Python 3.12+
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Environment Variables**:
  - `DATABASE_URL` - Neon PostgreSQL connection string
  - `JWT_SECRET` - JWT secret (must match frontend)
  - `CORS_ORIGINS` - Frontend URL for CORS

### Database Setup (Neon)

- **Platform**: Neon Serverless PostgreSQL
- **Setup**: Create database via Neon dashboard
- **Connection**: Use connection string in backend environment variables
- **Migrations**: Run migrations on deployment

---

## 14. Monitoring and Observability

### Logging

- **Frontend**: Console logs in development, structured logging in production
- **Backend**: Structured logging with log levels (DEBUG, INFO, WARNING, ERROR)
- **Database**: Query logging in development only

### Error Tracking

- **Frontend**: Error boundaries to catch React errors
- **Backend**: Global exception handler for unhandled errors
- **Future**: Integration with Sentry or similar service

### Performance Monitoring

- **Frontend**: Next.js built-in analytics
- **Backend**: FastAPI request timing middleware
- **Database**: Neon dashboard for query performance

---

## 15. Conclusion

This overview specification provides the foundation for the Todo App Phase II implementation. All subsequent specifications must align with the principles, architecture, and requirements defined here.

The success of Phase II depends on:
1. Comprehensive, detailed specifications
2. Strict adherence to CONSTITUTION.md
3. Spec-first development workflow
4. Security-first mindset
5. Quality over speed

By following this specification and the related specifications, the implementation agents (nextjs-frontend-engineer and fastapi-backend-engineer) will have everything they need to build a professional, secure, multi-user Todo web application.

---

**Next Steps:**
1. Review and approve this overview specification
2. Create detailed feature specifications
3. Create API contract specifications
4. Create database schema specifications
5. Create UI/UX specifications
6. Begin implementation with approved specifications

---

**Document Status:** Draft - Awaiting Review and Approval
