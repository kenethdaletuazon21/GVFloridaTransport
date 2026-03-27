import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiArrowLeft, FiDollarSign, FiCreditCard, FiSmartphone, FiCheckCircle } from 'react-icons/fi';

const METHODS = [
  { id: 'wallet', name: 'GV Wallet', desc: 'Pay with balance', icon: <FiCreditCard />, color: 'var(--primary)', bg: '#fde8ee' },
  { id: 'gcash', name: 'GCash', desc: 'Scan to pay', icon: <FiSmartphone />, color: '#0070f0', bg: '#e3f2fd' },
  { id: 'cash', name: 'Cash', desc: 'Pay at counter', icon: <FiDollarSign />, color: 'var(--success)', bg: '#e8f5e9' },
];

export default function PaymentScreen() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { destination, trip, seats, totalFare } = state || {};
  const [method, setMethod] = useState(null);
  const [processing, setProcessing] = useState(false);

  if (!trip) { navigate('/search'); return null; }

  const serviceFee = 20;
  const total = totalFare + serviceFee;

  const handlePay = () => {
    if (!method) return;
    setProcessing(true);
    setTimeout(() => {
      const code = 'GVF-' + Date.now().toString(36).toUpperCase().slice(-8);
      navigate('/booking-confirm', { state: { ...state, bookingCode: code, paymentMethod: method, total } });
    }, 1500);
  };

  return (
    <div className="screen">
      <div className="screen-header">
        <button className="back-btn" onClick={() => navigate(-1)}><FiArrowLeft /></button>
        <h1>Payment</h1>
      </div>
      <div className="screen-body">
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: '#999' }}>Route</div>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Manila → {destination?.name}</div>
          <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
            <div><span style={{ color: '#999' }}>Departure </span><strong>{trip.departure}</strong></div>
            <div><span style={{ color: '#999' }}>Bus </span><strong>{trip.busType}</strong></div>
          </div>
          <div style={{ fontSize: 13, marginTop: 8 }}><span style={{ color: '#999' }}>Seats </span><strong>{seats?.sort((a, b) => a - b).join(', ')}</strong></div>
        </div>

        <div className="section-title">Payment Method</div>
        {METHODS.map(m => (
          <div key={m.id} className={`payment-method ${method === m.id ? 'selected' : ''}`} onClick={() => setMethod(m.id)}>
            <div className="payment-method-icon" style={{ background: m.bg, color: m.color }}>{m.icon}</div>
            <div className="payment-method-info"><h4>{m.name}</h4><p>{m.desc}</p></div>
            {method === m.id && <FiCheckCircle color="var(--primary)" size={20} />}
          </div>
        ))}

        <div className="card" style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}><span style={{ color: '#777' }}>Fare ({seats?.length}x)</span><span style={{ fontWeight: 600 }}>₱{totalFare}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}><span style={{ color: '#777' }}>Service Fee</span><span style={{ fontWeight: 600 }}>₱{serviceFee}</span></div>
          <div className="divider" />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: 16, fontWeight: 700 }}>Total</span><span style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary)' }}>₱{total}</span></div>
        </div>

        <button className="btn btn-primary" style={{ marginTop: 16 }} disabled={!method || processing} onClick={handlePay}>
          {processing ? 'Processing...' : method === 'cash' ? 'Reserve & Pay at Counter' : `Pay ₱${total}`}
        </button>
      </div>
    </div>
  );
}
