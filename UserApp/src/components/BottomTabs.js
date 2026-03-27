import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiMap, FiCreditCard, FiUser } from 'react-icons/fi';

const tabs = [
  { path: '/', icon: <FiHome />, label: 'Home' },
  { path: '/my-trips', icon: <FiMap />, label: 'My Trips' },
  { path: '/wallet', icon: <FiCreditCard />, label: 'Wallet' },
  { path: '/profile', icon: <FiUser />, label: 'Profile' },
];

export default function BottomTabs() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="tab-bar">
      {tabs.map(tab => (
        <button key={tab.path} className={`tab-item ${location.pathname === tab.path ? 'active' : ''}`} onClick={() => navigate(tab.path)}>
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
