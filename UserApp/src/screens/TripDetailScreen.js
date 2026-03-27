import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FiArrowLeft, FiMapPin, FiClock, FiUser, FiNavigation } from 'react-icons/fi';
import { format } from 'date-fns';

export default function TripDetailScreen() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const trip = state?.trip || { id: 0, destination: 'Unknown', date: new Date().toISOString(), departure: '--', arrival: '--', seats: [], status: 'upcoming', busNumber: 'GVF-0000', total: 0, bookingCode: 'GVF-000' };

  return (
    <div className="screen">
      <div className="screen-header">
        <button className="back-btn" onClick={() => navigate(-1)}><FiArrowLeft /></button>
        <h2>Trip Details</h2>
      </div>
      <div className="screen-body">
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <span className={`badge ${trip.status === 'upcoming' ? 'badge-primary' : 'badge-success'}`} style={{ fontSize: 13, padding: '6px 16px' }}>
            {trip.status?.toUpperCase()}
          </span>
        </div>

        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: '#999' }}>Booking Code</div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 2, color: 'var(--primary)' }}>{trip.bookingCode}</div>
          </div>
          <div className="divider" />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <div><div style={{ fontSize: 11, color: '#999' }}>From</div><div style={{ fontWeight: 700 }}>Manila</div><div style={{ fontSize: 12, color: '#999' }}>Cubao Terminal</div></div>
            <div style={{ color: '#ccc', fontSize: 24 }}>→</div>
            <div style={{ textAlign: 'right' }}><div style={{ fontSize: 11, color: '#999' }}>To</div><div style={{ fontWeight: 700 }}>{trip.destination}</div></div>
          </div>
          <div className="divider" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13 }}>
            <div><FiClock style={{ marginRight: 4, color: 'var(--primary)' }} /><span style={{ color: '#999' }}>Departure</span><br /><strong>{trip.departure}</strong></div>
            <div><FiClock style={{ marginRight: 4, color: 'var(--success)' }} /><span style={{ color: '#999' }}>Arrival</span><br /><strong>{trip.arrival}</strong></div>
            <div><FiMapPin style={{ marginRight: 4, color: '#ff6f00' }} /><span style={{ color: '#999' }}>Date</span><br /><strong>{format(new Date(trip.date), 'MMM dd, yyyy')}</strong></div>
            <div><FiUser style={{ marginRight: 4, color: '#6c63ff' }} /><span style={{ color: '#999' }}>Bus</span><br /><strong>{trip.busNumber}</strong></div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Passenger & Seat</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 4 }}>
            <span style={{ color: '#666' }}>Seats</span><strong>{trip.seats?.join(', ')}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
            <span style={{ color: '#666' }}>Passengers</span><strong>{trip.seats?.length}</strong>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Payment Summary</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 4 }}>
            <span style={{ color: '#666' }}>Fare × {trip.seats?.length}</span><span>₱{trip.total - 20}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 4 }}>
            <span style={{ color: '#666' }}>Service Fee</span><span>₱20</span>
          </div>
          <div className="divider" />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700 }}>
            <span>Total</span><span style={{ color: 'var(--primary)' }}>₱{trip.total?.toLocaleString()}</span>
          </div>
        </div>

        {trip.status === 'upcoming' && (
          <button className="btn btn-primary" style={{ width: '100%' }}
            onClick={() => navigate('/tracking', { state: { trip } })}>
            <FiNavigation style={{ marginRight: 6 }} /> Track Bus
          </button>
        )}
      </div>
    </div>
  );
}
