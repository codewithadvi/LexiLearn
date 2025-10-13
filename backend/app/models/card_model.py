# app/models/card_model.py
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from ..core.database import Base

#creating a new table called cards
class Card(Base):
    __tablename__ = "cards"

#what are all the features a card should have: id, question, answer, next_review_date, interval, ease_factor
    id = Column(Integer, primary_key=True, index=True)
    question = Column(String, nullable=False)
    answer = Column(String, nullable=False)
#just defining the columns in card table along w their datatypes

    # --- The "Smart" Fields for Spaced Repetition ---
    next_review_date = Column(DateTime, default=datetime.utcnow)
    #keepign next review dates default date as current date and time
    interval = Column(Integer, default=1) # The gap in days until the next review
    #keeping the default gap as 1 day
    ease_factor = Column(Float, default=2.5) # A multiplier for how "easy" the card is
    #keepign the default ease factor as 2.5 

    # --- The Relationship to a Deck ---
    deck_id = Column(Integer, ForeignKey("decks.id")) # foreign key is a link from one table to another in a db
    deck = relationship("Deck", back_populates="cards") # Connects this card back to its Deck