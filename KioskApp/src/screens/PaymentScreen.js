import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaArrowLeft, FaMoneyBillWave, FaWallet, FaMobileAlt,
  FaCreditCard, FaQrcode, FaCheckCircle
} from 'react-icons/fa';
import KioskHeader from '../components/KioskHeader';

const paymentMethods = [
  {
    id: 'cash',
    name: 'Cash Payment',
    desc: 'Pay at the cashier counter',
    icon: <FaMoneyBillWave />,
    color: '#2e7d32',
    bg: '#e8f5e9',
  },
  {
    id: 'wallet',
    name: 'GV Florida Wallet',
    desc: 'Pay with your digital wallet',
    icon: <FaWallet />,
    color: '#D90045',
    bg: '#fde8ee',
  },
  {
    id: 'gcash',
    name: 'GCash',
    desc: 'Scan QR to pay via GCash',
    icon: <FaMobileAlt />,
    color: '#0070f0',
    bg: '#e3f2fd',
  },
  {
    id: 'paymaya',
    name: 'Maya / PayMaya',
    desc: 'Scan QR to pay via Maya',
    icon: <FaMobileAlt />,
    color: '#00b300',
    bg: '#e8f5e9',
  },
  {
    id: 'card',
    name: 'Credit / Debit Card',
    desc: 'Tap or insert your card',
    icon: <FaCreditCard />,
    color: '#ff6f00',
    bg: '#fff3e0',
  },
];

export default function PaymentScreen({ booking, setBooking }) {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const serviceFee = 20;
  const total = booking.totalFare + serviceFee;

  const handlePay = () => {
    if (!selectedMethod) return;

    if (selectedMethod === 'gcash' || selectedMethod === 'paymaya') {
      setShowQR(true);
      // Simulate QR payment after 3 seconds
      setTimeout(() => {
        completePayment();
      }, 3000);
      return;
    }

    setProcessing(true);
    // Simulate processing
    setTimeout(() => {
      completePayment();
    }, 2000);
  };

  const completePayment = () => {
    const code = 'GVF-' + Date.now().toString(36).toUpperCase().slice(-8);
    setBooking(prev => ({
      ...prev,
      paymentMethod: selectedMethod,
      bookingCode: code,
    }));
    setProcessing(false);
    setShowQR(false);
    navigate('/ticket');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <KioskHeader />
      <div className="kiosk-screen fade-in" style={{ display: 'flex', gap: 32 }}>
        {/* Left: Payment Methods */}
        <div style={{ flex: 1 }}>
          <button className="back-btn" onClick={() => navigate('/passenger-info')}>
            <FaArrowLeft /> Back
          </button>

          <h1 className="screen-title">Payment Method</h1>
          <p className="screen-subtitle">Choose how you'd like to pay</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {paymentMethods.map(method => (
              <div
                key={method.id}
                className={`payment-option ${selectedMethod === method.id ? 'selected' : ''}`}
                onClick={() => setSelectedMethod(method.id)}
              >
                <div className="payment-icon" style={{ background: method.bg, color: method.color }}>
                  {method.icon}
                </div>
                <div className="payment-info" style={{ flex: 1 }}>
                  <h3>{method.name}</h3>
                  <p>{method.desc}</p>
                </div>
                {selectedMethod === method.id && (
                  <FaCheckCircle style={{ color: '#D90045', fontSize: 24 }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Order Summary */}
        <div style={{ width: 360 }}>
          <div className="kiosk-card" style={{ position: 'sticky', top: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Order Summary</h3>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 13, color: '#9e9e9e' }}>Route</div>
              <div style={{ fontWeight: 600 }}>Manila → {booking.destination?.name}</div>
            </div>

            <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 13, color: '#9e9e9e' }}>Departure</div>
                <div style={{ fontWeight: 600 }}>{booking.trip?.departure}</div>
              </div>
              <div>
                <div style={{ fontSize: 13, color: '#9e9e9e' }}>Bus</div>
                <div style={{ fontWeight: 600 }}>{booking.trip?.busType}</div>
              </div>
            </div>

            <div style={{ fontSize: 13, color: '#9e9e9e', marginBottom: 4 }}>Seats</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
              {booking.seats.map(s => (
                <span key={s} className="badge primary" style={{ fontSize: 14, fontWeight: 700 }}>
                  {s}
                </span>
              ))}
            </div>

            <div className="divider" />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: '#757575' }}>Base Fare ({booking.seats.length}x)</span>
              <span style={{ fontWeight: 600 }}>₱{booking.totalFare}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: '#757575' }}>Service Fee</span>
              <span style={{ fontWeight: 600 }}>₱{serviceFee}</span>
            </div>

            <div className="divider" />

            <div style={{
              display: 'flex', justifyContent: 'space-between',
              background: '#fde8ee', padding: '14px 16px', borderRadius: 10, marginBottom: 20
            }}>
              <span style={{ fontSize: 18, fontWeight: 700 }}>Total</span>
              <span style={{ fontSize: 28, fontWeight: 800, color: '#D90045' }}>₱{total}</span>
            </div>

            <button
              className="touch-btn large full accent"
              disabled={!selectedMethod || processing}
              onClick={handlePay}
            >
              {processing ? (
                <>
                  <div className="spinner" style={{ width: 24, height: 24, borderWidth: 3 }} />
                  Processing...
                </>
              ) : selectedMethod === 'cash' ? (
                'Reserve & Pay at Counter'
              ) : (
                `Pay ₱${total}`
              )}
            </button>

            {selectedMethod === 'cash' && (
              <div style={{
                marginTop: 12, padding: '10px 16px', borderRadius: 10,
                background: '#fff3e0', fontSize: 13, color: '#e65100', textAlign: 'center'
              }}>
                Please proceed to the cashier to complete payment within 30 minutes
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QR Payment Modal */}
      {showQR && (
        <div className="modal-overlay">
          <div className="modal-content">
            <FaQrcode style={{ fontSize: 48, color: '#D90045', marginBottom: 16 }} />
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
              Scan to Pay with {selectedMethod === 'gcash' ? 'GCash' : 'Maya'}
            </h2>
            <p style={{ color: '#757575', marginBottom: 24 }}>
              Open your {selectedMethod === 'gcash' ? 'GCash' : 'Maya'} app and scan the QR code
            </p>

            <div style={{
              background: '#f5f5f5', padding: 24, borderRadius: 16,
              display: 'inline-block', marginBottom: 24
            }}>
              <div style={{
                width: 180, height: 180, background: '#212121',
                borderRadius: 8, display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: 'white', fontSize: 48
              }}>
                <FaQrcode />
              </div>
            </div>

            <div style={{ fontSize: 28, fontWeight: 800, color: '#D90045', marginBottom: 8 }}>
              ₱{total}
            </div>

            <div className="pulse" style={{ color: '#ff6f00', fontWeight: 600 }}>
              Waiting for payment...
            </div>

            <button
              className="touch-btn outline full"
              style={{ marginTop: 20 }}
              onClick={() => setShowQR(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
