import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiLock, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!phone || !password) { setError('Please fill all fields'); return; }
    setLoading(true); setError('');
    try { await login(phone, password); navigate('/'); }
    catch (err) { setError(err.message || 'Login failed'); }
    setLoading(false);
  };

  return (
    <div className="auth-screen">
      <div className="auth-header">
        <img src="/logoround.png" alt="GV Florida" className="auth-logo" />
        <h1>GV Florida</h1>
        <p>Transport Inc.</p>
      </div>
      <div className="auth-form">
        <h2>Sign In</h2>
        {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '10px 14px', borderRadius: 10, fontSize: 13, marginBottom: 16 }}>{error}</div>}

        <div style={{ background: '#e8f5e9', border: '1px solid #a5d6a7', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13 }}>
          <strong style={{ color: '#2e7d32' }}>Demo Credentials</strong><br/>
          Phone: <strong>09171234567</strong><br/>
          Password: <strong>demo123</strong>
        </div>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label><FiPhone size={14} style={{ marginRight: 4 }} />Phone Number</label>
            <input className="input-field" placeholder="09XX XXX XXXX" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          <div className="input-group">
            <label><FiLock size={14} style={{ marginRight: 4 }} />Password</label>
            <div style={{ position: 'relative' }}>
              <input className="input-field" type={showPw ? 'text' : 'password'} placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} style={{ paddingRight: 44 }} />
              <button type="button" onClick={() => setShowPw(p => !p)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#999', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 4 }}>
                {showPw ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
        <div className="auth-link">Don't have an account? <Link to="/register">Register</Link></div>
      </div>
    </div>
  );
}
