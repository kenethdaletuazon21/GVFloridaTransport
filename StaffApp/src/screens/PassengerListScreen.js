import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiArrowLeft, FiSearch, FiCheckCircle, FiClock, FiXCircle, FiUserCheck } from 'react-icons/fi';

const demoPassengers = [
  { id: 1, name: 'Juan Dela Cruz', bookingCode: 'GVF-20250001', seat: '12A', status: 'boarded' },
  { id: 2, name: 'Maria Santos', bookingCode: 'GVF-20250002', seat: '12B', status: 'boarded' },
  { id: 3, name: 'Pedro Reyes', bookingCode: 'GVF-20250003', seat: '5A', status: 'checked_in' },
  { id: 4, name: 'Ana Garcia', bookingCode: 'GVF-20250004', seat: '5B', status: 'checked_in' },
  { id: 5, name: 'Jose Mendoza', bookingCode: 'GVF-20250005', seat: '8C', status: 'checked_in' },
  { id: 6, name: 'Rosa De Leon', bookingCode: 'GVF-20250006', seat: '3A', status: 'no_show' },
  { id: 7, name: 'Miguel Torres', bookingCode: 'GVF-20250007', seat: '3B', status: 'boarded' },
  { id: 8, name: 'Carmen Aquino', bookingCode: 'GVF-20250008', seat: '7A', status: 'checked_in' },
];

export default function PassengerListScreen() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [search, setSearch] = useState('');
  const [passengers, setPassengers] = useState(demoPassengers);

  const filtered = passengers.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.bookingCode.toLowerCase().includes(search.toLowerCase()) ||
    p.seat.toLowerCase().includes(search.toLowerCase())
  );

  const counts = { boarded: passengers.filter(p => p.status === 'boarded').length, waiting: passengers.filter(p => p.status === 'checked_in').length, noShow: passengers.filter(p => p.status === 'no_show').length };

  const boardPassenger = (id) => {
    setPassengers(prev => prev.map(p => p.id === id ? { ...p, status: 'boarded' } : p));
  };

  const statusIcon = (s) => {
    if (s === 'boarded') return <FiCheckCircle style={{ color: 'var(--success)' }} />;
    if (s === 'checked_in') return <FiClock style={{ color: '#ff6f00' }} />;
    return <FiXCircle style={{ color: 'var(--danger)' }} />;
  };

  return (
    <div className="screen">
      <div className="screen-header">
        <button className="back-btn" onClick={() => navigate(-1)}><FiArrowLeft /></button>
        <h2>Passenger Manifest</h2>
      </div>
      <div className="screen-body">
        {/* Summary */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <div className="card" style={{ flex: 1, textAlign: 'center', padding: 10 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--success)' }}>{counts.boarded}</div>
            <div style={{ fontSize: 10, color: 'var(--text-light)' }}>Boarded</div>
          </div>
          <div className="card" style={{ flex: 1, textAlign: 'center', padding: 10 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#ff6f00' }}>{counts.waiting}</div>
            <div style={{ fontSize: 10, color: 'var(--text-light)' }}>Waiting</div>
          </div>
          <div className="card" style={{ flex: 1, textAlign: 'center', padding: 10 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--danger)' }}>{counts.noShow}</div>
            <div style={{ fontSize: 10, color: 'var(--text-light)' }}>No Show</div>
          </div>
          <div className="card" style={{ flex: 1, textAlign: 'center', padding: 10 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--primary)' }}>{passengers.length}</div>
            <div style={{ fontSize: 10, color: 'var(--text-light)' }}>Total</div>
          </div>
        </div>

        {/* Search */}
        <div className="search-box">
          <FiSearch />
          <input className="input" placeholder="Search name, booking code, seat..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 38 }} />
        </div>

        {/* Passengers */}
        {filtered.map(p => (
          <div key={p.id} className="passenger-card">
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
              {p.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                {p.name} {statusIcon(p.status)}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-light)' }}>{p.bookingCode}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
              <span className="badge badge-primary" style={{ fontSize: 12, fontWeight: 700 }}>{p.seat}</span>
              {p.status === 'checked_in' && (
                <button className="btn btn-sm btn-success" onClick={() => boardPassenger(p.id)} style={{ padding: '4px 10px', fontSize: 11 }}>
                  <FiUserCheck /> Board
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
