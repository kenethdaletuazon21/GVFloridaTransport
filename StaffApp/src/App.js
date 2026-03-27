import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

import LoginScreen from './screens/auth/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import TripManagementScreen from './screens/TripManagementScreen';
import TripDetailScreen from './screens/TripDetailScreen';
import PassengerListScreen from './screens/PassengerListScreen';
import ScanTicketScreen from './screens/ScanTicketScreen';
import IncidentReportScreen from './screens/IncidentReportScreen';
import ShiftLogScreen from './screens/ShiftLogScreen';
import GeoTagScreen from './screens/GeoTagScreen';
import ProfileScreen from './screens/ProfileScreen';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
}

function AuthRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return !user ? children : <Navigate to="/" />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<AuthRoute><LoginScreen /></AuthRoute>} />
      <Route path="/" element={<ProtectedRoute><DashboardScreen /></ProtectedRoute>} />
      <Route path="/trips" element={<ProtectedRoute><TripManagementScreen /></ProtectedRoute>} />
      <Route path="/trip/:id" element={<ProtectedRoute><TripDetailScreen /></ProtectedRoute>} />
      <Route path="/passengers" element={<ProtectedRoute><PassengerListScreen /></ProtectedRoute>} />
      <Route path="/scanner" element={<ProtectedRoute><ScanTicketScreen /></ProtectedRoute>} />
      <Route path="/incident" element={<ProtectedRoute><IncidentReportScreen /></ProtectedRoute>} />
      <Route path="/shifts" element={<ProtectedRoute><ShiftLogScreen /></ProtectedRoute>} />
      <Route path="/geotag" element={<ProtectedRoute><GeoTagScreen /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <div className="mobile-frame">
        <AppRoutes />
      </div>
    </AuthProvider>
  );
}
