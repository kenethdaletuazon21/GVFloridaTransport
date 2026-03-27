import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiArrowLeft, FiMapPin, FiCheckCircle, FiClock } from 'react-icons/fi';

const demoCheckpoints = [
  { id: 1, name: 'Cubao Terminal', km: 0, status: 'passed', time: '06:00 AM' },
  { id: 2, name: 'Sta. Rosa Toll', km: 45, status: 'passed', time: '07:10 AM' },
  { id: 3, name: 'Calamba Rest Stop', km: 62, status: 'current', time: null },
  { id: 4, name: 'San Pablo Junction', km: 95, status: 'upcoming', time: null },
  { id: 5, name: 'Lucena Terminal', km: 140, status: 'upcoming', time: null },
  { id: 6, name: 'Daet Stopover', km: 310, status: 'upcoming', time: null },
  { id: 7, name: 'Naga City Terminal', km: 380, status: 'upcoming', time: null },
];

export default function GeoTagScreen() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [checkpoints, setCheckpoints] = useState(demoCheckpoints);

  const passedCount = checkpoints.filter(c => c.status === 'passed').length;
  const progress = (passedCount / checkpoints.length) * 100;

  const checkIn = (id) => {
    setCheckpoints(prev => prev.map(c => {
      if (c.id === id) return { ...c, status: 'passed', time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) };
      if (c.id === id + 1) return { ...c, status: 'current' };
      return c;
    }));
  };

  return (
    <div className="screen">
      <div className="screen-header">
        <button className="back-btn" onClick={() => navigate(-1)}><FiArrowLeft /></button>
        <h2>Geo Check-in</h2>
      </div>
      <div className="screen-body">
        {/* Map placeholder */}
        <div className="card" style={{ background: 'linear-gradient(135deg, #2193b0, #6dd5ed)', padding: 20, marginBottom: 16, textAlign: 'center', color: '#fff' }}>
          <FiMapPin style={{ fontSize: 32, marginBottom: 8 }} />
          <div style={{ fontWeight: 700, fontSize: 16 }}>Route Progress</div>
          <div className="progress-bar" style={{ margin: '12px 0', height: 8, background: 'rgba(255,255,255,.3)' }}>
            <div className="progress-fill" style={{ width: `${progress}%`, background: '#fff' }} />
          </div>
          <div style={{ fontSize: 13 }}>{passedCount} of {checkpoints.length} checkpoints • {Math.round(progress)}%</div>
        </div>

        {/* Checkpoints */}
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Checkpoints</h3>
        {checkpoints.map((cp, i) => (
          <div key={cp.id} className="checkpoint">
            <div className={`checkpoint-dot ${cp.status}`} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: cp.status === 'current' ? 700 : 500, fontSize: 14, color: cp.status === 'upcoming' ? 'var(--text-light)' : 'var(--text)' }}>
                    {cp.name}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-light)' }}>
                    KM {cp.km} {cp.time ? `• ${cp.time}` : ''}
                  </div>
                </div>
                {cp.status === 'passed' && <FiCheckCircle style={{ color: 'var(--success)', fontSize: 18 }} />}
                {cp.status === 'current' && (
                  <button className="btn btn-sm btn-primary" onClick={() => checkIn(cp.id)}>
                    <FiMapPin /> Check In
                  </button>
                )}
                {cp.status === 'upcoming' && <FiClock style={{ color: 'var(--text-light)', fontSize: 16 }} />}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
