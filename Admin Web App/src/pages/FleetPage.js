import React, { useState } from 'react';
import { FiPlus, FiSearch, FiEdit2, FiTool } from 'react-icons/fi';

const initialFleet = [
  { id: 1, bus_number: 'GVF-001', type: 'Deluxe', capacity: 45, plate: 'ABC-1234', route: 'Manila → Naga', status: 'active', mileage: 125000, next_maintenance: '2025-02-15' },
  { id: 2, bus_number: 'GVF-002', type: 'Regular', capacity: 55, plate: 'DEF-5678', route: 'Manila → Legazpi', status: 'active', mileage: 98000, next_maintenance: '2025-03-01' },
  { id: 3, bus_number: 'GVF-003', type: 'Sleeper', capacity: 30, plate: 'GHI-9012', route: 'Manila → Sorsogon', status: 'maintenance', mileage: 150200, next_maintenance: '2025-01-20' },
  { id: 4, bus_number: 'GVF-004', type: 'Deluxe', capacity: 45, plate: 'JKL-3456', route: 'Manila → Daet', status: 'active', mileage: 72000, next_maintenance: '2025-04-10' },
  { id: 5, bus_number: 'GVF-005', type: 'Regular', capacity: 55, plate: 'MNO-7890', route: 'Manila → Naga', status: 'active', mileage: 110500, next_maintenance: '2025-02-28' },
  { id: 6, bus_number: 'GVF-006', type: 'Sleeper', capacity: 30, plate: 'PQR-2345', route: 'Manila → Legazpi', status: 'retired', mileage: 250000, next_maintenance: '-' },
  { id: 7, bus_number: 'GVF-007', type: 'Regular', capacity: 55, plate: 'STU-6789', route: 'Manila → Tabaco', status: 'active', mileage: 65000, next_maintenance: '2025-05-05' },
  { id: 8, bus_number: 'GVF-008', type: 'Deluxe', capacity: 45, plate: 'VWX-0123', route: 'Manila → Iriga', status: 'maintenance', mileage: 180000, next_maintenance: '2025-01-25' },
];

export default function FleetPage() {
  const [fleet, setFleet] = useState(initialFleet);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ bus_number: '', type: 'Regular', capacity: 55, plate: '', route: '' });

  const filtered = fleet.filter(b => {
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    return `${b.bus_number} ${b.plate} ${b.route}`.toLowerCase().includes(search.toLowerCase());
  });

  const addBus = () => {
    setFleet(prev => [...prev, { ...form, id: Date.now(), status: 'active', mileage: 0, next_maintenance: '2025-06-01' }]);
    setShowModal(false);
  };

  const statusBadge = (s) => {
    if (s === 'active') return 'badge-success';
    if (s === 'maintenance') return 'badge-warning';
    return 'badge-info';
  };

  const typeBadge = (t) => {
    if (t === 'Deluxe') return { background: '#e8f5e9', color: '#2e7d32' };
    if (t === 'Sleeper') return { background: '#e3f2fd', color: '#1565c0' };
    return { background: '#f3e5f5', color: '#7b1fa2' };
  };

  return (
    <>
      <div className="topbar">
        <h2>Fleet Management</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><FiPlus /> Add Bus</button>
      </div>
      <div className="page-content">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
          <div className="stat-card"><div className="stat-value" style={{ color: 'var(--primary)' }}>{fleet.length}</div><div className="stat-label">Total Buses</div></div>
          <div className="stat-card"><div className="stat-value" style={{ color: 'var(--success)' }}>{fleet.filter(b => b.status === 'active').length}</div><div className="stat-label">Active</div></div>
          <div className="stat-card"><div className="stat-value" style={{ color: '#ff6f00' }}>{fleet.filter(b => b.status === 'maintenance').length}</div><div className="stat-label">In Maintenance</div></div>
          <div className="stat-card"><div className="stat-value" style={{ color: 'var(--info)' }}>{fleet.reduce((a, b) => a + b.capacity, 0)}</div><div className="stat-label">Total Capacity</div></div>
        </div>
        <div className="card">
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <div className="search-bar" style={{ flex: 1, minWidth: 200 }}>
              <FiSearch />
              <input className="input" placeholder="Search fleet..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="input select" style={{ width: 160 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="retired">Retired</option>
            </select>
          </div>
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Bus #</th><th>Type</th><th>Capacity</th><th>Plate</th><th>Route</th><th>Mileage</th><th>Next Service</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {filtered.map(b => (
                  <tr key={b.id}>
                    <td><strong>{b.bus_number}</strong></td>
                    <td><span className="badge" style={typeBadge(b.type)}>{b.type}</span></td>
                    <td>{b.capacity}</td>
                    <td>{b.plate}</td>
                    <td>{b.route}</td>
                    <td>{b.mileage.toLocaleString()} km</td>
                    <td>{b.next_maintenance}</td>
                    <td><span className={`badge ${statusBadge(b.status)}`} style={{ textTransform: 'capitalize' }}>{b.status}</span></td>
                    <td><button className="btn btn-sm btn-outline" title="Edit"><FiEdit2 /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Add Bus</h3>
            <div className="form-grid">
              <div className="form-group"><label>Bus Number</label><input className="input" placeholder="GVF-009" value={form.bus_number} onChange={e => setForm({...form, bus_number: e.target.value})} /></div>
              <div className="form-group"><label>Type</label><select className="input select" value={form.type} onChange={e => setForm({...form, type: e.target.value})}><option>Regular</option><option>Deluxe</option><option>Sleeper</option></select></div>
              <div className="form-group"><label>Capacity</label><input className="input" type="number" value={form.capacity} onChange={e => setForm({...form, capacity: Number(e.target.value)})} /></div>
              <div className="form-group"><label>Plate Number</label><input className="input" value={form.plate} onChange={e => setForm({...form, plate: e.target.value})} /></div>
              <div className="form-group" style={{ gridColumn: '1/-1' }}><label>Assigned Route</label><input className="input" placeholder="Manila → Naga" value={form.route} onChange={e => setForm({...form, route: e.target.value})} /></div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={addBus}>Add Bus</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
