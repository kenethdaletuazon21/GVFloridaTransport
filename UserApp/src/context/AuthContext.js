import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('gvf_user');
      if (savedUser) setUser(JSON.parse(savedUser));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const login = async (phone, password) => {
    const { data } = await authAPI.login({ phone, password });
    await AsyncStorage.setItem('gvf_token', data.token);
    await AsyncStorage.setItem('gvf_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const register = async (userData) => {
    const { data } = await authAPI.register(userData);
    await AsyncStorage.setItem('gvf_token', data.token);
    await AsyncStorage.setItem('gvf_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['gvf_token', 'gvf_user']);
    setUser(null);
  };

  const updateUser = async (userData) => {
    await AsyncStorage.setItem('gvf_user', JSON.stringify(userData));
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
