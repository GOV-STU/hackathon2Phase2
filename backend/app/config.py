"""Configuration settings for the Todo App backend."""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Better Auth Configuration
    BETTER_AUTH_SECRET: str
    BETTER_AUTH_URL: str
    
    # Database Configuration
    DATABASE_URL: str
    
    # Application Configuration
    DEBUG: bool = False
    
    model_config = {
        "env_file": ".env",
        "case_sensitive": True,
        "extra": "ignore"
    }


# Global settings instance
settings = Settings()
