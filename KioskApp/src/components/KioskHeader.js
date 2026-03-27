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
        <img
          src="/logoround.png"
          alt="GV Florida"
        />
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
