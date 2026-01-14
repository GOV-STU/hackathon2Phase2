"""API dependencies."""
from typing import Annotated
from fastapi import Depends
from sqlmodel import Session
from app.database import get_session
from app.core.security import get_current_user_id


# Type aliases for cleaner route signatures
SessionDep = Annotated[Session, Depends(get_session)]
CurrentUserDep = Annotated[str, Depends(get_current_user_id)]
