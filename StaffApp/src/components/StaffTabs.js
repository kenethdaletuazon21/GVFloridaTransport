import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiNavigation, FiCamera, FiClock, FiUser } from 'react-icons/fi';

const tabs = [
  { path: '/', icon: <FiHome />, label: 'Dashboard' },
  { path: '/trips', icon: <FiNavigation />, label: 'Trips' },
  { path: '/scanner', icon: <FiCamera />, label: 'Scanner' },
  { path: '/shifts', icon: <FiClock />, label: 'Shifts' },
  { path: '/profile', icon: <FiUser />, label: 'Profile' },
];

export default function StaffTabs() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="tab-bar">
      {tabs.map(t => (
        <button key={t.path} className={`tab-item ${pathname === t.path ? 'active' : ''}`} onClick={() => navigate(t.path)}>
          {t.icon}
          <span>{t.label}</span>
        </button>
      ))}
    </div>
  );
}
