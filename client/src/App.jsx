import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAppContext.js';
import { useNavigate } from 'react-router-dom';

export default function App() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Render pages based on route
  const renderPage = () => {
    const path = window.location.pathname;
    
    if (!token && !['/login', '/register', '/'].includes(path)) {
      return navigate('/login');
    }

    switch (path) {
      case '/':
        return <LandingPage />;
      case '/login':
        return <LoginPage />;
      case '/register':
        return <RegisterPage />;
      case '/feed':
        return <FeedPage />;
      case '/profile':
        return <ProfilePage />;
      case '/dashboard':
        return <DashboardPage />;
      default:
        return <NotFoundPage />;
    }
  };

  return mounted ? (
    <div>
      {renderPage()}
    </div>
  ) : null;
}

// Import pages (would use React Router in production)
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FeedPage from './pages/FeedPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
