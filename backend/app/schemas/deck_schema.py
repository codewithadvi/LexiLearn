from pydantic import BaseModel
from typing import Optional

# --- Schema for CREATING a deck ---
# The user only needs to provide a name.
class DeckCreate(BaseModel):
    name: str

# --- Schema for UPDATING a deck ---
# When updating, the name is optional.
class DeckUpdate(BaseModel):
    name: Optional[str] = None

# --- Schema for READING a deck ---
# This is the full representation of a deck that our API will send back.
class Deck(BaseModel):
    id: int
    name: str
    card_count: int # <-- This is the required update

    class Config:
        # This allows Pydantic to read data directly from SQLAlchemy model objects.
        from_attributes = True

