import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiArrowLeft, FiClock, FiTruck, FiWifi, FiWind, FiChevronRight } from 'react-icons/fi';

const BUS_TYPES = [
  { type: 'Deluxe', multiplier: 1.5, amenities: ['AC', 'WiFi', 'Reclining'], seats: 32 },
  { type: 'Super Deluxe', multiplier: 1.8, amenities: ['AC', 'WiFi', 'Reclining', 'CR', 'TV'], seats: 28 },
  { type: 'Regular AC', multiplier: 1.0, amenities: ['AC'], seats: 45 },
  { type: 'Regular', multiplier: 0.8, amenities: [], seats: 49 },
];

const DEPARTURES = ['04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '18:00', '20:00', '22:00'];

export default function BookingScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { destination, date } = location.state || {};
  const [filter, setFilter] = useState('All');

  if (!destination) { navigate('/search'); return null; }

  const trips = DEPARTURES.map((dep, i) => {
    const bt = BUS_TYPES[i % BUS_TYPES.length];
    const dh = 6 + (i % 5);
    const ah = (parseInt(dep) + dh) % 24;
    const available = Math.floor(Math.random() * bt.seats * 0.6) + 5;
    return { id: i + 1, busNumber: `GVF-${100 + i}`, busType: bt.type, departure: dep, arrival: `${String(ah).padStart(2, '0')}:00`, duration: `${dh}h`, price: Math.round(destination.price * bt.multiplier), amenities: bt.amenities, totalSeats: bt.seats, available };
  });

  const filtered = filter === 'All' ? trips : trips.filter(t => t.busType === filter);

  const selectTrip = (trip) => {
    navigate('/seat-select', { state: { destination, date, trip } });
  };

  return (
    <div className="screen">
      <div className="screen-header">
        <button className="back-btn" onClick={() => navigate(-1)}><FiArrowLeft /></button>
        <h1>Manila → {destination.name}</h1>
      </div>
      <div className="screen-body">
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto' }}>
          {['All', ...BUS_TYPES.map(b => b.type)].map(t => (
            <button key={t} onClick={() => setFilter(t)} style={{
              padding: '8px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
              background: filter === t ? 'var(--primary)' : '#fff', color: filter === t ? '#fff' : '#666',
              border: filter === t ? 'none' : '1px solid #ddd', whiteSpace: 'nowrap', flexShrink: 0,
            }}>{t}</button>
          ))}
        </div>

        {filtered.map(trip => (
          <div key={trip.id} className="trip-card" onClick={() => selectTrip(trip)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span className="badge badge-primary">{trip.busType}</span>
              <span style={{ fontSize: 12, color: '#999' }}><FiTruck size={12} /> {trip.busNumber}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div><div style={{ fontSize: 20, fontWeight: 700 }}>{trip.departure}</div><div style={{ fontSize: 11, color: '#999' }}>Manila</div></div>
              <div style={{ flex: 1, textAlign: 'center', color: '#bbb' }}>
                <div style={{ height: 1, background: '#e0e0e0', margin: '0 8px' }} />
                <span style={{ fontSize: 11 }}><FiClock size={10} /> {trip.duration}</span>
              </div>
              <div style={{ textAlign: 'right' }}><div style={{ fontSize: 20, fontWeight: 700 }}>{trip.arrival}</div><div style={{ fontSize: 11, color: '#999' }}>{destination.name}</div></div>
            </div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
              {trip.amenities.map((a, i) => (
                <span key={i} style={{ fontSize: 10, color: '#777', background: '#f5f5f5', padding: '2px 8px', borderRadius: 6 }}>
                  {a === 'AC' ? <FiWind size={10} /> : a === 'WiFi' ? <FiWifi size={10} /> : null} {a}
                </span>
              ))}
            </div>
            <div className="trip-bottom">
              <span className="trip-price">₱{trip.price}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="trip-seats" style={{ color: trip.available < 10 ? 'var(--danger)' : 'var(--success)' }}>{trip.available} seats</span>
                <FiChevronRight color="var(--primary)" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
