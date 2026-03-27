import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiUser, FiPhone, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

export default function RegisterScreen() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);

  const update = (field, val) => setForm(p => ({ ...p, [field]: val }));

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.password) { setError('Please fill required fields'); return; }
    setLoading(true); setError('');
    try { await register(form); navigate('/'); }
    catch (err) { setError(err.message || 'Registration failed'); }
    setLoading(false);
  };

  return (
    <div className="auth-screen">
      <div className="auth-header" style={{ minHeight: 180 }}>
        <img src="/logoround.png" alt="GV Florida" className="auth-logo" style={{ width: 72, height: 72 }} />
        <h1 style={{ fontSize: 24 }}>Create Account</h1>
        <p>Join GV Florida Transport</p>
      </div>
      <div className="auth-form">
        <h2>Register</h2>
        {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '10px 14px', borderRadius: 10, fontSize: 13, marginBottom: 16 }}>{error}</div>}
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label><FiUser size={14} /> Full Name *</label>
            <input className="input-field" placeholder="Juan Dela Cruz" value={form.name} onChange={e => update('name', e.target.value)} />
          </div>
          <div className="input-group">
            <label><FiPhone size={14} /> Phone *</label>
            <input className="input-field" placeholder="09XX XXX XXXX" value={form.phone} onChange={e => update('phone', e.target.value)} />
          </div>
          <div className="input-group">
            <label><FiMail size={14} /> Email</label>
            <input className="input-field" type="email" placeholder="your@email.com" value={form.email} onChange={e => update('email', e.target.value)} />
          </div>
          <div className="input-group">
            <label><FiLock size={14} /> Password *</label>
            <div style={{ position: 'relative' }}>
              <input className="input-field" type={showPw ? 'text' : 'password'} placeholder="Create password" value={form.password} onChange={e => update('password', e.target.value)} style={{ paddingRight: 44 }} />
              <button type="button" onClick={() => setShowPw(p => !p)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#999', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 4 }}>
                {showPw ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</button>
        </form>
        <div className="auth-link">Already have an account? <Link to="/login">Sign In</Link></div>
      </div>
    </div>
  );
}
