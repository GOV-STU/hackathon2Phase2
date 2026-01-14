"""Custom exceptions and ownership validation."""
from fastapi import HTTPException, status
from app.models.task import Task


def validate_task_ownership(task: Task, current_user_id: str) -> None:
    """Validate that the task belongs to the current user."""
    if task.user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to access this task"
        )
