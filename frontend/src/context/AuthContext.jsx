import { createContext, useState, useContext, useEffect } from 'react';
import * as api from '../services/apiService';

// 1. Create the context object
const AuthContext = createContext(null);

// 2. Create the Provider component
export const AuthProvider = ({ children }) => {
    // State to hold the authentication token. We initialize it from localStorage
    // to keep the user logged in across page refreshes.
    const [token, setToken] = useState(localStorage.getItem('lexi_token'));
    const [loading, setLoading] = useState(false); // To handle loading states for UI feedback

    // This is a React "effect". It runs automatically whenever the `token` state changes.
    // Its job is to keep localStorage in sync with our application's state.
    useEffect(() => {
        if (token) {
            // If there's a token, save it to localStorage.
            localStorage.setItem('lexi_token', token);
        } else {
            // If the token is null (e.g., after logout), remove it from localStorage.
            localStorage.removeItem('lexi_token');
        }
    }, [token]); // The [token] array means this effect only re-runs when the token changes.

    // The login function that components will call.
    const login = async (email, password) => {
        setLoading(true);
        try {
            // Call the login function from our apiService.
            const response = await api.login(email, password);
            // On success, update the token state with the new token from the backend.
            setToken(response.data.access_token);
        } finally {
            // Ensure the loading state is turned off, even if the login fails.
            setLoading(false);
        }
    };

    // The logout function that components will call.
    const logout = () => {
        // Simply set the token to null. The useEffect hook will handle clearing localStorage.
        setToken(null);
    };

    // The value object contains all the state and functions we want to make
    // globally available to any child component.
    const value = { token, login, logout, loading };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// 3. Create a custom hook for easy access
// This is a professional pattern that makes using the context much cleaner.
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        // This error will appear if you try to use the hook outside of the AuthProvider.
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

