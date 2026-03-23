import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiTruck, FiSearch, FiFilter, FiTool } from 'react-icons/fi';
import { fleetAPI } from '../services/api';
import { toast } from 'react-toastify';

const BUS_TYPES = ['regular', 'deluxe', 'super_deluxe'];
const BUS_STATUSES = ['active', 'maintenance', 'retired'];

function BusModal({ bus, onClose, onSave }) {
  const [form, setForm] = useState(bus || { bus_number: '', plate_number: '', bus_type: 'deluxe', capacity: 45, status: 'active', model: '', year: '' });
  const [saving, setSaving] = useState(false);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (bus?.id) await fleetAPI.update(bus.id, form);
      else await fleetAPI.create(form);
      toast.success(bus?.id ? 'Bus updated' : 'Bus added');
      onSave();
    } catch (err) { toast.error(err.response?.data?.error || 'Save failed'); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">{bus?.id ? 'Edit Bus' : 'Add New Bus'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Bus Number</label><input name="bus_number" value={form.bus_number} onChange={handleChange} className="input-field" required /></div>
            <div><label className="block text-sm font-medium mb-1">Plate Number</label><input name="plate_number" value={form.plate_number} onChange={handleChange} className="input-field" required /></div>
            <div><label className="block text-sm font-medium mb-1">Type</label><select name="bus_type" value={form.bus_type} onChange={handleChange} className="input-field">{BUS_TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ').toUpperCase()}</option>)}</select></div>
            <div><label className="block text-sm font-medium mb-1">Capacity</label><input name="capacity" type="number" value={form.capacity} onChange={handleChange} className="input-field" min="1" required /></div>
            <div><label className="block text-sm font-medium mb-1">Model</label><input name="model" value={form.model} onChange={handleChange} className="input-field" /></div>
            <div><label className="block text-sm font-medium mb-1">Year</label><input name="year" value={form.year} onChange={handleChange} className="input-field" /></div>
            <div><label className="block text-sm font-medium mb-1">Status</label><select name="status" value={form.status} onChange={handleChange} className="input-field">{BUS_STATUSES.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}</select></div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save Bus'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Fleet() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => { loadBuses(); }, []);

  const loadBuses = async () => {
    try {
      const { data } = await fleetAPI.getAll();
      setBuses(data.buses || data || []);
    } catch (err) { toast.error('Failed to load fleet'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Decommission this bus?')) return;
    try { await fleetAPI.delete(id); toast.success('Bus removed'); loadBuses(); }
    catch (err) { toast.error('Delete failed'); }
  };

  const filteredBuses = buses.filter(b => {
    const matchSearch = !search || b.bus_number?.toLowerCase().includes(search.toLowerCase()) || b.plate_number?.toLowerCase().includes(search.toLowerCase());
    const matchType = !filterType || b.bus_type === filterType;
    const matchStatus = !filterStatus || b.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  const statusColor = (s) => ({ active: 'badge-success', maintenance: 'badge-warning', retired: 'badge-danger' }[s] || 'badge-info');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title flex items-center gap-2"><FiTruck /> Fleet Management</h1>
          <p className="text-sm text-gray-500 mt-1">{buses.length} buses registered</p>
        </div>
        <button onClick={() => setModal({})} className="btn-primary flex items-center gap-2"><FiPlus size={16} /> Add Bus</button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by bus/plate number..." className="input-field pl-10" />
          </div>
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="input-field w-auto"><option value="">All Types</option>{BUS_TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}</select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="input-field w-auto"><option value="">All Status</option>{BUS_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}</select>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden p-0">
        {loading ? (
          <div className="flex items-center justify-center h-32"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50"><tr>
                <th className="table-header">Bus #</th><th className="table-header">Plate</th><th className="table-header">Type</th><th className="table-header">Capacity</th><th className="table-header">Model</th><th className="table-header">Status</th><th className="table-header">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBuses.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-8 text-gray-400">No buses found</td></tr>
                ) : filteredBuses.map(bus => (
                  <tr key={bus.id} className="hover:bg-gray-50">
                    <td className="table-cell font-medium">{bus.bus_number}</td>
                    <td className="table-cell">{bus.plate_number}</td>
                    <td className="table-cell capitalize">{bus.bus_type?.replace('_', ' ')}</td>
                    <td className="table-cell">{bus.capacity}</td>
                    <td className="table-cell">{bus.model} {bus.year && `(${bus.year})`}</td>
                    <td className="table-cell"><span className={statusColor(bus.status)}>{bus.status}</span></td>
                    <td className="table-cell">
                      <div className="flex gap-2">
                        <button onClick={() => setModal(bus)} className="text-blue-500 hover:text-blue-700"><FiEdit2 size={16} /></button>
                        <button onClick={() => handleDelete(bus.id)} className="text-red-500 hover:text-red-700"><FiTrash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {modal !== null && <BusModal bus={modal.id ? modal : null} onClose={() => setModal(null)} onSave={() => { setModal(null); loadBuses(); }} />}
    </div>
  );
}
