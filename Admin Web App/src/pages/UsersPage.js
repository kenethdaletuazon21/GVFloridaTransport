import React, { useState } from 'react';
import { FiPlus, FiSearch, FiEdit2, FiTrash2 } from 'react-icons/fi';

const initialUsers = [
  { id: 1, name: 'Juan Dela Cruz', email: 'juan@email.com', phone: '0917-555-0001', wallet: 1500, trips: 12, joined: 'Oct 15, 2024', status: 'active' },
  { id: 2, name: 'Maria Santos', email: 'maria@email.com', phone: '0917-555-0002', wallet: 3200, trips: 28, joined: 'Aug 20, 2024', status: 'active' },
  { id: 3, name: 'Pedro Reyes', email: 'pedro@email.com', phone: '0917-555-0003', wallet: 500, trips: 5, joined: 'Dec 01, 2024', status: 'active' },
  { id: 4, name: 'Ana Garcia', email: 'ana@email.com', phone: '0917-555-0004', wallet: 0, trips: 45, joined: 'Mar 10, 2024', status: 'active' },
  { id: 5, name: 'Jose Mendoza', email: 'jose@email.com', phone: '0917-555-0005', wallet: 820, trips: 18, joined: 'Jun 22, 2024', status: 'suspended' },
  { id: 6, name: 'Rosa De Leon', email: 'rosa@email.com', phone: '0917-555-0006', wallet: 4100, trips: 55, joined: 'Jan 05, 2024', status: 'active' },
];

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', status: 'active' });

  const filtered = users.filter(u => `${u.name} ${u.email} ${u.phone}`.toLowerCase().includes(search.toLowerCase()));

  const addUser = () => {
    setUsers(prev => [...prev, { ...form, id: Date.now(), wallet: 0, trips: 0, joined: 'Today' }]);
    setShowModal(false);
    setForm({ name: '', email: '', phone: '', status: 'active' });
  };

  return (
    <>
      <div className="topbar">
        <h2>User Management</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><FiPlus /> Add User</button>
      </div>
      <div className="page-content">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
          <div className="stat-card"><div className="stat-value" style={{ color: 'var(--primary)' }}>{users.length}</div><div className="stat-label">Total Users</div></div>
          <div className="stat-card"><div className="stat-value" style={{ color: 'var(--success)' }}>{users.filter(u => u.status === 'active').length}</div><div className="stat-label">Active</div></div>
          <div className="stat-card"><div className="stat-value" style={{ color: 'var(--warning)' }}>{users.filter(u => u.status === 'suspended').length}</div><div className="stat-label">Suspended</div></div>
        </div>
        <div className="card">
          <div className="search-bar" style={{ marginBottom: 16, maxWidth: 300 }}>
            <FiSearch />
            <input className="input" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Wallet</th><th>Trips</th><th>Joined</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id}>
                    <td><strong>{u.name}</strong></td>
                    <td>{u.email}</td>
                    <td>{u.phone}</td>
                    <td>₱{u.wallet.toLocaleString()}</td>
                    <td>{u.trips}</td>
                    <td>{u.joined}</td>
                    <td><span className={`badge ${u.status === 'active' ? 'badge-success' : 'badge-warning'}`}>{u.status}</span></td>
                    <td>
                      <button className="btn btn-sm btn-outline" style={{ marginRight: 6 }} onClick={() => setUsers(prev => prev.map(x => x.id === u.id ? { ...x, status: x.status === 'active' ? 'suspended' : 'active' } : x))}><FiEdit2 /></button>
                      <button className="btn btn-sm btn-danger" onClick={() => setUsers(prev => prev.filter(x => x.id !== u.id))}><FiTrash2 /></button>
                    </td>
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
            <h3>Add User</h3>
            <div className="form-group"><label>Full Name</label><input className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
            <div className="form-group"><label>Email</label><input className="input" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
            <div className="form-group"><label>Phone</label><input className="input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={addUser}>Add User</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
