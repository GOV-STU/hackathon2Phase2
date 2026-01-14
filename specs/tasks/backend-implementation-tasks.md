# Backend Implementation Tasks

**File:** `@specs/tasks/backend-implementation-tasks.md`
**Phase:** II – Full-Stack Web Application (Backend)
**Based On:**
- `@specs/features/backend-complete-and-frontend-integration.md`
- `@specs/plans/backend-implementation-plan.md`
- `@CONSTITUTION.md`
**Status:** Ready for Implementation
**Version:** 1.0
**Last Updated:** January 2026

---

## Overview

This document breaks down the backend implementation into **35 granular, trackable tasks** across 6 phases, following the constitutional requirement of spec-first development with detailed task planning.

**Total Tasks:** 35 tasks across 6 phases

---

## Phase 1: Foundation & Setup (8 tasks)

### Task 1.1: Create Backend Directory Structure
**Priority:** Critical
**Dependencies:** None
**Description:** Create complete backend folder structure following specification

**Acceptance Criteria:**
- [ ] `/backend/app/` directory created
- [ ] `/backend/app/models/` directory created
- [ ] `/backend/app/schemas/` directory created
- [ ] `/backend/app/api/` directory created
- [ ] `/backend/app/core/` directory created
- [ ] All `__init__.py` files created
- [ ] Structure matches specification exactly

**Files to Create:**
```
backend/
├── app/
│   ├── __init__.py
│   ├── models/__init__.py
│   ├── schemas/__init__.py
│   ├── api/__init__.py
│   └── core/__init__.py
```

---

### Task 1.2: Create requirements.txt
**Priority:** Critical
**Dependencies:** Task 1.1
**Description:** Generate requirements.txt with exact dependencies from specification

**Acceptance Criteria:**
- [ ] All required packages listed
- [ ] Exact versions specified
- [ ] No extra/unnecessary packages
- [ ] File matches specification

**Dependencies to Include:**
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

**Files to Create:**
- `backend/requirements.txt`

---

### Task 1.3: Create .env.example File
**Priority:** High
**Dependencies:** Task 1.1
**Description:** Create .env.example with required environment variables (no real secrets)

**Acceptance Criteria:**
- [ ] All three required env vars listed
- [ ] Clear comments explaining each variable
- [ ] No real secrets committed
- [ ] Matches specification exactly

**Environment Variables:**
```env
# Better Auth Configuration
BETTER_AUTH_SECRET=your_secret_here
BETTER_AUTH_URL=http://localhost:3000

# Database Configuration
DATABASE_URL=postgresql://user:password@host:port/dbname?sslmode=require
```

**Files to Create:**
- `backend/.env.example`

---

### Task 1.4: Create .gitignore File
**Priority:** High
**Dependencies:** Task 1.1
**Description:** Create .gitignore to prevent committing sensitive files

**Acceptance Criteria:**
- [ ] .env file ignored
- [ ] __pycache__ ignored
- [ ] *.pyc files ignored
- [ ] .pytest_cache ignored
- [ ] venv/ ignored

**Files to Create:**
- `backend/.gitignore`

---

### Task 1.5: Create Config Module
**Priority:** Critical
**Dependencies:** Task 1.2, Task 1.3
**Description:** Implement settings/config module that loads environment variables

**Acceptance Criteria:**
- [ ] Uses pydantic-settings
- [ ] Loads all three required env vars
- [ ] Type hints on all settings
- [ ] Validation for required fields
- [ ] Settings singleton pattern

**Files to Create:**
- `backend/app/config.py`

**Implementation Pattern:**
```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    BETTER_AUTH_SECRET: str
    BETTER_AUTH_URL: str
    DATABASE_URL: str

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
```

---

### Task 1.6: Create Database Connection Module
**Priority:** Critical
**Dependencies:** Task 1.5
**Description:** Implement database connection with engine and session

**Acceptance Criteria:**
- [ ] SQLModel engine created
- [ ] Connection pool configured
- [ ] Session dependency created
- [ ] Type hints everywhere
- [ ] Proper error handling

**Files to Create:**
- `backend/app/database.py`

**Implementation Pattern:**
```python
from sqlmodel import create_engine, Session, SQLModel
from app.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    echo=False,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20
)

def get_session():
    with Session(engine) as session:
        yield session
```

---

### Task 1.7: Create Main FastAPI App
**Priority:** Critical
**Dependencies:** Task 1.5, Task 1.6
**Description:** Initialize FastAPI application with basic configuration

**Acceptance Criteria:**
- [ ] FastAPI app created
- [ ] Title and description set
- [ ] Version specified
- [ ] Docs URL configured
- [ ] App runs successfully

**Files to Create:**
- `backend/app/main.py`

**Implementation Pattern:**
```python
from fastapi import FastAPI
from app.config import settings

app = FastAPI(
    title="Todo App API",
    description="Secure multi-user Todo application API",
    version="1.0.0"
)

@app.get("/health")
async def health_check():
    return {"status": "ok"}
```

---

### Task 1.8: Implement Automatic Table Creation
**Priority:** High
**Dependencies:** Task 1.6, Task 1.7
**Description:** Add startup event to create database tables automatically

**Acceptance Criteria:**
- [ ] Startup event handler created
- [ ] SQLModel.metadata.create_all() called
- [ ] Tables created on first run
- [ ] No errors on subsequent runs
- [ ] Logging added

**Files to Modify:**
- `backend/app/main.py`

**Implementation Pattern:**
```python
@app.on_event("startup")
async def on_startup():
    SQLModel.metadata.create_all(engine)
```

---

## Phase 2: Authentication & JWT Security (6 tasks)

### Task 2.1: Create Security Module
**Priority:** Critical
**Dependencies:** Phase 1 complete
**Description:** Create core security module for JWT verification

**Acceptance Criteria:**
- [ ] Module created with proper structure
- [ ] Type hints everywhere
- [ ] HTTPBearer security scheme
- [ ] Ready for JWT functions

**Files to Create:**
- `backend/app/core/security.py`

---

### Task 2.2: Implement JWT Token Extraction
**Priority:** Critical
**Dependencies:** Task 2.1
**Description:** Extract JWT token from Authorization header

**Acceptance Criteria:**
- [ ] Extracts Bearer token from header
- [ ] Validates header format
- [ ] Returns 401 if missing/invalid
- [ ] Type hints correct

**Files to Modify:**
- `backend/app/core/security.py`

**Implementation Pattern:**
```python
from fastapi import Header, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

def get_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    return credentials.credentials
```

---

### Task 2.3: Implement JWT Verification
**Priority:** Critical
**Dependencies:** Task 2.2
**Description:** Verify JWT signature and decode payload

**Acceptance Criteria:**
- [ ] Uses python-jose for JWT
- [ ] Verifies signature with BETTER_AUTH_SECRET
- [ ] Validates expiration
- [ ] Returns 401 on invalid token
- [ ] Proper error messages

**Files to Modify:**
- `backend/app/core/security.py`

**Implementation Pattern:**
```python
import jwt
from jose import JWTError

def verify_token(token: str) -> dict:
    try:
        payload = jwt.decode(
            token,
            settings.BETTER_AUTH_SECRET,
            algorithms=["HS256"]
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(401, "Token expired")
    except JWTError:
        raise HTTPException(401, "Invalid token")
```

---

### Task 2.4: Extract User ID from Token
**Priority:** Critical
**Dependencies:** Task 2.3
**Description:** Extract and validate user_id from JWT payload

**Acceptance Criteria:**
- [ ] Extracts "sub" claim from payload
- [ ] Validates user_id exists
- [ ] Returns 401 if missing
- [ ] Type hints correct

**Files to Modify:**
- `backend/app/core/security.py`

**Implementation Pattern:**
```python
def get_current_user_id(payload: dict) -> str:
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(401, "Invalid token payload")
    return user_id
```

---

### Task 2.5: Create Current User Dependency
**Priority:** Critical
**Dependencies:** Task 2.2, Task 2.3, Task 2.4
**Description:** Create FastAPI dependency for current authenticated user

**Acceptance Criteria:**
- [ ] Combines token extraction and verification
- [ ] Returns user_id string
- [ ] Can be used in route dependencies
- [ ] Type hints with Annotated

**Files to Modify:**
- `backend/app/core/security.py`

**Implementation Pattern:**
```python
from typing import Annotated
from fastapi import Depends

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> str:
    token = credentials.credentials
    payload = verify_token(token)
    user_id = get_current_user_id(payload)
    return user_id

CurrentUser = Annotated[str, Depends(get_current_user)]
```

---

### Task 2.6: Create Dependencies Module
**Priority:** High
**Dependencies:** Task 2.5, Task 1.6
**Description:** Create API dependencies module with session and auth

**Acceptance Criteria:**
- [ ] Session dependency exported
- [ ] CurrentUser dependency exported
- [ ] Type aliases created
- [ ] Clean imports

**Files to Create:**
- `backend/app/api/deps.py`

**Implementation Pattern:**
```python
from typing import Annotated
from fastapi import Depends
from sqlmodel import Session
from app.database import get_session
from app.core.security import get_current_user

SessionDep = Annotated[Session, Depends(get_session)]
CurrentUserDep = Annotated[str, Depends(get_current_user)]
```

---

## Phase 3: Domain Models & Services (6 tasks)

### Task 3.1: Create User Model
**Priority:** Critical
**Dependencies:** Phase 1 complete
**Description:** Define SQLModel User model matching specification

**Acceptance Criteria:**
- [ ] All fields from specification
- [ ] Proper types and constraints
- [ ] Table name set correctly
- [ ] Indexes on email
- [ ] Type hints everywhere

**Files to Create:**
- `backend/app/models/user.py`

**Model Fields:**
```python
class User(SQLModel, table=True):
    __tablename__ = "users"

    id: str = Field(primary_key=True)
    email: str = Field(unique=True, index=True)
    name: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

---

### Task 3.2: Create Task Model
**Priority:** Critical
**Dependencies:** Task 3.1
**Description:** Define SQLModel Task model with user relationship

**Acceptance Criteria:**
- [ ] All fields from specification
- [ ] Foreign key to users table
- [ ] Index on user_id
- [ ] UUID generation for id
- [ ] Type hints everywhere

**Files to Create:**
- `backend/app/models/task.py`

**Model Fields:**
```python
class Task(SQLModel, table=True):
    __tablename__ = "tasks"

    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    priority: str = Field(default="medium")
    due_date: Optional[datetime] = None
    user_id: str = Field(foreign_key="users.id", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

---

### Task 3.3: Create Task Request Schemas
**Priority:** High
**Dependencies:** Task 3.2
**Description:** Create Pydantic schemas for task requests

**Acceptance Criteria:**
- [ ] TaskCreate schema
- [ ] TaskUpdate schema
- [ ] Proper validation rules
- [ ] Type hints everywhere

**Files to Create:**
- `backend/app/schemas/task.py`

**Schemas:**
```python
class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    priority: str = Field(default="medium")
    due_date: Optional[datetime] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    completed: Optional[bool] = None
    priority: Optional[str] = None
    due_date: Optional[datetime] = None
```

---

### Task 3.4: Create Task Response Schema
**Priority:** High
**Dependencies:** Task 3.2
**Description:** Create Pydantic schema for task responses

**Acceptance Criteria:**
- [ ] TaskResponse schema
- [ ] All fields included
- [ ] from_attributes = True
- [ ] Type hints everywhere

**Files to Modify:**
- `backend/app/schemas/task.py`

**Schema:**
```python
class TaskResponse(BaseModel):
    id: str
    title: str
    description: Optional[str]
    completed: bool
    priority: str
    due_date: Optional[datetime]
    user_id: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
```

---

### Task 3.5: Create Response Envelope Schemas
**Priority:** High
**Dependencies:** None
**Description:** Create success/error response envelope schemas

**Acceptance Criteria:**
- [ ] SuccessResponse schema
- [ ] ErrorResponse schema
- [ ] ErrorDetail schema
- [ ] Type hints everywhere

**Files to Create:**
- `backend/app/schemas/response.py`

**Schemas:**
```python
class SuccessResponse(BaseModel):
    success: bool = True
    data: Any
    message: Optional[str] = None

class ErrorDetail(BaseModel):
    code: str
    message: str
    details: Optional[dict] = None

class ErrorResponse(BaseModel):
    success: bool = False
    error: ErrorDetail
```

---

### Task 3.6: Create Ownership Validation Helper
**Priority:** Critical
**Dependencies:** Task 3.2
**Description:** Create helper function to validate task ownership

**Acceptance Criteria:**
- [ ] Validates task belongs to user
- [ ] Raises 403 if not owner
- [ ] Clear error message
- [ ] Type hints everywhere

**Files to Create:**
- `backend/app/core/exceptions.py`

**Implementation:**
```python
from fastapi import HTTPException, status
from app.models.task import Task

def validate_task_ownership(task: Task, current_user_id: str):
    if task.user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "code": "FORBIDDEN",
                "message": "You don't have permission to access this task"
            }
        )
```

---

## Phase 4: API Routes & Responses (7 tasks)

### Task 4.1: Create Tasks Router
**Priority:** Critical
**Dependencies:** Phase 3 complete
**Description:** Create FastAPI router for task endpoints

**Acceptance Criteria:**
- [ ] APIRouter created
- [ ] Prefix set to /api/tasks
- [ ] Tags set correctly
- [ ] Ready for endpoints

**Files to Create:**
- `backend/app/api/tasks.py`

**Implementation:**
```python
from fastapi import APIRouter

router = APIRouter(prefix="/api/tasks", tags=["tasks"])
```

---

### Task 4.2: Implement Get All Tasks Endpoint
**Priority:** Critical
**Dependencies:** Task 4.1
**Description:** Implement GET /api/tasks endpoint

**Acceptance Criteria:**
- [ ] Returns all tasks for current user
- [ ] Filters by user_id
- [ ] Returns success envelope
- [ ] Type hints correct

**Files to Modify:**
- `backend/app/api/tasks.py`

**Endpoint:**
```python
@router.get("", response_model=list[TaskResponse])
async def get_tasks(
    session: SessionDep,
    current_user_id: CurrentUserDep
):
    statement = select(Task).where(Task.user_id == current_user_id)
    tasks = session.exec(statement).all()
    return tasks
```

---

### Task 4.3: Implement Create Task Endpoint
**Priority:** Critical
**Dependencies:** Task 4.1
**Description:** Implement POST /api/tasks endpoint

**Acceptance Criteria:**
- [ ] Creates new task
- [ ] Sets user_id from token
- [ ] Returns 201 status
- [ ] Returns success envelope

**Files to Modify:**
- `backend/app/api/tasks.py`

**Endpoint:**
```python
@router.post("", response_model=TaskResponse, status_code=201)
async def create_task(
    task_data: TaskCreate,
    session: SessionDep,
    current_user_id: CurrentUserDep
):
    task = Task(**task_data.model_dump(), user_id=current_user_id)
    session.add(task)
    session.commit()
    session.refresh(task)
    return task
```

---

### Task 4.4: Implement Get Single Task Endpoint
**Priority:** Critical
**Dependencies:** Task 4.1, Task 3.6
**Description:** Implement GET /api/tasks/{task_id} endpoint

**Acceptance Criteria:**
- [ ] Gets task by ID
- [ ] Validates ownership
- [ ] Returns 404 if not found
- [ ] Returns 403 if not owner

**Files to Modify:**
- `backend/app/api/tasks.py`

**Endpoint:**
```python
@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: str,
    session: SessionDep,
    current_user_id: CurrentUserDep
):
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(404, "Task not found")
    validate_task_ownership(task, current_user_id)
    return task
```

---

### Task 4.5: Implement Update Task Endpoint
**Priority:** Critical
**Dependencies:** Task 4.1, Task 3.6
**Description:** Implement PUT /api/tasks/{task_id} endpoint

**Acceptance Criteria:**
- [ ] Updates task fields
- [ ] Validates ownership
- [ ] Updates updated_at timestamp
- [ ] Returns updated task

**Files to Modify:**
- `backend/app/api/tasks.py`

**Endpoint:**
```python
@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: str,
    task_data: TaskUpdate,
    session: SessionDep,
    current_user_id: CurrentUserDep
):
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(404, "Task not found")
    validate_task_ownership(task, current_user_id)

    update_data = task_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(task, key, value)

    task.updated_at = datetime.utcnow()
    session.add(task)
    session.commit()
    session.refresh(task)
    return task
```

---

### Task 4.6: Implement Delete Task Endpoint
**Priority:** Critical
**Dependencies:** Task 4.1, Task 3.6
**Description:** Implement DELETE /api/tasks/{task_id} endpoint

**Acceptance Criteria:**
- [ ] Deletes task
- [ ] Validates ownership
- [ ] Returns 204 status
- [ ] No content in response

**Files to Modify:**
- `backend/app/api/tasks.py`

**Endpoint:**
```python
@router.delete("/{task_id}", status_code=204)
async def delete_task(
    task_id: str,
    session: SessionDep,
    current_user_id: CurrentUserDep
):
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(404, "Task not found")
    validate_task_ownership(task, current_user_id)

    session.delete(task)
    session.commit()
```

---

### Task 4.7: Implement Toggle Complete Endpoint
**Priority:** Critical
**Dependencies:** Task 4.1, Task 3.6
**Description:** Implement PATCH /api/tasks/{task_id}/complete endpoint

**Acceptance Criteria:**
- [ ] Toggles completed status
- [ ] Validates ownership
- [ ] Updates updated_at timestamp
- [ ] Returns updated task

**Files to Modify:**
- `backend/app/api/tasks.py`

**Endpoint:**
```python
@router.patch("/{task_id}/complete", response_model=TaskResponse)
async def toggle_complete(
    task_id: str,
    session: SessionDep,
    current_user_id: CurrentUserDep
):
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(404, "Task not found")
    validate_task_ownership(task, current_user_id)

    task.completed = not task.completed
    task.updated_at = datetime.utcnow()
    session.add(task)
    session.commit()
    session.refresh(task)
    return task
```

---

## Phase 5: Security, Middleware & Polish (5 tasks)

### Task 5.1: Add CORS Middleware
**Priority:** Critical
**Dependencies:** Task 1.7
**Description:** Configure CORS to allow frontend requests only

**Acceptance Criteria:**
- [ ] CORS middleware added
- [ ] Allows http://localhost:3000 only
- [ ] Credentials allowed
- [ ] All methods allowed
- [ ] All headers allowed

**Files to Modify:**
- `backend/app/main.py`

**Implementation:**
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

### Task 5.2: Add Global Exception Handler
**Priority:** High
**Dependencies:** Task 1.7
**Description:** Add global exception handler for consistent errors

**Acceptance Criteria:**
- [ ] Catches all exceptions
- [ ] Returns consistent error format
- [ ] Logs errors
- [ ] Hides sensitive details in production

**Files to Modify:**
- `backend/app/main.py`

**Implementation:**
```python
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occurred"
            }
        }
    )
```

---

### Task 5.3: Add HTTP Exception Handler
**Priority:** High
**Dependencies:** Task 1.7
**Description:** Add handler for FastAPI HTTPException

**Acceptance Criteria:**
- [ ] Catches HTTPException
- [ ] Returns consistent error format
- [ ] Preserves status code
- [ ] Extracts error details

**Files to Modify:**
- `backend/app/main.py`

**Implementation:**
```python
from fastapi.exceptions import HTTPException

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "code": "HTTP_ERROR",
                "message": str(exc.detail)
            }
        }
    )
```

---

### Task 5.4: Add Validation Exception Handler
**Priority:** High
**Dependencies:** Task 1.7
**Description:** Add handler for Pydantic validation errors

**Acceptance Criteria:**
- [ ] Catches RequestValidationError
- [ ] Returns 422 status
- [ ] Returns validation details
- [ ] Consistent error format

**Files to Modify:**
- `backend/app/main.py`

**Implementation:**
```python
from fastapi.exceptions import RequestValidationError

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "Invalid request data",
                "details": exc.errors()
            }
        }
    )
```

---

### Task 5.5: Include Tasks Router in Main App
**Priority:** Critical
**Dependencies:** Task 4.1
**Description:** Include tasks router in main FastAPI app

**Acceptance Criteria:**
- [ ] Router imported
- [ ] Router included in app
- [ ] All endpoints accessible
- [ ] Prefix correct

**Files to Modify:**
- `backend/app/main.py`

**Implementation:**
```python
from app.api.tasks import router as tasks_router

app.include_router(tasks_router)
```

---

## Phase 6: Frontend Integration Guide (3 tasks)

### Task 6.1: Create README with Setup Instructions
**Priority:** High
**Dependencies:** All previous phases
**Description:** Create comprehensive README with setup and usage instructions

**Acceptance Criteria:**
- [ ] Installation instructions
- [ ] Environment setup
- [ ] Running the server
- [ ] API documentation
- [ ] Testing instructions

**Files to Create:**
- `backend/README.md`

---

### Task 6.2: Document Frontend Integration
**Priority:** High
**Dependencies:** All previous phases
**Description:** Document how frontend should integrate with backend

**Acceptance Criteria:**
- [ ] JWT token retrieval documented
- [ ] API client update instructions
- [ ] Error handling documented
- [ ] Code examples provided

**Files to Modify:**
- `backend/README.md`

---

### Task 6.3: Create API Testing Examples
**Priority:** Medium
**Dependencies:** All previous phases
**Description:** Provide curl examples for testing all endpoints

**Acceptance Criteria:**
- [ ] Health check example
- [ ] Create task example
- [ ] Get tasks example
- [ ] Update task example
- [ ] Delete task example
- [ ] Toggle complete example

**Files to Modify:**
- `backend/README.md`

---

## Task Summary by Phase

| Phase | Tasks | Description |
|-------|-------|-------------|
| Phase 1 | 8 | Foundation & Setup |
| Phase 2 | 6 | Authentication & JWT Security |
| Phase 3 | 6 | Domain Models & Services |
| Phase 4 | 7 | API Routes & Responses |
| Phase 5 | 5 | Security, Middleware & Polish |
| Phase 6 | 3 | Frontend Integration Guide |
| **Total** | **35** | **Complete Backend** |

---

## Constitutional Compliance Checklist

### Technology Stack
- [ ] FastAPI (latest stable)
- [ ] SQLModel + Pydantic v2
- [ ] Python 3.12+ with type hints
- [ ] PyJWT + python-jose
- [ ] Neon PostgreSQL

### Security
- [ ] JWT verification on all protected endpoints
- [ ] User ID from validated token
- [ ] All queries filtered by user_id
- [ ] Ownership validation on single resources
- [ ] No sensitive data in errors

### Code Quality
- [ ] Type hints everywhere
- [ ] snake_case naming
- [ ] Clean separation of concerns
- [ ] Consistent error responses

---

## Testing Checklist

After implementation, verify:
- [ ] Backend starts successfully
- [ ] Health check responds
- [ ] JWT verification works
- [ ] All 7 endpoints work
- [ ] Ownership validation enforced
- [ ] CORS allows frontend
- [ ] Errors return consistent format
- [ ] Database tables created
- [ ] No Python type errors

---

## Related Documents

- **Backend Specification:** `@specs/features/backend-complete-and-frontend-integration.md`
- **Implementation Plan:** `@specs/plans/backend-implementation-plan.md`
- **Constitution:** `@CONSTITUTION.md`
- **Backend Guidance:** `@backend/CLAUDE.md`

---

**Status:** Ready for implementation by fastapi-backend-engineer agent
