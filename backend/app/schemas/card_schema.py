from pydantic import BaseModel
from typing import Optional

# --- Schema for CREATING a card ---
class CardCreate(BaseModel):
    question: str
    answer: str

# --- ADD THIS NEW SCHEMA for UPDATING a card ---
# When updating, both question and answer are optional.
class CardUpdate(BaseModel):
    question: Optional[str] = None
    answer: Optional[str] = None

# --- Schema for READING a card ---
class Card(CardCreate):
    id: int
    deck_id: int

    class Config:
        from_attributes = True
        
# --- Schemas for the Study Session ---
class CardReviewRequest(BaseModel):
    user_answer: str

class CardReviewResponse(BaseModel):
    was_correct: bool
    correct_answer: str

class HintResponse(BaseModel):
    hint: str

