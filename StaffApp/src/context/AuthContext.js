import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('staff_token').then(token => {
      if (token) AsyncStorage.getItem('staff_user').then(u => { if (u) setUser(JSON.parse(u)); });
    }).finally(() => setLoading(false));
  }, []);

  const login = async (userId, password) => {
    const { data } = await authAPI.login({ user_id: userId, password });
    const staffRoles = ['driver', 'conductor', 'inspector', 'dispatcher'];
    if (!staffRoles.includes(data.user?.role)) throw new Error('Unauthorized: Staff access only');
    await AsyncStorage.setItem('staff_token', data.token);
    await AsyncStorage.setItem('staff_user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['staff_token', 'staff_user']);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
