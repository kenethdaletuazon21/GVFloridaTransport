import React, { useState } from 'react';
import { FiPackage, FiPlus, FiSearch, FiCheck, FiX } from 'react-icons/fi';

export default function LostFound() {
  const [items, setItems] = useState([
    { id: 1, item: 'Black Backpack', description: 'Nike black backpack with laptop inside', bus_number: 'MNL-001', route: 'Manila → Tuguegarao', date_found: '2024-01-20', status: 'unclaimed', reported_by: 'Juan Cruz' },
    { id: 2, item: 'Umbrella', description: 'Blue folding umbrella', bus_number: 'MNL-003', route: 'Manila → Santiago', date_found: '2024-01-19', status: 'claimed', reported_by: 'Maria Santos' },
    { id: 3, item: 'Phone Charger', description: 'Samsung USB-C charger with cable', bus_number: 'MNL-007', route: 'Manila → Ilagan', date_found: '2024-01-18', status: 'unclaimed', reported_by: 'Pedro Reyes' },
    { id: 4, item: 'Eyeglasses', description: 'Prescription glasses in brown case', bus_number: 'MNL-012', route: 'Manila → Cauayan', date_found: '2024-01-17', status: 'unclaimed', reported_by: 'Jose Santos' },
    { id: 5, item: 'Water Bottle', description: 'Stainless steel water bottle, blue', bus_number: 'MNL-005', route: 'Manila → Tabuk', date_found: '2024-01-15', status: 'disposed', reported_by: 'Ana Cruz' },
  ]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const markClaimed = (id) => setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'claimed' } : i));

  const filtered = items.filter(i => {
    const matchSearch = !search || i.item.toLowerCase().includes(search.toLowerCase()) || i.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || i.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusColor = (s) => ({ unclaimed: 'badge-warning', claimed: 'badge-success', disposed: 'badge-danger' }[s] || 'badge-info');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div><h1 className="page-title flex items-center gap-2"><FiPackage /> Lost & Found</h1><p className="text-sm text-gray-500 mt-1">{items.filter(i => i.status === 'unclaimed').length} unclaimed items</p></div>
        <button className="btn-primary flex items-center gap-2"><FiPlus size={16} /> Report Item</button>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative"><FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search items..." className="input-field pl-10" /></div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-field w-auto"><option value="">All Status</option><option value="unclaimed">Unclaimed</option><option value="claimed">Claimed</option><option value="disposed">Disposed</option></select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(item => (
          <div key={item.id} className="card-hover">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{item.item}</h3>
                <p className="text-sm text-gray-500 mt-1">{item.description}</p>
              </div>
              <span className={statusColor(item.status)}>{item.status}</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
              <p>Bus: <span className="font-medium text-gray-700">{item.bus_number}</span></p>
              <p>Route: <span className="font-medium text-gray-700">{item.route}</span></p>
              <p>Found: <span className="font-medium text-gray-700">{item.date_found}</span></p>
              <p>By: <span className="font-medium text-gray-700">{item.reported_by}</span></p>
            </div>
            {item.status === 'unclaimed' && (
              <div className="mt-3 flex gap-2">
                <button onClick={() => markClaimed(item.id)} className="btn-success text-xs py-1 px-3 flex items-center gap-1"><FiCheck size={12} /> Mark Claimed</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
