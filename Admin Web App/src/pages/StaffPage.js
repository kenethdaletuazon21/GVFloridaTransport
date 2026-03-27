import React, { useState } from 'react';
import { FiPlus, FiSearch, FiEdit2 } from 'react-icons/fi';

const initialStaff = [
  { id: 1, name: 'Carlos Reyes', employee_id: 'DRV-2024-001', role: 'driver', phone: '0917-555-1001', terminal: 'Cubao', status: 'on_duty', shifts: 142, rating: 4.8 },
  { id: 2, name: 'Roberto Cruz', employee_id: 'DRV-2024-002', role: 'driver', phone: '0917-555-1002', terminal: 'Cubao', status: 'on_duty', shifts: 128, rating: 4.6 },
  { id: 3, name: 'Lina Marquez', employee_id: 'CND-2024-001', role: 'conductor', phone: '0917-555-1003', terminal: 'Cubao', status: 'off_duty', shifts: 135, rating: 4.9 },
  { id: 4, name: 'Miguel Torres', employee_id: 'DRV-2024-003', role: 'driver', phone: '0917-555-1004', terminal: 'Pasay', status: 'on_duty', shifts: 98, rating: 4.5 },
  { id: 5, name: 'Carmen Santos', employee_id: 'CND-2024-002', role: 'conductor', phone: '0917-555-1005', terminal: 'Pasay', status: 'on_leave', shifts: 110, rating: 4.7 },
  { id: 6, name: 'Antonio Ramos', employee_id: 'INS-2024-001', role: 'inspector', phone: '0917-555-1006', terminal: 'Cubao', status: 'off_duty', shifts: 200, rating: 4.4 },
  { id: 7, name: 'Elena Cruz', employee_id: 'DSP-2024-001', role: 'dispatcher', phone: '0917-555-1007', terminal: 'Cubao', status: 'on_duty', shifts: 180, rating: 4.8 },
];

export default function StaffPage() {
  const [staff, setStaff] = useState(initialStaff);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', employee_id: '', role: 'driver', phone: '', terminal: 'Cubao' });

  const filtered = staff.filter(s => {
    if (roleFilter !== 'all' && s.role !== roleFilter) return false;
    return `${s.name} ${s.employee_id}`.toLowerCase().includes(search.toLowerCase());
  });

  const addStaff = () => {
    setStaff(prev => [...prev, { ...form, id: Date.now(), status: 'off_duty', shifts: 0, rating: 0 }]);
    setShowModal(false);
  };

  const statusBadge = (s) => {
    if (s === 'on_duty') return 'badge-success';
    if (s === 'off_duty') return 'badge-info';
    return 'badge-warning';
  };

  return (
    <>
      <div className="topbar">
        <h2>Staff Management</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><FiPlus /> Add Staff</button>
      </div>
      <div className="page-content">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
          <div className="stat-card"><div className="stat-value" style={{ color: 'var(--primary)' }}>{staff.length}</div><div className="stat-label">Total Staff</div></div>
          <div className="stat-card"><div className="stat-value" style={{ color: 'var(--success)' }}>{staff.filter(s => s.status === 'on_duty').length}</div><div className="stat-label">On Duty</div></div>
          <div className="stat-card"><div className="stat-value" style={{ color: 'var(--info)' }}>{staff.filter(s => s.role === 'driver').length}</div><div className="stat-label">Drivers</div></div>
          <div className="stat-card"><div className="stat-value" style={{ color: '#ff6f00' }}>{staff.filter(s => s.role === 'conductor').length}</div><div className="stat-label">Conductors</div></div>
        </div>
        <div className="card">
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <div className="search-bar" style={{ flex: 1, minWidth: 200 }}>
              <FiSearch />
              <input className="input" placeholder="Search staff..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="input select" style={{ width: 160 }} value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
              <option value="all">All Roles</option>
              <option value="driver">Drivers</option>
              <option value="conductor">Conductors</option>
              <option value="inspector">Inspectors</option>
              <option value="dispatcher">Dispatchers</option>
            </select>
          </div>
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Name</th><th>Employee ID</th><th>Role</th><th>Terminal</th><th>Shifts</th><th>Rating</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id}>
                    <td><strong>{s.name}</strong></td>
                    <td>{s.employee_id}</td>
                    <td><span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>{s.role}</span></td>
                    <td>{s.terminal}</td>
                    <td>{s.shifts}</td>
                    <td>⭐ {s.rating || '-'}</td>
                    <td><span className={`badge ${statusBadge(s.status)}`} style={{ textTransform: 'capitalize' }}>{s.status.replace('_', ' ')}</span></td>
                    <td><button className="btn btn-sm btn-outline"><FiEdit2 /></button></td>
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
            <h3>Add Staff Member</h3>
            <div className="form-grid">
              <div className="form-group"><label>Full Name</label><input className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
              <div className="form-group"><label>Employee ID</label><input className="input" value={form.employee_id} onChange={e => setForm({...form, employee_id: e.target.value})} /></div>
              <div className="form-group"><label>Role</label><select className="input select" value={form.role} onChange={e => setForm({...form, role: e.target.value})}><option value="driver">Driver</option><option value="conductor">Conductor</option><option value="inspector">Inspector</option><option value="dispatcher">Dispatcher</option></select></div>
              <div className="form-group"><label>Phone</label><input className="input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
              <div className="form-group"><label>Terminal</label><select className="input select" value={form.terminal} onChange={e => setForm({...form, terminal: e.target.value})}><option>Cubao</option><option>Pasay</option></select></div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={addStaff}>Add Staff</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
