import React, { useState } from 'react';
import { FiSearch, FiEye } from 'react-icons/fi';

const demoBookings = [
  { id: 'GVF-20250001', passenger: 'Juan Dela Cruz', phone: '0917-555-0001', route: 'Manila → Naga City', date: 'Jan 28, 2025', departure: '06:00 AM', seats: '12A, 12B', amount: '₱1,500', payment: 'GV Wallet', status: 'confirmed' },
  { id: 'GVF-20250002', passenger: 'Maria Santos', phone: '0917-555-0002', route: 'Manila → Legazpi', date: 'Jan 28, 2025', departure: '08:00 PM', seats: '5A', amount: '₱950', payment: 'GCash', status: 'confirmed' },
  { id: 'GVF-20250003', passenger: 'Pedro Reyes', phone: '0917-555-0003', route: 'Manila → Daet', date: 'Jan 28, 2025', departure: '10:00 PM', seats: '8C', amount: '₱680', payment: 'Cash', status: 'pending' },
  { id: 'GVF-20250004', passenger: 'Ana Garcia', phone: '0917-555-0004', route: 'Manila → Sorsogon', date: 'Jan 27, 2025', departure: '09:00 PM', seats: '3A, 3B', amount: '₱2,100', payment: 'GV Wallet', status: 'completed' },
  { id: 'GVF-20250005', passenger: 'Jose Mendoza', phone: '0917-555-0005', route: 'Manila → Iriga', date: 'Jan 27, 2025', departure: '07:00 AM', seats: '7A', amount: '₱820', payment: 'GCash', status: 'cancelled' },
  { id: 'GVF-20250006', passenger: 'Rosa De Leon', phone: '0917-555-0006', route: 'Manila → Naga City', date: 'Jan 26, 2025', departure: '06:00 AM', seats: '1A', amount: '₱750', payment: 'Cash', status: 'completed' },
  { id: 'GVF-20250007', passenger: 'Miguel Torres', phone: '0917-555-0007', route: 'Manila → Tabaco', date: 'Jan 26, 2025', departure: '08:00 PM', seats: '9B, 9C', amount: '₱1,760', payment: 'GV Wallet', status: 'completed' },
];

export default function BookingsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const filtered = demoBookings.filter(b => {
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    return `${b.id} ${b.passenger} ${b.route}`.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <>
      <div className="topbar"><h2>Booking Management</h2></div>
      <div className="page-content">
        <div className="card">
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <div className="search-bar" style={{ flex: 1, minWidth: 200 }}>
              <FiSearch />
              <input className="input" placeholder="Search bookings..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="input select" style={{ width: 160 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Booking ID</th><th>Passenger</th><th>Route</th><th>Date</th><th>Seats</th><th>Amount</th><th>Payment</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {filtered.map(b => (
                  <tr key={b.id}>
                    <td><strong>{b.id}</strong></td>
                    <td>{b.passenger}</td>
                    <td>{b.route}</td>
                    <td>{b.date}</td>
                    <td>{b.seats}</td>
                    <td><strong>{b.amount}</strong></td>
                    <td><span className="badge badge-info">{b.payment}</span></td>
                    <td><span className={`badge badge-${b.status === 'confirmed' ? 'success' : b.status === 'pending' ? 'warning' : b.status === 'completed' ? 'info' : 'danger'}`}>{b.status}</span></td>
                    <td><button className="btn btn-sm btn-outline" onClick={() => setSelected(b)}><FiEye /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Booking Details</h3>
            <div className="form-grid">
              {Object.entries(selected).map(([k, v]) => (
                <div key={k} className="form-group">
                  <label style={{ textTransform: 'capitalize' }}>{k.replace('_', ' ')}</label>
                  <div style={{ fontWeight: 600 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
              <button className="btn btn-outline" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
