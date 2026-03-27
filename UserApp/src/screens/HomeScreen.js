import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiBell, FiPlusCircle, FiClock, FiMapPin, FiCalendar, FiStar } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import BottomTabs from '../components/BottomTabs';

const POPULAR_ROUTES = [
  { id: 1, from: 'Manila', to: 'Tuguegarao', price: 950, time: '10 hrs', icon: '🏔️' },
  { id: 2, from: 'Manila', to: 'Santiago', price: 850, time: '8 hrs', icon: '🌾' },
  { id: 3, from: 'Manila', to: 'Baguio', price: 500, time: '5 hrs', icon: '🌲' },
  { id: 4, from: 'Manila', to: 'Tabuk', price: 1050, time: '12 hrs', icon: '⛰️' },
];

export default function HomeScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [balance] = useState(1500);

  return (
    <div className="screen">
      <div style={{ background: 'var(--primary)', color: '#fff', padding: '20px 20px 50px', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>Hello, {user?.first_name || 'Traveler'}! 👋</div>
            <div style={{ fontSize: 13, opacity: .7 }}>Where are you headed?</div>
          </div>
          <button onClick={() => navigate('/notifications')} style={{ background: 'rgba(255,255,255,.2)', border: 'none', borderRadius: 12, padding: 10, color: '#fff', cursor: 'pointer', position: 'relative' }}>
            <FiBell size={20} />
            <span style={{ position: 'absolute', top: -2, right: -2, background: '#f39c12', width: 18, height: 18, borderRadius: 9, fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</span>
          </button>
        </div>
        <div className="wallet-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="wallet-label">GV Wallet Balance</span>
            <button onClick={() => navigate('/wallet')} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Top Up →</button>
          </div>
          <div className="wallet-balance">₱{balance.toLocaleString()}</div>
          <div className="wallet-actions">
            <button className="wallet-action-btn" onClick={() => navigate('/wallet')}><FiPlusCircle /> Top Up</button>
            <button className="wallet-action-btn" onClick={() => navigate('/my-trips')}><FiClock /> History</button>
          </div>
        </div>
      </div>

      <div className="screen-body" style={{ marginTop: -30, paddingBottom: 80 }}>
        <div className="search-box" onClick={() => navigate('/search')}>
          <FiSearch size={18} color="#999" />
          <span>Search for trips...</span>
        </div>

        <div className="quick-actions">
          {[
            { icon: <FiSearch size={22} />, label: 'Book Trip', path: '/search', color: 'var(--dark)' },
            { icon: <FiMapPin size={22} />, label: 'Track Bus', path: '/tracking', color: 'var(--success)' },
            { icon: <FiCalendar size={22} />, label: 'My Trips', path: '/my-trips', color: 'var(--warning)' },
            { icon: <FiStar size={22} />, label: 'Promos', path: '/', color: 'var(--danger)' },
          ].map((a, i) => (
            <div key={i} className="quick-action" onClick={() => navigate(a.path)}>
              <div className="quick-action-icon" style={{ background: a.color + '15', color: a.color }}>{a.icon}</div>
              <span className="quick-action-label">{a.label}</span>
            </div>
          ))}
        </div>

        <div className="section-title">Popular Routes</div>
        {POPULAR_ROUTES.map(route => (
          <div key={route.id} className="route-card" onClick={() => navigate('/search', { state: { destination: route.to } })}>
            <div className="route-icon">{route.icon}</div>
            <div className="route-info">
              <div className="route-name">{route.from} → {route.to}</div>
              <div className="route-time">{route.time} journey</div>
            </div>
            <div className="route-price">₱{route.price}</div>
          </div>
        ))}
      </div>
      <BottomTabs />
    </div>
  );
}
