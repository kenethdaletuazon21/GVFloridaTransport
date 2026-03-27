import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiCreditCard, FiShield, FiFileText, FiHelpCircle, FiLogOut, FiChevronRight, FiBell, FiMapPin, FiLock, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';
import BottomTabs from '../components/BottomTabs';

const menuItems = [
  { icon: <FiUser />, label: 'Personal Information', color: '#6c63ff' },
  { icon: <FiCreditCard />, label: 'Payment Methods', color: '#ff6f00' },
  { icon: <FiBell />, label: 'Notifications', path: '/notifications', color: '#e91e63' },
  { icon: <FiMapPin />, label: 'Saved Destinations', color: '#00bcd4' },
  { icon: <FiShield />, label: 'Privacy Policy', color: '#4caf50' },
  { icon: <FiFileText />, label: 'Terms & Conditions', color: '#607d8b' },
  { icon: <FiHelpCircle />, label: 'Help & Support', color: '#9c27b0' },
];

export default function ProfileScreen() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showChangePw, setShowChangePw] = useState(false);
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [showCur, setShowCur] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showCon, setShowCon] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);

  const handleChangePw = (e) => {
    e.preventDefault();
    if (!pwForm.current || !pwForm.next || !pwForm.confirm) return;
    if (pwForm.next !== pwForm.confirm) { alert('Passwords do not match'); return; }
    setPwSuccess(true);
    setPwForm({ current: '', next: '', confirm: '' });
    setTimeout(() => { setPwSuccess(false); setShowChangePw(false); }, 2000);
  };

  return (
    <div className="screen">
      <div className="screen-header"><h2>Profile</h2></div>
      <div className="screen-body" style={{ paddingBottom: 70 }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, fontWeight: 700, margin: '0 auto 10px' }}>
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{user?.first_name} {user?.last_name}</div>
          <div style={{ fontSize: 13, color: '#999' }}>{user?.email}</div>
          <div style={{ fontSize: 13, color: '#999' }}>{user?.phone}</div>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 16 }}>
          {menuItems.map((item, i) => (
            <div key={i} onClick={() => item.path && navigate(item.path)}
              style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', borderBottom: i < menuItems.length - 1 ? '1px solid #f0f0f0' : 'none', cursor: 'pointer' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${item.color}15`, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, marginRight: 12 }}>
                {item.icon}
              </div>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{item.label}</span>
              <FiChevronRight style={{ color: '#ccc' }} />
            </div>
          ))}
        </div>

        {/* Change Password */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div onClick={() => setShowChangePw(p => !p)}
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#e8f0fe', color: '#1a5276', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, marginRight: 12 }}>
              <FiLock />
            </div>
            <span style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>Change Password</span>
            <FiChevronRight style={{ color: '#ccc', transform: showChangePw ? 'rotate(90deg)' : 'none', transition: 'transform .2s' }} />
          </div>
          {showChangePw && (
            <form onSubmit={handleChangePw} style={{ marginTop: 16 }}>
              {pwSuccess && <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '8px 12px', borderRadius: 8, fontSize: 13, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}><FiCheck /> Password updated successfully!</div>}
              {[
                { label: 'Current Password', key: 'current', show: showCur, toggle: () => setShowCur(p => !p) },
                { label: 'New Password', key: 'next', show: showNew, toggle: () => setShowNew(p => !p) },
                { label: 'Confirm New Password', key: 'confirm', show: showCon, toggle: () => setShowCon(p => !p) },
              ].map(f => (
                <div key={f.key} className="input-group">
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>{f.label}</label>
                  <div style={{ position: 'relative' }}>
                    <input className="input-field" type={f.show ? 'text' : 'password'} placeholder={f.label} value={pwForm[f.key]} onChange={e => setPwForm(p => ({ ...p, [f.key]: e.target.value }))} style={{ paddingRight: 44, fontSize: 14 }} />
                    <button type="button" onClick={f.toggle} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#999', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 4 }}>
                      {f.show ? <FiEyeOff size={17} /> : <FiEye size={17} />}
                    </button>
                  </div>
                </div>
              ))}
              <button className="btn btn-dark" type="submit" style={{ marginTop: 4 }}>Update Password</button>
            </form>
          )}
        </div>

        <button className="btn" onClick={logout}
          style={{ width: '100%', background: '#fce4ec', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, border: 'none', padding: 14, borderRadius: 12, fontSize: 15, cursor: 'pointer' }}>
          <FiLogOut /> Log Out
        </button>
      </div>
      <BottomTabs />
    </div>
  );
}
