import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/apiService';
import Header from '../components/Header';
import Flashcard from '../components/Flashcard';

const studyPageStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px',
    gap: '20px', // Adjusted gap
};

const answerFormStyle = {
    display: 'flex',
    gap: '10px',
    width: '100%',
    maxWidth: '700px',
};

const feedbackStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    height: '30px', // Reserve space to prevent layout shift
};

const hintContainerStyle = {
    minHeight: '24px', // Reserve space for the hint
    fontStyle: 'italic',
    color: 'var(--text-secondary)',
};

function StudyPage() {
    const { deckId } = useParams();
    const { token } = useAuth();

    const [currentCard, setCurrentCard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userAnswer, setUserAnswer] = useState('');
    const [showAnswer, setShowAnswer] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [hint, setHint] = useState(''); // <-- New state for the hint
    const [hintLoading, setHintLoading] = useState(false); // <-- New state for hint loading

    const fetchNextCard = async () => {
        setLoading(true);
        setShowAnswer(false);
        setFeedback(null);
        setUserAnswer('');
        setHint(''); // Reset hint for the new card
        try {
            const response = await api.getNextCard(deckId, token);
            setCurrentCard(response.data);
        } catch (error) {
            console.error("Failed to fetch next card:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNextCard();
    }, [deckId, token]);

    const handleAnswerSubmit = async (e) => {
        e.preventDefault();
        if (!currentCard || showAnswer) return;

        try {
            const response = await api.reviewCard(currentCard.id, userAnswer, token);
            setFeedback(response.data);
            setShowAnswer(true);
        } catch (error) {
            console.error("Failed to review card:", error);
        }
    };

    // --- NEW HINT HANDLER ---
    const handleGetHint = async () => {
        if (!currentCard || hint) return; // Don't fetch if there's already a hint
        setHintLoading(true);
        try {
            const response = await api.getHint(currentCard.id, token);
            setHint(response.data.hint); // Update state with the AI-generated hint
        } catch (error) {
            console.error("Failed to fetch hint:", error);
            setHint("Sorry, couldn't get a hint right now.");
        } finally {
            setHintLoading(false);
        }
    };

    if (loading && !currentCard) {
        return (
             <div>
                <Header />
                <div style={studyPageStyle}>
                    <p>Loading study session...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Header />
            <main style={studyPageStyle}>
                <Flashcard card={currentCard} showAnswer={showAnswer} feedback={feedback} />

                <div style={{ ...feedbackStyle, color: feedback?.was_correct ? 'var(--accent-secondary)' : 'var(--error-color)' }}>
                    {feedback && (feedback.was_correct ? "Correct!" : "Not quite...")}
                </div>

                {showAnswer ? (
                    <button onClick={fetchNextCard}>
                        {loading ? 'Loading...' : 'Next Card'}
                    </button>
                ) : (
                    currentCard && (
                        <>
                            <form onSubmit={handleAnswerSubmit} style={answerFormStyle}>
                                <input
                                    type="text"
                                    style={{ flexGrow: 1 }}
                                    placeholder="Type your answer here..."
                                    value={userAnswer}
                                    onChange={(e) => setUserAnswer(e.target.value)}
                                    required
                                    autoFocus
                                />
                                <button type="submit">Submit</button>
                            </form>
                            
                            {/* --- NEW HINT UI --- */}
                            <div style={hintContainerStyle}>
                                {hint ? (
                                    <p>Hint: {hint}</p>
                                ) : (
                                    <button onClick={handleGetHint} disabled={hintLoading} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', padding: 0 }}>
                                        {hintLoading ? 'Getting hint...' : 'Need a hint?'}
                                    </button>
                                )}
                            </div>
                        </>
                    )
                )}
                
                <Link to="/" style={{ color: 'var(--accent-primary)', marginTop: '20px' }}>
                    &larr; Back to Dashboard
                </Link>
            </main>
        </div>
    );
}

export default StudyPage;

