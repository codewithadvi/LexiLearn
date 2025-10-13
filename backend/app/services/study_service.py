# 1. Standard Library Imports
from datetime import datetime, timedelta
import heapq

# 2. Third-party Imports
from sqlalchemy.orm import Session
from fastapi import HTTPException
import google.generativeai as genai

# 3. Local Application Imports
from ..models import card_model
from ..core.config import settings

# --- Configure the Gemini API Client ---
genai.configure(api_key=settings.GEMINI_API_KEY)

# --- THIS IS THE CRUCIAL CHANGE ---
# We are switching to the more specific and stable 'gemini-1.0-pro' model name.
ai_model = genai.GenerativeModel('gemini-1.0-pro')

# --- Private Helper Function for AI Verification ---
def _verify_answer_with_ai(correct_answer: str, user_answer: str) -> bool:
    """
    Internal function to call the Gemini API for semantic verification.
    """
    try:
        prompt = f"""
        The correct answer is: '{correct_answer}'.
        The user's answer is: '{user_answer}'.
        Is the user's answer semantically correct and contains the key information? 
        Your response must be only the single word 'true' or 'false'.
        """
        response = ai_model.generate_content(prompt)
        result = response.text.strip().lower()
        return result == 'true'
    except Exception as e:
        print(f"Gemini API call failed during verification: {e}")
        return False

# --- Spaced Repetition Logic (The Main Stuff) ---

def get_next_card_to_study(db: Session, deck_id: int):
    """
    Uses a Priority Queue (min-heap) to find the most urgent card to review.
    """
    due_cards = db.query(card_model.Card).filter(
        card_model.Card.deck_id == deck_id,
        card_model.Card.next_review_date <= datetime.utcnow()
    ).all()

    if not due_cards:
        return None

    priority_queue = []
    for card in due_cards:
        heapq.heappush(priority_queue, (card.next_review_date, card))
    
    most_urgent_card = heapq.heappop(priority_queue)[1]
    return most_urgent_card

def review_card(db: Session, card_id: int, user_answer: str):
    """
    Updates a card's review schedule after verifying the answer with AI.
    """
    card = db.query(card_model.Card).filter(card_model.Card.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")

    was_correct = _verify_answer_with_ai(card.answer, user_answer)

    if was_correct:
        new_interval = round(card.interval * card.ease_factor)
        card.interval = new_interval
    else:
        card.interval = 1 # Reset if wrong
    
    card.next_review_date = datetime.utcnow() + timedelta(days=card.interval)

    db.commit()
    
    return {"was_correct": was_correct, "correct_answer": card.answer}

def get_hint_for_card(db: Session, card_id: int):
    """
    Generates a hint for a specific card using the Gemini API.
    """
    card = db.query(card_model.Card).filter(card_model.Card.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")

    try:
        prompt = f"""
        The question is: '{card.question}'.
        The answer is: '{card.answer}'.
        Generate a single, short, one-sentence hint for the user that guides them
        towards the answer without giving it away completely.
        """
        response = ai_model.generate_content(prompt)
        return {"hint": response.text.strip()}
    except Exception as e:
        print(f"Gemini API hint generation failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate hint")



