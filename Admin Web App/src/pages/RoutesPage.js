import React, { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';

const initialRoutes = [
  { id: 1, origin: 'Manila (Cubao)', destination: 'Naga City', distance: '380 km', duration: '8-9 hrs', fare: 750, status: 'active' },
  { id: 2, origin: 'Manila (Cubao)', destination: 'Legazpi City', distance: '450 km', duration: '10-11 hrs', fare: 950, status: 'active' },
  { id: 3, origin: 'Manila (Cubao)', destination: 'Daet', distance: '310 km', duration: '6-7 hrs', fare: 680, status: 'active' },
  { id: 4, origin: 'Manila (Cubao)', destination: 'Sorsogon', distance: '520 km', duration: '11-12 hrs', fare: 1050, status: 'active' },
  { id: 5, origin: 'Manila (Cubao)', destination: 'Iriga City', distance: '400 km', duration: '9-10 hrs', fare: 820, status: 'active' },
  { id: 6, origin: 'Manila (Pasay)', destination: 'Tabaco City', distance: '430 km', duration: '9-10 hrs', fare: 880, status: 'active' },
  { id: 7, origin: 'Manila (Cubao)', destination: 'Masbate', distance: '580 km', duration: '13-14 hrs', fare: 1200, status: 'inactive' },
  { id: 8, origin: 'Naga City', destination: 'Manila (Cubao)', distance: '380 km', duration: '8-9 hrs', fare: 750, status: 'active' },
];

export default function RoutesPage() {
  const [routes, setRoutes] = useState(initialRoutes);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ origin: '', destination: '', distance: '', duration: '', fare: '', status: 'active' });

  const filtered = routes.filter(r => `${r.origin} ${r.destination}`.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setEditing(null); setForm({ origin: '', destination: '', distance: '', duration: '', fare: '', status: 'active' }); setShowModal(true); };
  const openEdit = (r) => { setEditing(r); setForm({ ...r }); setShowModal(true); };
  const save = () => {
    if (editing) {
      setRoutes(prev => prev.map(r => r.id === editing.id ? { ...r, ...form } : r));
    } else {
      setRoutes(prev => [...prev, { ...form, id: Date.now(), fare: Number(form.fare) }]);
    }
    setShowModal(false);
  };
  const remove = (id) => { if (window.confirm('Delete this route?')) setRoutes(prev => prev.filter(r => r.id !== id)); };

  return (
    <>
      <div className="topbar">
        <h2>Route Management</h2>
        <button className="btn btn-primary" onClick={openAdd}><FiPlus /> Add Route</button>
      </div>
      <div className="page-content">
        <div className="card">
          <div className="search-bar" style={{ marginBottom: 16, maxWidth: 300 }}>
            <FiSearch />
            <input className="input" placeholder="Search routes..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Origin</th><th>Destination</th><th>Distance</th><th>Duration</th><th>Base Fare</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id}>
                    <td>{r.origin}</td>
                    <td><strong>{r.destination}</strong></td>
                    <td>{r.distance}</td>
                    <td>{r.duration}</td>
                    <td><strong>₱{Number(r.fare).toLocaleString()}</strong></td>
                    <td><span className={`badge ${r.status === 'active' ? 'badge-success' : 'badge-warning'}`}>{r.status}</span></td>
                    <td>
                      <button className="btn btn-sm btn-outline" style={{ marginRight: 6 }} onClick={() => openEdit(r)}><FiEdit2 /></button>
                      <button className="btn btn-sm btn-danger" onClick={() => remove(r.id)}><FiTrash2 /></button>
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
            <h3>{editing ? 'Edit Route' : 'Add New Route'}</h3>
            <div className="form-grid">
              <div className="form-group"><label>Origin</label><input className="input" value={form.origin} onChange={e => setForm({...form, origin: e.target.value})} placeholder="e.g. Manila (Cubao)" /></div>
              <div className="form-group"><label>Destination</label><input className="input" value={form.destination} onChange={e => setForm({...form, destination: e.target.value})} placeholder="e.g. Naga City" /></div>
              <div className="form-group"><label>Distance</label><input className="input" value={form.distance} onChange={e => setForm({...form, distance: e.target.value})} placeholder="e.g. 380 km" /></div>
              <div className="form-group"><label>Duration</label><input className="input" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} placeholder="e.g. 8-9 hrs" /></div>
              <div className="form-group"><label>Base Fare (₱)</label><input className="input" type="number" value={form.fare} onChange={e => setForm({...form, fare: e.target.value})} /></div>
              <div className="form-group"><label>Status</label><select className="input select" value={form.status} onChange={e => setForm({...form, status: e.target.value})}><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={save}>{editing ? 'Update' : 'Add'} Route</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
