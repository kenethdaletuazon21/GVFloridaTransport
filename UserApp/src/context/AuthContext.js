import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('gvf_user');
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch {}
    }
    setLoading(false);
  }, []);

  const login = async (phone, password) => {
    // Demo login - accepts any credentials
    const demoUser = { id: 1, first_name: 'Juan', last_name: 'Dela Cruz', phone: phone || '09171234567', email: 'juan@email.com', wallet_balance: 1500 };
    localStorage.setItem('gvf_user', JSON.stringify(demoUser));
    localStorage.setItem('gvf_token', 'demo-token-123');
    setUser(demoUser);
    return demoUser;
  };

  const register = async (userData) => {
    const newUser = { id: 2, first_name: userData.name?.split(' ')[0] || 'User', last_name: userData.name?.split(' ').slice(1).join(' ') || '', phone: userData.phone, email: userData.email, wallet_balance: 0 };
    localStorage.setItem('gvf_user', JSON.stringify(newUser));
    localStorage.setItem('gvf_token', 'demo-token-456');
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem('gvf_user');
    localStorage.removeItem('gvf_token');
    setUser(null);
  };

  const updateUser = (userData) => {
    localStorage.setItem('gvf_user', JSON.stringify(userData));
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
