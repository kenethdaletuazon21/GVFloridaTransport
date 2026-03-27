import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiArrowLeft, FiSearch, FiClock, FiMapPin } from 'react-icons/fi';
import { format, addDays } from 'date-fns';

const DESTINATIONS = [
  { id: 1, name: 'Tuguegarao', province: 'Cagayan', duration: '10-12 hrs', price: 850 },
  { id: 2, name: 'Tabuk', province: 'Kalinga', duration: '12-14 hrs', price: 950 },
  { id: 3, name: 'Baguio', province: 'Benguet', duration: '5-6 hrs', price: 500 },
  { id: 4, name: 'Santiago', province: 'Isabela', duration: '8-9 hrs', price: 700 },
  { id: 5, name: 'Cauayan', province: 'Isabela', duration: '8-10 hrs', price: 720 },
  { id: 6, name: 'Ilagan', province: 'Isabela', duration: '9-11 hrs', price: 780 },
  { id: 7, name: 'Solano', province: 'Nueva Vizcaya', duration: '7-8 hrs', price: 620 },
  { id: 8, name: 'Cabanatuan', province: 'Nueva Ecija', duration: '3-4 hrs', price: 280 },
];

export default function SearchScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState(location.state?.destination || '');
  const [selectedDate, setSelectedDate] = useState(0);

  const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));
  const filtered = DESTINATIONS.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.province.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="screen">
      <div className="screen-header">
        <button className="back-btn" onClick={() => navigate('/')}><FiArrowLeft /></button>
        <h1>Search Trips</h1>
      </div>
      <div className="screen-body">
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <FiSearch style={{ position: 'absolute', left: 14, top: 15, color: '#999' }} />
          <input className="input-field" placeholder="Search destination..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 40 }} />
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 }}>
          {dates.map((d, i) => (
            <button key={i} onClick={() => setSelectedDate(i)} style={{
              padding: '10px 14px', borderRadius: 10, minWidth: 70, textAlign: 'center', cursor: 'pointer', flexShrink: 0, fontFamily: 'inherit',
              border: selectedDate === i ? '2px solid var(--primary)' : '2px solid #eee',
              background: selectedDate === i ? 'var(--primary)' : '#fff',
              color: selectedDate === i ? '#fff' : '#333',
            }}>
              <div style={{ fontSize: 11, opacity: .7 }}>{i === 0 ? 'Today' : format(d, 'EEE')}</div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{format(d, 'dd')}</div>
              <div style={{ fontSize: 10, opacity: .7 }}>{format(d, 'MMM')}</div>
            </button>
          ))}
        </div>

        <div className="section-title">Available Destinations</div>
        {filtered.map(dest => (
          <div key={dest.id} className="route-card" onClick={() => navigate('/booking', { state: { destination: dest, date: format(dates[selectedDate], 'yyyy-MM-dd') } })}>
            <div className="route-icon"><FiMapPin size={22} color="var(--primary)" /></div>
            <div className="route-info">
              <div className="route-name">Manila → {dest.name}</div>
              <div className="route-time"><FiClock size={12} /> {dest.duration} • {dest.province}</div>
            </div>
            <div className="route-price">₱{dest.price}</div>
          </div>
        ))}
        {filtered.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>No destinations found</div>}
      </div>
    </div>
  );
}
