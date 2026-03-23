import React, { useState, useEffect } from 'react';
import { FiSearch, FiEye, FiXCircle, FiFileText } from 'react-icons/fi';
import { bookingAPI } from '../services/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => { loadBookings(); }, [statusFilter]);

  const loadBookings = async () => {
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const { data } = await bookingAPI.getAll(params);
      setBookings(data.bookings || data || []);
    } catch (err) { toast.error('Failed to load bookings'); }
    finally { setLoading(false); }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try { await bookingAPI.cancel(id); toast.success('Booking cancelled'); loadBookings(); }
    catch (err) { toast.error('Cancel failed'); }
  };

  const viewBooking = async (id) => {
    try { const { data } = await bookingAPI.getById(id); setSelected(data); }
    catch (err) { toast.error('Failed to load details'); }
  };

  const statusColor = (s) => ({ confirmed: 'badge-success', pending: 'badge-warning', cancelled: 'badge-danger', completed: 'bg-gray-100 text-gray-600' }[s] || 'badge-info');

  const filtered = bookings.filter(b => {
    if (!search) return true;
    const s = search.toLowerCase();
    return b.booking_code?.toLowerCase().includes(s) || b.passenger_name?.toLowerCase().includes(s);
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title flex items-center gap-2"><FiFileText /> Bookings</h1>
        <p className="text-sm text-gray-500 mt-1">{bookings.length} total bookings</p>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by booking code or passenger..." className="input-field pl-10" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-field w-auto">
            <option value="">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
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
                <th className="table-header">Code</th><th className="table-header">Passenger</th><th className="table-header">Route</th><th className="table-header">Date</th><th className="table-header">Seat</th><th className="table-header">Amount</th><th className="table-header">Status</th><th className="table-header">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr><td colSpan="8" className="text-center py-8 text-gray-400">No bookings found</td></tr>
                ) : filtered.map(b => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="table-cell font-mono font-medium text-primary-600">{b.booking_code}</td>
                    <td className="table-cell">{b.passenger_name}</td>
                    <td className="table-cell">{b.origin} → {b.destination}</td>
                    <td className="table-cell">{b.travel_date ? format(new Date(b.travel_date), 'MMM d, yyyy') : '-'}</td>
                    <td className="table-cell">{b.seat_number}</td>
                    <td className="table-cell font-medium">₱{(b.amount || 0).toLocaleString()}</td>
                    <td className="table-cell"><span className={statusColor(b.status)}>{b.status}</span></td>
                    <td className="table-cell">
                      <div className="flex gap-1">
                        <button onClick={() => viewBooking(b.id)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded"><FiEye size={14} /></button>
                        {b.status === 'confirmed' && <button onClick={() => handleCancel(b.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><FiXCircle size={14} /></button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">Booking Details</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Code</span><span className="font-mono font-medium">{selected.booking_code}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Passenger</span><span>{selected.passenger_name}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Route</span><span>{selected.origin} → {selected.destination}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Seat</span><span>{selected.seat_number}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Amount</span><span className="font-medium">₱{(selected.amount || 0).toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Status</span><span className={statusColor(selected.status)}>{selected.status}</span></div>
            </div>
            <div className="flex justify-end mt-6"><button onClick={() => setSelected(null)} className="btn-secondary">Close</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
