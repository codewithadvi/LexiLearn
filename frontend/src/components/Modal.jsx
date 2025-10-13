// This is a general-purpose, reusable Modal component.
// We can use it for creating decks, creating cards, editing, etc.

const modalBackdropStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(5px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000, // Ensure it's on top of everything
};

const modalContentStyle = {
    backgroundColor: 'var(--bg-medium)',
    padding: '30px',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
    width: '100%',
    maxWidth: '500px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
};

const modalHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
};

const modalTitleStyle = {
    fontSize: '22px',
    fontWeight: '600',
};

const closeButtonStyle = {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    fontSize: '24px',
    cursor: 'pointer',
};

function Modal({ title, isOpen, onClose, children }) {
    // If the modal is not open, render nothing.
    if (!isOpen) {
        return null;
    }

    return (
        // The backdrop is the dark, semi-transparent background.
        // Clicking it will close the modal.
        <div style={modalBackdropStyle} onClick={onClose}>
            {/* We stop the click from propagating to the backdrop from the content area. */}
            <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
                <div style={modalHeaderStyle}>
                    <h2 style={modalTitleStyle}>{title}</h2>
                    <button onClick={onClose} style={closeButtonStyle}>&times;</button>
                </div>
                {/* The 'children' prop is where the form or other content will be rendered. */}
                <div>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;
