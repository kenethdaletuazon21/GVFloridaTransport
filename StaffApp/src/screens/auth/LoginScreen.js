import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

export default function LoginScreen() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!userId.trim() || !password.trim()) { setError('Please fill in all fields'); return; }
    setLoading(true);
    setError('');
    try {
      await login(userId, password);
      navigate('/');
    } catch (err) {
      setError('Login failed. Try any credentials for demo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen">
      <div className="auth-screen">
        <div style={{ marginBottom: 24, textAlign: 'center' }}>
          <img src="/logoround.png" alt="GV Florida" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', marginBottom: 12, border: '3px solid rgba(255,255,255,.3)' }} />
          <div style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 4 }}>GV Florida</div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,.7)' }}>Staff Portal</div>
        </div>

        <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: 320 }}>
          {error && <div style={{ background: 'rgba(231,76,60,.2)', color: '#fce4ec', padding: 10, borderRadius: 8, fontSize: 13, marginBottom: 12, textAlign: 'center' }}>{error}</div>}

          <div style={{ background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: 'rgba(255,255,255,.85)' }}>
            <strong style={{ color: '#81c784' }}>Demo Credentials</strong><br/>
            Employee ID: <strong>DRV-2024-001</strong><br/>
            Password: <strong>demo123</strong>
          </div>

          <div style={{ position: 'relative', marginBottom: 14 }}>
            <FiUser style={{ position: 'absolute', left: 14, top: 14, color: 'rgba(255,255,255,.5)' }} />
            <input className="input" placeholder="Employee ID"
              value={userId} onChange={e => setUserId(e.target.value)}
              style={{ paddingLeft: 40, background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.2)', color: '#fff' }} />
          </div>

          <div style={{ position: 'relative', marginBottom: 14 }}>
            <FiLock style={{ position: 'absolute', left: 14, top: 14, color: 'rgba(255,255,255,.5)' }} />
            <input className="input" type={showPw ? 'text' : 'password'} placeholder="Password"
              value={password} onChange={e => setPassword(e.target.value)}
              style={{ paddingLeft: 40, paddingRight: 40, background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.2)', color: '#fff' }} />
            <button type="button" onClick={() => setShowPw(!showPw)}
              style={{ position: 'absolute', right: 14, top: 12, background: 'none', border: 'none', color: 'rgba(255,255,255,.5)', cursor: 'pointer' }}>
              {showPw ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <button className="btn" type="submit" disabled={loading}
            style={{ width: '100%', background: '#fff', color: 'var(--primary)', fontWeight: 700, fontSize: 16, padding: 14 }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: 24, fontSize: 12, color: 'rgba(255,255,255,.5)', textAlign: 'center' }}>
          Any credentials will work for demo
        </div>
      </div>
    </div>
  );
}
