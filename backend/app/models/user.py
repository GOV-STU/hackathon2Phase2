"""User model."""
from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional
from uuid import uuid4


class User(SQLModel, table=True):
    """User model with authentication support."""
    __tablename__ = "users"

    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    email: str = Field(unique=True, index=True)
    name: Optional[str] = None
    hashed_password: str = Field()
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
