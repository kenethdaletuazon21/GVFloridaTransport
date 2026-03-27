import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiArrowLeft, FiUser } from 'react-icons/fi';

export default function SeatSelectScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { destination, date, trip } = location.state || {};
  const [selected, setSelected] = useState([]);

  const totalSeats = trip?.totalSeats || 45;
  const cols = 4;
  const rows = Math.ceil(totalSeats / cols);

  const occupied = useMemo(() => {
    const occ = new Set();
    const count = Math.floor(totalSeats * 0.35);
    while (occ.size < count) occ.add(Math.floor(Math.random() * totalSeats) + 1);
    return occ;
  }, [totalSeats]);

  const toggleSeat = (num) => {
    if (occupied.has(num)) return;
    setSelected(prev => prev.includes(num) ? prev.filter(s => s !== num) : prev.length >= 4 ? prev : [...prev, num]);
  };

  if (!trip) { navigate('/search'); return null; }

  return (
    <div className="screen">
      <div className="screen-header">
        <button className="back-btn" onClick={() => navigate(-1)}><FiArrowLeft /></button>
        <h1>Select Seat</h1>
      </div>
      <div className="screen-body">
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <span className="badge badge-dark">{trip.busNumber}</span>
          <span style={{ fontSize: 13, color: '#666', marginLeft: 8 }}>{trip.busType} • Max 4 seats</span>
        </div>

        <div className="seat-grid">
          <div style={{ background: '#e0e0e0', borderRadius: 6, padding: '6px 16px', fontSize: 12, fontWeight: 600, color: '#888', marginBottom: 8 }}>🚌 DRIVER</div>
          {Array.from({ length: rows }).map((_, row) => (
            <div className="seat-row" key={row}>
              {Array.from({ length: cols }).map((_, col) => {
                const num = row * cols + col + 1;
                if (num > totalSeats) return <div key={col} className="seat" style={{ visibility: 'hidden' }} />;
                const isOcc = occupied.has(num);
                const isSel = selected.includes(num);
                return (
                  <React.Fragment key={col}>
                    {col === 2 && <div className="seat seat-aisle" />}
                    <div className={`seat ${isOcc ? 'seat-occupied' : isSel ? 'seat-selected' : 'seat-available'}`} onClick={() => toggleSeat(num)}>
                      {isOcc ? <FiUser size={14} /> : num}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, fontSize: 12, color: '#888', marginBottom: 16 }}>
          <span><span style={{ display: 'inline-block', width: 16, height: 16, borderRadius: 4, background: '#e8f5e9', border: '2px solid #a5d6a7', verticalAlign: 'middle', marginRight: 4 }} />Available</span>
          <span><span style={{ display: 'inline-block', width: 16, height: 16, borderRadius: 4, background: 'var(--primary)', verticalAlign: 'middle', marginRight: 4 }} />Selected</span>
          <span><span style={{ display: 'inline-block', width: 16, height: 16, borderRadius: 4, background: '#eee', verticalAlign: 'middle', marginRight: 4 }} />Taken</span>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: '#777' }}>Seats</span>
            <span style={{ fontWeight: 600 }}>{selected.length > 0 ? selected.sort((a, b) => a - b).join(', ') : 'None'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: '#777' }}>Fare per seat</span>
            <span style={{ fontWeight: 600 }}>₱{trip.price}</span>
          </div>
          <div className="divider" />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 16, fontWeight: 700 }}>Total</span>
            <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--primary)' }}>₱{trip.price * selected.length}</span>
          </div>
        </div>

        <button className="btn btn-primary" disabled={selected.length === 0} onClick={() => navigate('/payment', { state: { destination, date, trip, seats: selected, totalFare: trip.price * selected.length } })}>
          Continue to Payment
        </button>
      </div>
    </div>
  );
}
