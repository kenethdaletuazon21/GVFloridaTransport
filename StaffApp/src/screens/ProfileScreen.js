import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiClock, FiFileText, FiHelpCircle, FiInfo, FiChevronRight, FiLogOut, FiMail, FiPhone, FiBriefcase, FiHash, FiMapPin, FiLock, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';
import StaffTabs from '../components/StaffTabs';

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

  const infoItems = [
    { icon: <FiMail />, label: 'Email', value: user?.email },
    { icon: <FiPhone />, label: 'Phone', value: user?.phone },
    { icon: <FiBriefcase />, label: 'Role', value: user?.role },
    { icon: <FiHash />, label: 'Employee ID', value: user?.employee_id },
    { icon: <FiMapPin />, label: 'Terminal', value: user?.terminal },
  ];

  const menuItems = [
    { icon: <FiClock />, label: 'Shift History', path: '/shifts' },
    { icon: <FiFileText />, label: 'My Reports', color: '#e65100' },
    { icon: <FiHelpCircle />, label: 'Help & Support', color: '#9c27b0' },
    { icon: <FiInfo />, label: 'About', color: '#607d8b' },
  ];

  return (
    <div className="screen">
      <div className="screen-header"><h2>Profile</h2></div>
      <div className="screen-body">
        {/* Avatar */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, margin: '0 auto 10px' }}>
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{user?.first_name} {user?.last_name}</div>
          <span className="badge badge-primary" style={{ marginTop: 6, textTransform: 'capitalize' }}>{user?.role}</span>
        </div>

        {/* Info */}
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Personal Information</h3>
          {infoItems.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < infoItems.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <span style={{ fontSize: 13, color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: 8 }}>{item.icon} {item.label}</span>
              <span style={{ fontSize: 13, fontWeight: 500, textTransform: item.label === 'Role' ? 'capitalize' : 'none' }}>{item.value}</span>
            </div>
          ))}
        </div>

        {/* Menu */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 16 }}>
          {menuItems.map((item, i) => (
            <div key={i} onClick={() => item.path && navigate(item.path)}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: i < menuItems.length - 1 ? '1px solid var(--border)' : 'none', cursor: 'pointer' }}>
              <span style={{ color: item.color || 'var(--primary)', fontSize: 16 }}>{item.icon}</span>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{item.label}</span>
              <FiChevronRight style={{ color: '#ccc' }} />
            </div>
          ))}
        </div>

        {/* Change Password */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div onClick={() => setShowChangePw(p => !p)}
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#e8f0fe', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, marginRight: 12 }}>
              <FiLock />
            </div>
            <span style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>Change Password</span>
            <FiChevronRight style={{ color: '#ccc', transform: showChangePw ? 'rotate(90deg)' : 'none', transition: 'transform .2s' }} />
          </div>
          {showChangePw && (
            <form onSubmit={handleChangePw} style={{ marginTop: 16 }}>
              {pwSuccess && <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '8px 12px', borderRadius: 8, fontSize: 13, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}><FiCheck /> Password updated!</div>}
              {[
                { label: 'Current Password', key: 'current', show: showCur, toggle: () => setShowCur(p => !p) },
                { label: 'New Password', key: 'next', show: showNew, toggle: () => setShowNew(p => !p) },
                { label: 'Confirm New Password', key: 'confirm', show: showCon, toggle: () => setShowCon(p => !p) },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-light)', display: 'block', marginBottom: 4 }}>{f.label}</label>
                  <div style={{ position: 'relative' }}>
                    <input className="input" type={f.show ? 'text' : 'password'} placeholder={f.label} value={pwForm[f.key]} onChange={e => setPwForm(p => ({ ...p, [f.key]: e.target.value }))} style={{ paddingRight: 44 }} />
                    <button type="button" onClick={f.toggle} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 4 }}>
                      {f.show ? <FiEyeOff size={17} /> : <FiEye size={17} />}
                    </button>
                  </div>
                </div>
              ))}
              <button className="btn btn-primary" type="submit" style={{ width: '100%', marginTop: 4 }}>Update Password</button>
            </form>
          )}
        </div>

        {/* Logout */}
        <button onClick={() => { logout(); navigate('/login'); }}
          style={{ width: '100%', padding: 14, borderRadius: 12, border: 'none', background: '#fce4ec', color: 'var(--accent)', fontSize: 15, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <FiLogOut /> Log Out
        </button>

        <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-light)', marginTop: 20 }}>GV Florida Staff App v1.0.0</div>
      </div>
      <StaffTabs />
    </div>
  );
}
