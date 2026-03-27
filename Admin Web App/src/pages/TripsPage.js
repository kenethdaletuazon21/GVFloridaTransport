import React, { useState } from 'react';
import { FiPlus, FiSearch, FiPlay, FiSquare } from 'react-icons/fi';
import { format, addDays } from 'date-fns';

const initialTrips = [
  { id: 1, route: 'Manila → Naga City', bus: 'GVF-2847', driver: 'Carlos Reyes', departure: '06:00 AM', arrival: '02:00 PM', date: format(new Date(), 'yyyy-MM-dd'), passengers: 38, capacity: 49, status: 'active' },
  { id: 2, route: 'Manila → Legazpi', bus: 'GVF-1122', driver: 'Roberto Cruz', departure: '08:00 PM', arrival: '06:00 AM', date: format(new Date(), 'yyyy-MM-dd'), passengers: 22, capacity: 49, status: 'scheduled' },
  { id: 3, route: 'Manila → Daet', bus: 'GVF-3391', driver: 'Miguel Torres', departure: '10:00 PM', arrival: '04:00 AM', date: format(new Date(), 'yyyy-MM-dd'), passengers: 45, capacity: 49, status: 'scheduled' },
  { id: 4, route: 'Manila → Sorsogon', bus: 'GVF-4420', driver: 'Jose Garcia', departure: '05:00 AM', arrival: '03:00 PM', date: format(new Date(), 'yyyy-MM-dd'), passengers: 49, capacity: 49, status: 'completed' },
  { id: 5, route: 'Manila → Naga City', bus: 'GVF-2100', driver: 'Ramon Santos', departure: '07:00 AM', arrival: '03:00 PM', date: format(addDays(new Date(), 1), 'yyyy-MM-dd'), passengers: 15, capacity: 49, status: 'scheduled' },
  { id: 6, route: 'Manila → Iriga', bus: 'GVF-5501', driver: 'Pedro Mendoza', departure: '09:00 PM', arrival: '05:00 AM', date: format(addDays(new Date(), 1), 'yyyy-MM-dd'), passengers: 8, capacity: 49, status: 'scheduled' },
];

export default function TripsPage() {
  const [trips, setTrips] = useState(initialTrips);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ route: '', bus: '', driver: '', departure: '', arrival: '', date: format(new Date(), 'yyyy-MM-dd'), capacity: 49 });

  const filtered = trips.filter(t => {
    if (filter !== 'all' && t.status !== filter) return false;
    return `${t.route} ${t.bus} ${t.driver}`.toLowerCase().includes(search.toLowerCase());
  });

  const addTrip = () => {
    setTrips(prev => [...prev, { ...form, id: Date.now(), passengers: 0, status: 'scheduled', capacity: Number(form.capacity) }]);
    setShowModal(false);
    setForm({ route: '', bus: '', driver: '', departure: '', arrival: '', date: format(new Date(), 'yyyy-MM-dd'), capacity: 49 });
  };

  return (
    <>
      <div className="topbar">
        <h2>Trips & Schedules</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><FiPlus /> Add Trip</button>
      </div>
      <div className="page-content">
        <div className="card">
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <div className="search-bar" style={{ flex: 1, minWidth: 200 }}>
              <FiSearch />
              <input className="input" placeholder="Search trips..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="input select" style={{ width: 160 }} value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Route</th><th>Bus</th><th>Driver</th><th>Date</th><th>Schedule</th><th>Passengers</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {filtered.map(t => (
                  <tr key={t.id}>
                    <td><strong>{t.route}</strong></td>
                    <td>{t.bus}</td>
                    <td>{t.driver}</td>
                    <td>{format(new Date(t.date), 'MMM dd')}</td>
                    <td>{t.departure} — {t.arrival}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 4, background: '#e0e0e0', borderRadius: 2 }}>
                          <div style={{ width: `${(t.passengers / t.capacity) * 100}%`, height: '100%', background: t.passengers >= t.capacity ? 'var(--success)' : 'var(--primary)', borderRadius: 2 }} />
                        </div>
                        <span style={{ fontSize: 12, whiteSpace: 'nowrap' }}>{t.passengers}/{t.capacity}</span>
                      </div>
                    </td>
                    <td><span className={`badge ${t.status === 'active' ? 'badge-success' : t.status === 'scheduled' ? 'badge-info' : 'badge-primary'}`}>{t.status}</span></td>
                    <td>
                      {t.status === 'scheduled' && <button className="btn btn-sm btn-success" onClick={() => setTrips(prev => prev.map(tr => tr.id === t.id ? {...tr, status: 'active'} : tr))}><FiPlay /></button>}
                      {t.status === 'active' && <button className="btn btn-sm btn-danger" onClick={() => setTrips(prev => prev.map(tr => tr.id === t.id ? {...tr, status: 'completed'} : tr))}><FiSquare /></button>}
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
            <h3>Add New Trip</h3>
            <div className="form-grid">
              <div className="form-group full"><label>Route</label><select className="input select" value={form.route} onChange={e => setForm({...form, route: e.target.value})}><option value="">Select route</option><option>Manila → Naga City</option><option>Manila → Legazpi</option><option>Manila → Daet</option><option>Manila → Sorsogon</option><option>Manila → Iriga</option></select></div>
              <div className="form-group"><label>Bus Number</label><input className="input" value={form.bus} onChange={e => setForm({...form, bus: e.target.value})} placeholder="GVF-XXXX" /></div>
              <div className="form-group"><label>Driver</label><input className="input" value={form.driver} onChange={e => setForm({...form, driver: e.target.value})} placeholder="Driver name" /></div>
              <div className="form-group"><label>Date</label><input className="input" type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} /></div>
              <div className="form-group"><label>Capacity</label><input className="input" type="number" value={form.capacity} onChange={e => setForm({...form, capacity: e.target.value})} /></div>
              <div className="form-group"><label>Departure Time</label><input className="input" value={form.departure} onChange={e => setForm({...form, departure: e.target.value})} placeholder="06:00 AM" /></div>
              <div className="form-group"><label>Arrival Time</label><input className="input" value={form.arrival} onChange={e => setForm({...form, arrival: e.target.value})} placeholder="02:00 PM" /></div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={addTrip}>Add Trip</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
