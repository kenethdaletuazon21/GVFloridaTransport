import React, { useState } from 'react';
import { FiFileText, FiSearch, FiFilter, FiDownload } from 'react-icons/fi';

export default function AuditLog() {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  const logs = [
    { id: 1, user: 'Admin User', action: 'LOGIN', details: 'Admin logged in from 192.168.1.100', timestamp: '2024-01-22T14:32:00', ip: '192.168.1.100' },
    { id: 2, user: 'Admin User', action: 'CREATE', details: 'Created new trip T-789 (Manila → Tuguegarao)', timestamp: '2024-01-22T14:35:00', ip: '192.168.1.100' },
    { id: 3, user: 'HR Manager', action: 'UPDATE', details: 'Updated employee profile: Juan Cruz - salary adjustment', timestamp: '2024-01-22T13:20:00', ip: '192.168.1.105' },
    { id: 4, user: 'Dispatcher', action: 'UPDATE', details: 'Reassigned Bus MNL-003 to Route Manila-Santiago', timestamp: '2024-01-22T12:45:00', ip: '192.168.1.102' },
    { id: 5, user: 'Admin User', action: 'DELETE', details: 'Cancelled booking BK-1290 (refund processed)', timestamp: '2024-01-22T11:30:00', ip: '192.168.1.100' },
    { id: 6, user: 'System', action: 'SYSTEM', details: 'Auto-generated payroll batch #46 for period Jan 16-31', timestamp: '2024-01-22T06:00:00', ip: 'system' },
    { id: 7, user: 'Admin User', action: 'UPDATE', details: 'Updated route fare: Manila-Tuguegarao Deluxe ₱950 → ₱980', timestamp: '2024-01-21T16:00:00', ip: '192.168.1.100' },
    { id: 8, user: 'HR Manager', action: 'CREATE', details: 'Added new employee: Carlo Mendoza (Driver)', timestamp: '2024-01-21T10:00:00', ip: '192.168.1.105' },
    { id: 9, user: 'Admin User', action: 'APPROVE', details: 'Approved payroll batch #45 (₱245,000 total)', timestamp: '2024-01-20T15:30:00', ip: '192.168.1.100' },
    { id: 10, user: 'System', action: 'ALERT', details: 'SOS alert triggered by Bus MNL-007 at coordinates 16.0292, 121.2453', timestamp: '2024-01-20T14:55:00', ip: 'system' },
  ];

  const actionColor = (a) => ({
    LOGIN: 'badge-info', CREATE: 'badge-success', UPDATE: 'badge-warning', DELETE: 'badge-danger', SYSTEM: 'bg-gray-100 text-gray-600', APPROVE: 'badge-success', ALERT: 'badge-danger'
  }[a] || 'badge-info');

  const filtered = logs.filter(l => {
    const matchSearch = !search || l.details.toLowerCase().includes(search.toLowerCase()) || l.user.toLowerCase().includes(search.toLowerCase());
    const matchAction = !actionFilter || l.action === actionFilter;
    return matchSearch && matchAction;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div><h1 className="page-title flex items-center gap-2"><FiFileText /> Audit Log</h1><p className="text-sm text-gray-500 mt-1">System activity history</p></div>
        <button className="btn-secondary flex items-center gap-2"><FiDownload size={14} /> Export Log</button>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative"><FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search logs..." className="input-field pl-10" /></div>
          <select value={actionFilter} onChange={e => setActionFilter(e.target.value)} className="input-field w-auto">
            <option value="">All Actions</option>
            <option value="LOGIN">Login</option><option value="CREATE">Create</option><option value="UPDATE">Update</option><option value="DELETE">Delete</option><option value="APPROVE">Approve</option><option value="SYSTEM">System</option><option value="ALERT">Alert</option>
          </select>
        </div>
      </div>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto"><table className="w-full"><thead className="bg-gray-50"><tr>
          <th className="table-header">Timestamp</th><th className="table-header">User</th><th className="table-header">Action</th><th className="table-header">Details</th><th className="table-header">IP</th>
        </tr></thead><tbody className="divide-y divide-gray-100">
          {filtered.map(log => (
            <tr key={log.id} className="hover:bg-gray-50">
              <td className="table-cell text-xs whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
              <td className="table-cell font-medium">{log.user}</td>
              <td className="table-cell"><span className={actionColor(log.action)}>{log.action}</span></td>
              <td className="table-cell max-w-md">{log.details}</td>
              <td className="table-cell font-mono text-xs">{log.ip}</td>
            </tr>
          ))}
        </tbody></table></div>
      </div>
    </div>
  );
}
