# Specification: COMPLETE FastAPI Backend + Automatic Frontend Integration

**File:** `@specs/features/backend-complete-and-frontend-integration-ready-to-implement.md`
**Phase:** II – Full-Stack Web Application
**Priority:** Highest – This is the final step to make the Todo app fully working end-to-end
**Status:** Draft
**Version:** 1.0
**Last Updated:** January 2026

---

## Core Instruction for Implementation Agent

**You must implement everything automatically.**

The human should NOT have to write any code, create files manually, run migrations manually, or adjust anything except possibly approving or starting the next phase.

### Implementation Order (STRICT)

Do everything step-by-step in the following strict order:

1. Create complete project structure in `/backend/` folder
2. Generate `requirements.txt` with all necessary dependencies
3. Create `.env.example` file showing the required variables (do NOT commit real secrets)
4. Implement settings loading from environment variables (use exactly these names)
5. Set up database connection to Neon PostgreSQL
6. Define SQLModel models (User + Task)
7. Implement automatic table creation on startup (or provide one-click migration command)
8. Implement secure JWT verification using JWKS from Better Auth
9. Create `current_user` dependency with proper validation
10. Implement all required REST API endpoints with full ownership checks
11. Use consistent success/error response envelope
12. Add CORS middleware allowing only `http://localhost:3000`
13. Add global exception handler for clean errors
14. Provide detailed instructions (as comments or README section) for the frontend team/agent on how to:
    - Get JWT token after login
    - Attach Bearer token to every API call
    - Replace mock functions with real fetch/axios calls
    - Handle 401/403/422 responses

---

## Required Environment Variables – Use EXACTLY these names

```env
# Better Auth Configuration
BETTER_AUTH_SECRET=49pKok08UbAju61y1YJ7xZSSNd12RSFe
BETTER_AUTH_URL=http://localhost:3000

# Database Configuration
DATABASE_URL=postgresql://neondb_owner:npg_j1myLUFYE0dS@ep-blue-art-ah34hwpr-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

**⚠️ SECURITY NOTE:** These are development credentials. In production, use environment-specific secrets and never commit them to version control.

---

## Database Schema (SQLModel)

### User Model

```python
from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

class User(SQLModel, table=True):
    """User model - managed by Better Auth on frontend."""
    __tablename__ = "users"

    id: str = Field(primary_key=True)
    email: str = Field(unique=True, index=True)
    name: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

### Task Model

```python
from sqlmodel import SQLModel, Field
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
    priority: str = Field(default="medium")  # "low", "medium", "high"
    due_date: Optional[datetime] = None

    # Foreign key to user
    user_id: str = Field(foreign_key="users.id", index=True)

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

---

## API Endpoints (RESTful)

### Base URL
```
http://localhost:8000/api
```

### Authentication
All endpoints except health check require JWT Bearer token in header:
```
Authorization: Bearer <jwt_token>
```

### Endpoint List

#### 1. Health Check (Public)
```
GET /health
Response: {"status": "ok", "timestamp": "2026-01-13T..."}
```

#### 2. Get All Tasks
```
GET /api/tasks
Headers: Authorization: Bearer <token>
Response: {
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Task title",
      "description": "Task description",
      "completed": false,
      "priority": "high",
      "dueDate": "2026-01-15T00:00:00Z",
      "userId": "user-id",
      "createdAt": "2026-01-10T10:00:00Z",
      "updatedAt": "2026-01-10T10:00:00Z"
    }
  ]
}
```

#### 3. Create Task
```
POST /api/tasks
Headers: Authorization: Bearer <token>
Body: {
  "title": "New task",
  "description": "Optional description",
  "priority": "medium",
  "dueDate": "2026-01-15T00:00:00Z"
}
Response: {
  "success": true,
  "data": {
    "id": "uuid",
    "title": "New task",
    ...
  }
}
```

#### 4. Get Single Task
```
GET /api/tasks/{task_id}
Headers: Authorization: Bearer <token>
Response: {
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Task title",
    ...
  }
}
```

#### 5. Update Task
```
PUT /api/tasks/{task_id}
Headers: Authorization: Bearer <token>
Body: {
  "title": "Updated title",
  "description": "Updated description",
  "completed": false,
  "priority": "high",
  "dueDate": "2026-01-20T00:00:00Z"
}
Response: {
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Updated title",
    ...
  }
}
```

#### 6. Delete Task
```
DELETE /api/tasks/{task_id}
Headers: Authorization: Bearer <token>
Response: {
  "success": true,
  "message": "Task deleted successfully"
}
```

#### 7. Toggle Task Completion
```
PATCH /api/tasks/{task_id}/complete
Headers: Authorization: Bearer <token>
Response: {
  "success": true,
  "data": {
    "id": "uuid",
    "completed": true,
    ...
  }
}
```

---

## Request/Response Schemas (Pydantic)

### TaskCreate
```python
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    priority: str = Field(default="medium")
    due_date: Optional[datetime] = None
```

### TaskUpdate
```python
class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    completed: Optional[bool] = None
    priority: Optional[str] = None
    due_date: Optional[datetime] = None
```

### TaskResponse
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

    class Config:
        from_attributes = True
```

### Success Response Envelope
```python
class SuccessResponse(BaseModel):
    success: bool = True
    data: Any
    message: Optional[str] = None
```

### Error Response Envelope
```python
class ErrorResponse(BaseModel):
    success: bool = False
    error: dict

class ErrorDetail(BaseModel):
    code: str
    message: str
    details: Optional[dict] = None
```

---

## JWT Verification (Better Auth)

### Implementation Requirements

1. **Extract JWT from Authorization header**
   ```python
   from fastapi import Header, HTTPException

   def get_token(authorization: str = Header(...)):
       if not authorization.startswith("Bearer "):
           raise HTTPException(401, "Invalid authorization header")
       return authorization.replace("Bearer ", "")
   ```

2. **Verify JWT signature**
   ```python
   import jwt
   from app.config import settings

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
       except jwt.InvalidTokenError:
           raise HTTPException(401, "Invalid token")
   ```

3. **Extract user_id from payload**
   ```python
   def get_current_user_id(token_payload: dict) -> str:
       user_id = token_payload.get("sub")
       if not user_id:
           raise HTTPException(401, "Invalid token payload")
       return user_id
   ```

4. **Create dependency**
   ```python
   from typing import Annotated
   from fastapi import Depends

   CurrentUser = Annotated[str, Depends(get_current_user_id)]
   ```

---

## Error Handling

### Global Exception Handler

```python
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

app = FastAPI()

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occurred",
                "details": str(exc) if settings.DEBUG else None
            }
        }
    )
```

### HTTP Exception Handler

```python
from fastapi.exceptions import HTTPException

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "code": exc.detail.get("code", "HTTP_ERROR"),
                "message": exc.detail.get("message", str(exc.detail)),
                "details": exc.detail.get("details")
            }
        }
    )
```

### Validation Exception Handler

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

## CORS Configuration

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Ownership Validation Pattern

**CRITICAL:** Every endpoint that accesses a specific task MUST validate ownership.

```python
from fastapi import HTTPException, status

def validate_task_ownership(task: Task, current_user_id: str):
    """Validate that the task belongs to the current user."""
    if task.user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "code": "FORBIDDEN",
                "message": "You don't have permission to access this task"
            }
        )
```

### Example Endpoint with Ownership Check

```python
@app.get("/api/tasks/{task_id}")
async def get_task(
    task_id: str,
    current_user_id: CurrentUser,
    session: SessionDep
):
    # Get task from database
    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(404, {"code": "NOT_FOUND", "message": "Task not found"})

    # CRITICAL: Validate ownership
    validate_task_ownership(task, current_user_id)

    return {"success": True, "data": task}
```

---

## Frontend Integration Instructions

### Step 1: Update API Client (`lib/api.ts`)

Replace mock functions with real API calls:

```typescript
// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        // Redirect to login
        window.location.href = '/login';
      }
      throw new Error(data.error?.message || 'API request failed');
    }

    return data.data; // Extract data from success envelope
  }

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
}

export const api = new ApiClient();
```

### Step 2: Update Auth System (`lib/auth.ts`)

Store JWT token from Better Auth:

```typescript
// After successful login with Better Auth
const session = await auth.signIn.email({
  email,
  password,
});

if (session?.token) {
  localStorage.setItem('auth_token', session.token);
}
```

### Step 3: Handle API Errors

```typescript
try {
  await api.createTask(taskData);
  toast.success('Task created successfully');
} catch (error) {
  if (error.message.includes('401')) {
    // Redirect to login
    router.push('/login');
  } else {
    toast.error(error.message || 'Failed to create task');
  }
}
```

---

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app initialization
│   ├── config.py            # Settings from environment
│   ├── database.py          # Database connection
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py          # User model
│   │   └── task.py          # Task model
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── task.py          # Pydantic schemas
│   │   └── response.py      # Response envelopes
│   ├── api/
│   │   ├── __init__.py
│   │   ├── deps.py          # Dependencies (auth, db)
│   │   └── tasks.py         # Task endpoints
│   └── core/
│       ├── __init__.py
│       ├── security.py      # JWT verification
│       └── exceptions.py    # Custom exceptions
├── requirements.txt
├── .env.example
├── .gitignore
└── README.md
```

---

## Dependencies (requirements.txt)

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

---

## Startup Instructions

### 1. Create `.env` file
```bash
cp .env.example .env
# Edit .env with actual credentials
```

### 2. Install dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 3. Run the server
```bash
uvicorn app.main:app --reload --port 8000
```

### 4. Verify
```bash
curl http://localhost:8000/health
```

---

## Testing Checklist

- [ ] Health check endpoint works
- [ ] JWT verification works
- [ ] Unauthorized requests return 401
- [ ] User can create tasks
- [ ] User can list their own tasks only
- [ ] User can update their own tasks
- [ ] User can delete their own tasks
- [ ] User can toggle task completion
- [ ] User cannot access other users' tasks (403)
- [ ] Invalid task ID returns 404
- [ ] Validation errors return 422
- [ ] CORS allows frontend requests
- [ ] Database connection works
- [ ] Tables are created automatically

---

## Success Criteria

The backend is complete when:
- ✅ All API endpoints implemented
- ✅ JWT authentication working
- ✅ User data isolation enforced
- ✅ Database connected to Neon PostgreSQL
- ✅ CORS configured for frontend
- ✅ Error handling consistent
- ✅ Frontend can successfully call all endpoints
- ✅ All CRUD operations work end-to-end

---

**Status:** Complete specification - Ready for implementation by fastapi-backend-engineer agent
