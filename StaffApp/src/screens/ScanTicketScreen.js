import React, { useState } from 'react';
import { FiCamera, FiCheckCircle, FiXCircle, FiRefreshCw } from 'react-icons/fi';
import StaffTabs from '../components/StaffTabs';

const demoScans = [
  { code: 'GVF-20250001', passenger: 'Juan Dela Cruz', seat: '12A', valid: true, time: '05:45 AM' },
  { code: 'GVF-20250007', passenger: 'Miguel Torres', seat: '3B', valid: true, time: '05:42 AM' },
];

export default function ScanTicketScreen() {
  const [scans, setScans] = useState(demoScans);
  const [scanning, setScanning] = useState(false);

  const simulateScan = () => {
    setScanning(true);
    setTimeout(() => {
      const isValid = Math.random() > 0.3;
      const newScan = {
        code: `GVF-${20250000 + Math.floor(Math.random() * 100)}`,
        passenger: isValid ? 'Demo Passenger' : 'Unknown',
        seat: isValid ? `${Math.floor(Math.random() * 12 + 1)}${['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)]}` : '-',
        valid: isValid,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      };
      setScans(prev => [newScan, ...prev]);
      setScanning(false);
    }, 1500);
  };

  return (
    <div className="screen">
      <div className="screen-header"><h2>Ticket Scanner</h2></div>
      <div className="screen-body">
        {/* Scanner Area */}
        <div className="scanner-box">
          <div className="scan-frame">
            {scanning ? (
              <FiRefreshCw style={{ color: '#fff', fontSize: 32, animation: 'spin 1s linear infinite' }} />
            ) : (
              <FiCamera style={{ color: 'rgba(255,255,255,.4)', fontSize: 36 }} />
            )}
          </div>
          <div style={{ color: 'rgba(255,255,255,.6)', fontSize: 13, marginTop: 16 }}>
            {scanning ? 'Scanning...' : 'Position QR code in frame'}
          </div>
        </div>

        <button className="btn btn-accent" style={{ width: '100%', marginBottom: 16 }} onClick={simulateScan} disabled={scanning}>
          <FiCamera /> {scanning ? 'Scanning...' : 'Simulate Scan'}
        </button>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <div className="card" style={{ flex: 1, textAlign: 'center', padding: 12 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--success)' }}>{scans.filter(s => s.valid).length}</div>
            <div style={{ fontSize: 11, color: 'var(--text-light)' }}>Valid</div>
          </div>
          <div className="card" style={{ flex: 1, textAlign: 'center', padding: 12 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--danger)' }}>{scans.filter(s => !s.valid).length}</div>
            <div style={{ fontSize: 11, color: 'var(--text-light)' }}>Invalid</div>
          </div>
          <div className="card" style={{ flex: 1, textAlign: 'center', padding: 12 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary)' }}>{scans.length}</div>
            <div style={{ fontSize: 11, color: 'var(--text-light)' }}>Total</div>
          </div>
        </div>

        {/* Scan History */}
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Scan History</h3>
        {scans.map((s, i) => (
          <div key={i} className="scan-result" style={{ background: s.valid ? '#e8f5e9' : '#fce4ec' }}>
            {s.valid ? <FiCheckCircle style={{ color: 'var(--success)', fontSize: 20, flexShrink: 0 }} /> : <FiXCircle style={{ color: 'var(--danger)', fontSize: 20, flexShrink: 0 }} />}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{s.passenger}</div>
              <div style={{ fontSize: 11, color: 'var(--text-light)' }}>{s.code} • Seat {s.seat}</div>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-light)', flexShrink: 0 }}>{s.time}</div>
          </div>
        ))}
      </div>
      <StaffTabs />
    </div>
  );
}
