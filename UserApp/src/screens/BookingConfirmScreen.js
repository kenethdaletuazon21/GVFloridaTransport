import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiCheckCircle, FiHome, FiMap } from 'react-icons/fi';
import { format } from 'date-fns';

export default function BookingConfirmScreen() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { destination, trip, seats, bookingCode, total, paymentMethod } = state || {};

  return (
    <div className="screen">
      <div className="confirm-screen">
        <div className="confirm-icon" style={{ background: '#e8f5e9', color: 'var(--success)' }}><FiCheckCircle /></div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--success)', marginBottom: 4 }}>
          {paymentMethod === 'cash' ? 'Reservation Confirmed!' : 'Booking Confirmed!'}
        </h2>
        <p style={{ color: '#777', fontSize: 14, marginBottom: 20 }}>
          {paymentMethod === 'cash' ? 'Pay at the counter before departure' : 'Your ticket has been issued'}
        </p>

        <div style={{ background: 'var(--primary)', color: '#fff', padding: '10px 24px', borderRadius: 10, fontSize: 20, fontWeight: 800, letterSpacing: 2, marginBottom: 20 }}>
          {bookingCode}
        </div>

        <div className="card" style={{ width: '100%', textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <div><div style={{ fontSize: 11, color: '#999' }}>Departure</div><div style={{ fontSize: 18, fontWeight: 700 }}>{trip?.departure}</div><div style={{ fontSize: 11, color: '#999' }}>Manila</div></div>
            <div style={{ textAlign: 'right' }}><div style={{ fontSize: 11, color: '#999' }}>Arrival</div><div style={{ fontSize: 18, fontWeight: 700 }}>{trip?.arrival}</div><div style={{ fontSize: 11, color: '#999' }}>{destination?.name}</div></div>
          </div>
          <div className="divider" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 13 }}>
            <div><span style={{ color: '#999' }}>Date</span><br /><strong>{format(new Date(), 'MMM dd, yyyy')}</strong></div>
            <div><span style={{ color: '#999' }}>Bus</span><br /><strong>{trip?.busNumber}</strong></div>
            <div><span style={{ color: '#999' }}>Seats</span><br /><strong>{seats?.join(', ')}</strong></div>
            <div><span style={{ color: '#999' }}>Total</span><br /><strong style={{ color: 'var(--primary)' }}>₱{total}</strong></div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, width: '100%', marginTop: 20 }}>
          <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => navigate('/my-trips')}><FiMap /> My Trips</button>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => navigate('/')}><FiHome /> Home</button>
        </div>
      </div>
    </div>
  );
}
