import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RoutesPage from './pages/RoutesPage';
import TripsPage from './pages/TripsPage';
import BookingsPage from './pages/BookingsPage';
import UsersPage from './pages/UsersPage';
import StaffPage from './pages/StaffPage';
import FleetPage from './pages/FleetPage';
import RevenuePage from './pages/RevenuePage';
import IncidentsPage from './pages/IncidentsPage';
import SettingsPage from './pages/SettingsPage';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
}

function AdminLayout() {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/trips" element={<TripsPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/staff" element={<StaffPage />} />
          <Route path="/fleet" element={<FleetPage />} />
          <Route path="/revenue" element={<RevenuePage />} />
          <Route path="/incidents" element={<IncidentsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </div>
  );
}

function AppRoutes() {
  const { user, loading } = useAuth();
  if (loading) return null;

  return (
    <Routes>
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
      <Route path="/*" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
