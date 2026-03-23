import React, { useState } from 'react';
import { FiTag, FiPlus, FiEdit2, FiTrash2, FiCalendar } from 'react-icons/fi';
import { toast } from 'react-toastify';

export default function Promotions() {
  const [promos, setPromos] = useState([
    { id: 1, code: 'SUMMER2024', type: 'percentage', value: 20, description: '20% off all Super Deluxe trips', min_purchase: 500, max_discount: 300, start_date: '2024-06-01', end_date: '2024-08-31', usage_limit: 1000, used: 342, status: 'active' },
    { id: 2, code: 'NEWUSER50', type: 'fixed', value: 50, description: '₱50 off for new users', min_purchase: 300, max_discount: 50, start_date: '2024-01-01', end_date: '2024-12-31', usage_limit: 5000, used: 1245, status: 'active' },
    { id: 3, code: 'HOLIDAY100', type: 'fixed', value: 100, description: '₱100 off during holiday season', min_purchase: 800, max_discount: 100, start_date: '2024-12-15', end_date: '2025-01-05', usage_limit: 500, used: 0, status: 'scheduled' },
    { id: 4, code: 'FLASH30', type: 'percentage', value: 30, description: '30% flash sale on all routes', min_purchase: 0, max_discount: 500, start_date: '2024-01-10', end_date: '2024-01-12', usage_limit: 200, used: 200, status: 'expired' },
  ]);
  const [showAdd, setShowAdd] = useState(false);

  const statusColor = (s) => ({ active: 'badge-success', scheduled: 'badge-info', expired: 'badge-danger', paused: 'badge-warning' }[s] || 'badge-info');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div><h1 className="page-title flex items-center gap-2"><FiTag /> Promotions</h1><p className="text-sm text-gray-500 mt-1">{promos.filter(p => p.status === 'active').length} active promotions</p></div>
        <button onClick={() => setShowAdd(!showAdd)} className="btn-primary flex items-center gap-2"><FiPlus size={16} /> Create Promotion</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card text-center"><p className="text-sm text-gray-500">Active Promos</p><p className="text-2xl font-bold text-green-600">{promos.filter(p => p.status === 'active').length}</p></div>
        <div className="card text-center"><p className="text-sm text-gray-500">Total Redemptions</p><p className="text-2xl font-bold text-primary-600">{promos.reduce((s, p) => s + p.used, 0).toLocaleString()}</p></div>
        <div className="card text-center"><p className="text-sm text-gray-500">Scheduled</p><p className="text-2xl font-bold text-blue-600">{promos.filter(p => p.status === 'scheduled').length}</p></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {promos.map(promo => (
          <div key={promo.id} className="card-hover">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-lg">{promo.code}</span>
                  <span className={statusColor(promo.status)}>{promo.status}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{promo.description}</p>
              </div>
              <div className="flex gap-1">
                <button className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"><FiEdit2 size={14} /></button>
                <button className="p-1.5 text-red-500 hover:bg-red-50 rounded"><FiTrash2 size={14} /></button>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
              <div><span className="text-gray-400">Discount</span><p className="font-medium text-gray-700">{promo.type === 'percentage' ? `${promo.value}%` : `₱${promo.value}`}</p></div>
              <div><span className="text-gray-400">Min Purchase</span><p className="font-medium text-gray-700">₱{promo.min_purchase}</p></div>
              <div><span className="text-gray-400">Max Discount</span><p className="font-medium text-gray-700">₱{promo.max_discount}</p></div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-400"><FiCalendar size={12} />{promo.start_date} → {promo.end_date}</div>
              <div className="text-xs"><span className="font-medium text-gray-700">{promo.used}</span><span className="text-gray-400">/{promo.usage_limit} used</span></div>
            </div>
            {/* Usage Bar */}
            <div className="mt-2 bg-gray-100 rounded-full h-1.5"><div className="bg-primary-500 h-1.5 rounded-full" style={{ width: `${Math.min((promo.used / promo.usage_limit) * 100, 100)}%` }}></div></div>
          </div>
        ))}
      </div>
    </div>
  );
}
