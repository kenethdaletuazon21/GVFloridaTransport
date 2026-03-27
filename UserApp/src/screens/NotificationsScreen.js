import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiBell, FiAlertCircle, FiCheckCircle, FiClock, FiTag } from 'react-icons/fi';

const notifications = [
  { id: 1, type: 'booking', icon: <FiCheckCircle />, color: 'var(--success)', title: 'Booking Confirmed', message: 'Your trip to Naga City on Jan 28 has been confirmed. Booking code: GVF-20250001', time: '2 hours ago', read: false },
  { id: 2, type: 'promo', icon: <FiTag />, color: '#ff6f00', title: '20% Off Weekend Trips!', message: 'Book any weekend trip this January and get 20% discount. Use code: GVWEEKEND', time: '5 hours ago', read: false },
  { id: 3, type: 'alert', icon: <FiAlertCircle />, color: 'var(--primary)', title: 'Schedule Change', message: 'Your 8:00 PM trip to Legazpi has been moved to 8:30 PM. We apologize for the inconvenience.', time: '1 day ago', read: true },
  { id: 4, type: 'reminder', icon: <FiClock />, color: '#6c63ff', title: 'Trip Reminder', message: 'Your trip to Naga City departs tomorrow at 6:00 AM from Cubao Terminal. Please arrive 30 minutes early.', time: '1 day ago', read: true },
  { id: 5, type: 'booking', icon: <FiCheckCircle />, color: 'var(--success)', title: 'Refund Processed', message: 'Your refund of ₱750 for cancelled Legazpi trip has been credited to your GV Wallet.', time: '3 days ago', read: true },
  { id: 6, type: 'promo', icon: <FiTag />, color: '#ff6f00', title: 'New Route Available', message: 'GV Florida now serves Tabaco City! Book your first trip and get ₱50 off.', time: '5 days ago', read: true },
];

export default function NotificationsScreen() {
  const navigate = useNavigate();

  return (
    <div className="screen">
      <div className="screen-header">
        <button className="back-btn" onClick={() => navigate(-1)}><FiArrowLeft /></button>
        <h2>Notifications</h2>
      </div>
      <div className="screen-body">
        {notifications.map(n => (
          <div key={n.id} className="notification" style={{ background: n.read ? '#fff' : '#fff8f9' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${n.color}15`, color: n.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
              {n.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{n.title}</span>
                {!n.read && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0 }} />}
              </div>
              <div style={{ fontSize: 13, color: '#666', lineHeight: 1.4, marginBottom: 4 }}>{n.message}</div>
              <div style={{ fontSize: 11, color: '#aaa' }}>{n.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
