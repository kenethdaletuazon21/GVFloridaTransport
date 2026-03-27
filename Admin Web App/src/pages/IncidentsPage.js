import React, { useState } from 'react';
import { FiSearch, FiAlertTriangle, FiEye } from 'react-icons/fi';

const initialIncidents = [
  { id: 1, type: 'Mechanical', severity: 'high', trip: 'T-20250120-001', bus: 'GVF-003', location: 'Km 45, Quezon', reporter: 'Carlos Reyes (DRV-2024-001)', description: 'Engine overheating warning. Pulled over for cooldown.', status: 'resolved', date: '2025-01-20 14:30' },
  { id: 2, type: 'Accident', severity: 'critical', trip: 'T-20250119-005', bus: 'GVF-005', location: 'SLEX Km 32', reporter: 'Roberto Cruz (DRV-2024-002)', description: 'Minor fender bender in traffic. No injuries.', status: 'investigating', date: '2025-01-19 08:15' },
  { id: 3, type: 'Medical', severity: 'medium', trip: 'T-20250118-003', bus: 'GVF-001', location: 'Lucena Terminal', reporter: 'Lina Marquez (CND-2024-001)', description: 'Passenger felt dizzy. First aid administered.', status: 'resolved', date: '2025-01-18 11:45' },
  { id: 4, type: 'Security', severity: 'medium', trip: 'T-20250118-007', bus: 'GVF-007', location: 'Daet Bus Stop', reporter: 'Antonio Ramos (INS-2024-001)', description: 'Unattended bag reported. Cleared after inspection.', status: 'resolved', date: '2025-01-18 16:20' },
  { id: 5, type: 'Delay', severity: 'low', trip: 'T-20250117-002', bus: 'GVF-002', location: 'EDSA Cubao', reporter: 'Elena Cruz (DSP-2024-001)', description: 'Departure delayed 45 min due to heavy traffic.', status: 'resolved', date: '2025-01-17 06:30' },
  { id: 6, type: 'Passenger', severity: 'low', trip: 'T-20250117-009', bus: 'GVF-004', location: 'Naga Terminal', reporter: 'Lina Marquez (CND-2024-001)', description: 'Passenger complaint about AC not working properly.', status: 'open', date: '2025-01-17 19:10' },
  { id: 7, type: 'Mechanical', severity: 'medium', trip: 'T-20250116-004', bus: 'GVF-008', location: 'Km 120, Camarines Sur', reporter: 'Miguel Torres (DRV-2024-003)', description: 'Flat tire. Replaced within 30 minutes.', status: 'resolved', date: '2025-01-16 13:55' },
];

export default function IncidentsPage() {
  const [incidents] = useState(initialIncidents);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const filtered = incidents.filter(inc => {
    if (statusFilter !== 'all' && inc.status !== statusFilter) return false;
    return `${inc.type} ${inc.bus} ${inc.reporter} ${inc.description}`.toLowerCase().includes(search.toLowerCase());
  });

  const severityBadge = (s) => {
    if (s === 'critical') return { background: '#D90045', color: '#fff' };
    if (s === 'high') return { background: '#ff6f00', color: '#fff' };
    if (s === 'medium') return { background: '#fbc02d', color: '#333' };
    return { background: '#e0e0e0', color: '#555' };
  };

  const statusBadge = (s) => {
    if (s === 'resolved') return 'badge-success';
    if (s === 'investigating') return 'badge-warning';
    return 'badge-primary';
  };

  return (
    <>
      <div className="topbar">
        <h2>Incident Reports</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FiAlertTriangle color="#D90045" />
          <span style={{ fontWeight: 600, color: '#D90045' }}>{incidents.filter(i => i.status !== 'resolved').length} Open</span>
        </div>
      </div>
      <div className="page-content">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
          <div className="stat-card"><div className="stat-value" style={{ color: 'var(--primary)' }}>{incidents.length}</div><div className="stat-label">Total Incidents</div></div>
          <div className="stat-card"><div className="stat-value" style={{ color: '#D90045' }}>{incidents.filter(i => i.severity === 'critical').length}</div><div className="stat-label">Critical</div></div>
          <div className="stat-card"><div className="stat-value" style={{ color: 'var(--success)' }}>{incidents.filter(i => i.status === 'resolved').length}</div><div className="stat-label">Resolved</div></div>
          <div className="stat-card"><div className="stat-value" style={{ color: '#ff6f00' }}>{incidents.filter(i => i.status === 'open' || i.status === 'investigating').length}</div><div className="stat-label">Pending</div></div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <div className="search-bar" style={{ flex: 1, minWidth: 200 }}>
              <FiSearch />
              <input className="input" placeholder="Search incidents..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="input select" style={{ width: 160 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Date</th><th>Type</th><th>Severity</th><th>Bus</th><th>Location</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {filtered.map(inc => (
                  <tr key={inc.id}>
                    <td style={{ whiteSpace: 'nowrap', fontSize: 13 }}>{inc.date}</td>
                    <td><strong>{inc.type}</strong></td>
                    <td><span className="badge" style={severityBadge(inc.severity)}>{inc.severity}</span></td>
                    <td>{inc.bus}</td>
                    <td style={{ fontSize: 13 }}>{inc.location}</td>
                    <td><span className={`badge ${statusBadge(inc.status)}`} style={{ textTransform: 'capitalize' }}>{inc.status}</span></td>
                    <td><button className="btn btn-sm btn-outline" onClick={() => setSelected(inc)}><FiEye /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0 }}>Incident Detail</h3>
              <span className="badge" style={severityBadge(selected.severity)}>{selected.severity.toUpperCase()}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 14, marginBottom: 16 }}>
              <div><strong>Type:</strong> {selected.type}</div>
              <div><strong>Status:</strong> <span className={`badge ${statusBadge(selected.status)}`} style={{ textTransform: 'capitalize' }}>{selected.status}</span></div>
              <div><strong>Trip:</strong> {selected.trip}</div>
              <div><strong>Bus:</strong> {selected.bus}</div>
              <div><strong>Date:</strong> {selected.date}</div>
              <div><strong>Location:</strong> {selected.location}</div>
              <div style={{ gridColumn: '1/-1' }}><strong>Reporter:</strong> {selected.reporter}</div>
              <div style={{ gridColumn: '1/-1' }}><strong>Description:</strong><br/>{selected.description}</div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              {selected.status !== 'resolved' && <button className="btn btn-primary" onClick={() => setSelected(null)}>Mark Resolved</button>}
              <button className="btn btn-outline" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
