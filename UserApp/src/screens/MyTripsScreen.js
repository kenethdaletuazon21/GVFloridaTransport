import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiMapPin, FiClock, FiChevronRight } from 'react-icons/fi';
import { format, addDays, subDays } from 'date-fns';
import BottomTabs from '../components/BottomTabs';

const demoTrips = [
  { id: 1, destination: 'Naga City', date: format(addDays(new Date(), 1), 'yyyy-MM-dd'), departure: '06:00 AM', arrival: '02:00 PM', seats: ['12A', '12B'], status: 'upcoming', busNumber: 'GVF-2847', total: 1500, bookingCode: 'GVF-20250001' },
  { id: 2, destination: 'Legazpi City', date: format(addDays(new Date(), 3), 'yyyy-MM-dd'), departure: '08:00 PM', arrival: '06:00 AM', seats: ['5A'], status: 'upcoming', busNumber: 'GVF-1122', total: 950, bookingCode: 'GVF-20250002' },
  { id: 3, destination: 'Daet', date: format(subDays(new Date(), 5), 'yyyy-MM-dd'), departure: '10:00 PM', arrival: '04:00 AM', seats: ['8C'], status: 'completed', busNumber: 'GVF-3391', total: 680, bookingCode: 'GVF-20240098' },
  { id: 4, destination: 'Sorsogon', date: format(subDays(new Date(), 12), 'yyyy-MM-dd'), departure: '09:00 PM', arrival: '07:00 AM', seats: ['3A', '3B'], status: 'completed', busNumber: 'GVF-4420', total: 2100, bookingCode: 'GVF-20240085' },
];

export default function MyTripsScreen() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('upcoming');

  const filtered = demoTrips.filter(t => t.status === tab);

  return (
    <div className="screen">
      <div className="screen-header"><h2>My Trips</h2></div>
      <div className="screen-body" style={{ paddingBottom: 70 }}>
        <div style={{ display: 'flex', gap: 0, marginBottom: 16, background: '#f0f0f0', borderRadius: 10, padding: 3 }}>
          {['upcoming', 'completed'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ flex: 1, padding: '10px 0', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: 'pointer',
                background: tab === t ? '#fff' : 'transparent', color: tab === t ? 'var(--primary)' : '#888',
                boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,.1)' : 'none' }}>
              {t === 'upcoming' ? 'Upcoming' : 'Completed'}
            </button>
          ))}
        </div>

        {filtered.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>No {tab} trips</div>}

        {filtered.map(trip => (
          <div key={trip.id} className="card" style={{ cursor: 'pointer', marginBottom: 12 }}
            onClick={() => navigate(`/trip/${trip.id}`, { state: { trip } })}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontWeight: 700, fontSize: 16 }}>{trip.destination}</span>
              <span className={`badge ${trip.status === 'upcoming' ? 'badge-primary' : 'badge-success'}`}>{trip.status}</span>
            </div>
            <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#666', marginBottom: 8 }}>
              <span><FiCalendar style={{ marginRight: 4 }} />{format(new Date(trip.date), 'MMM dd, yyyy')}</span>
              <span><FiClock style={{ marginRight: 4 }} />{trip.departure}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
              <span style={{ color: '#999' }}><FiMapPin style={{ marginRight: 4 }} />Seats: {trip.seats.join(', ')}</span>
              <span style={{ fontWeight: 700, color: 'var(--primary)' }}>₱{trip.total.toLocaleString()} <FiChevronRight /></span>
            </div>
          </div>
        ))}
      </div>
      <BottomTabs />
    </div>
  );
}
