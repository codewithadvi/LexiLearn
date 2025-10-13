import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/apiService';

// Import all the reusable components for this page
import Header from '../components/Header';
import DeckCard from '../components/DeckCard';
import Modal from '../components/Modal';
import CreateDeckForm from '../components/CreateDeckForm';

// --- Styles ---
const mainContentStyle = {
    padding: '40px'
};

const dashboardHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px'
};

const dashboardTitleStyle = {
    fontSize: '32px',
    fontWeight: '700',
};

const deckGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '30px'
};

// --- Component ---
function DashboardPage() {
    // --- State Management ---
    const [decks, setDecks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false); // For create/update actions
    const [error, setError] = useState('');
    
    // State to manage which modals are open
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    
    // State to keep track of which deck is currently being edited
    const [editingDeck, setEditingDeck] = useState(null);

    const { token } = useAuth();

    // --- Data Fetching ---
    const fetchDecks = async () => {
        if (!token) return;
        try {
            setLoading(true);
            const response = await api.getDecks(token);
            setDecks(response.data);
        } catch (err) {
            setError('Failed to load decks.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDecks();
    }, [token]);

    // --- CRUD Handlers ---

    const handleCreateDeck = async (deckName) => {
        setActionLoading(true);
        try {
            const response = await api.createDeck(deckName, token);
            // Add the new deck to our local state to update the UI instantly
            setDecks(prevDecks => [...prevDecks, response.data]);
            setIsCreateModalOpen(false);
        } catch (err) {
            console.error("Failed to create deck:", err);
            // You could set a specific error for the form here
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdateDeck = async (newName) => {
        if (!editingDeck) return;
        setActionLoading(true);
        try {
            const response = await api.updateDeck(editingDeck.id, newName, token);
            // Find the updated deck in the list and replace it with the new data from the server
            setDecks(prevDecks => prevDecks.map(deck => 
                deck.id === editingDeck.id ? response.data : deck
            ));
            setIsEditModalOpen(false);
            setEditingDeck(null); // Clear the editing state
        } catch (err) {
            console.error("Failed to update deck:", err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteDeck = async (deckToDelete) => {
        // Use a simple confirmation dialog before a destructive action
        if (window.confirm(`Are you sure you want to delete the deck "${deckToDelete.name}"?`)) {
            try {
                await api.deleteDeck(deckToDelete.id, token);
                // Filter out the deleted deck from the local state to update the UI instantly
                setDecks(prevDecks => prevDecks.filter(deck => deck.id !== deckToDelete.id));
            } catch (err) {
                console.error("Failed to delete deck:", err);
                setError('Failed to delete deck. Please try again.');
            }
        }
    };
    
    // Helper function to open the edit modal with the correct deck's data
    const openEditModal = (deck) => {
        setEditingDeck(deck);
        setIsEditModalOpen(true);
    };

    return (
        <div>
            <Header />
            <main style={mainContentStyle}>
                <div style={dashboardHeaderStyle}>
                    <h2 style={dashboardTitleStyle}>Your Decks</h2>
                    <button onClick={() => setIsCreateModalOpen(true)}>
                        + Create New Deck
                    </button>
                </div>
                
                {loading && <p>Loading your decks...</p>}
                {error && <p style={{ color: 'var(--error-color)' }}>{error}</p>}
                
                <div style={deckGridStyle}>
                    {decks.map(deck => (
                        <DeckCard 
                            key={deck.id} 
                            deck={deck}
                            onEdit={openEditModal}      // Pass the handler function down as a prop
                            onDelete={handleDeleteDeck} // Pass the handler function down as a prop
                        />
                    ))}
                </div>
            </main>

            {/* --- Modals for Create and Edit --- */}
            <Modal 
                title="Create a New Deck" 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)}
            >
                <CreateDeckForm 
                    onSubmit={handleCreateDeck}
                    onCancel={() => setIsCreateModalOpen(false)}
                    loading={actionLoading}
                />
            </Modal>
            
            {/* The Edit modal only renders when a deck is being edited */}
            {editingDeck && (
                <Modal 
                    title={`Edit Deck: ${editingDeck.name}`}
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                >
                    {/* We can reuse the same form component for editing! */}
                    <CreateDeckForm 
                        onSubmit={handleUpdateDeck}
                        onCancel={() => setIsEditModalOpen(false)}
                        loading={actionLoading}
                        // To improve this, you could pass an initialValue to the form
                        // e.g., initialValue={editingDeck.name}
                    />
                </Modal>
            )}
        </div>
    );
}

export default DashboardPage;

