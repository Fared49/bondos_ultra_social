import React, { useState } from 'react';
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
                Login
