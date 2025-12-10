import React, { createContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api.js';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      authAPI.getProfile().then(res => setUser(res.data)).catch(() => setToken(null));
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    const res = await authAPI.login({ email, password });
    setToken(res.data.accessToken);
    localStorage.setItem('token', res.data.accessToken);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return <AuthContext.Provider value={{ user, token, loading, login, logout }}>{children}</AuthContext.Provider>;
}
