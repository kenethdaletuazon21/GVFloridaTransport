import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBus, FaWallet, FaInfoCircle, FaUserCircle, FaHandPointer } from 'react-icons/fa';

export default function WelcomeScreen() {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const actions = [
    {
      icon: <FaBus />,
      bg: 'linear-gradient(135deg, #ff6f00, #ffa040)',
      title: 'Book a Trip',
      desc: 'Purchase tickets for your next journey',
      path: '/destination',
    },
    {
      icon: <FaWallet />,
      bg: 'linear-gradient(135deg, #2e7d32, #43a047)',
      title: 'Wallet Top-Up',
      desc: 'Add funds to your GV Florida wallet',
      path: '/wallet',
    },
    {
      icon: <FaUserCircle />,
      bg: 'linear-gradient(135deg, #1565c0, #42a5f5)',
      title: 'My Account',
      desc: 'View bookings and manage your account',
      path: '/account',
    },
    {
      icon: <FaInfoCircle />,
      bg: 'linear-gradient(135deg, #6a1b9a, #ab47bc)',
      title: 'Station Info',
      desc: 'Schedules, routes, and terminal guide',
      path: '/station-info',
    },
  ];

  return (
    <div className="welcome-screen">
      <img
        src="/logo.png"
        alt="GV Florida"
        className="welcome-logo"
        onError={(e) => { e.target.style.display = 'none'; }}
      />
      <h1 className="welcome-title">GV Florida Transport</h1>
      <p className="welcome-subtitle">Self-Service Kiosk Terminal</p>

      <div className="welcome-actions fade-in">
        {actions.map((action, i) => (
          <button
            key={i}
            className="welcome-btn"
            onClick={() => navigate(action.path)}
          >
            <div className="btn-icon" style={{ background: action.bg }}>
              {action.icon}
            </div>
            <div className="btn-text">
              <h3>{action.title}</h3>
              <p>{action.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="welcome-touch-hint pulse">
        <FaHandPointer style={{ marginRight: 8 }} />
        Touch to begin
      </div>

      <div className="welcome-footer">
        <div style={{ marginBottom: 4 }}>
          {time.toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          {' • '}
          {time.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })}
        </div>
        GV Florida Transport Inc. — 832 AH Lacson Ave. Cor. Earnshaw St. Sampaloc, Manila
      </div>
    </div>
  );
}
