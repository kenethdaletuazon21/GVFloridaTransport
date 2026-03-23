import React, { useState, useEffect } from 'react';
import { FiTool, FiPlus, FiSearch, FiCalendar } from 'react-icons/fi';
import { fleetAPI } from '../services/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

export default function Maintenance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [busId, setBusId] = useState('');
  const [form, setForm] = useState({ type: 'scheduled', description: '', cost: '', date: '' });

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    try {
      const { data } = await fleetAPI.getAll();
      const buses = data.buses || data || [];
      const allRecords = [];
      for (const bus of buses.slice(0, 20)) {
        try {
          const { data: maint } = await fleetAPI.getMaintenance(bus.id);
          (maint.records || maint || []).forEach(r => allRecords.push({ ...r, bus_number: bus.bus_number }));
        } catch {}
      }
      setRecords(allRecords);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const demoRecords = records.length > 0 ? records : [
    { id: 1, bus_number: 'MNL-001', type: 'scheduled', description: 'Oil change and filter replacement', cost: 5500, date: '2024-01-15', status: 'completed' },
    { id: 2, bus_number: 'MNL-003', type: 'repair', description: 'Brake pad replacement', cost: 8200, date: '2024-01-18', status: 'completed' },
    { id: 3, bus_number: 'MNL-007', type: 'scheduled', description: 'Tire rotation and inspection', cost: 3800, date: '2024-01-20', status: 'in_progress' },
    { id: 4, bus_number: 'MNL-012', type: 'emergency', description: 'Engine overheating - radiator repair', cost: 15000, date: '2024-01-22', status: 'in_progress' },
    { id: 5, bus_number: 'MNL-005', type: 'scheduled', description: 'AC servicing and refrigerant refill', cost: 6500, date: '2024-01-25', status: 'scheduled' },
  ];

  const typeColor = (t) => ({ scheduled: 'badge-info', repair: 'badge-warning', emergency: 'badge-danger' }[t] || 'badge-info');
  const statusColor = (s) => ({ completed: 'badge-success', in_progress: 'badge-warning', scheduled: 'badge-info' }[s] || 'badge-info');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div><h1 className="page-title flex items-center gap-2"><FiTool /> Maintenance</h1><p className="text-sm text-gray-500 mt-1">Fleet maintenance records</p></div>
        <button onClick={() => setShowAdd(!showAdd)} className="btn-primary flex items-center gap-2"><FiPlus size={16} /> Add Record</button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card text-center"><p className="text-sm text-gray-500">Total Records</p><p className="text-2xl font-bold">{demoRecords.length}</p></div>
        <div className="card text-center"><p className="text-sm text-gray-500">In Progress</p><p className="text-2xl font-bold text-yellow-600">{demoRecords.filter(r => r.status === 'in_progress').length}</p></div>
        <div className="card text-center"><p className="text-sm text-gray-500">Scheduled</p><p className="text-2xl font-bold text-blue-600">{demoRecords.filter(r => r.status === 'scheduled').length}</p></div>
        <div className="card text-center"><p className="text-sm text-gray-500">Total Cost</p><p className="text-2xl font-bold text-primary-600">₱{demoRecords.reduce((s, r) => s + (r.cost || 0), 0).toLocaleString()}</p></div>
      </div>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto"><table className="w-full"><thead className="bg-gray-50"><tr>
          <th className="table-header">Bus</th><th className="table-header">Type</th><th className="table-header">Description</th><th className="table-header">Cost</th><th className="table-header">Date</th><th className="table-header">Status</th>
        </tr></thead><tbody className="divide-y divide-gray-100">
          {demoRecords.map(r => (
            <tr key={r.id} className="hover:bg-gray-50">
              <td className="table-cell font-medium">{r.bus_number}</td>
              <td className="table-cell"><span className={typeColor(r.type)}>{r.type}</span></td>
              <td className="table-cell max-w-xs truncate">{r.description}</td>
              <td className="table-cell font-medium">₱{(r.cost || 0).toLocaleString()}</td>
              <td className="table-cell">{r.date}</td>
              <td className="table-cell"><span className={statusColor(r.status)}>{r.status?.replace('_', ' ')}</span></td>
            </tr>
          ))}
        </tbody></table></div>
      </div>
    </div>
  );
}
