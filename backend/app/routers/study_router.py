# 1. Third-party Imports
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

# 2. Local Application Imports
from ..services import study_service
from ..schemas import card_schema, user_schema      # <-- Import user_schema for type hinting
from ..core.deps import get_db, get_current_user    # <-- Import the security dependency

# --- Router Initialization ---
# This creates a new "mini-application" that we can plug into our main app.
router = APIRouter()

# --- API Endpoints ---
# All endpoints below are now "locked" and require a valid JWT token.

@router.get("/decks/{deck_id}/study", response_model=card_schema.Card | None)
def get_next_card_endpoint(
    deck_id: int, 
    db: Session = Depends(get_db),
    current_user: user_schema.User = Depends(get_current_user) # <-- LOCK
):
    """
    Endpoint to get the next, most urgent card to study for a given deck.
    This is protected and requires a user to be logged in.
    """
    # We will later add logic to ensure the user has access to this deck.
    card = study_service.get_next_card_to_study(db=db, deck_id=deck_id)
    if not card:
        return None
    return card
@router.patch("/cards/{card_id}/review", response_model=card_schema.CardReviewResponse)
def review_card_endpoint(
    card_id: int, 
    review_data: card_schema.CardReviewRequest, 
    db: Session = Depends(get_db),
    current_user: user_schema.User = Depends(get_current_user) # <-- LOCK
):
    """
    Endpoint to review a card using the AI verification service.
    This is protected and requires a user to be logged in.
    """
    # The router's only job is to pass the data to the service layer.
    return study_service.review_card(
        db=db, 
        card_id=card_id, 
        user_answer=review_data.user_answer
    )

@router.get("/cards/{card_id}/hint", response_model=card_schema.HintResponse)
def get_hint_endpoint(
    card_id: int, 
    db: Session = Depends(get_db),
    current_user: user_schema.User = Depends(get_current_user) # <-- LOCK
):
    """
    Endpoint to generate and retrieve a hint for a card using AI.
    This is protected and requires a user to be logged in.
    """
    # Calls the corresponding service function to do the actual work.
    return study_service.get_hint_for_card(db=db, card_id=card_id)

