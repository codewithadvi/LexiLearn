import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8000/api', 
});

// --- Auth Functions ---
export const login = (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    
    return apiClient.post('/users/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
};

export const signup = (email, password) => {
    return apiClient.post('/users/signup', { email, password });
};


// --- Deck Functions ---
export const getDecks = (token) => {
    return apiClient.get('/decks/', {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const createDeck = (name, token) => {
    return apiClient.post('/decks/', { name }, { headers: { Authorization: `Bearer ${token}` } });
};

export const updateDeck = (deckId, name, token) => {
    return apiClient.patch(`/decks/${deckId}`, { name }, { headers: { Authorization: `Bearer ${token}` } });
};

export const deleteDeck = (deckId, token) => {
    return apiClient.delete(`/decks/${deckId}`, { headers: { Authorization: `Bearer ${token}` } });
};


// --- Card Management Functions ---
export const getCardsInDeck = (deckId, token) => {
    return apiClient.get(`/decks/${deckId}/cards`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const createCard = (deckId, cardData, token) => {
    return apiClient.post(`/decks/${deckId}/cards`, cardData, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// --- ADD THESE FINAL TWO FUNCTIONS ---

/**
 * @description Updates an existing card's question or answer.
 * @param {string} cardId - The ID of the card to update.
 * @param {object} cardData - An object with { question, answer }.
 * @param {string} token - The user's JWT for authorization.
 * @returns {Promise}
 */
export const updateCard = (cardId, cardData, token) => {
    return apiClient.patch(`/cards/${cardId}`, cardData, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

/**
 * @description Deletes a card permanently.
 * @param {string} cardId - The ID of the card to delete.
 * @param {string} token - The user's JWT for authorization.
 * @returns {Promise}
 */
export const deleteCard = (cardId, token) => {
    return apiClient.delete(`/cards/${cardId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};


// --- Study Functions ---
export const getNextCard = (deckId, token) => {
    return apiClient.get(`/decks/${deckId}/study`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const reviewCard = (cardId, userAnswer, token) => {
    return apiClient.patch(`/cards/${cardId}/review`, 
        { user_answer: userAnswer }, 
        { headers: { Authorization: `Bearer ${token}` } }
    );
};

export const getHint = (cardId, token) => {
    return apiClient.get(`/cards/${cardId}/hint`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

