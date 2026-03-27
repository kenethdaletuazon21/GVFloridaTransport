import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiArrowLeft, FiUsers, FiDollarSign, FiClock, FiActivity, FiMapPin, FiAlertTriangle, FiPlay, FiSquare } from 'react-icons/fi';

export default function TripDetailScreen() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const trip = state?.trip || { route: 'Manila → Naga City', bus: 'GVF-2847', departure: '06:00 AM', arrival: '02:00 PM', passengers: 38, capacity: 49, revenue: 28500, status: 'active' };

  return (
    <div className="screen">
      <div className="screen-header">
        <button className="back-btn" onClick={() => navigate(-1)}><FiArrowLeft /></button>
        <h2>Trip Details</h2>
      </div>
      <div className="screen-body">
        <div className="card" style={{ background: 'var(--primary)', color: '#fff', marginBottom: 16 }}>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{trip.route}</div>
          <div style={{ fontSize: 13, opacity: .8, marginBottom: 12 }}>Bus: {trip.bus}</div>
          <span className="badge" style={{ background: 'rgba(255,255,255,.2)', color: '#fff' }}>{trip.status}</span>
        </div>

        <div className="stat-grid">
          <div className="stat-card"><FiUsers style={{ color: 'var(--primary)', fontSize: 20, marginBottom: 4 }} /><div className="stat-value">{trip.passengers}</div><div className="stat-label">Passengers</div></div>
          <div className="stat-card"><FiDollarSign style={{ color: 'var(--success)', fontSize: 20, marginBottom: 4 }} /><div className="stat-value" style={{ color: 'var(--success)' }}>₱{(trip.revenue || 0).toLocaleString()}</div><div className="stat-label">Revenue</div></div>
          <div className="stat-card"><FiClock style={{ color: '#ff6f00', fontSize: 20, marginBottom: 4 }} /><div className="stat-value" style={{ color: '#ff6f00', fontSize: 18 }}>{trip.departure}</div><div className="stat-label">Departure</div></div>
          <div className="stat-card"><FiActivity style={{ color: '#6c63ff', fontSize: 20, marginBottom: 4 }} /><div className="stat-value" style={{ color: '#6c63ff', fontSize: 18 }}>{trip.arrival}</div><div className="stat-label">Arrival</div></div>
        </div>

        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Quick Actions</h3>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {[
            { icon: <FiUsers />, label: 'Passenger Manifest', color: 'var(--primary)', action: () => navigate('/passengers', { state: { trip } }) },
            { icon: <FiMapPin />, label: 'Geo Check-in', color: 'var(--success)', action: () => navigate('/geotag', { state: { trip } }) },
            { icon: <FiAlertTriangle />, label: 'Report Incident', color: '#e65100', action: () => navigate('/incident', { state: { trip } }) },
          ].map((item, i) => (
            <div key={i} onClick={item.action}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: i < 2 ? '1px solid var(--border)' : 'none', cursor: 'pointer' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${item.color}15`, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                {item.icon}
              </div>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{item.label}</span>
              <span style={{ color: '#ccc' }}>›</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          {trip.status === 'upcoming' && <button className="btn btn-success" style={{ flex: 1 }} onClick={() => alert('Trip started!')}><FiPlay /> Start Trip</button>}
          {trip.status === 'active' && <button className="btn btn-danger" style={{ flex: 1 }} onClick={() => alert('Trip ended!')}><FiSquare /> End Trip</button>}
        </div>
      </div>
    </div>
  );
}
