# Backend - Todo App Phase II
## Guidance for FastAPI Backend Development

**Last Updated:** January 2026
**Scope:** `/backend/` directory
**Agent:** fastapi-backend-engineer

---

## 🎯 Backend Mission

Build a **secure, type-safe, high-performance** FastAPI backend that provides RESTful APIs for multi-user task management with JWT-based authentication and strict user data isolation.

---

## 📜 Required Reading (Before Any Work)

1. **`/CONSTITUTION.md`** - Project constitution
2. **`/CLAUDE.md`** - Root project guidance
3. **`/specs/overview.md`** - Phase II overview
4. **`/specs/api/`** - API contract specifications
5. **`/specs/database/`** - Database schema specifications

---

## 🛠️ Technology Stack (Locked)

### Core Framework
- **FastAPI** (latest stable)
- **Python 3.12+**
- **Uvicorn** (ASGI server)

### Database & ORM
- **SQLModel** (SQLAlchemy + Pydantic integration)
- **Pydantic v2** (data validation)
- **Neon Serverless PostgreSQL** (production database)

### Authentication
- **PyJWT** + **python-jose** (JWT verification)
- Shared secret with frontend (`BETTER_AUTH_SECRET`)
- User ID extraction from validated tokens

### Code Quality
- **Black** (code formatting)
- **isort** (import sorting)
- **ruff** (linting)
- **mypy** (type checking)

---

## 🏗️ Directory Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app initialization
│   ├── config.py            # Configuration & environment
│   ├── database.py          # Database connection & session
│   ├── models/              # SQLModel database models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   └── task.py
│   ├── schemas/             # Pydantic request/response schemas
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   └── task.py
│   ├── api/                 # API routes
│   │   ├── __init__.py
│   │   ├── deps.py          # Dependencies (auth, db session)
│   │   ├── auth.py          # Auth endpoints
│   │   └── tasks.py         # Task endpoints
│   ├── services/            # Business logic
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   └── task.py
│   └── core/                # Core utilities
│       ├── __init__.py
│       ├── security.py      # JWT verification
│       └── exceptions.py    # Custom exceptions
├── tests/                   # Tests (optional for Phase II)
├── alembic/                 # Database migrations
├── CLAUDE.md               # This file
├── requirements.txt        # Python dependencies
├── pyproject.toml          # Project configuration
└── .env.example            # Environment variables template
```

---

## 🔐 Authentication & Security

### JWT Verification Pattern

```python
# app/core/security.py
from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from app.config import settings

security = HTTPBearer()

def verify_token(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)]
) -> dict:
    """Verify JWT token and return payload."""
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            settings.BETTER_AUTH_SECRET,
            algorithms=["HS256"]
        )
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_current_user_id(
    token_payload: Annotated[dict, Depends(verify_token)]
) -> str:
    """Extract user ID from verified token."""
    user_id = token_payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )
    return user_id
```

### Dependency Injection Pattern

```python
# app/api/deps.py
from typing import Annotated
from fastapi import Depends
from sqlmodel import Session
from app.database import get_session
from app.core.security import get_current_user_id

# Type aliases for cleaner route signatures
SessionDep = Annotated[Session, Depends(get_session)]
CurrentUserDep = Annotated[str, Depends(get_current_user_id)]
```

---

## 🗄️ Database Models (SQLModel)

### User Model

```python
# app/models/user.py
from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

class User(SQLModel, table=True):
    """User model - managed by Better Auth."""
    __tablename__ = "users"

    id: str = Field(primary_key=True)
    email: str = Field(unique=True, index=True)
    name: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

### Task Model

```python
# app/models/task.py
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional
from uuid import uuid4

class Task(SQLModel, table=True):
    """Task model with user ownership."""
    __tablename__ = "tasks"

    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)

    # Foreign key to user
    user_id: str = Field(foreign_key="users.id", index=True)

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

---

## 📋 Request/Response Schemas

### Task Schemas

```python
# app/schemas/task.py
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class TaskCreate(BaseModel):
    """Schema for creating a task."""
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)

class TaskUpdate(BaseModel):
    """Schema for updating a task."""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    completed: Optional[bool] = None

class TaskResponse(BaseModel):
    """Schema for task response."""
    id: str
    title: str
    description: Optional[str]
    completed: bool
    user_id: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
```

---

## 🛣️ API Route Patterns

### Task Endpoints with User Isolation

```python
# app/api/tasks.py
from fastapi import APIRouter, HTTPException, status
from sqlmodel import select
from app.api.deps import SessionDep, CurrentUserDep
from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse

router = APIRouter(prefix="/api/tasks", tags=["tasks"])

@router.get("", response_model=list[TaskResponse])
def get_tasks(
    session: SessionDep,
    current_user_id: CurrentUserDep
) -> list[Task]:
    """Get all tasks for the authenticated user."""
    statement = select(Task).where(Task.user_id == current_user_id)
    tasks = session.exec(statement).all()
    return tasks

@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(
    task_data: TaskCreate,
    session: SessionDep,
    current_user_id: CurrentUserDep
) -> Task:
    """Create a new task for the authenticated user."""
    task = Task(
        **task_data.model_dump(),
        user_id=current_user_id
    )
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

@router.get("/{task_id}", response_model=TaskResponse)
def get_task(
    task_id: str,
    session: SessionDep,
    current_user_id: CurrentUserDep
) -> Task:
    """Get a specific task (with ownership validation)."""
    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # CRITICAL: Validate ownership
    if task.user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this task"
        )

    return task

@router.put("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: str,
    task_data: TaskUpdate,
    session: SessionDep,
    current_user_id: CurrentUserDep
) -> Task:
    """Update a task (with ownership validation)."""
    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # CRITICAL: Validate ownership
    if task.user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to modify this task"
        )

    # Update only provided fields
    update_data = task_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(task, key, value)

    task.updated_at = datetime.utcnow()
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    task_id: str,
    session: SessionDep,
    current_user_id: CurrentUserDep
) -> None:
    """Delete a task (with ownership validation)."""
    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # CRITICAL: Validate ownership
    if task.user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this task"
        )

    session.delete(task)
    session.commit()

@router.patch("/{task_id}/complete", response_model=TaskResponse)
def toggle_task_complete(
    task_id: str,
    session: SessionDep,
    current_user_id: CurrentUserDep
) -> Task:
    """Toggle task completion status (with ownership validation)."""
    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # CRITICAL: Validate ownership
    if task.user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to modify this task"
        )

    task.completed = not task.completed
    task.updated_at = datetime.utcnow()
    session.add(task)
    session.commit()
    session.refresh(task)
    return task
```

---

## 🔒 Security Checklist (MANDATORY)

Every endpoint MUST satisfy:

- [ ] JWT token verification via dependency injection
- [ ] User ID extracted from validated token
- [ ] Database queries filtered by `user_id`
- [ ] Ownership validation on single-resource operations
- [ ] Proper HTTP status codes (401, 403, 404)
- [ ] No sensitive data in error messages
- [ ] Input validation via Pydantic schemas
- [ ] SQL injection prevention (SQLModel handles this)

---

## 🎯 Error Handling Pattern

### Consistent Error Responses

```python
# app/core/exceptions.py
from fastapi import HTTPException, status

class TaskNotFoundError(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

class UnauthorizedError(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"}
        )

class ForbiddenError(HTTPException):
    def __init__(self, detail: str = "Not authorized"):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=detail
        )
```

---

## 🗃️ Database Configuration

### Connection Setup

```python
# app/database.py
from sqlmodel import create_engine, Session, SQLModel
from app.config import settings

# Create engine with connection pooling
engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20
)

def get_session():
    """Dependency for database session."""
    with Session(engine) as session:
        yield session

def create_db_and_tables():
    """Create all tables (for development)."""
    SQLModel.metadata.create_all(engine)
```

### Configuration

```python
# app/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str

    # Authentication
    BETTER_AUTH_SECRET: str

    # API
    API_V1_PREFIX: str = "/api"
    PROJECT_NAME: str = "Todo App API"
    DEBUG: bool = False

    # CORS
    ALLOWED_ORIGINS: list[str] = ["http://localhost:3000"]

    model_config = {
        "env_file": ".env",
        "case_sensitive": True
    }

settings = Settings()
```

---

## 📝 Type Safety Standards

### Type Hints Everywhere

```python
# Good: Full type hints
def get_user_tasks(
    session: Session,
    user_id: str,
    skip: int = 0,
    limit: int = 100
) -> list[Task]:
    statement = select(Task).where(Task.user_id == user_id).offset(skip).limit(limit)
    return session.exec(statement).all()

# Bad: No type hints
def get_user_tasks(session, user_id, skip=0, limit=100):
    statement = select(Task).where(Task.user_id == user_id).offset(skip).limit(limit)
    return session.exec(statement).all()
```

---

## 🚫 Prohibited Patterns

### DO NOT:
- ❌ Use SQLAlchemy/Prisma/Drizzle (use SQLModel only)
- ❌ Trust client-provided user_id (always use JWT)
- ❌ Skip ownership validation
- ❌ Log sensitive data (tokens, passwords)
- ❌ Use `any` type or skip type hints
- ❌ Create endpoints without authentication
- ❌ Return different user's data
- ❌ Use raw SQL queries (use SQLModel)

---

## ✅ Pre-Implementation Checklist

Before starting any backend work:

- [ ] Read and understand CONSTITUTION.md
- [ ] Read API specifications in `/specs/api/`
- [ ] Read database specifications in `/specs/database/`
- [ ] Verify specifications are approved
- [ ] Understand JWT verification flow
- [ ] Know the database schema
- [ ] Understand user isolation requirements

---

## 🎯 Success Criteria

Backend is successful when:

- [ ] All API endpoints implemented per specifications
- [ ] JWT authentication enforced on all protected endpoints
- [ ] User data isolation working correctly
- [ ] Ownership validation on all single-resource operations
- [ ] Proper error handling with consistent responses
- [ ] Type hints on all functions
- [ ] SQLModel used for all database operations
- [ ] Neon PostgreSQL connected and working
- [ ] Code generated via Claude Code (no manual coding)

---

## 🆘 When in Doubt

1. **Check specifications** - `/specs/api/` and `/specs/database/`
2. **Validate ownership** - Always check `user_id` matches
3. **Use type hints** - No untyped code
4. **Filter by user** - Every query must filter by `current_user_id`
5. **Security first** - When uncertain, choose the more secure option

---

**Remember:** You are the fastapi-backend-engineer agent. Your job is to implement the backend API according to approved specifications, following all constitutional requirements with absolute focus on security and user data isolation.
