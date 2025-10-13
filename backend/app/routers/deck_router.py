# 1. Third-party Imports
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

# 2. Local Application Imports
from ..services import deck_service
from ..schemas import deck_schema, user_schema # <-- Import user_schema
from ..core.deps import get_db, get_current_user # <-- Import the security dependency

# --- Router Initialization ---
router = APIRouter()

# --- API Endpoints ---
# All endpoints below are now "locked" and require a valid JWT token.

@router.post("/", response_model=deck_schema.Deck, status_code=201)
def create_deck_endpoint(
    deck: deck_schema.DeckCreate, 
    db: Session = Depends(get_db),
    current_user: user_schema.User = Depends(get_current_user) # <-- LOCK
):
    """
    Endpoint to create a new deck for the currently logged-in user.
    """
    # We will later update the service to associate this deck with the current_user.id
    return deck_service.create_deck(db=db, deck=deck)

@router.get("/", response_model=List[deck_schema.Deck])
def get_all_decks_endpoint(
    db: Session = Depends(get_db),
    current_user: user_schema.User = Depends(get_current_user) # <-- LOCK
):
    """
    Endpoint to retrieve a list of all decks owned by the currently logged-in user.
    """
    # We will later update the service to only get decks for this user.
    return deck_service.get_all_decks(db=db)

@router.get("/{deck_id}", response_model=deck_schema.Deck)
def get_deck_by_id_endpoint(
    deck_id: int, 
    db: Session = Depends(get_db),
    current_user: user_schema.User = Depends(get_current_user) # <-- LOCK
):
    """
    Endpoint to retrieve a single deck by its unique ID.
    """
    # We will later add logic to ensure this deck belongs to the current_user.
    return deck_service.get_deck_by_id(db=db, deck_id=deck_id)

@router.patch("/{deck_id}", response_model=deck_schema.Deck)
def update_deck_endpoint(
    deck_id: int, 
    deck_update: deck_schema.DeckUpdate, 
    db: Session = Depends(get_db),
    current_user: user_schema.User = Depends(get_current_user) # <-- LOCK
):
    """
    Endpoint to update a deck's properties.
    """
    return deck_service.update_deck(db=db, deck_id=deck_id, deck_update=deck_update)

@router.delete("/{deck_id}", status_code=204)
def delete_deck_endpoint(
    deck_id: int, 
    db: Session = Depends(get_db),
    current_user: user_schema.User = Depends(get_current_user) # <-- LOCK
):
    """
    Endpoint to delete a deck.
    """
    deck_service.delete_deck(db=db, deck_id=deck_id)
    return None

