import React, { useState, useEffect } from 'react';
import { FiTruck, FiUsers, FiDollarSign, FiStar, FiAlertTriangle, FiTrendingUp, FiActivity, FiCalendar } from 'react-icons/fi';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { dashboardAPI } from '../services/api';
import socketService from '../services/socket';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

function StatCard({ icon: Icon, label, value, change, color, bgColor }) {
  return (
    <div className="stat-card">
      <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center`}>
        <Icon size={22} className={color} />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        {change && <p className={`text-xs font-medium ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>{change > 0 ? '+' : ''}{change}% from last month</p>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    loadDashboard();
    socketService.on('sos:alert', handleSOSAlert);
    socketService.on('bus:breakdown', handleBreakdownAlert);
    return () => {
      socketService.off('sos:alert', handleSOSAlert);
      socketService.off('bus:breakdown', handleBreakdownAlert);
    };
  }, []);

  const handleSOSAlert = (data) => setAlerts(prev => [{ type: 'sos', ...data, time: new Date() }, ...prev].slice(0, 10));
  const handleBreakdownAlert = (data) => setAlerts(prev => [{ type: 'breakdown', ...data, time: new Date() }, ...prev].slice(0, 10));

  const loadDashboard = async () => {
    try {
      const [summaryRes, revenueRes] = await Promise.all([
        dashboardAPI.getSummary(),
        dashboardAPI.getRevenue({ period: 'weekly' }),
      ]);
      setSummary(summaryRes.data);
      setRevenue(revenueRes.data);
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const revenueChartData = {
    labels: revenue?.data?.map(r => r.label) || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Revenue (PHP)',
      data: revenue?.data?.map(r => r.amount) || [45000, 52000, 48000, 61000, 55000, 72000, 68000],
      borderColor: '#1a5276',
      backgroundColor: 'rgba(26, 82, 118, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: '#1a5276',
    }],
  };

  const tripChartData = {
    labels: ['Completed', 'In Progress', 'Cancelled', 'Scheduled'],
    datasets: [{
      data: [summary?.completed_trips || 145, summary?.active_trips || 12, summary?.cancelled_trips || 8, summary?.scheduled_trips || 34],
      backgroundColor: ['#27ae60', '#3498db', '#e74c3c', '#f39c12'],
      borderWidth: 0,
    }],
  };

  const busTypeData = {
    labels: ['Deluxe', 'Super Deluxe', 'Regular'],
    datasets: [{
      label: 'Active Buses',
      data: [18, 12, 8],
      backgroundColor: ['#1a5276', '#e74c3c', '#f39c12'],
      borderRadius: 8,
    }],
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FiCalendar size={14} />
          <span>{new Date().toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Alert Bar */}
      {alerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-red-700 font-semibold mb-2">
            <FiAlertTriangle size={18} /> Active Alerts ({alerts.length})
          </div>
          {alerts.slice(0, 3).map((alert, i) => (
            <div key={i} className="flex items-center justify-between text-sm py-1">
              <span className="text-red-600">{alert.type === 'sos' ? '🚨 SOS' : '🔧 Breakdown'}: {alert.message || 'Alert triggered'}</span>
              <span className="text-red-400 text-xs">{alert.time?.toLocaleTimeString()}</span>
            </div>
          ))}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FiDollarSign} label="Today's Revenue" value={`₱${(summary?.today_revenue || 125000).toLocaleString()}`} change={12} color="text-blue-600" bgColor="bg-blue-50" />
        <StatCard icon={FiTruck} label="Active Buses" value={summary?.active_buses || 24} change={5} color="text-green-600" bgColor="bg-green-50" />
        <StatCard icon={FiUsers} label="Passengers Today" value={(summary?.today_passengers || 1284).toLocaleString()} change={8} color="text-purple-600" bgColor="bg-purple-50" />
        <StatCard icon={FiStar} label="Avg Rating" value={summary?.avg_rating || '4.7'} change={2} color="text-yellow-600" bgColor="bg-yellow-50" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title flex items-center gap-2"><FiTrendingUp size={18} /> Revenue Trend</h3>
          </div>
          <Line data={revenueChartData} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { callback: v => '₱' + v.toLocaleString() } } } }} />
        </div>
        <div className="card">
          <h3 className="section-title mb-4">Trip Status</h3>
          <Doughnut data={tripChartData} options={{ responsive: true, plugins: { legend: { position: 'bottom', labels: { padding: 15, usePointStyle: true } } }, cutout: '65%' }} />
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="section-title mb-4 flex items-center gap-2"><FiActivity size={18} /> Bus Fleet by Type</h3>
          <Bar data={busTypeData} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }} />
        </div>
        <div className="card">
          <h3 className="section-title mb-4">Recent Activities</h3>
          <div className="space-y-3">
            {[
              { text: 'Bus MNL-001 departed from Sampaloc Terminal', time: '2 min ago', color: 'bg-green-500' },
              { text: 'New booking #BK-1284 confirmed (Manila → Tuguegarao)', time: '5 min ago', color: 'bg-blue-500' },
              { text: 'Driver Juan Cruz started shift', time: '15 min ago', color: 'bg-purple-500' },
              { text: 'Maintenance completed for Bus MNL-008', time: '1 hr ago', color: 'bg-yellow-500' },
              { text: 'Payroll batch #45 approved', time: '2 hrs ago', color: 'bg-gray-500' },
              { text: 'New route added: Manila → Banaue via Solano', time: '3 hrs ago', color: 'bg-primary-500' },
            ].map((activity, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-2 h-2 ${activity.color} rounded-full mt-2 shrink-0`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">{activity.text}</p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
