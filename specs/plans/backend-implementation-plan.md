# Plan: Complete FastAPI Backend Implementation + Frontend Integration

**File:** `@specs/plans/backend-implementation-plan.md`
**Phase:** II – Full-Stack Web Application
**Priority:** Critical – This plan turns the Todo app into a real full-stack product
**Status:** Draft
**Version:** 1.0
**Last Updated:** January 2026

---

## Objective

Implement a secure, performant FastAPI backend that:
- Connects to the real Neon PostgreSQL database
- Verifies JWT tokens from Better Auth (frontend)
- Provides full multi-user Todo CRUD operations with strict ownership
- Enables the existing Next.js frontend to use real API calls instead of mock data
- Results in end-to-end working application: sign up → login → manage persistent tasks

---

## Core Constraints & Promises

- Use **exactly** the environment variables from the constitution/spec:
  ```env
  BETTER_AUTH_SECRET=49pKok08UbAju61y1YJ7xZSSNd12RSFe
  BETTER_AUTH_URL=http://localhost:3000
  DATABASE_URL=postgresql://neondb_owner:npg_j1myLUFYE0dS@ep-blue-art-ah34hwpr-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
  ```
- Never hardcode secrets — load from env only
- 100% ownership enforcement — no exceptions
- All code must follow CONSTITUTION.md rules (type hints, clean architecture, no magic)

---

## Recommended Implementation Phases (Sequential)

### Phase 1 – Foundation & Setup

1. Create complete backend folder structure
2. Generate `requirements.txt` with exact dependencies
3. Create settings/config module that loads the three env vars above
4. Implement database connection (engine + async session)
5. Add startup event to create tables automatically (or provide migration command)

---

### Phase 2 – Authentication & JWT Security

6. Implement JWKS fetching from `http://localhost:3000/api/auth/jwks`
7. Build robust JWT verification dependency (using python-jose)
   - Cache JWKS
   - Validate issuer, audience, exp, signature
   - Prefer EdDSA/Ed25519
8. Create `current_user` dependency that returns dict with id & email
9. Add 401/403 protection to all protected routes

---

### Phase 3 – Domain Models & Services

10. Define SQLModel User and Task models (exact fields from spec)
11. Create TaskService class with clean business logic:
    - `get_all_tasks(user_id)`
    - `get_task(user_id, task_id)`
    - `create_task(user_id, data)`
    - `update_task(user_id, task_id, data)`
    - `delete_task(user_id, task_id)`
    - `toggle_complete(user_id, task_id)`

---

### Phase 4 – API Routes & Responses

12. Implement all 7 required endpoints under `/api` prefix
13. Use consistent response envelope (success/data or success/error)
14. Add proper status codes (201 create, 404 not found, 403 forbidden, etc.)
15. Validate inputs with Pydantic models

---

### Phase 5 – Security, Middleware & Polish

16. Add CORS middleware – allow only `http://localhost:3000`
17. Add global exception handler for consistent error responses
18. Add basic logging (uvicorn default + request logging)
19. Document health endpoint `/api/health`

---

### Phase 6 – Frontend Integration Guide

20. Provide clear, copy-paste instructions for frontend team/agent:
    - How to get JWT after sign in (`authClient.token()`)
    - How to attach Bearer token to fetch/axios calls
    - How to handle success/error envelope in responses
    - Which status codes trigger redirect/toast (401→login, 403→forbidden, etc.)
    - Example code snippets for each CRUD operation

---

## Success Criteria Checklist (Must All Be True)

- [ ] Backend starts with `uvicorn main:app --reload` → http://localhost:8000
- [ ] `/api/health` returns `{"status": "ok"}`
- [ ] After frontend login → JWT is sent in header
- [ ] All CRUD operations work and persist in Neon database
- [ ] Impossible to see/modify another user's tasks
- [ ] Frontend switches from mock → real API without breaking UI
- [ ] Clean errors shown in frontend (toasts/redirects)

---

## Execution Recommendation

Implement one phase at a time.

Start with Phase 1.

After each phase, commit with message like:
```
feat(backend): complete [phase name]
```

---

## References

Use these documents during implementation:
- `@specs/features/backend-complete-and-frontend-integration.md` - Complete backend specification
- `@CONSTITUTION.md` - Constitutional requirements
- `@frontend/CLAUDE.md` - Frontend integration guidance
- `@backend/CLAUDE.md` - Backend-specific guidance

---

## Phase Details

### Phase 1 Details: Foundation & Setup

**Goal:** Create the basic project structure and configuration

**Tasks:**
1. Create directory structure:
   ```
   backend/
   ├── app/
   │   ├── __init__.py
   │   ├── main.py
   │   ├── config.py
   │   ├── database.py
   │   ├── models/
   │   ├── schemas/
   │   ├── api/
   │   └── core/
   ├── requirements.txt
   ├── .env.example
   └── .gitignore
   ```

2. Create `requirements.txt`:
   ```txt
   fastapi==0.109.0
   uvicorn[standard]==0.27.0
   sqlmodel==0.0.14
   pydantic==2.5.3
   pydantic-settings==2.1.0
   psycopg2-binary==2.9.9
   python-jose[cryptography]==3.3.0
   PyJWT==2.8.0
   python-multipart==0.0.6
   ```

3. Create `config.py` with settings class
4. Create `database.py` with engine and session
5. Add table creation on startup

**Acceptance Criteria:**
- [ ] All directories created
- [ ] Dependencies installable
- [ ] Settings load from environment
- [ ] Database connection works
- [ ] Tables created automatically

---

### Phase 2 Details: Authentication & JWT Security

**Goal:** Implement secure JWT verification

**Tasks:**
1. Create `core/security.py` with JWT verification
2. Implement JWKS fetching and caching
3. Create `current_user` dependency
4. Add authentication to protected routes

**Acceptance Criteria:**
- [ ] JWT verification works
- [ ] Invalid tokens return 401
- [ ] User ID extracted from token
- [ ] JWKS cached properly

---

### Phase 3 Details: Domain Models & Services

**Goal:** Define data models and business logic

**Tasks:**
1. Create `models/user.py` with User model
2. Create `models/task.py` with Task model
3. Create `services/task_service.py` with business logic
4. Implement all CRUD operations with ownership checks

**Acceptance Criteria:**
- [ ] Models match specification
- [ ] Foreign key relationships correct
- [ ] Service layer implements all operations
- [ ] Ownership enforced in service layer

---

### Phase 4 Details: API Routes & Responses

**Goal:** Implement all REST API endpoints

**Tasks:**
1. Create `api/tasks.py` with all 7 endpoints
2. Create `schemas/task.py` with Pydantic models
3. Create `schemas/response.py` with response envelopes
4. Implement proper status codes

**Acceptance Criteria:**
- [ ] All 7 endpoints implemented
- [ ] Request validation works
- [ ] Response envelope consistent
- [ ] Status codes correct

---

### Phase 5 Details: Security, Middleware & Polish

**Goal:** Add security layers and error handling

**Tasks:**
1. Add CORS middleware
2. Add global exception handler
3. Add request logging
4. Create health endpoint

**Acceptance Criteria:**
- [ ] CORS allows frontend only
- [ ] Errors return consistent format
- [ ] Logging works
- [ ] Health check responds

---

### Phase 6 Details: Frontend Integration Guide

**Goal:** Provide clear integration instructions

**Tasks:**
1. Document JWT token retrieval
2. Document API client updates
3. Provide code examples
4. Document error handling

**Acceptance Criteria:**
- [ ] Instructions are clear
- [ ] Code examples work
- [ ] Error handling documented
- [ ] Frontend team can integrate easily

---

## Implementation Notes

### JWT Verification Pattern

```python
from jose import jwt, JWTError
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer

security = HTTPBearer()

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.BETTER_AUTH_SECRET,
            algorithms=["HS256"]
        )
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_user(payload: dict = Depends(verify_token)):
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    return {"id": user_id, "email": payload.get("email")}
```

### Ownership Validation Pattern

```python
def validate_ownership(task: Task, user_id: str):
    if task.user_id != user_id:
        raise HTTPException(
            status_code=403,
            detail={"code": "FORBIDDEN", "message": "Not authorized"}
        )
```

### Response Envelope Pattern

```python
def success_response(data: Any, message: str = None):
    return {"success": True, "data": data, "message": message}

def error_response(code: str, message: str, details: Any = None):
    return {
        "success": False,
        "error": {"code": code, "message": message, "details": details}
    }
```

---

## Testing Strategy

### Manual Testing Checklist

1. **Health Check**
   ```bash
   curl http://localhost:8000/api/health
   ```

2. **Create Task (with JWT)**
   ```bash
   curl -X POST http://localhost:8000/api/tasks \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"title": "Test task", "priority": "high"}'
   ```

3. **Get All Tasks**
   ```bash
   curl http://localhost:8000/api/tasks \
     -H "Authorization: Bearer <token>"
   ```

4. **Update Task**
   ```bash
   curl -X PUT http://localhost:8000/api/tasks/<task_id> \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"title": "Updated task"}'
   ```

5. **Delete Task**
   ```bash
   curl -X DELETE http://localhost:8000/api/tasks/<task_id> \
     -H "Authorization: Bearer <token>"
   ```

6. **Toggle Complete**
   ```bash
   curl -X PATCH http://localhost:8000/api/tasks/<task_id>/complete \
     -H "Authorization: Bearer <token>"
   ```

---

## Troubleshooting Guide

### Common Issues

1. **Database Connection Fails**
   - Check DATABASE_URL is correct
   - Verify Neon database is accessible
   - Check SSL mode is set correctly

2. **JWT Verification Fails**
   - Verify BETTER_AUTH_SECRET matches frontend
   - Check token format (Bearer prefix)
   - Verify token hasn't expired

3. **CORS Errors**
   - Verify frontend URL in CORS config
   - Check credentials are allowed
   - Verify headers are allowed

4. **Ownership Validation Fails**
   - Check user_id is extracted correctly
   - Verify task.user_id matches current user
   - Check database queries filter by user_id

---

## Related Documents

- **Backend Specification:** `@specs/features/backend-complete-and-frontend-integration.md`
- **Constitution:** `@CONSTITUTION.md`
- **Backend Guidance:** `@backend/CLAUDE.md`
- **Frontend Guidance:** `@frontend/CLAUDE.md`

---

**Status:** Complete plan - Ready for implementation by fastapi-backend-engineer agent
