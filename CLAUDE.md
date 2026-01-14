# Todo App - Hackathon II Phase II
## Root Project Guidance for AI Agents

**Last Updated:** January 2026
**Phase:** Phase II - Full-Stack Web Application

---

## 🎯 Project Mission

Transform a simple in-memory Python console Todo app into a **professional, secure, multi-user web application** with persistent storage, demonstrating the evolution toward cloud-native and AI-powered systems.

---

## 📜 Constitutional Authority

**CRITICAL:** Before making ANY changes to this codebase, you MUST read and internalize:

1. **`CONSTITUTION.md`** - The immutable project constitution containing:
   - Core philosophy & first principles
   - Non-negotiable project values
   - Technology stack constraints
   - Security requirements
   - Code style standards
   - Development workflow

2. **`.spec-kit/config.yaml`** - Project configuration and agent settings

3. **`specs/overview.md`** - High-level Phase II specifications (once created)

---

## 🚨 Binding Rules (From Constitution)

### Spec-First Development (NON-NEGOTIABLE)
- **NEVER write production code manually**
- **Specifications are the Single Source of Truth**
- **Always read relevant specs before implementation**
- **Update specs first, then regenerate code**

### Workflow Sequence (MANDATORY)
1. Read/write specifications
2. Generate implementation plan
3. Break into granular tasks
4. Implement via Claude Code agents
5. Iterate by updating specs

### Security (ABSOLUTE)
- Every task operation filtered by `current_user.id`
- Backend always re-validates ownership
- All endpoints require valid JWT (except auth endpoints)
- JWT secret identical in frontend & backend
- Never log tokens or sensitive data

---

## 🏗️ Monorepo Structure

```
/
├── .spec-kit/          # Spec-Kit Plus configuration
├── specs/              # ALL specifications (Single Source of Truth)
│   ├── overview.md
│   ├── features/       # Feature specifications
│   ├── api/            # API contract specifications
│   ├── database/       # Database schema specifications
│   └── ui/             # UI/UX specifications
├── CONSTITUTION.md     # Project constitution (immutable)
├── CLAUDE.md          # This file - root guidance
├── frontend/          # Next.js 16+ App Router application
│   └── CLAUDE.md      # Frontend-specific guidance
├── backend/           # FastAPI application
│   └── CLAUDE.md      # Backend-specific guidance
└── README.md          # User-facing documentation
```

---

## 🛠️ Technology Stack (Locked)

### Frontend
- **Framework:** Next.js 16+ (App Router ONLY)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **Auth:** Better Auth (JWT mode)

### Backend
- **Framework:** FastAPI
- **Language:** Python 3.12+
- **ORM:** SQLModel + Pydantic v2
- **JWT:** PyJWT + python-jose
- **Database:** Neon Serverless PostgreSQL

### Prohibited
- ❌ Next.js Pages Router
- ❌ Prisma/Drizzle/SQLAlchemy
- ❌ CSS-in-JS/CSS Modules
- ❌ Manual code writing

---

## 🤖 Specialized Agents

### spec-architect
**Purpose:** Create and maintain specifications
**When to use:** Before any implementation work
**Output:** Comprehensive specs in `/specs/`

### architecture-planner
**Purpose:** System-wide architectural decisions
**When to use:** Planning major features or structural changes
**Output:** Architecture plans and technical specifications

### nextjs-frontend-engineer
**Purpose:** Implement frontend features
**When to use:** After specs are approved
**Requires:** Approved specifications in `/specs/ui/` and `/specs/api/`
**Scope:** `/frontend/` directory only

### fastapi-backend-engineer
**Purpose:** Implement backend APIs and services
**When to use:** After specs are approved
**Requires:** Approved specifications in `/specs/api/` and `/specs/database/`
**Scope:** `/backend/` directory only

### integration-tester
**Purpose:** End-to-end testing across frontend and backend
**When to use:** After both frontend and backend implementation complete
**Scope:** Full application testing

---

## 📋 Development Workflow

### Phase 1: Specification (CURRENT)
1. Use `spec-architect` agent to create comprehensive specifications
2. Review and refine specifications
3. Get approval before proceeding

### Phase 2: Planning
1. Use `architecture-planner` for system design
2. Break down into implementation tasks
3. Identify dependencies and sequence

### Phase 3: Implementation
1. Launch `nextjs-frontend-engineer` for frontend work
2. Launch `fastapi-backend-engineer` for backend work
3. Agents MUST verify specs are approved before coding
4. All code generated via Claude Code

### Phase 4: Integration & Testing
1. Launch `integration-tester` agent
2. Verify end-to-end functionality
3. Ensure user isolation and security

---

## 🔐 Security Checklist

Every implementation MUST satisfy:

- [ ] JWT authentication enforced on all protected endpoints
- [ ] User ID extracted from validated JWT token
- [ ] All database queries filtered by `user_id`
- [ ] Ownership validation on server-side (never trust client)
- [ ] Proper error handling (no sensitive data leakage)
- [ ] Input validation on all user inputs
- [ ] HTTPS in production (handled by deployment platforms)

---

## 📝 Code Style Standards

### Python (Backend)
- Type hints everywhere
- Black + isort + ruff formatting
- `Annotated` + `Depends` for dependency injection
- snake_case for everything except classes (PascalCase)

### TypeScript (Frontend)
- Strict TypeScript configuration
- Prefer Server Components
- Client Components only when necessary (interactivity, hooks, browser APIs)
- camelCase for variables/functions, PascalCase for components
- Tailwind for all styling

### Naming Conventions
- **Database/Models:** snake_case
- **API Payloads:** camelCase
- **URL Paths:** kebab-case
- **Environment Variables:** SCREAMING_SNAKE_CASE
- **Components:** PascalCase

---

## 🎯 Success Criteria (Phase II)

The project is successful when:

- [ ] Users can sign up, sign in, sign out
- [ ] Complete data isolation per user
- [ ] All 5 CRUD operations work end-to-end:
  - [ ] Create task
  - [ ] Read/list tasks
  - [ ] Update task
  - [ ] Delete task
  - [ ] Toggle complete status
- [ ] Persistent storage in Neon PostgreSQL
- [ ] Beautiful, responsive UI
- [ ] JWT authentication across frontend ↔ backend
- [ ] All API endpoints protected
- [ ] Every line of code generated via Claude Code + Spec-Kit Plus

---

## 🚫 Prohibited Actions

- ❌ Writing code manually
- ❌ Skipping specifications
- ❌ Bypassing authentication
- ❌ Trusting client-side data
- ❌ Deviating from Constitution
- ❌ Using prohibited technologies
- ❌ Manual database edits

---

## 📚 Reference Documents

1. **CONSTITUTION.md** - Project constitution (read first)
2. **specs/overview.md** - Phase II overview specification
3. **specs/features/** - Feature specifications
4. **specs/api/** - API contract specifications
5. **specs/database/** - Database schema specifications
6. **specs/ui/** - UI/UX specifications
7. **frontend/CLAUDE.md** - Frontend-specific guidance
8. **backend/CLAUDE.md** - Backend-specific guidance

---

## 🎓 For AI Agents Working on This Project

### Before Starting Any Task:
1. Read CONSTITUTION.md thoroughly
2. Read relevant specifications in `/specs/`
3. Understand the security requirements
4. Verify specs are approved
5. Check which specialized agent should handle the task

### During Implementation:
1. Follow the technology stack constraints
2. Adhere to code style standards
3. Implement security requirements
4. Reference specs using `@specs/...` notation
5. Update specs if requirements change

### After Implementation:
1. Verify all security checks pass
2. Ensure code follows style guidelines
3. Confirm user isolation is enforced
4. Document any spec deviations (should be none)

---

## 🆘 When in Doubt

1. **Check CONSTITUTION.md** - It has the final word
2. **Read the specs** - They are the Single Source of Truth
3. **Ask for clarification** - Better to ask than assume
4. **Default to security** - When uncertain, choose the more secure option
5. **Prefer simplicity** - Avoid over-engineering

---

**Remember:** This is a spec-driven, AI-assisted project. The quality of our specifications determines the quality of our implementation. Take time to get the specs right before writing any code.
