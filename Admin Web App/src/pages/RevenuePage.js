import React, { useState } from 'react';
import { FiDownload } from 'react-icons/fi';

const monthlyData = [
  { month: 'Aug 2024', revenue: 2850000, bookings: 4200, avg_ticket: 678 },
  { month: 'Sep 2024', revenue: 3100000, bookings: 4500, avg_ticket: 688 },
  { month: 'Oct 2024', revenue: 3250000, bookings: 4800, avg_ticket: 677 },
  { month: 'Nov 2024', revenue: 3520000, bookings: 5100, avg_ticket: 690 },
  { month: 'Dec 2024', revenue: 4100000, bookings: 6200, avg_ticket: 661 },
  { month: 'Jan 2025', revenue: 3780000, bookings: 5500, avg_ticket: 687 },
];

const routeRevenue = [
  { route: 'Manila → Naga', revenue: 1250000, pct: 33 },
  { route: 'Manila → Legazpi', revenue: 980000, pct: 26 },
  { route: 'Manila → Sorsogon', revenue: 650000, pct: 17 },
  { route: 'Manila → Daet', revenue: 420000, pct: 11 },
  { route: 'Manila → Tabaco', revenue: 280000, pct: 7 },
  { route: 'Others', revenue: 200000, pct: 6 },
];

const paymentBreakdown = [
  { method: 'GV Wallet', amount: 1510000, pct: 40, color: '#D90045' },
  { method: 'GCash', amount: 1134000, pct: 30, color: '#007bff' },
  { method: 'Cash', amount: 756000, pct: 20, color: '#28a745' },
  { method: 'Counter', amount: 378000, pct: 10, color: '#ff6f00' },
];

export default function RevenuePage() {
  const [period, setPeriod] = useState('monthly');

  const totalRevenue = 3780000;
  const growthPct = -7.8; // from Dec peak

  return (
    <>
      <div className="topbar">
        <h2>Revenue Reports</h2>
        <button className="btn btn-outline"><FiDownload /> Export</button>
      </div>
      <div className="page-content">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
          <div className="stat-card"><div className="stat-value" style={{ color: 'var(--primary)' }}>₱3.78M</div><div className="stat-label">This Month</div></div>
          <div className="stat-card"><div className="stat-value" style={{ color: 'var(--success)' }}>₱21.6M</div><div className="stat-label">Last 6 Months</div></div>
          <div className="stat-card"><div className="stat-value" style={{ color: 'var(--info)' }}>₱687</div><div className="stat-label">Avg Ticket Price</div></div>
          <div className="stat-card"><div className="stat-value" style={{ color: '#ff6f00' }}>5,500</div><div className="stat-label">Total Bookings</div></div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 20 }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0 }}>Monthly Revenue</h3>
              <select className="input select" style={{ width: 140 }} value={period} onChange={e => setPeriod(e.target.value)}>
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
                <option value="daily">Daily</option>
              </select>
            </div>
            <div className="chart-placeholder" style={{ height: 240 }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: '100%', padding: '20px 0' }}>
                {monthlyData.map((m, i) => (
                  <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{
                      height: `${(m.revenue / 4200000) * 160}px`,
                      background: `linear-gradient(180deg, var(--primary) 0%, #ff6f00 100%)`,
                      borderRadius: '6px 6px 0 0',
                      marginBottom: 4,
                      minHeight: 20,
                    }} />
                    <div style={{ fontSize: 11, color: '#888' }}>{m.month.split(' ')[0]}</div>
                    <div style={{ fontSize: 11, fontWeight: 600 }}>₱{(m.revenue / 1000000).toFixed(1)}M</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginTop: 0 }}>Payment Methods</h3>
            {paymentBreakdown.map((p, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
                  <span style={{ fontWeight: 600 }}>{p.method}</span>
                  <span>₱{(p.amount / 1000000).toFixed(2)}M ({p.pct}%)</span>
                </div>
                <div style={{ height: 8, background: '#f0f0f0', borderRadius: 4 }}>
                  <div style={{ width: `${p.pct}%`, height: '100%', background: p.color, borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>Revenue by Route</h3>
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Route</th><th>Revenue</th><th>Share</th><th>Trend</th></tr></thead>
              <tbody>
                {routeRevenue.map((r, i) => (
                  <tr key={i}>
                    <td><strong>{r.route}</strong></td>
                    <td>₱{r.revenue.toLocaleString()}</td>
                    <td><span className="badge badge-primary">{r.pct}%</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ flex: 1, height: 6, background: '#f0f0f0', borderRadius: 3, maxWidth: 120 }}>
                          <div style={{ width: `${r.pct}%`, height: '100%', background: 'var(--primary)', borderRadius: 3 }} />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
