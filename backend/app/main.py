# 1. Third-party Imports
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# 2. Local Application Imports
from .core.database import Base, engine
# Import ALL your routers
from .routers import deck_router, study_router, user_router, card_router 
from .models import deck_model, card_model, user_model

# --- Create Database Tables ---
# This single line creates ALL tables that inherit from our Base class.
Base.metadata.create_all(bind=engine)

# --- Initialize FastAPI App ---
app = FastAPI(
    title="LexiLearn AI",
    description="An intelligent, AI-powered flashcard application with Spaced Repetition.",
    version="1.0.0"
)

# --- Add Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # The address of your React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Include Routers ---
# The order here doesn't matter, but it's good to keep them organized.
app.include_router(
    user_router.router, 
    prefix="/api/users",
    tags=["Users"] 
)
app.include_router(
    deck_router.router, 
    prefix="/api/decks",
    tags=["Decks"] 
)
# Add the new card router
app.include_router(
    card_router.router,
    prefix="/api",
    tags=["Cards"] # This will group all card operations in the docs
)
app.include_router(
    study_router.router, 
    prefix="/api",
    tags=["Study"]
)

# --- Root Endpoint ---
@app.get("/", tags=["Root"])
def read_root():
    """
    A simple root endpoint to confirm that the API is running.
    """
    return {"message": "Welcome to the LexiLearn AI API!"}

