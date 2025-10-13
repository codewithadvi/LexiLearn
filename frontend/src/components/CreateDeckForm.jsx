import { useState } from 'react';

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
};

const inputStyle = {
    width: '100%', // Ensure input takes full width of the modal
};

const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'flex-end', // Align button to the right
};

function CreateDeckForm({ onSubmit, onCancel, loading }) {
    // State to manage the deck name input field
    const [deckName, setDeckName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        if (!deckName.trim()) return; // Don't submit if the name is empty

        // Call the onSubmit function passed from the parent (DashboardPage)
        onSubmit(deckName);
    };

    return (
        <form onSubmit={handleSubmit} style={formStyle}>
            <input
                type="text"
                placeholder="Enter new deck name..."
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                style={inputStyle}
                autoFocus // Automatically focus the input when the modal opens
                required
                disabled={loading}
            />
            <div style={buttonContainerStyle}>
                <button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Deck'}
                </button>
            </div>
        </form>
    );
}

export default CreateDeckForm;
