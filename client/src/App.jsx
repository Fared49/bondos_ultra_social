import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './store/AuthContext';
import { ThemeProvider } from './store/ThemeContext';
import PrivateRoute from './components/PrivateRoute';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LandingPage from './pages/LandingPage';
import FeedPage from './pages/FeedPage';
import ProfilePage from './pages/ProfilePage';
import RoomsPage from './pages/RoomsPage';
import CommunitiesPage from './pages/CommunitiesPage';
import GamesPage from './pages/GamesPage';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import AdminPanel from './pages/AdminPanel';
import NotFoundPage from './pages/NotFoundPage';

// Components
import Navbar from './components/Navbar';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-white dark:bg-slate-900 text-black dark:text-white transition-colors">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/feed" element={<PrivateRoute><FeedPage /></PrivateRoute>} />
                <Route path="/profile/:userId" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
                <Route path="/rooms" element={<PrivateRoute><RoomsPage /></PrivateRoute>} />
                <Route path="/communities" element={<PrivateRoute><CommunitiesPage /></PrivateRoute>} />
                <Route path="/games" element={<PrivateRoute><GamesPage /></PrivateRoute>} />
                <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
                <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
                <Route path="/admin" element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
