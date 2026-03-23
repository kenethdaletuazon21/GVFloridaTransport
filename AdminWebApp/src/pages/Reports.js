import React, { useState, useEffect } from 'react';
import { FiBarChart2, FiDownload, FiCalendar, FiDollarSign, FiTruck, FiUsers } from 'react-icons/fi';
import { Line, Bar } from 'react-chartjs-2';
import { reportAPI } from '../services/api';
import { toast } from 'react-toastify';

export default function Reports() {
  const [activeTab, setActiveTab] = useState('revenue');
  const [revenueData, setRevenueData] = useState(null);
  const [tripData, setTripData] = useState(null);
  const [employeeData, setEmployeeData] = useState(null);
  const [period, setPeriod] = useState('weekly');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadReport(); }, [activeTab, period]);

  const loadReport = async () => {
    setLoading(true);
    try {
      if (activeTab === 'revenue') {
        const { data } = await reportAPI.getRevenue({ period });
        setRevenueData(data);
      } else if (activeTab === 'trips') {
        const { data } = await reportAPI.getTrips({ period });
        setTripData(data);
      } else if (activeTab === 'employees') {
        const { data } = await reportAPI.getEmployees({ period });
        setEmployeeData(data);
      }
    } catch (err) { console.error('Report load error:', err); }
    finally { setLoading(false); }
  };

  const tabs = [
    { id: 'revenue', label: 'Revenue', icon: FiDollarSign },
    { id: 'trips', label: 'Trip Performance', icon: FiTruck },
    { id: 'employees', label: 'Employee Productivity', icon: FiUsers },
  ];

  const revenueChart = {
    labels: revenueData?.data?.map(r => r.label) || ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'Revenue (PHP)',
      data: revenueData?.data?.map(r => r.amount) || [320000, 410000, 380000, 450000],
      borderColor: '#1a5276',
      backgroundColor: 'rgba(26, 82, 118, 0.15)',
      fill: true,
      tension: 0.4,
    }],
  };

  const tripChart = {
    labels: tripData?.data?.map(r => r.route_name) || ['Manila-Tuguegarao', 'Manila-Santiago', 'Manila-Ilagan', 'Manila-Cauayan', 'Manila-Tabuk'],
    datasets: [
      { label: 'Completed', data: tripData?.data?.map(r => r.completed) || [45, 38, 32, 28, 20], backgroundColor: '#27ae60', borderRadius: 4 },
      { label: 'Cancelled', data: tripData?.data?.map(r => r.cancelled) || [3, 2, 1, 2, 1], backgroundColor: '#e74c3c', borderRadius: 4 },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title flex items-center gap-2"><FiBarChart2 /> Reports & Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Insights and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <select value={period} onChange={e => setPeriod(e.target.value)} className="input-field w-auto">
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <button className="btn-secondary flex items-center gap-2"><FiDownload size={14} /> Export</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-white shadow text-primary-600' : 'text-gray-600 hover:text-gray-800'}`}>
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div></div>
      ) : (
        <>
          {activeTab === 'revenue' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="card text-center"><p className="text-sm text-gray-500">Total Revenue</p><p className="text-3xl font-bold text-primary-600">₱{(revenueData?.total || 1560000).toLocaleString()}</p></div>
                <div className="card text-center"><p className="text-sm text-gray-500">Average per Trip</p><p className="text-3xl font-bold text-green-600">₱{(revenueData?.avg_per_trip || 8500).toLocaleString()}</p></div>
                <div className="card text-center"><p className="text-sm text-gray-500">Growth</p><p className="text-3xl font-bold text-blue-600">+{revenueData?.growth || 12}%</p></div>
              </div>
              <div className="card"><Line data={revenueChart} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { callback: v => '₱' + (v / 1000) + 'k' } } } }} /></div>
            </div>
          )}

          {activeTab === 'trips' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="card text-center"><p className="text-sm text-gray-500">Total Trips</p><p className="text-3xl font-bold text-primary-600">{tripData?.total || 163}</p></div>
                <div className="card text-center"><p className="text-sm text-gray-500">Avg Occupancy</p><p className="text-3xl font-bold text-green-600">{tripData?.avg_occupancy || 78}%</p></div>
                <div className="card text-center"><p className="text-sm text-gray-500">On-Time Rate</p><p className="text-3xl font-bold text-blue-600">{tripData?.on_time_rate || 92}%</p></div>
              </div>
              <div className="card"><Bar data={tripChart} options={{ responsive: true, plugins: { legend: { position: 'top' } }, scales: { x: { stacked: false }, y: { beginAtZero: true } } }} /></div>
            </div>
          )}

          {activeTab === 'employees' && (
            <div className="space-y-6">
              <div className="card overflow-hidden p-0">
                <table className="w-full">
                  <thead className="bg-gray-50"><tr>
                    <th className="table-header">Employee</th><th className="table-header">Role</th><th className="table-header">Trips</th><th className="table-header">Hours</th><th className="table-header">Rating</th><th className="table-header">Performance</th>
                  </tr></thead>
                  <tbody className="divide-y divide-gray-100">
                    {(employeeData?.employees || [
                      { name: 'Juan Cruz', role: 'Driver', trips: 28, hours: 168, rating: 4.8, perf: 95 },
                      { name: 'Maria Santos', role: 'Conductor', trips: 32, hours: 180, rating: 4.6, perf: 90 },
                      { name: 'Pedro Reyes', role: 'Driver', trips: 25, hours: 155, rating: 4.9, perf: 98 },
                      { name: 'Ana Dela Cruz', role: 'Inspector', trips: 40, hours: 160, rating: 4.7, perf: 92 },
                    ]).map((e, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="table-cell font-medium">{e.name}</td>
                        <td className="table-cell capitalize">{e.role}</td>
                        <td className="table-cell">{e.trips}</td>
                        <td className="table-cell">{e.hours}h</td>
                        <td className="table-cell">⭐ {e.rating}</td>
                        <td className="table-cell">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2"><div className="bg-green-500 h-2 rounded-full" style={{ width: `${e.perf}%` }}></div></div>
                            <span className="text-xs font-medium">{e.perf}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
