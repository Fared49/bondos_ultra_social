<<<<<<< HEAD
import React from 'react';
<<<<<<< HEAD
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAppContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-primary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold cursor-pointer" onClick={() => navigate('/')}>
            🎮 Bondos
          </h1>
          {user && (
            <div className="hidden md:flex gap-6">
              <a href="/feed" className="hover:text-gray-200">Feed</a>
              <a href="/rooms" className="hover:text-gray-200">Rooms</a>
              <a href="/dashboard" className="hover:text-gray-200">Dashboard</a>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm">{user.username}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
=======
=======
import React, { useState } from 'react';
>>>>>>> 9854696 (feat: Transform into comprehensive entertainment + social platform)
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-slate-800 shadow-md border-b dark:border-slate-700 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Bondos Ultra
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {user && (
              <>
                <Link to="/feed" className="hover:text-blue-600 dark:hover:text-blue-400 transition font-semibold">
                  Feed
                </Link>
                <Link to="/rooms" className="hover:text-blue-600 dark:hover:text-blue-400 transition font-semibold">
                  Rooms
                </Link>
                <Link to="/communities" className="hover:text-blue-600 dark:hover:text-blue-400 transition font-semibold">
                  Communities
                </Link>
                <Link to="/games" className="hover:text-blue-600 dark:hover:text-blue-400 transition font-semibold">
                  Games
                </Link>
                <Link to="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400 transition font-semibold">
                  Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="hover:text-red-600 dark:hover:text-red-400 transition font-semibold text-red-600 dark:text-red-400">
                    Admin
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-4">
            {user && (
              <>
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition"
                >
                  {theme.mode === 'dark' ? '☀️' : '🌙'}
                </button>

<<<<<<< HEAD
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
>>>>>>> 53a9161 (🚀 Initial project setup: Full-stack app with React, Node.js, Express, MongoDB, JWT Auth, Docker)
              >
                Logout
              </button>
            </>
<<<<<<< HEAD
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-white text-primary rounded hover:bg-gray-100"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-4 py-2 border border-white rounded hover:bg-white hover:text-primary"
              >
                Register
              </button>
            </>
=======
>>>>>>> 53a9161 (🚀 Initial project setup: Full-stack app with React, Node.js, Express, MongoDB, JWT Auth, Docker)
          )}
=======
                <Link
                  to={`/profile/${user._id}`}
                  className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
                  title="Profile"
                >
                  👤
                </Link>

                <Link
                  to="/settings"
                  className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition"
                  title="Settings"
                >
                  ⚙️
                </Link>

                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition font-semibold"
                >
                  Logout
                </button>
              </>
            )}
          </div>
>>>>>>> 9854696 (feat: Transform into comprehensive entertainment + social platform)
        </div>

        {/* Mobile Menu Toggle */}
        {user && (
          <div className="md:hidden flex gap-2 flex-wrap">
            <Link to="/feed" className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-sm font-semibold">
              Feed
            </Link>
            <Link to="/rooms" className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 text-sm font-semibold">
              Rooms
            </Link>
            <Link to="/communities" className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 text-sm font-semibold">
              Communities
            </Link>
            <Link to="/games" className="px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300 text-sm font-semibold">
              Games
            </Link>
            <Link to="/dashboard" className="px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300 text-sm font-semibold">
              Dashboard
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
