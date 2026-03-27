import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiLock, FiEye, FiEyeOff, FiCheck, FiUser, FiMail, FiShield } from 'react-icons/fi';

const pwFields = [
  { label: 'Current Password', key: 'current' },
  { label: 'New Password', key: 'next' },
  { label: 'Confirm New Password', key: 'confirm' },
];

export default function SettingsPage() {
  const { user } = useAuth();
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false });
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwError, setPwError] = useState('');

  const handleChangePw = (e) => {
    e.preventDefault();
    setPwError('');
    if (!pwForm.current || !pwForm.next || !pwForm.confirm) { setPwError('Please fill all fields'); return; }
    if (pwForm.next.length < 6) { setPwError('New password must be at least 6 characters'); return; }
    if (pwForm.next !== pwForm.confirm) { setPwError('New passwords do not match'); return; }
    setPwSuccess(true);
    setPwForm({ current: '', next: '', confirm: '' });
    setTimeout(() => setPwSuccess(false), 3000);
  };

  const toggleShow = (key) => setShowPw(p => ({ ...p, [key]: !p[key] }));

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage your account settings</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
        {/* Profile Info */}
        <div className="card">
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <FiUser style={{ color: 'var(--primary)' }} /> Account Information
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { icon: <FiUser />, label: 'Full Name', value: `${user?.first_name} ${user?.last_name}` },
              { icon: <FiMail />, label: 'Email Address', value: user?.email },
              { icon: <FiShield />, label: 'Role', value: user?.role || 'Administrator' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: 16 }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-light)' }}>{item.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, textTransform: item.label === 'Role' ? 'capitalize' : 'none' }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Change Password */}
        <div className="card">
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <FiLock style={{ color: 'var(--primary)' }} /> Change Password
          </h2>

          {pwSuccess && (
            <div style={{ background: '#e8f5e9', border: '1px solid #a5d6a7', color: '#2e7d32', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiCheck /> Password updated successfully!
            </div>
          )}
          {pwError && (
            <div style={{ background: '#ffebee', border: '1px solid #ef9a9a', color: '#c62828', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
              {pwError}
            </div>
          )}

          <form onSubmit={handleChangePw}>
            {pwFields.map(f => (
              <div key={f.key} className="form-group">
                <label>{f.label}</label>
                <div style={{ position: 'relative' }}>
                  <FiLock style={{ position: 'absolute', left: 14, top: 12, color: 'var(--text-light)' }} />
                  <input
                    className="input"
                    type={showPw[f.key] ? 'text' : 'password'}
                    placeholder={f.label}
                    value={pwForm[f.key]}
                    onChange={e => setPwForm(p => ({ ...p, [f.key]: e.target.value }))}
                    style={{ paddingLeft: 40, paddingRight: 44 }}
                  />
                  <button type="button" onClick={() => toggleShow(f.key)}
                    style={{ position: 'absolute', right: 14, top: 10, background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    {showPw[f.key] ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>
            ))}
            <button className="btn btn-primary" type="submit" style={{ width: '100%', padding: '12px', marginTop: 8 }}>
              <FiLock size={16} /> Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
