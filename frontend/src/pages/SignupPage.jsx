import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as api from '../services/apiService';

// We can reuse the same styles from the LoginPage for a consistent look.
const pageStyle = {
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

function SignupPage() {
    // State to manage the input fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    // The navigate function from React Router allows us to redirect the user after a successful signup.
    const navigate = useNavigate();

    // This function runs when the user submits the form
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevents the default browser page reload
        setError('');
        setLoading(true);

        try {
            // Call the signup function from our apiService.
            await api.signup(email, password);
            // On success, automatically redirect the user to the login page
            // with a success message (optional).
            navigate('/login');
        } catch (err) {
            // If the API call fails (e.g., email already exists), set an error message.
            const errorMessage = err.response?.data?.detail || 'Failed to create account. Please try again.';
            setError(errorMessage);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={pageStyle}>
             <form onSubmit={handleSubmit} style={formStyle}>
                <h2 style={titleStyle}>Create Your Account</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                />
                <input
                    type="password"
                    placeholder="Password (8-72 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Sign Up'}
                </button>
                {error && <p style={{ color: 'var(--error-color)', textAlign: 'center', marginTop: '10px' }}>{error}</p>}
            </form>
            <p style={{ marginTop: '20px' }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: 'var(--accent-primary)' }}>
                    Log In
                </Link>
            </p>
        </div>
    );
}

export default SignupPage;

