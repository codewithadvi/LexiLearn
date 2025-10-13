from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.ext.hybrid import hybrid_property # <-- Import the hybrid_property tool
from ..core.database import Base

class Deck(Base):
    __tablename__ = "decks"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    
    # This relationship links this deck to its many Cards.
    # The "cascade" option is a professional best practice: if a deck is deleted,
    # all of its associated cards will be automatically deleted too.
    cards = relationship("Card", back_populates="deck", cascade="all, delete-orphan")

    # --- THIS IS THE CRUCIAL UPDATE ---
    @hybrid_property
    def card_count(self):
        """
        This property calculates the number of cards in the deck on the fly.
        Because it's a property, Pydantic can read it just like a database column.
        """
        return len(self.cards)

