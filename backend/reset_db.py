"""Script to reset database tables."""
from sqlmodel import SQLModel
from app.database import engine
from app.models.user import User
from app.models.task import Task

# Drop all tables
SQLModel.metadata.drop_all(engine)
print("Dropped all tables")

# Create all tables with new schema
SQLModel.metadata.create_all(engine)
print("Created all tables with updated schema")
print("\nDatabase reset complete!")
