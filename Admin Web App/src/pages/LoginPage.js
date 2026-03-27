import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    await login(email, password);
    navigate('/');
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 40, width: 400, boxShadow: '0 20px 60px rgba(0,0,0,.3)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <img src="/logoround.png" alt="GV Florida" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', marginBottom: 12 }} />
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--primary)' }}>GV Florida</div>
          <div style={{ fontSize: 14, color: 'var(--text-light)' }}>Admin Portal</div>
        </div>

        <div style={{ background: '#e8f5e9', border: '1px solid #a5d6a7', borderRadius: 10, padding: '10px 14px', marginBottom: 20, fontSize: 13 }}>
          <strong style={{ color: '#2e7d32' }}>Demo Credentials</strong><br/>
          Email: <strong>admin@gvflorida.com</strong><br/>
          Password: <strong>admin123</strong>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address</label>
            <div style={{ position: 'relative' }}>
              <FiMail style={{ position: 'absolute', left: 14, top: 12, color: 'var(--text-light)' }} />
              <input className="input" type="email" placeholder="admin@gvflorida.com" value={email} onChange={e => setEmail(e.target.value)} style={{ paddingLeft: 40 }} />
            </div>
          </div>
          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <FiLock style={{ position: 'absolute', left: 14, top: 12, color: 'var(--text-light)' }} />
              <input className="input" type={showPw ? 'text' : 'password'} placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} style={{ paddingLeft: 40, paddingRight: 40 }} />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 14, top: 10, background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer' }}>
                {showPw ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>
          <button className="btn btn-primary" type="submit" style={{ width: '100%', padding: 14, fontSize: 16, marginTop: 8 }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-light)', marginTop: 16 }}>Any credentials will work for demo</p>
      </div>
    </div>
  );
}
