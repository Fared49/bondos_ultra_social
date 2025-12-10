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
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-slate-800 shadow-md border-b dark:border-slate-700">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-primary">
          Bondos Ultra
        </Link>

        <div className="flex items-center gap-6">
          {user && (
            <>
              <Link to={`/profile/${user._id}`} className="hover:text-primary transition">
                Profile
              </Link>

              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600"
              >
                {theme.mode === 'dark' ? '☀️' : '🌙'}
              </button>

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
        </div>
      </div>
    </nav>
  );
}
