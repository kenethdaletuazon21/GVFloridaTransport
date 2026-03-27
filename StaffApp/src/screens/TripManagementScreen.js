import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiClock, FiUsers, FiDollarSign, FiPlay, FiSquare } from 'react-icons/fi';
import StaffTabs from '../components/StaffTabs';

const demoTrips = [
  { id: 1, route: 'Manila → Naga City', bus: 'GVF-2847', departure: '06:00 AM', arrival: '02:00 PM', passengers: 38, capacity: 49, revenue: 28500, status: 'active' },
  { id: 2, route: 'Manila → Legazpi', bus: 'GVF-1122', departure: '08:00 PM', arrival: '06:00 AM', passengers: 22, capacity: 49, revenue: 16500, status: 'upcoming' },
  { id: 3, route: 'Manila → Daet', bus: 'GVF-3391', departure: '10:00 PM', arrival: '04:00 AM', passengers: 45, capacity: 49, revenue: 30600, status: 'upcoming' },
  { id: 4, route: 'Manila → Sorsogon', bus: 'GVF-4420', departure: '05:00 AM', arrival: '03:00 PM', passengers: 49, capacity: 49, revenue: 51450, status: 'completed' },
  { id: 5, route: 'Manila → Naga City', bus: 'GVF-2100', departure: '07:00 AM', arrival: '03:00 PM', passengers: 47, capacity: 49, revenue: 35250, status: 'completed' },
];

export default function TripManagementScreen() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('active');

  const filtered = demoTrips.filter(t => t.status === tab);

  return (
    <div className="screen">
      <div className="screen-header"><h2>Trip Management</h2></div>
      <div className="screen-body">
        <div className="tab-row">
          {['active', 'upcoming', 'completed'].map(t => (
            <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {filtered.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-light)' }}>No {tab} trips</div>}

        {filtered.map(trip => (
          <div key={trip.id} className="trip-card" onClick={() => navigate(`/trip/${trip.id}`, { state: { trip } })}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>{trip.route}</span>
              <span className={`badge ${trip.status === 'active' ? 'badge-success' : trip.status === 'upcoming' ? 'badge-info' : 'badge-primary'}`}>{trip.status}</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-light)', marginBottom: 8 }}>Bus: {trip.bus}</div>
            <div style={{ display: 'flex', gap: 16, fontSize: 13, marginBottom: 8 }}>
              <span><FiClock style={{ marginRight: 4 }} />{trip.departure} → {trip.arrival}</span>
            </div>
            <div className="progress-bar" style={{ marginBottom: 6 }}>
              <div className="progress-fill" style={{ width: `${(trip.passengers / trip.capacity)*100}%`, background: trip.passengers >= trip.capacity ? 'var(--success)' : 'var(--primary)' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-light)' }}>
              <span><FiUsers style={{ marginRight: 4 }} />{trip.passengers}/{trip.capacity}</span>
              <span><FiDollarSign style={{ marginRight: 2 }} />₱{trip.revenue.toLocaleString()}</span>
            </div>

            {tab === 'active' && (
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <button className="btn btn-sm btn-outline" onClick={e => { e.stopPropagation(); navigate('/passengers', { state: { trip } }); }}>Manifest</button>
                <button className="btn btn-sm btn-danger" onClick={e => { e.stopPropagation(); alert('Trip ended'); }}><FiSquare /> End Trip</button>
              </div>
            )}
            {tab === 'upcoming' && (
              <div style={{ marginTop: 10 }}>
                <button className="btn btn-sm btn-success" onClick={e => { e.stopPropagation(); alert('Trip started!'); }}><FiPlay /> Start Trip</button>
              </div>
            )}
          </div>
        ))}
      </div>
      <StaffTabs />
    </div>
  );
}
