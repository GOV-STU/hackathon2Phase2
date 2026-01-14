"""Authentication endpoints."""
from typing import Annotated
from fastapi import APIRouter, HTTPException, status, Depends
from sqlmodel import Session, select
from app.database import get_session
from app.models.user import User
from app.schemas.auth import SignupRequest, LoginRequest, AuthResponse, UserResponse
from app.core.security import hash_password, verify_password, create_access_token


router = APIRouter(prefix="/api/auth", tags=["auth"])

SessionDep = Annotated[Session, Depends(get_session)]


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def signup(signup_data: SignupRequest, session: SessionDep) -> dict:
    """Register a new user."""
    # Check if user already exists
    statement = select(User).where(User.email == signup_data.email)
    existing_user = session.exec(statement).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create new user
    hashed_pwd = hash_password(signup_data.password)
    new_user = User(
        email=signup_data.email,
        name=signup_data.name,
        hashed_password=hashed_pwd
    )

    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    # Generate JWT token
    token = create_access_token(new_user.id, new_user.email)

    # Return response
    return {
        "success": True,
        "data": {
            "token": token,
            "user": {
                "id": new_user.id,
                "email": new_user.email,
                "name": new_user.name,
                "created_at": new_user.created_at.isoformat(),
                "updated_at": new_user.updated_at.isoformat()
            }
        },
        "message": "User registered successfully"
    }


@router.post("/login", response_model=AuthResponse)
def login(login_data: LoginRequest, session: SessionDep) -> dict:
    """Authenticate a user and return JWT token."""
    # Find user by email
    statement = select(User).where(User.email == login_data.email)
    user = session.exec(statement).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Verify password
    if not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Generate JWT token
    token = create_access_token(user.id, user.email)

    # Return response
    return {
        "success": True,
        "data": {
            "token": token,
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "created_at": user.created_at.isoformat(),
                "updated_at": user.updated_at.isoformat()
            }
        },
        "message": "Login successful"
    }


@router.post("/logout")
def logout() -> dict:
    """Logout endpoint (stateless - client should discard token)."""
    return {
        "success": True,
        "message": "Logout successful. Please discard your token."
    }
