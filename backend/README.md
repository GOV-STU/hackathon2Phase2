# Todo App Backend
<!-- uvicorn app.main:app --reload to run backend-->
FastAPI backend for the multi-user Todo application with JWT authentication and PostgreSQL database.

## Features

- RESTful API with FastAPI
- JWT authentication (Better Auth integration)
- PostgreSQL database with SQLModel ORM
- User data isolation and ownership validation
- Automatic table creation
- CORS configured for frontend
- Consistent error handling

## Prerequisites

- Python 3.12+
- PostgreSQL database (Neon Serverless)
- Better Auth secret (shared with frontend)

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env` with your actual credentials:

```env
BETTER_AUTH_SECRET=49pKok08UbAju61y1YJ7xZSSNd12RSFe
BETTER_AUTH_URL=http://localhost:3000
DATABASE_URL=postgresql://neondb_owner:npg_j1myLUFYE0dS@ep-blue-art-ah34hwpr-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### 3. Run the Server

```bash
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

### 4. Verify Installation

Check the health endpoint:

```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-01-13T..."
}
```

## API Endpoints

### Public Endpoints

- `GET /health` - Health check

### Protected Endpoints (Require JWT)

All endpoints require `Authorization: Bearer <token>` header.

#### Tasks

- `GET /api/tasks` - Get all tasks for authenticated user
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/{task_id}` - Get a specific task
- `PUT /api/tasks/{task_id}` - Update a task
- `DELETE /api/tasks/{task_id}` - Delete a task
- `PATCH /api/tasks/{task_id}/complete` - Toggle task completion

## API Documentation

Interactive API documentation is available at:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Testing with cURL

### Create a Task

```bash
curl -X POST http://localhost:8000/api/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test task",
    "description": "This is a test task",
    "priority": "high"
  }'
```

### Get All Tasks

```bash
curl http://localhost:8000/api/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update a Task

```bash
curl -X PUT http://localhost:8000/api/tasks/TASK_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated task",
    "completed": true
  }'
```

### Delete a Task

```bash
curl -X DELETE http://localhost:8000/api/tasks/TASK_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Toggle Task Completion

```bash
curl -X PATCH http://localhost:8000/api/tasks/TASK_ID/complete \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Frontend Integration

### Getting JWT Token

After user signs in with Better Auth on the frontend, retrieve the JWT token:

```typescript
// In your frontend code
const session = await authClient.getSession();
const token = session?.token;
```

### Making API Calls

```typescript
const response = await fetch('http://localhost:8000/api/tasks', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
```

### Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {}
  }
}
```

Common status codes:
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (not owner of resource)
- `404` - Not found
- `422` - Validation error
- `500` - Internal server error

## Security

- All task operations are filtered by authenticated user ID
- Ownership validation on all single-resource operations
- JWT signature verification on every protected endpoint
- No cross-user data access possible
- Input validation via Pydantic schemas

## Database Schema

### Users Table

```sql
CREATE TABLE users (
    id VARCHAR PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    name VARCHAR,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Tasks Table

```sql
CREATE TABLE tasks (
    id VARCHAR PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description VARCHAR(1000),
    completed BOOLEAN DEFAULT FALSE,
    priority VARCHAR DEFAULT 'medium',
    due_date TIMESTAMP,
    user_id VARCHAR NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

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

## Troubleshooting

### Database Connection Issues

- Verify DATABASE_URL is correct
- Check that Neon database is accessible
- Ensure SSL mode is configured properly

### JWT Verification Fails

- Verify BETTER_AUTH_SECRET matches frontend
- Check token format includes "Bearer " prefix
- Ensure token hasn't expired

### CORS Errors

- Verify frontend URL is http://localhost:3000
- Check that credentials are allowed
- Ensure all required headers are allowed

## Development

### Code Quality

The codebase follows strict standards:

- Type hints on all functions
- SQLModel for all database operations
- Pydantic for request/response validation
- Consistent error handling
- User data isolation enforced

### Adding New Endpoints

1. Define Pydantic schemas in `app/schemas/`
2. Create route handler in `app/api/`
3. Add authentication dependency: `CurrentUserDep`
4. Filter queries by `current_user_id`
5. Validate ownership for single-resource operations

## License

This project is part of the Panaversity Hackathon II Phase II.
<!-- PS C:\Users\HP\Desktop\hac2_phase2\frontend> taskkill /F /PID 14856,17284,18720,19656,24248
PS C:\Users\HP\Desktop\hac2_phase2\frontend> taskkill /F /PID 14856
SUCCESS: The process with PID 17284 has been terminated.
PS C:\Users\HP\Desktop\hac2_phase2\frontend> taskkill /F /PID 18720
SUCCESS: The process with PID 18720 has been terminated.
PS C:\Users\HP\Desktop\hac2_phase2\frontend> taskkill /F /PID 19656
SUCCESS: The process with PID 19656 has been terminated.
PS C:\Users\HP\Desktop\hac2_phase2\frontend> taskkill /F /PID 24248
ERROR: The process "24248" not found.
PS C:\Users\HP\Desktop\hac2_phase2\frontend> Remove-Item -Recurse -Force .next
PS C:\Users\HP\Desktop\hac2_phase2\frontend> npm run dev
 -->