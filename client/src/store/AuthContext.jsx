import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api.js';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth from localStorage (support legacy `token` key)
  useEffect(() => {
    const tokensRaw = localStorage.getItem('tokens') || localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (tokensRaw && savedUser) {
      try {
        const tokens = typeof tokensRaw === 'string' && tokensRaw.startsWith('{') ? JSON.parse(tokensRaw) : { accessToken: tokensRaw };
        setToken(tokens.accessToken || null);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        // ignore
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (!data) throw new Error('Login failed');

      const tokens = { accessToken: data.accessToken, refreshToken: data.refreshToken };
      setToken(tokens.accessToken);
      setUser(data.user);
      localStorage.setItem('tokens', JSON.stringify(tokens));
      localStorage.setItem('user', JSON.stringify(data.user));
      return data.user;
    } catch (err) {
      setError(err.message || err.toString());
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/auth/register', { username, email, password });
      if (!data) throw new Error('Registration failed');
      const tokens = { accessToken: data.accessToken, refreshToken: data.refreshToken };
      setToken(tokens.accessToken);
      setUser(data.user);
      localStorage.setItem('tokens', JSON.stringify(tokens));
      localStorage.setItem('user', JSON.stringify(data.user));
      return data.user;
    } catch (err) {
      setError(err.message || err.toString());
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('tokens');
    localStorage.removeItem('user');
  };

  const updateProfile = async (data) => {
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Update failed');
      
      setUser(result.user);
      localStorage.setItem('user', JSON.stringify(result.user));
      return result.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
