import React from 'react';
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
              >
                Logout
              </button>
            </>
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
          )}
        </div>
      </div>
    </nav>
  );
}
