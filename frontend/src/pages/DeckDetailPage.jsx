import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/apiService';
import Header from '../components/Header';
import Modal from '../components/Modal'; // We'll reuse our Modal component

// --- Styles ---
const pageStyle = {
    padding: '40px'
};
const pageHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px'
};
const titleStyle = {
    fontSize: '32px',
    fontWeight: '700',
};
const cardListStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
};
const cardListItemStyle = {
    backgroundColor: 'var(--bg-medium)',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
};
const cardActionsStyle = {
    display: 'flex',
    gap: '10px'
}
const formStyle = {
    marginTop: '40px',
    paddingTop: '30px',
    borderTop: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
};

function DeckDetailPage() {
    const { deckId } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();
    
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    // State for the "Add New Card" form
    const [newQuestion, setNewQuestion] = useState('');
    const [newAnswer, setNewAnswer] = useState('');

    // State for the "Edit Card" modal
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingCard, setEditingCard] = useState(null);

    // --- Data Fetching ---
    const fetchCards = async () => {
        if (!token) return;
        try {
            setLoading(true);
            const response = await api.getCardsInDeck(deckId, token);
            setCards(response.data);
        } catch (err) {
            setError('Failed to load cards.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCards();
    }, [deckId, token]);

    // --- CRUD Handlers for Cards ---

    const handleAddCard = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            const response = await api.createCard(deckId, { question: newQuestion, answer: newAnswer }, token);
            setCards(prevCards => [...prevCards, response.data]);
            setNewQuestion('');
            setNewAnswer('');
        } catch (err) {
            console.error("Failed to create card:", err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdateCard = async (e) => {
        e.preventDefault();
        if (!editingCard) return;
        setActionLoading(true);
        try {
            const updatedData = { question: editingCard.question, answer: editingCard.answer };
            const response = await api.updateCard(editingCard.id, updatedData, token);
            setCards(prevCards => prevCards.map(card => card.id === editingCard.id ? response.data : card));
            setIsEditModalOpen(false);
        } catch (err) {
            console.error("Failed to update card:", err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteCard = async (cardId) => {
        if (window.confirm("Are you sure you want to delete this card?")) {
            try {
                await api.deleteCard(cardId, token);
                setCards(prevCards => prevCards.filter(card => card.id !== cardId));
            } catch (err) {
                console.error("Failed to delete card:", err);
            }
        }
    };

    // Helper to open the edit modal
    const openEditModal = (card) => {
        setEditingCard(card);
        setIsEditModalOpen(true);
    };

    const handleStartStudy = () => {
        navigate(`/decks/${deckId}/study`);
    };

    return (
        <div>
            <Header />
            <main style={pageStyle}>
                <div style={pageHeaderStyle}>
                    <div>
                        <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'block', marginBottom: '10px' }}>
                            &larr; Back to Dashboard
                        </Link>
                        <h2 style={titleStyle}>Manage Deck</h2>
                    </div>
                    <button onClick={handleStartStudy} disabled={cards.length === 0}>
                        Start Study Session &rarr;
                    </button>
                </div>

                {loading && <p>Loading cards...</p>}
                {error && <p style={{ color: 'var(--error-color)' }}>{error}</p>}

                <div style={cardListStyle}>
                    {cards.length > 0 ? cards.map(card => (
                        <div key={card.id} style={cardListItemStyle}>
                            <div>
                                <p><strong>Q:</strong> {card.question}</p>
                                <p style={{ color: 'var(--text-secondary)' }}><strong>A:</strong> {card.answer}</p>
                            </div>
                            <div style={cardActionsStyle}>
                                <button onClick={() => openEditModal(card)} style={{fontSize: '14px'}}>Edit</button>
                                <button onClick={() => handleDeleteCard(card.id)} style={{fontSize: '14px', backgroundColor: 'var(--error-color)'}}>Delete</button>
                            </div>
                        </div>
                    )) : (
                        !loading && <p>This deck has no cards yet. Add one below!</p>
                    )}
                </div>

                {/* "Add New Card" Form */}
                <form onSubmit={handleAddCard} style={formStyle}>
                    <h3>Add a New Card</h3>
                    <input type="text" placeholder="Question" value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} required disabled={actionLoading} />
                    <input type="text" placeholder="Answer" value={newAnswer} onChange={(e) => setNewAnswer(e.target.value)} required disabled={actionLoading} />
                    <button type="submit" disabled={actionLoading} style={{ alignSelf: 'flex-start' }}>
                        {actionLoading ? 'Adding...' : 'Add Card'}
                    </button>
                </form>
            </main>
            
            {/* "Edit Card" Modal */}
            {isEditModalOpen && (
                <Modal title="Edit Card" isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                    <form onSubmit={handleUpdateCard} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                        <input type="text" value={editingCard.question} onChange={(e) => setEditingCard({...editingCard, question: e.target.value})} required disabled={actionLoading} />
                        <input type="text" value={editingCard.answer} onChange={(e) => setEditingCard({...editingCard, answer: e.target.value})} required disabled={actionLoading} />
                        <button type="submit" disabled={actionLoading} style={{ alignSelf: 'flex-end' }}>
                            {actionLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </Modal>
            )}
        </div>
    );
}

export default DeckDetailPage;

