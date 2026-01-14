"""Task model."""
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
    priority: str = Field(default="medium")
    due_date: Optional[datetime] = None

    # Foreign key to user
    user_id: str = Field(foreign_key="users.id", index=True)

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
