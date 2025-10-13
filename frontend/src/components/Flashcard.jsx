const cardContainerStyle = {
    backgroundColor: 'var(--bg-medium)',
    padding: '40px',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
    width: '100%',
    maxWidth: '700px',
    minHeight: '300px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
};

const questionStyle = {
    fontSize: '28px',
    fontWeight: '600',
    marginBottom: '20px',
};

const answerSectionStyle = {
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid var(--border-color)',
    width: '100%'
};

const answerLabelStyle = {
    fontSize: '16px',
    color: 'var(--text-secondary)',
    marginBottom: '8px'
};

const answerStyle = {
    fontSize: '22px',
    fontWeight: '500',
    color: 'var(--accent-secondary)',
};

function Flashcard({ card, showAnswer, feedback }) {
    // If there is no current card, it means the study session is over.
    if (!card) {
        return (
            <div style={cardContainerStyle}>
                <h2>All done for now!</h2>
                <p style={{ color: 'var(--text-secondary)', marginTop: '10px' }}>
                    You have reviewed all the due cards in this deck. Great work!
                </p>
            </div>
        );
    }

    // This is the main view for an active card.
    return (
        <div style={cardContainerStyle}>
            <p style={questionStyle}>{card.question}</p>

            {/* This section is conditionally rendered. It only appears after the user has submitted an answer. */}
            {showAnswer && feedback && (
                <div style={answerSectionStyle}>
                    <p style={answerLabelStyle}>Correct Answer:</p>
                    <p style={answerStyle}>{feedback.correct_answer}</p>
                </div>
            )}
        </div>
    );
}

export default Flashcard;

