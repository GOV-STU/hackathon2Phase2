"""Response envelope schemas."""
from pydantic import BaseModel
from typing import Any, Optional


class SuccessResponse(BaseModel):
    """Success response envelope."""
    success: bool = True
    data: Any
    message: Optional[str] = None


class ErrorDetail(BaseModel):
    """Error detail schema."""
    code: str
    message: str
    details: Optional[dict] = None


class ErrorResponse(BaseModel):
    """Error response envelope."""
    success: bool = False
    error: ErrorDetail
