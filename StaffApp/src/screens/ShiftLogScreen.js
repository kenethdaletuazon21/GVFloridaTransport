import React from 'react';
import { FiClock, FiCalendar, FiMapPin } from 'react-icons/fi';
import { format, subDays } from 'date-fns';
import StaffTabs from '../components/StaffTabs';

const demoShifts = [
  { id: 1, date: format(new Date(), 'yyyy-MM-dd'), clockIn: '05:30 AM', clockOut: null, location: 'Cubao Terminal', trips: 1, status: 'active' },
  { id: 2, date: format(subDays(new Date(), 1), 'yyyy-MM-dd'), clockIn: '05:00 AM', clockOut: '06:30 PM', location: 'Cubao Terminal', trips: 2, hours: 13.5, status: 'completed' },
  { id: 3, date: format(subDays(new Date(), 2), 'yyyy-MM-dd'), clockIn: '04:30 AM', clockOut: '05:00 PM', location: 'Cubao Terminal', trips: 2, hours: 12.5, status: 'completed' },
  { id: 4, date: format(subDays(new Date(), 3), 'yyyy-MM-dd'), clockIn: '06:00 AM', clockOut: '07:00 PM', location: 'Pasay Terminal', trips: 2, hours: 13, status: 'completed' },
  { id: 5, date: format(subDays(new Date(), 5), 'yyyy-MM-dd'), clockIn: '05:00 AM', clockOut: '06:00 PM', location: 'Cubao Terminal', trips: 3, hours: 13, status: 'completed' },
];

export default function ShiftLogScreen() {
  const completed = demoShifts.filter(s => s.status === 'completed');
  const totalHours = completed.reduce((sum, s) => sum + (s.hours || 0), 0);

  return (
    <div className="screen">
      <div className="screen-header"><h2>Shift Log</h2></div>
      <div className="screen-body">
        {/* Summary */}
        <div className="stat-grid">
          <div className="stat-card"><div className="stat-value">{completed.length}</div><div className="stat-label">Total Shifts</div></div>
          <div className="stat-card"><div className="stat-value" style={{ color: 'var(--success)' }}>{totalHours}h</div><div className="stat-label">Total Hours</div></div>
          <div className="stat-card"><div className="stat-value" style={{ color: '#ff6f00' }}>{(totalHours / (completed.length || 1)).toFixed(1)}h</div><div className="stat-label">Avg Hours</div></div>
          <div className="stat-card"><div className="stat-value" style={{ color: '#6c63ff' }}>{completed.reduce((sum, s) => sum + (s.trips || 0), 0)}</div><div className="stat-label">Total Trips</div></div>
        </div>

        {/* Shift History */}
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Shift History</h3>
        {demoShifts.map(shift => (
          <div key={shift.id} className="card" style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FiCalendar style={{ color: 'var(--primary)' }} />
                <span style={{ fontWeight: 600, fontSize: 14 }}>{format(new Date(shift.date), 'MMM dd, yyyy')}</span>
              </div>
              <span className={`badge ${shift.status === 'active' ? 'badge-success' : 'badge-primary'}`}>
                {shift.status === 'active' ? 'Active' : `${shift.hours}h`}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--text-light)' }}>
              <span><FiClock style={{ marginRight: 4 }} />{shift.clockIn} — {shift.clockOut || 'In progress'}</span>
              <span><FiMapPin style={{ marginRight: 4 }} />{shift.location}</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 4 }}>{shift.trips} trip{shift.trips !== 1 ? 's' : ''} completed</div>
          </div>
        ))}
      </div>
      <StaffTabs />
    </div>
  );
}
