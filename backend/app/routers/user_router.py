from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from ..services import user_service
from ..schemas import user_schema
from ..core.deps import get_db

router = APIRouter()

@router.post("/signup", response_model=user_schema.User, status_code=status.HTTP_201_CREATED)
def signup_user(user: user_schema.UserCreate, db: Session = Depends(get_db)):
    """
    Endpoint for new user registration.
    """
    return user_service.create_user(db=db, user=user)

@router.post("/login", response_model=user_schema.Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db: Session = Depends(get_db)
):
    """
    Endpoint for user login. Returns a JWT token.
    FastAPI's OAuth2PasswordRequestForm expects form data, not JSON.
    """
    user = user_service.authenticate_user(
        db, email=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user
