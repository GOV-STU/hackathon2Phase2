"""Authentication request and response schemas."""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class SignupRequest(BaseModel):
    """Schema for user signup."""
    email: EmailStr
    password: str = Field(min_length=8, max_length=100)
    name: Optional[str] = Field(None, max_length=100)


class LoginRequest(BaseModel):
    """Schema for user login."""
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    """Schema for user data in responses."""
    id: str
    email: str
    name: Optional[str]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class AuthResponse(BaseModel):
    """Schema for authentication response."""
    success: bool = True
    data: dict
    message: str = "Authentication successful"
