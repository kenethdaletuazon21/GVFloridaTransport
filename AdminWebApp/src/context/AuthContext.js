import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import socketService from '../services/socket';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('gvf_admin_user');
    const token = localStorage.getItem('gvf_admin_token');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
      socketService.connect(token);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    const { token, user: userData } = data;
    if (!['admin', 'super_admin', 'hr', 'dispatcher'].includes(userData.role)) {
      throw new Error('Insufficient privileges for admin dashboard.');
    }
    localStorage.setItem('gvf_admin_token', token);
    localStorage.setItem('gvf_admin_user', JSON.stringify(userData));
    setUser(userData);
    socketService.connect(token);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('gvf_admin_token');
    localStorage.removeItem('gvf_admin_user');
    socketService.disconnect();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
