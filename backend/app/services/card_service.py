from sqlalchemy.orm import Session
from fastapi import HTTPException, status

# Import the models and schemas needed for card operations
from ..models import card_model, deck_model
from ..schemas import card_schema

# --- READ Operations ---

def get_cards_in_deck(db: Session, deck_id: int):
    """
    Logic to retrieve all cards that belong to a specific deck.
    """
    # First, ensure the deck itself exists to avoid errors.
    deck = db.query(deck_model.Deck).filter(deck_model.Deck.id == deck_id).first()
    if not deck:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Deck not found")
    
    # Query for all cards where the foreign key 'deck_id' matches.
    return db.query(card_model.Card).filter(card_model.Card.deck_id == deck_id).all()

# --- CREATE Operations ---

def create_card(db: Session, deck_id: int, card: card_schema.CardCreate):
    """
    Logic to create a new card and associate it with a specific deck.
    """
    # Ensure the parent deck exists before creating a card in it.
    db_deck = db.query(deck_model.Deck).filter(deck_model.Deck.id == deck_id).first()
    if not db_deck:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Deck not found")
        
    # Create the new card model instance, passing the deck_id to link them.
    db_card = card_model.Card(
        question=card.question,
        answer=card.answer,
        deck_id=deck_id
    )
    
    db.add(db_card)
    db.commit()
    db.refresh(db_card)
    return db_card

# --- UPDATE Operations ---

def update_card(db: Session, card_id: int, card_update: card_schema.CardUpdate):
    """
    Logic to update an existing card's question or answer.
    """
    db_card = db.query(card_model.Card).filter(card_model.Card.id == card_id).first()
    if not db_card:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Card not found")
        
    update_data = card_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_card, key, value)
        
    db.commit()
    db.refresh(db_card)
    return db_card

# --- DELETE Operations ---

def delete_card(db: Session, card_id: int):
    """
    Logic to delete a card from the database.
    """
    db_card = db.query(card_model.Card).filter(card_model.Card.id == card_id).first()
    if not db_card:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Card not found")
        
    db.delete(db_card)
    db.commit()
    
    return {"detail": "Card deleted successfully"}
