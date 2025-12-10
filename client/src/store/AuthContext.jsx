import React, { createContext, useState, useEffect } from 'react';
<<<<<<< HEAD
import { authAPI } from '../services/api.js';
=======
>>>>>>> 53a9161 (🚀 Initial project setup: Full-stack app with React, Node.js, Express, MongoDB, JWT Auth, Docker)

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
<<<<<<< HEAD
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize auth on mount
  const initializeAuth = async () => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      try {
        const res = await authAPI.getProfile();
        setUser(res.data);
      } catch (err) {
        console.error('Failed to load profile:', err);
        localStorage.removeItem('token');
        setToken(null);
      }
    }
  };

  useEffect(() => {
    if (token && !user) {
      initializeAuth();
    }
  }, [token, user]);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authAPI.login({ email, password });
      setToken(res.data.accessToken);
      localStorage.setItem('token', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'فشل تسجيل الدخول';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authAPI.register({ username, email, password });
      setToken(res.data.accessToken);
      localStorage.setItem('token', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'فشل التسجيل';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
=======
  const [tokens, setTokens] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const savedTokens = localStorage.getItem('tokens');
    const savedUser = localStorage.getItem('user');

    if (savedTokens && savedUser) {
      try {
        setTokens(JSON.parse(savedTokens));
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to load saved auth data:', error);
        localStorage.removeItem('tokens');
        localStorage.removeItem('user');
      }
    }

    setLoading(false);
  }, []);

  const login = (userData, authTokens) => {
    setUser(userData);
    setTokens(authTokens);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('tokens', JSON.stringify(authTokens));
>>>>>>> 53a9161 (🚀 Initial project setup: Full-stack app with React, Node.js, Express, MongoDB, JWT Auth, Docker)
  };

  const logout = () => {
    setUser(null);
<<<<<<< HEAD
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  };

  const updateProfile = async (data) => {
    try {
      const res = await authAPI.updateProfile(data);
      setUser(res.data);
      return res.data;
    } catch (err) {
      setError('فشل تحديث الملف الشخصي');
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
        initializeAuth,
      }}
    >
=======
    setTokens(null);
    localStorage.removeItem('tokens');
    localStorage.removeItem('user');
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ user, tokens, login, logout, updateUser, loading }}>
>>>>>>> 53a9161 (🚀 Initial project setup: Full-stack app with React, Node.js, Express, MongoDB, JWT Auth, Docker)
      {children}
    </AuthContext.Provider>
  );
}
