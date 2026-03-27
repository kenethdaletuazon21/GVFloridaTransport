import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('staff_token');
    if (token) {
      const u = localStorage.getItem('staff_user');
      if (u) setUser(JSON.parse(u));
    }
    setLoading(false);
  }, []);

  const login = async (userId, password) => {
    // Demo login – accept any credentials
    const demoUser = {
      id: 'STAFF-001',
      first_name: 'Carlos',
      last_name: 'Reyes',
      role: 'driver',
      email: 'carlos.reyes@gvflorida.com',
      phone: '0917-555-1234',
      employee_id: userId || 'DRV-2024-001',
      terminal: 'Cubao Main Terminal',
    };
    localStorage.setItem('staff_token', 'demo-staff-token');
    localStorage.setItem('staff_user', JSON.stringify(demoUser));
    setUser(demoUser);
  };

  const logout = () => {
    localStorage.removeItem('staff_token');
    localStorage.removeItem('staff_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
