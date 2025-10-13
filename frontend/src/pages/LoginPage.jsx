import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

// We use inline styles here for simplicity and to keep components self-contained.
// In a larger application, this could be moved to a dedicated CSS file.
const loginPageStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
};

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    padding: '40px',
    backgroundColor: 'var(--bg-medium)',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '400px',
    border: '1px solid var(--border-color)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
};

const titleStyle = {
    textAlign: 'center',
    marginBottom: '10px',
    fontWeight: '600',
    fontSize: '24px'
};

function LoginPage() {
    // State to manage the input fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    // Get the login function and loading state from our global AuthContext
    const { login, loading } = useAuth();

    // This function runs when the user submits the form
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevents the default browser page reload
        setError(''); // Reset any previous errors
        try {
            await login(email, password);
            // If the login is successful, the redirection logic in App.jsx will automatically handle it.
        } catch (err) {
            setError('Failed to log in. Please check your credentials.');
            console.error(err); // Log the full error for debugging
        }
    };

    return (
        <div style={loginPageStyle}>
             <form onSubmit={handleSubmit} style={formStyle}>
                <h2 style={titleStyle}>Welcome to LexiLearn AI</h2>
                <input
                    type="email"
                    placeholder="Email (e.g., test@example.com)"
                    value={email}
                    // This creates a "controlled component" where React state drives the input value
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading} // Disable the input while logging in
                />
                <input
                    type="password"
                    placeholder="Password (e.g., password123)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading} // Disable the input while logging in
                />
                <button type="submit" disabled={loading}>
                    {/* Show different text on the button based on the loading state */}
                    {loading ? 'Logging in...' : 'Login'}
                </button>
                {/* Conditionally render an error message if one exists */}
                {error && <p style={{ color: 'var(--error-color)', textAlign: 'center', marginTop: '10px' }}>{error}</p>}
            </form>
        </div>
    );
}

export default LoginPage;

