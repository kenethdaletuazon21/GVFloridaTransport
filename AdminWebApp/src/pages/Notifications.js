import React, { useState, useEffect } from 'react';
import { FiBell, FiCheck, FiCheckCircle, FiSend, FiTrash2 } from 'react-icons/fi';
import { notificationAPI } from '../services/api';
import { toast } from 'react-toastify';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSend, setShowSend] = useState(false);
  const [form, setForm] = useState({ title: '', message: '', target: 'all' });

  useEffect(() => { loadNotifications(); }, []);

  const loadNotifications = async () => {
    try {
      const { data } = await notificationAPI.getAll();
      setNotifications(data.notifications || data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const markRead = async (id) => {
    try { await notificationAPI.markRead(id); loadNotifications(); }
    catch (err) { console.error(err); }
  };

  const markAllRead = async () => {
    try { await notificationAPI.markAllRead(); toast.success('All marked as read'); loadNotifications(); }
    catch (err) { toast.error('Failed'); }
  };

  const sendNotification = async (e) => {
    e.preventDefault();
    try { await notificationAPI.send(form); toast.success('Notification sent'); setShowSend(false); setForm({ title: '', message: '', target: 'all' }); }
    catch (err) { toast.error('Send failed'); }
  };

  const demoNotifs = notifications.length > 0 ? notifications : [
    { id: 1, title: 'SOS Alert', message: 'Bus MNL-007 triggered SOS near Bayombong', type: 'sos', read: false, created_at: '2024-01-22T14:30:00' },
    { id: 2, title: 'Booking Surge', message: 'High booking volume for Jan 25 Manila-Tuguegarao route', type: 'info', read: false, created_at: '2024-01-22T12:00:00' },
    { id: 3, title: 'Maintenance Due', message: 'Bus MNL-012 scheduled maintenance overdue by 2 days', type: 'warning', read: false, created_at: '2024-01-22T09:15:00' },
    { id: 4, title: 'Trip Completed', message: 'Trip #T-456 Manila→Santiago completed on time', type: 'success', read: true, created_at: '2024-01-21T22:00:00' },
    { id: 5, title: 'New Employee', message: 'Carlo Mendoza registered as new driver', type: 'info', read: true, created_at: '2024-01-21T10:00:00' },
  ];

  const typeStyle = (t) => ({
    sos: 'border-l-4 border-red-500 bg-red-50',
    warning: 'border-l-4 border-yellow-500 bg-yellow-50',
    success: 'border-l-4 border-green-500 bg-green-50',
    info: 'border-l-4 border-blue-500 bg-blue-50',
  }[t] || 'border-l-4 border-gray-300');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div><h1 className="page-title flex items-center gap-2"><FiBell /> Notifications</h1><p className="text-sm text-gray-500 mt-1">{demoNotifs.filter(n => !n.read).length} unread</p></div>
        <div className="flex gap-2">
          <button onClick={markAllRead} className="btn-secondary flex items-center gap-2"><FiCheckCircle size={14} /> Mark All Read</button>
          <button onClick={() => setShowSend(!showSend)} className="btn-primary flex items-center gap-2"><FiSend size={14} /> Send</button>
        </div>
      </div>

      {showSend && (
        <div className="card">
          <h3 className="section-title mb-4">Send Notification</h3>
          <form onSubmit={sendNotification} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1">Title</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input-field" required /></div>
              <div><label className="block text-sm font-medium mb-1">Target</label><select value={form.target} onChange={e => setForm({ ...form, target: e.target.value })} className="input-field"><option value="all">All Users</option><option value="passengers">Passengers</option><option value="staff">Staff</option><option value="drivers">Drivers</option></select></div>
            </div>
            <div><label className="block text-sm font-medium mb-1">Message</label><textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="input-field" rows={3} required /></div>
            <div className="flex justify-end gap-3"><button type="button" onClick={() => setShowSend(false)} className="btn-secondary">Cancel</button><button type="submit" className="btn-primary">Send</button></div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {demoNotifs.map(n => (
          <div key={n.id} className={`card ${typeStyle(n.type)} ${!n.read ? 'font-medium' : 'opacity-75'}`}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold">{n.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                <p className="text-xs text-gray-400 mt-2">{new Date(n.created_at).toLocaleString()}</p>
              </div>
              {!n.read && <button onClick={() => markRead(n.id)} className="p-1.5 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded" title="Mark read"><FiCheck size={14} /></button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
