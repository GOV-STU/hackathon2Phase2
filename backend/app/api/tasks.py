"""Task API endpoints."""
from fastapi import APIRouter, HTTPException, status
from sqlmodel import select
from datetime import datetime
from app.api.deps import SessionDep, CurrentUserDep
from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse
from app.core.exceptions import validate_task_ownership


router = APIRouter(prefix="/api/tasks", tags=["tasks"])


@router.get("", response_model=list[TaskResponse])
def get_tasks(
    session: SessionDep,
    current_user_id: CurrentUserDep
) -> list[Task]:
    """Get all tasks for the authenticated user."""
    statement = select(Task).where(Task.user_id == current_user_id)
    tasks = session.exec(statement).all()
    return list(tasks)


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
    validate_task_ownership(task, current_user_id)

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
    validate_task_ownership(task, current_user_id)

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
    validate_task_ownership(task, current_user_id)

    session.delete(task)
    session.commit()


@router.patch("/{task_id}/complete", response_model=TaskResponse)
def toggle_complete(
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
    validate_task_ownership(task, current_user_id)

    task.completed = not task.completed
    task.updated_at = datetime.utcnow()
    session.add(task)
    session.commit()
    session.refresh(task)
    return task
