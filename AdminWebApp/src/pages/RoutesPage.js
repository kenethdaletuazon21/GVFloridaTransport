import React, { useState, useEffect } from 'react';
import { FiNavigation, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { routeAPI } from '../services/api';
import { toast } from 'react-toastify';

export default function RoutesPage() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  useEffect(() => { loadRoutes(); }, []);

  const loadRoutes = async () => {
    try { const { data } = await routeAPI.getAll(); setRoutes(data.routes || data || []); }
    catch (err) { toast.error('Failed to load routes'); }
    finally { setLoading(false); }
  };

  const demoRoutes = routes.length > 0 ? routes : [
    { id: 1, origin: 'Manila (Sampaloc)', destination: 'Tuguegarao', distance_km: 480, duration_hours: 10, fare_regular: 750, fare_deluxe: 950, fare_super_deluxe: 1200, status: 'active' },
    { id: 2, origin: 'Manila (Sampaloc)', destination: 'Santiago', distance_km: 370, duration_hours: 8, fare_regular: 650, fare_deluxe: 850, fare_super_deluxe: 1050, status: 'active' },
    { id: 3, origin: 'Manila (Sampaloc)', destination: 'Ilagan', distance_km: 400, duration_hours: 9, fare_regular: 700, fare_deluxe: 900, fare_super_deluxe: 1100, status: 'active' },
    { id: 4, origin: 'Manila (Sampaloc)', destination: 'Cauayan', distance_km: 380, duration_hours: 8.5, fare_regular: 680, fare_deluxe: 880, fare_super_deluxe: 1080, status: 'active' },
    { id: 5, origin: 'Manila (Sampaloc)', destination: 'Tabuk', distance_km: 520, duration_hours: 12, fare_regular: 850, fare_deluxe: 1050, fare_super_deluxe: 1350, status: 'active' },
    { id: 6, origin: 'Manila (Sampaloc)', destination: 'Banaue', distance_km: 450, duration_hours: 10, fare_regular: 780, fare_deluxe: 980, fare_super_deluxe: 1250, status: 'active' },
  ];

  function RouteModal({ route, onClose, onSave }) {
    const [form, setForm] = useState(route || { origin: '', destination: '', distance_km: '', duration_hours: '', fare_regular: '', fare_deluxe: '', fare_super_deluxe: '', status: 'active' });
    const [saving, setSaving] = useState(false);
    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const handleSubmit = async (e) => {
      e.preventDefault(); setSaving(true);
      try {
        if (route?.id) await routeAPI.update(route.id, form);
        else await routeAPI.create(form);
        toast.success(route?.id ? 'Route updated' : 'Route added'); onSave();
      } catch (err) { toast.error('Save failed'); }
      finally { setSaving(false); }
    };
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6" onClick={e => e.stopPropagation()}>
          <h2 className="text-xl font-bold mb-4">{route?.id ? 'Edit Route' : 'Add Route'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1">Origin</label><input name="origin" value={form.origin} onChange={handleChange} className="input-field" required /></div>
              <div><label className="block text-sm font-medium mb-1">Destination</label><input name="destination" value={form.destination} onChange={handleChange} className="input-field" required /></div>
              <div><label className="block text-sm font-medium mb-1">Distance (km)</label><input name="distance_km" type="number" value={form.distance_km} onChange={handleChange} className="input-field" /></div>
              <div><label className="block text-sm font-medium mb-1">Duration (hrs)</label><input name="duration_hours" type="number" step="0.5" value={form.duration_hours} onChange={handleChange} className="input-field" /></div>
              <div><label className="block text-sm font-medium mb-1">Fare (Regular)</label><input name="fare_regular" type="number" value={form.fare_regular} onChange={handleChange} className="input-field" /></div>
              <div><label className="block text-sm font-medium mb-1">Fare (Deluxe)</label><input name="fare_deluxe" type="number" value={form.fare_deluxe} onChange={handleChange} className="input-field" /></div>
              <div><label className="block text-sm font-medium mb-1">Fare (Super Deluxe)</label><input name="fare_super_deluxe" type="number" value={form.fare_super_deluxe} onChange={handleChange} className="input-field" /></div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
              <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save'}</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div><h1 className="page-title flex items-center gap-2"><FiNavigation /> Route Management</h1><p className="text-sm text-gray-500 mt-1">{demoRoutes.length} active routes</p></div>
        <button onClick={() => setModal({})} className="btn-primary flex items-center gap-2"><FiPlus size={16} /> Add Route</button>
      </div>
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto"><table className="w-full"><thead className="bg-gray-50"><tr>
          <th className="table-header">Origin</th><th className="table-header">Destination</th><th className="table-header">Distance</th><th className="table-header">Duration</th><th className="table-header">Regular</th><th className="table-header">Deluxe</th><th className="table-header">Super Deluxe</th><th className="table-header">Actions</th>
        </tr></thead><tbody className="divide-y divide-gray-100">
          {demoRoutes.map(r => (
            <tr key={r.id} className="hover:bg-gray-50">
              <td className="table-cell">{r.origin}</td><td className="table-cell font-medium">{r.destination}</td>
              <td className="table-cell">{r.distance_km} km</td><td className="table-cell">{r.duration_hours}h</td>
              <td className="table-cell">₱{(r.fare_regular || 0).toLocaleString()}</td><td className="table-cell">₱{(r.fare_deluxe || 0).toLocaleString()}</td><td className="table-cell">₱{(r.fare_super_deluxe || 0).toLocaleString()}</td>
              <td className="table-cell"><div className="flex gap-2"><button onClick={() => setModal(r)} className="text-blue-500 hover:text-blue-700"><FiEdit2 size={16} /></button></div></td>
            </tr>
          ))}
        </tbody></table></div>
      </div>
      {modal !== null && <RouteModal route={modal.id ? modal : null} onClose={() => setModal(null)} onSave={() => { setModal(null); loadRoutes(); }} />}
    </div>
  );
}
