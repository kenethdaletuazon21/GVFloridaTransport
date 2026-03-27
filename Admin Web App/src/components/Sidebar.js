import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiMap, FiNavigation, FiBookOpen, FiUsers, FiBriefcase, FiTruck, FiDollarSign, FiAlertTriangle, FiLogOut, FiSettings } from 'react-icons/fi';

const navItems = [
  { section: 'Main' },
  { path: '/', icon: <FiHome />, label: 'Dashboard' },
  { section: 'Operations' },
  { path: '/routes', icon: <FiMap />, label: 'Routes' },
  { path: '/trips', icon: <FiNavigation />, label: 'Trips & Schedules' },
  { path: '/bookings', icon: <FiBookOpen />, label: 'Bookings' },
  { section: 'Management' },
  { path: '/users', icon: <FiUsers />, label: 'Users' },
  { path: '/staff', icon: <FiBriefcase />, label: 'Staff' },
  { path: '/fleet', icon: <FiTruck />, label: 'Fleet' },
  { section: 'Reports' },
  { path: '/revenue', icon: <FiDollarSign />, label: 'Revenue' },
  { path: '/incidents', icon: <FiAlertTriangle />, label: 'Incidents' },
  { section: 'Account' },
  { path: '/settings', icon: <FiSettings />, label: 'Settings' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { logout } = useAuth();

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src="/logoround.png" alt="GV Florida" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
        <div>
          <h1>GV Florida</h1>
          <span>Admin Portal</span>
        </div>
      </div>
      <div className="sidebar-nav">
        {navItems.map((item, i) =>
          item.section ? (
            <div key={i} className="nav-section">{item.section}</div>
          ) : (
            <div key={i} className={`nav-item ${pathname === item.path ? 'active' : ''}`} onClick={() => navigate(item.path)}>
              {item.icon}
              <span>{item.label}</span>
            </div>
          )
        )}
      </div>
      <div className="sidebar-footer">
        <div className="nav-item" onClick={() => { logout(); navigate('/login'); }}>
          <FiLogOut />
          <span>Log Out</span>
        </div>
      </div>
    </div>
  );
}
