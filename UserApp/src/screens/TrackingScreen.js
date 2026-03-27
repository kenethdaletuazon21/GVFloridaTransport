import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiArrowLeft, FiMapPin, FiRefreshCw } from 'react-icons/fi';

const stops = [
  { name: 'Cubao Terminal', km: 0, status: 'passed', time: '06:00 AM' },
  { name: 'Sta. Rosa', km: 45, status: 'passed', time: '07:10 AM' },
  { name: 'Calamba', km: 62, status: 'current', time: '07:35 AM' },
  { name: 'San Pablo', km: 95, status: 'upcoming', time: '08:15 AM' },
  { name: 'Lucena', km: 140, status: 'upcoming', time: '09:00 AM' },
  { name: 'Daet', km: 310, status: 'upcoming', time: '12:30 PM' },
  { name: 'Naga City', km: 380, status: 'upcoming', time: '02:00 PM' },
];

export default function TrackingScreen() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const trip = state?.trip;
  const [progress, setProgress] = useState(35);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => p < 95 ? p + Math.random() * 2 : p);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="screen">
      <div className="screen-header">
        <button className="back-btn" onClick={() => navigate(-1)}><FiArrowLeft /></button>
        <h2>Track Bus</h2>
      </div>
      <div className="screen-body">
        <div className="card" style={{ marginBottom: 16, background: 'var(--primary)', color: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
            <span>{trip?.busNumber || 'GVF-2847'}</span>
            <span><FiRefreshCw style={{ marginRight: 4 }} />Live</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 10, height: 8, overflow: 'hidden', marginBottom: 8 }}>
            <div style={{ width: `${progress}%`, height: '100%', background: '#fff', borderRadius: 10, transition: 'width 1s ease' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, opacity: .8 }}>
            <span>Manila</span>
            <span>{Math.round(progress)}% complete</span>
            <span>{trip?.destination || 'Naga City'}</span>
          </div>
        </div>

        <div style={{ background: '#f0f7ff', borderRadius: 12, padding: 14, marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
          <FiMapPin style={{ color: 'var(--primary)', fontSize: 20 }} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Currently near Calamba</div>
            <div style={{ fontSize: 12, color: '#666' }}>ETA to destination: ~6h 25min</div>
          </div>
        </div>

        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Route Stops</h3>
        <div style={{ position: 'relative', paddingLeft: 24 }}>
          <div style={{ position: 'absolute', left: 8, top: 0, bottom: 0, width: 2, background: '#e0e0e0' }} />
          {stops.map((stop, i) => (
            <div key={i} style={{ position: 'relative', marginBottom: 20, paddingLeft: 16 }}>
              <div style={{
                position: 'absolute', left: -20, top: 2, width: 14, height: 14, borderRadius: '50%',
                background: stop.status === 'passed' ? 'var(--success)' : stop.status === 'current' ? 'var(--primary)' : '#ddd',
                border: stop.status === 'current' ? '3px solid #ffcdd2' : 'none',
                boxSizing: 'border-box'
              }} />
              <div style={{ fontWeight: stop.status === 'current' ? 700 : 500, fontSize: 14, color: stop.status === 'upcoming' ? '#999' : '#333' }}>
                {stop.name}
              </div>
              <div style={{ fontSize: 12, color: '#999' }}>
                {stop.status === 'passed' ? `Passed — ${stop.time}` : stop.status === 'current' ? `Current location — ${stop.time}` : `ETA ${stop.time}`}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
