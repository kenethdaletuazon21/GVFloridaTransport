import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaArrowLeft, FaUser, FaLock, FaEnvelope, FaPhone,
  FaSignInAlt, FaUserPlus, FaTicketAlt, FaSearch
} from 'react-icons/fa';
import KioskHeader from '../components/KioskHeader';

export default function AccountScreen() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('menu'); // menu, login, register, lookup
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [lookupCode, setLookupCode] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    // Demo login
    setUser({ name: 'Juan Dela Cruz', email: loginForm.email, phone: '09171234567', wallet: 1500 });
    setLoggedIn(true);
    setMode('dashboard');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setUser({ name: registerForm.name, email: registerForm.email, phone: registerForm.phone, wallet: 0 });
    setLoggedIn(true);
    setMode('dashboard');
  };

  const demoBookings = [
    { code: 'GVF-ABC123', route: 'Manila → Tuguegarao', date: 'Jan 15, 2025', time: '06:00', seat: '12A', status: 'Confirmed' },
    { code: 'GVF-DEF456', route: 'Manila → Baguio', date: 'Jan 20, 2025', time: '08:00', seat: '5B', status: 'Upcoming' },
    { code: 'GVF-GHI789', route: 'Manila → Santiago', date: 'Dec 28, 2024', time: '22:00', seat: '8A', status: 'Completed' },
  ];

  const renderMenu = () => (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h1 className="screen-title" style={{ textAlign: 'center' }}>My Account</h1>
      <p className="screen-subtitle" style={{ textAlign: 'center' }}>Sign in or look up a booking</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <button
          className="kiosk-card"
          onClick={() => setMode('login')}
          style={{
            cursor: 'pointer', border: '2px solid #e0e0e0', display: 'flex',
            alignItems: 'center', gap: 16, fontFamily: 'Poppins', textAlign: 'left'
          }}
        >
          <div style={{
            width: 56, height: 56, borderRadius: 16, background: '#fde8ee',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#D90045', fontSize: 24
          }}>
            <FaSignInAlt />
          </div>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 600 }}>Sign In</h3>
            <p style={{ fontSize: 13, color: '#9e9e9e' }}>Access your account and bookings</p>
          </div>
        </button>

        <button
          className="kiosk-card"
          onClick={() => setMode('register')}
          style={{
            cursor: 'pointer', border: '2px solid #e0e0e0', display: 'flex',
            alignItems: 'center', gap: 16, fontFamily: 'Poppins', textAlign: 'left'
          }}
        >
          <div style={{
            width: 56, height: 56, borderRadius: 16, background: '#e8f5e9',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#2e7d32', fontSize: 24
          }}>
            <FaUserPlus />
          </div>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 600 }}>Create Account</h3>
            <p style={{ fontSize: 13, color: '#9e9e9e' }}>Register a new GV Florida account</p>
          </div>
        </button>

        <button
          className="kiosk-card"
          onClick={() => setMode('lookup')}
          style={{
            cursor: 'pointer', border: '2px solid #e0e0e0', display: 'flex',
            alignItems: 'center', gap: 16, fontFamily: 'Poppins', textAlign: 'left'
          }}
        >
          <div style={{
            width: 56, height: 56, borderRadius: 16, background: '#fff3e0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#ff6f00', fontSize: 24
          }}>
            <FaTicketAlt />
          </div>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 600 }}>Look Up Booking</h3>
            <p style={{ fontSize: 13, color: '#9e9e9e' }}>Find a booking by confirmation code</p>
          </div>
        </button>
      </div>
    </div>
  );

  const renderLogin = () => (
    <div style={{ maxWidth: 480, margin: '0 auto' }}>
      <h1 className="screen-title" style={{ textAlign: 'center' }}>Sign In</h1>
      <p className="screen-subtitle" style={{ textAlign: 'center' }}>Enter your account credentials</p>

      <form onSubmit={handleLogin} className="kiosk-card">
        <div style={{ marginBottom: 16 }}>
          <label className="input-label"><FaEnvelope style={{ marginRight: 6 }} />Email</label>
          <input
            className="kiosk-input"
            type="email"
            placeholder="your@email.com"
            value={loginForm.email}
            onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))}
            required
          />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label className="input-label"><FaLock style={{ marginRight: 6 }} />Password</label>
          <input
            className="kiosk-input"
            type="password"
            placeholder="Enter password"
            value={loginForm.password}
            onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
            required
          />
        </div>
        <button type="submit" className="touch-btn full large">
          <FaSignInAlt /> Sign In
        </button>
      </form>
    </div>
  );

  const renderRegister = () => (
    <div style={{ maxWidth: 480, margin: '0 auto' }}>
      <h1 className="screen-title" style={{ textAlign: 'center' }}>Create Account</h1>
      <p className="screen-subtitle" style={{ textAlign: 'center' }}>Register for a GV Florida account</p>

      <form onSubmit={handleRegister} className="kiosk-card">
        <div style={{ marginBottom: 16 }}>
          <label className="input-label"><FaUser style={{ marginRight: 6 }} />Full Name</label>
          <input
            className="kiosk-input"
            placeholder="Juan Dela Cruz"
            value={registerForm.name}
            onChange={e => setRegisterForm(p => ({ ...p, name: e.target.value }))}
            required
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label className="input-label"><FaEnvelope style={{ marginRight: 6 }} />Email</label>
          <input
            className="kiosk-input"
            type="email"
            placeholder="your@email.com"
            value={registerForm.email}
            onChange={e => setRegisterForm(p => ({ ...p, email: e.target.value }))}
            required
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label className="input-label"><FaPhone style={{ marginRight: 6 }} />Phone Number</label>
          <input
            className="kiosk-input"
            placeholder="09XX XXX XXXX"
            value={registerForm.phone}
            onChange={e => setRegisterForm(p => ({ ...p, phone: e.target.value }))}
            required
          />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label className="input-label"><FaLock style={{ marginRight: 6 }} />Password</label>
          <input
            className="kiosk-input"
            type="password"
            placeholder="Create a password"
            value={registerForm.password}
            onChange={e => setRegisterForm(p => ({ ...p, password: e.target.value }))}
            required
          />
        </div>
        <button type="submit" className="touch-btn full large success">
          <FaUserPlus /> Create Account
        </button>
      </form>
    </div>
  );

  const renderLookup = () => (
    <div style={{ maxWidth: 480, margin: '0 auto' }}>
      <h1 className="screen-title" style={{ textAlign: 'center' }}>Look Up Booking</h1>
      <p className="screen-subtitle" style={{ textAlign: 'center' }}>Enter your booking confirmation code</p>

      <div className="kiosk-card">
        <label className="input-label"><FaTicketAlt style={{ marginRight: 6 }} />Booking Code</label>
        <input
          className="kiosk-input"
          placeholder="e.g. GVF-ABC123"
          value={lookupCode}
          onChange={e => setLookupCode(e.target.value.toUpperCase())}
          style={{ fontSize: 24, textAlign: 'center', fontWeight: 700, letterSpacing: 2 }}
        />
        <button
          className="touch-btn full large"
          style={{ marginTop: 20 }}
          disabled={!lookupCode.trim()}
          onClick={() => alert('Booking lookup: ' + lookupCode)}
        >
          <FaSearch /> Find Booking
        </button>
      </div>

      {/* Numpad */}
      <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center' }}>
        <div className="numpad">
          {['G','V','F','-','1','2','3','4','5','6','7','8','9','0','A','B'].map(key => (
            <button
              key={key}
              className="numpad-key"
              onClick={() => setLookupCode(prev => prev + key)}
            >
              {key}
            </button>
          ))}
          <button
            className="numpad-key"
            onClick={() => setLookupCode(prev => prev.slice(0, -1))}
          >
            ⌫
          </button>
          <button
            className="numpad-key"
            onClick={() => setLookupCode('')}
          >
            CLR
          </button>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <div className="kiosk-card" style={{
        background: 'linear-gradient(135deg, #D90045, #E8336E)',
        color: 'white', marginBottom: 24
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 700
          }}>
            {user?.name?.charAt(0)}
          </div>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700 }}>Welcome, {user?.name}!</h2>
            <p style={{ opacity: 0.7, fontSize: 14 }}>{user?.email}</p>
          </div>
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between', marginTop: 20,
          background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: '12px 20px'
        }}>
          <div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Wallet Balance</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>₱{user?.wallet?.toLocaleString()}</div>
          </div>
          <button
            onClick={() => navigate('/wallet')}
            style={{
              background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white',
              padding: '8px 20px', borderRadius: 10, cursor: 'pointer',
              fontFamily: 'Poppins', fontWeight: 600
            }}
          >
            Top Up
          </button>
        </div>
      </div>

      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>My Bookings</h3>
      {demoBookings.map((b, i) => (
        <div key={i} className="kiosk-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 16 }}>{b.route}</div>
            <div style={{ color: '#757575', fontSize: 13 }}>{b.date} • {b.time} • Seat {b.seat}</div>
            <span className="badge primary" style={{ marginTop: 6, display: 'inline-block', fontWeight: 700 }}>
              {b.code}
            </span>
          </div>
          <span className={`badge ${b.status === 'Confirmed' ? 'success' : b.status === 'Upcoming' ? 'primary' : 'accent'}`}>
            {b.status}
          </span>
        </div>
      ))}

      <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
        <button className="touch-btn outline" style={{ flex: 1 }} onClick={() => navigate('/destination')}>
          Book New Trip
        </button>
        <button className="touch-btn outline" style={{ flex: 1 }} onClick={() => { setLoggedIn(false); setMode('menu'); }}>
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <KioskHeader />
      <div className="kiosk-screen fade-in">
        {mode !== 'menu' && mode !== 'dashboard' && (
          <button className="back-btn" onClick={() => setMode(loggedIn ? 'dashboard' : 'menu')}>
            <FaArrowLeft /> Back
          </button>
        )}
        {!loggedIn && mode === 'menu' && (
          <button className="back-btn" onClick={() => navigate('/')}>
            <FaArrowLeft /> Back to Home
          </button>
        )}
        {mode === 'dashboard' && (
          <button className="back-btn" onClick={() => navigate('/')}>
            <FaArrowLeft /> Back to Home
          </button>
        )}

        {mode === 'menu' && renderMenu()}
        {mode === 'login' && renderLogin()}
        {mode === 'register' && renderRegister()}
        {mode === 'lookup' && renderLookup()}
        {mode === 'dashboard' && renderDashboard()}
      </div>
    </div>
  );
}
