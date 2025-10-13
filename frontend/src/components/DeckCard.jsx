import { useNavigate } from 'react-router-dom';

const cardStyle = {
    backgroundColor: 'var(--bg-medium)',
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
};

const cardContentStyle = {
    cursor: 'pointer',
};

const cardTitleStyle = {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '8px'
};

const cardActionsStyle = {
    marginTop: '20px',
    paddingTop: '15px',
    borderTop: '1px solid var(--border-color)',
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
};

const actionButtonStyle = {
    padding: '6px 12px',
    fontSize: '14px',
    backgroundColor: 'var(--bg-light)',
};

function DeckCard({ deck, onEdit, onDelete }) {
    const navigate = useNavigate();

    const handleMouseOver = (e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
    };

    const handleMouseOut = (e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
    };

    const handleCardClick = () => {
        // Navigate to the detail page, not the study page
        navigate(`/decks/${deck.id}`);
    };
    
    const handleEditClick = (e) => {
        e.stopPropagation();
        onEdit(deck);
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        onDelete(deck);
    };

    return (
        <div 
            style={cardStyle} 
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
        >
            <div onClick={handleCardClick} style={cardContentStyle}>
                <h3 style={cardTitleStyle}>{deck.name}</h3>
                {/* --- THIS IS THE FINAL UPDATE --- */}
                {/* It now reads the card_count from the deck prop and correctly
                    displays "card" for 1 and "cards" for 0 or more than 1.
                */}
                <p style={{ color: 'var(--text-secondary)' }}>
                    {deck.card_count} {deck.card_count === 1 ? 'card' : 'cards'}
                </p>
            </div>

            <div style={cardActionsStyle}>
                <button onClick={handleEditClick} style={actionButtonStyle}>
                    Edit
                </button>
                <button onClick={handleDeleteClick} style={{...actionButtonStyle, backgroundColor: 'var(--error-color)'}}>
                    Delete
                </button>
            </div>
        </div>
    );
}

export default DeckCard;

