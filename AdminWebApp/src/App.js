import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Fleet from './pages/Fleet';
import Employees from './pages/Employees';
import Trips from './pages/Trips';
import Bookings from './pages/Bookings';
import Payroll from './pages/Payroll';
import Reports from './pages/Reports';
import LiveMap from './pages/LiveMap';
import RoutesPage from './pages/RoutesPage';
import Maintenance from './pages/Maintenance';
import LostFound from './pages/LostFound';
import Promotions from './pages/Promotions';
import Notifications from './pages/Notifications';
import AuditLog from './pages/AuditLog';
import Settings from './pages/Settings';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div></div>;
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="fleet" element={<Fleet />} />
            <Route path="employees" element={<Employees />} />
            <Route path="trips" element={<Trips />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="payroll" element={<Payroll />} />
            <Route path="reports" element={<Reports />} />
            <Route path="live-map" element={<LiveMap />} />
            <Route path="routes" element={<RoutesPage />} />
            <Route path="maintenance" element={<Maintenance />} />
            <Route path="lost-found" element={<LostFound />} />
            <Route path="promotions" element={<Promotions />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="audit-log" element={<AuditLog />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
