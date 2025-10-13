from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from ..models import user_model
from ..schemas import user_schema
from ..core import security

def create_user(db: Session, user: user_schema.UserCreate):
    """
    Creates a new user in the database after hashing their password.
    """
    # Check if a user with this email already exists
    db_user = db.query(user_model.User).filter(user_model.User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    
    # Hash the plain text password before storing it
    hashed_password = security.get_password_hash(user.password)
    
    # Create the new database model instance
    db_user = user_model.User(email=user.email, hashed_password=hashed_password)
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, email: str, password: str):
    """
    Authenticates a user by checking their email and password.
    Returns a JWT token if successful, otherwise returns False.
    """
    user = db.query(user_model.User).filter(user_model.User.email == email).first()
    
    # Check if user exists and if the provided password is correct
    if not user or not security.verify_password(password, user.hashed_password):
        return False
        
    # If credentials are correct, create a JWT token
    access_token = security.create_access_token(
        data={"sub": user.email} # "sub" is a standard JWT claim for "subject"
    )
    return {"access_token": access_token, "token_type": "bearer"}
