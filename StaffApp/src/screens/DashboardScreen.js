import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiCamera, FiAlertTriangle, FiMapPin, FiNavigation, FiPlay, FiSquare, FiAlertCircle } from 'react-icons/fi';
import { format } from 'date-fns';
import StaffTabs from '../components/StaffTabs';

const todaysTrips = [
  { id: 1, route: 'Manila → Naga City', bus: 'GVF-2847', departure: '06:00 AM', passengers: 38, capacity: 49, status: 'active' },
  { id: 2, route: 'Manila → Legazpi', bus: 'GVF-1122', departure: '08:00 PM', passengers: 0, capacity: 49, status: 'upcoming' },
];

export default function DashboardScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [clockedIn, setClockedIn] = useState(false);
  const [shiftStart, setShiftStart] = useState(null);

  const toggleShift = () => {
    if (!clockedIn) {
      setClockedIn(true);
      setShiftStart(new Date());
    } else {
      setClockedIn(false);
      setShiftStart(null);
      alert('Shift ended. Total hours logged.');
    }
  };

  return (
    <div className="screen">
      <div className="screen-header" style={{ justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 14, opacity: .8 }}>Good {new Date().getHours() < 12 ? 'morning' : 'afternoon'},</div>
          <h2>{user?.first_name} {user?.last_name}</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="badge" style={{ background: 'rgba(255,255,255,.2)', color: '#fff', textTransform: 'capitalize' }}>{user?.role}</span>
          <button className="sos-btn" onClick={() => alert('SOS alert sent to dispatch!')}>SOS</button>
        </div>
      </div>

      <div className="screen-body">
        {/* Shift Card */}
        <div className="shift-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 13, opacity: .8 }}>Shift Status</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{clockedIn ? 'On Duty' : 'Off Duty'}</div>
            </div>
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: clockedIn ? '#2ecc71' : '#e74c3c' }} />
          </div>
          {clockedIn && shiftStart && (
            <div style={{ fontSize: 12, opacity: .8, marginBottom: 10 }}>Started: {format(shiftStart, 'hh:mm a')}</div>
          )}
          <button onClick={toggleShift}
            style={{ width: '100%', padding: '10px', border: '1px solid rgba(255,255,255,.3)', background: 'rgba(255,255,255,.15)', color: '#fff', borderRadius: 10, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            {clockedIn ? <><FiSquare /> Clock Out</> : <><FiPlay /> Clock In</>}
          </button>
        </div>

        {/* Quick Actions */}
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Quick Actions</h3>
        <div className="action-grid">
          <div className="action-card" onClick={() => navigate('/scanner')}>
            <div className="action-icon" style={{ background: '#fce4ec', color: 'var(--accent)' }}><FiCamera /></div>
            <div className="action-label">Scan Ticket</div>
          </div>
          <div className="action-card" onClick={() => navigate('/incident')}>
            <div className="action-icon" style={{ background: '#fff3e0', color: '#e65100' }}><FiAlertTriangle /></div>
            <div className="action-label">Report Incident</div>
          </div>
          <div className="action-card" onClick={() => navigate('/geotag')}>
            <div className="action-icon" style={{ background: '#e8f5e9', color: 'var(--success)' }}><FiMapPin /></div>
            <div className="action-label">Geo Check-in</div>
          </div>
          <div className="action-card" onClick={() => navigate('/trips')}>
            <div className="action-icon" style={{ background: '#e8f0fe', color: 'var(--primary)' }}><FiNavigation /></div>
            <div className="action-label">My Trips</div>
          </div>
        </div>

        {/* Today's Trips */}
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Today's Trips</h3>
        {todaysTrips.map(trip => (
          <div key={trip.id} className="trip-card" onClick={() => navigate(`/trip/${trip.id}`, { state: { trip } })}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>{trip.route}</span>
              <span className={`badge ${trip.status === 'active' ? 'badge-success' : 'badge-info'}`}>{trip.status}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-light)', marginBottom: 8 }}>
              <span>Bus: {trip.bus}</span><span>{trip.departure}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${(trip.passengers / trip.capacity) * 100}%`, background: 'var(--primary)' }} />
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 4 }}>{trip.passengers}/{trip.capacity} passengers</div>
          </div>
        ))}
      </div>
      <StaffTabs />
    </div>
  );
}
