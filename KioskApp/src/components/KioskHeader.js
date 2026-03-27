import React, { useState, useEffect } from 'react';
import { FaClock } from 'react-icons/fa';

export default function KioskHeader() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="kiosk-header">
      <div className="logo-section">
        <div style={{
          width: 54, height: 54, borderRadius: '50%',
          background: '#fff',
          border: '3px solid #fff',
          boxShadow: '0 0 0 4px rgba(255,255,255,0.25), 0 4px 16px rgba(0,0,0,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden', flexShrink: 0
        }}>
          <img
            src="/logoround.png"
            alt="GV Florida"
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
          />
        </div>
        <div>
          <h1>GV Florida Transport</h1>
          <span>Self-Service Kiosk • Sampaloc Terminal</span>
        </div>
      </div>
      <div className="header-right">
        <FaClock />
        <span className="header-time">
          {time.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}
