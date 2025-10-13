import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Import all the page components
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import StudyPage from './pages/StudyPage';
import DeckDetailPage from './pages/DeckDetailPage'; // <-- Import the new page

function App() {
  const { token } = useAuth();

  return (
    <Routes>
      {/* --- Public Routes (Visible when logged out) --- */}
      <Route 
        path="/login" 
        element={!token ? <LoginPage /> : <Navigate to="/" replace />} 
      />
      <Route 
        path="/signup" 
        element={!token ? <SignupPage /> : <Navigate to="/" replace />} 
      />

      {/* --- Protected Routes (Visible only when logged in) --- */}
      <Route 
        path="/" 
        element={token ? <DashboardPage /> : <Navigate to="/login" replace />}
      />

      {/* --- THIS ROUTE IS NOW UPDATED --- */}
      {/* It now points to the DeckDetailPage for managing cards */}
      <Route 
        path="/decks/:deckId"
        element={token ? <DeckDetailPage /> : <Navigate to="/login" replace />}
      />
      
      {/* --- THIS IS A NEW ROUTE FOR THE STUDY SESSION --- */}
      <Route 
        path="/decks/:deckId/study"
        element={token ? <StudyPage /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default App;

