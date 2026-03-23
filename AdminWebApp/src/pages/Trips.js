import React, { useState, useEffect } from 'react';
import { FiCalendar, FiSearch, FiPlay, FiSquare, FiEye, FiPlus } from 'react-icons/fi';
import { tripAPI } from '../services/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [manifest, setManifest] = useState(null);

  useEffect(() => { loadTrips(); }, [statusFilter]);

  const loadTrips = async () => {
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const { data } = await tripAPI.getAll(params);
      setTrips(data.trips || data || []);
    } catch (err) { toast.error('Failed to load trips'); }
    finally { setLoading(false); }
  };

  const handleStart = async (id) => {
    try { await tripAPI.start(id); toast.success('Trip started'); loadTrips(); }
    catch (err) { toast.error('Failed to start trip'); }
  };

  const handleEnd = async (id) => {
    try { await tripAPI.end(id, {}); toast.success('Trip ended'); loadTrips(); }
    catch (err) { toast.error('Failed to end trip'); }
  };

  const loadManifest = async (id) => {
    try {
      const { data } = await tripAPI.getManifest(id);
      setManifest(data);
    } catch (err) { toast.error('Failed to load manifest'); }
  };

  const statusColor = (s) => ({ scheduled: 'badge-info', boarding: 'badge-warning', in_transit: 'badge-success', completed: 'bg-gray-100 text-gray-600', cancelled: 'badge-danger' }[s] || 'badge-info');

  const filtered = trips.filter(t => {
    if (!search) return true;
    const s = search.toLowerCase();
    return t.route_name?.toLowerCase().includes(s) || t.bus_number?.toLowerCase().includes(s);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title flex items-center gap-2"><FiCalendar /> Trip Management</h1>
          <p className="text-sm text-gray-500 mt-1">{trips.length} trips</p>
        </div>
        <button className="btn-primary flex items-center gap-2"><FiPlus size={16} /> Create Trip</button>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search trips..." className="input-field pl-10" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-field w-auto">
            <option value="">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="boarding">Boarding</option>
            <option value="in_transit">In Transit</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="card overflow-hidden p-0">
        {loading ? (
          <div className="flex items-center justify-center h-32"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50"><tr>
                <th className="table-header">Route</th><th className="table-header">Bus</th><th className="table-header">Departure</th><th className="table-header">Arrival</th><th className="table-header">Passengers</th><th className="table-header">Status</th><th className="table-header">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-8 text-gray-400">No trips found</td></tr>
                ) : filtered.map(trip => (
                  <tr key={trip.id} className="hover:bg-gray-50">
                    <td className="table-cell font-medium">{trip.route_name || `${trip.origin} → ${trip.destination}`}</td>
                    <td className="table-cell">{trip.bus_number}</td>
                    <td className="table-cell">{trip.departure_time ? format(new Date(trip.departure_time), 'MMM d, h:mm a') : '-'}</td>
                    <td className="table-cell">{trip.arrival_time ? format(new Date(trip.arrival_time), 'MMM d, h:mm a') : '-'}</td>
                    <td className="table-cell">{trip.booked_seats || 0}/{trip.capacity || 45}</td>
                    <td className="table-cell"><span className={statusColor(trip.status)}>{trip.status?.replace('_', ' ')}</span></td>
                    <td className="table-cell">
                      <div className="flex gap-1">
                        <button onClick={() => loadManifest(trip.id)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded" title="View Manifest"><FiEye size={14} /></button>
                        {trip.status === 'scheduled' && <button onClick={() => handleStart(trip.id)} className="p-1.5 text-green-500 hover:bg-green-50 rounded" title="Start Trip"><FiPlay size={14} /></button>}
                        {trip.status === 'in_transit' && <button onClick={() => handleEnd(trip.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded" title="End Trip"><FiSquare size={14} /></button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Manifest Modal */}
      {manifest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setManifest(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 p-6 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">Trip Manifest</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr><th className="table-header">Seat</th><th className="table-header">Passenger</th><th className="table-header">Status</th></tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {(manifest.passengers || []).map((p, i) => (
                    <tr key={i}><td className="table-cell">{p.seat_number}</td><td className="table-cell">{p.passenger_name}</td><td className="table-cell"><span className={p.status === 'confirmed' ? 'badge-success' : 'badge-warning'}>{p.status}</span></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-4"><button onClick={() => setManifest(null)} className="btn-secondary">Close</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
