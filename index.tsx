import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Make sure this file exists (even if empty)
import { AuthProvider } from './contexts/AuthContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* The AuthProvider MUST wrap the App component */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
);