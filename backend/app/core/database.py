#this file is the database connection it asks how does my application connect and talk to the db
# app/core/database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings

# The SQLAlchemy "engine" is the main connection point to the database.
engine = create_engine(
    settings.DATABASE_URL, 
    # This argument is required for SQLite
    connect_args={"check_same_thread": False} 
)

# Each instance of a SessionLocal class will be a database session.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# This is a "base class" that all our database models will inherit from.
Base = declarative_base()