import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      const u = localStorage.getItem('admin_user');
      if (u) setUser(JSON.parse(u));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const adminUser = {
      id: 'ADMIN-001',
      first_name: 'Admin',
      last_name: 'User',
      role: 'admin',
      email: email || 'admin@gvflorida.com',
    };
    localStorage.setItem('admin_token', 'demo-admin-token');
    localStorage.setItem('admin_user', JSON.stringify(adminUser));
    setUser(adminUser);
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
