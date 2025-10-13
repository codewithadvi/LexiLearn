import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Import our global styles

// Import the providers that will wrap our entire application
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';

// This is the entry point of the React application.
ReactDOM.createRoot(document.getElementById('root')).render(
  // React.StrictMode is a helper that highlights potential problems in an app.
  <React.StrictMode>
    {/* The BrowserRouter component enables routing for our entire app. 
      Any component inside it can use routing features.
    */}
    <BrowserRouter>
      {/* The AuthProvider holds the global state for authentication (token, user, login function).
        Any component inside it can access this state using the useAuth() hook.
      */}
      <AuthProvider>
        {/* <App /> is our main component that contains all the pages and logic.
          It can now use both routing and authentication features because it's inside the providers.
        */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

