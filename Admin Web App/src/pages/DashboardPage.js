import React from 'react';
import { FiUsers, FiNavigation, FiDollarSign, FiTruck, FiTrendingUp, FiTrendingDown, FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const stats = [
  { icon: <FiUsers />, label: 'Total Users', value: '12,458', change: '+8.2%', positive: true, color: '#6c63ff', bg: '#ede7f6' },
  { icon: <FiNavigation />, label: 'Active Trips', value: '24', change: '+3', positive: true, color: '#00897b', bg: '#e0f2f1' },
  { icon: <FiDollarSign />, label: 'Revenue Today', value: '₱284,500', change: '+12.5%', positive: true, color: '#D90045', bg: '#fce4ec' },
  { icon: <FiTruck />, label: 'Fleet Active', value: '42/58', change: '-2', positive: false, color: '#f57c00', bg: '#fff3e0' },
];

const recentBookings = [
  { id: 'GVF-20250001', passenger: 'Juan Dela Cruz', route: 'Manila → Naga', date: 'Jan 28, 2025', amount: '₱750', status: 'confirmed' },
  { id: 'GVF-20250002', passenger: 'Maria Santos', route: 'Manila → Legazpi', date: 'Jan 28, 2025', amount: '₱950', status: 'confirmed' },
  { id: 'GVF-20250003', passenger: 'Pedro Reyes', route: 'Manila → Daet', date: 'Jan 28, 2025', amount: '₱680', status: 'pending' },
  { id: 'GVF-20250004', passenger: 'Ana Garcia', route: 'Manila → Sorsogon', date: 'Jan 27, 2025', amount: '₱1,050', status: 'completed' },
  { id: 'GVF-20250005', passenger: 'Jose Mendoza', route: 'Manila → Iriga', date: 'Jan 27, 2025', amount: '₱820', status: 'cancelled' },
];

const activeTrips = [
  { bus: 'GVF-2847', route: 'Manila → Naga City', driver: 'Carlos Reyes', departure: '06:00 AM', passengers: '38/49', progress: 62 },
  { bus: 'GVF-1122', route: 'Manila → Legazpi', driver: 'Roberto Cruz', departure: '05:30 AM', passengers: '45/49', progress: 78 },
  { bus: 'GVF-3391', route: 'Manila → Daet', driver: 'Miguel Torres', departure: '07:00 AM', passengers: '32/49', progress: 35 },
];

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <>
      <div className="topbar"><h2>Dashboard</h2><div style={{ fontSize: 13, color: 'var(--text-light)' }}>Welcome, Admin</div></div>
      <div className="page-content">
        {/* Stats */}
        <div className="stats-row">
          {stats.map((s, i) => (
            <div key={i} className="stat-card">
              <div className="stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
              <div className={`stat-change ${s.positive ? 'positive' : 'negative'}`}>
                {s.positive ? <FiTrendingUp style={{ marginRight: 4 }} /> : <FiTrendingDown style={{ marginRight: 4 }} />}
                {s.change} from yesterday
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
          {/* Revenue Chart */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Revenue Overview</h3>
              <button className="btn btn-sm btn-outline" onClick={() => navigate('/revenue')}>View All <FiArrowRight /></button>
            </div>
            <div className="chart-placeholder">
              <div style={{ textAlign: 'center' }}>
                <FiDollarSign style={{ fontSize: 32, marginBottom: 8 }} />
                <div>₱1,842,500 this month</div>
                <div style={{ fontSize: 12, marginTop: 4 }}>+15.3% vs last month</div>
              </div>
            </div>
          </div>

          {/* Active Trips */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Active Trips</h3>
              <button className="btn btn-sm btn-outline" onClick={() => navigate('/trips')}>View All <FiArrowRight /></button>
            </div>
            {activeTrips.map((t, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                  <strong>{t.bus}</strong><span style={{ color: 'var(--text-light)' }}>{t.passengers}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-light)', marginBottom: 4 }}>{t.route} • {t.driver}</div>
                <div style={{ height: 4, background: '#e0e0e0', borderRadius: 2 }}>
                  <div style={{ width: `${t.progress}%`, height: '100%', background: 'var(--primary)', borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Recent Bookings</h3>
            <button className="btn btn-sm btn-outline" onClick={() => navigate('/bookings')}>View All <FiArrowRight /></button>
          </div>
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Booking ID</th><th>Passenger</th><th>Route</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {recentBookings.map(b => (
                  <tr key={b.id}>
                    <td><strong>{b.id}</strong></td>
                    <td>{b.passenger}</td>
                    <td>{b.route}</td>
                    <td>{b.date}</td>
                    <td><strong>{b.amount}</strong></td>
                    <td><span className={`badge badge-${b.status === 'confirmed' ? 'success' : b.status === 'pending' ? 'warning' : b.status === 'completed' ? 'info' : 'danger'}`}>{b.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
