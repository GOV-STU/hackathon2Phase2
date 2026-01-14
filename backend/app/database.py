"""Database connection and session management."""
from sqlmodel import create_engine, Session, SQLModel
from app.config import settings
from urllib.parse import urlparse


def get_engine():
    """Create database engine based on database type."""
    url = settings.DATABASE_URL

    if url.startswith("sqlite:///"):
        # SQLite configuration
        return create_engine(
            settings.DATABASE_URL,
            echo=settings.DEBUG,
            connect_args={"check_same_thread": False}
        )
    else:
        # PostgreSQL configuration with connection pooling
        return create_engine(
            settings.DATABASE_URL,
            echo=settings.DEBUG,
            pool_pre_ping=True,
            pool_size=10,
            max_overflow=20
        )


# Create database engine
engine = get_engine()


def get_session():
    """Dependency for database session."""
    with Session(engine) as session:
        yield session


def create_db_and_tables():
    """Create all database tables."""
    SQLModel.metadata.create_all(engine)
