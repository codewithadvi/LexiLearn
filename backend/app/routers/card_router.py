from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

# Import all necessary modules
from ..services import card_service
from ..schemas import card_schema, user_schema
from ..core.deps import get_db, get_current_user

# --- Router Initialization ---
# This creates a new router. We will need to include this in main.py later.
router = APIRouter()

# --- API Endpoints ---
# All endpoints are protected and require a user to be logged in.

@router.post("/decks/{deck_id}/cards", response_model=card_schema.Card, status_code=201)
def create_card_endpoint(
    deck_id: int,
    card: card_schema.CardCreate, 
    db: Session = Depends(get_db),
    current_user: user_schema.User = Depends(get_current_user)
):
    """
    Endpoint to create a new card within a specific deck.
    """
    return card_service.create_card(db=db, deck_id=deck_id, card=card)

@router.get("/decks/{deck_id}/cards", response_model=List[card_schema.Card])
def get_cards_in_deck_endpoint(
    deck_id: int, 
    db: Session = Depends(get_db),
    current_user: user_schema.User = Depends(get_current_user)
):
    """
    Endpoint to retrieve all cards that belong to a specific deck.
    """
    return card_service.get_cards_in_deck(db=db, deck_id=deck_id)

@router.patch("/cards/{card_id}", response_model=card_schema.Card)
def update_card_endpoint(
    card_id: int, 
    card_update: card_schema.CardUpdate, 
    db: Session = Depends(get_db),
    current_user: user_schema.User = Depends(get_current_user)
):
    """
    Endpoint to update an existing card's question or answer.
    (Note: Ensure CardUpdate schema exists in card_schema.py)
    """
    return card_service.update_card(db=db, card_id=card_id, card_update=card_update)

@router.delete("/cards/{card_id}", status_code=204)
def delete_card_endpoint(
    card_id: int, 
    db: Session = Depends(get_db),
    current_user: user_schema.User = Depends(get_current_user)
):
    """
    Endpoint to delete a card.
    """
    card_service.delete_card(db=db, card_id=card_id)
    return None
