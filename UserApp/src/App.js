import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import BookingScreen from './screens/BookingScreen';
import SeatSelectScreen from './screens/SeatSelectScreen';
import PaymentScreen from './screens/PaymentScreen';
import BookingConfirmScreen from './screens/BookingConfirmScreen';
import MyTripsScreen from './screens/MyTripsScreen';
import TripDetailScreen from './screens/TripDetailScreen';
import WalletScreen from './screens/WalletScreen';
import ProfileScreen from './screens/ProfileScreen';
import TrackingScreen from './screens/TrackingScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import './App.css';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function AuthRoute({ children }) {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/" />;
}

function AppRoutes() {
  const { loading } = useAuth();
  if (loading) return <div className="app-loading"><div className="spinner" /></div>;

  return (
    <Routes>
      <Route path="/login" element={<AuthRoute><LoginScreen /></AuthRoute>} />
      <Route path="/register" element={<AuthRoute><RegisterScreen /></AuthRoute>} />
      <Route path="/" element={<ProtectedRoute><HomeScreen /></ProtectedRoute>} />
      <Route path="/search" element={<ProtectedRoute><SearchScreen /></ProtectedRoute>} />
      <Route path="/booking" element={<ProtectedRoute><BookingScreen /></ProtectedRoute>} />
      <Route path="/seat-select" element={<ProtectedRoute><SeatSelectScreen /></ProtectedRoute>} />
      <Route path="/payment" element={<ProtectedRoute><PaymentScreen /></ProtectedRoute>} />
      <Route path="/booking-confirm" element={<ProtectedRoute><BookingConfirmScreen /></ProtectedRoute>} />
      <Route path="/my-trips" element={<ProtectedRoute><MyTripsScreen /></ProtectedRoute>} />
      <Route path="/trip/:id" element={<ProtectedRoute><TripDetailScreen /></ProtectedRoute>} />
      <Route path="/wallet" element={<ProtectedRoute><WalletScreen /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
      <Route path="/tracking" element={<ProtectedRoute><TrackingScreen /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><NotificationsScreen /></ProtectedRoute>} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="mobile-frame">
          <AppRoutes />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
