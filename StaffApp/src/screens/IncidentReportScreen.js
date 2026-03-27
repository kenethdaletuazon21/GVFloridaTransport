import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiArrowLeft, FiAlertTriangle, FiTruck, FiHeart, FiAlertCircle, FiCloud, FiClock, FiUsers, FiHelpCircle, FiSend } from 'react-icons/fi';

const incidentTypes = [
  { key: 'breakdown', icon: <FiTruck />, label: 'Breakdown' },
  { key: 'accident', icon: <FiAlertTriangle />, label: 'Accident' },
  { key: 'medical', icon: <FiHeart />, label: 'Medical' },
  { key: 'road_hazard', icon: <FiAlertCircle />, label: 'Road Hazard' },
  { key: 'passenger', icon: <FiUsers />, label: 'Passenger' },
  { key: 'weather', icon: <FiCloud />, label: 'Weather' },
  { key: 'delay', icon: <FiClock />, label: 'Delay' },
  { key: 'other', icon: <FiHelpCircle />, label: 'Other' },
];

const severityLevels = ['low', 'medium', 'high', 'critical'];

export default function IncidentReportScreen() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [type, setType] = useState('');
  const [severity, setSeverity] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!type) { alert('Please select incident type'); return; }
    if (!severity) { alert('Please select severity level'); return; }
    if (!description.trim()) { alert('Please describe the incident'); return; }
    setSubmitting(true);
    setTimeout(() => {
      alert('Incident report submitted successfully!');
      navigate(-1);
    }, 1000);
  };

  return (
    <div className="screen">
      <div className="screen-header">
        <button className="back-btn" onClick={() => navigate(-1)}><FiArrowLeft /></button>
        <h2>Report Incident</h2>
      </div>
      <div className="screen-body">
        {state?.trip && (
          <div className="card" style={{ background: '#e8f0fe', marginBottom: 16, padding: 12 }}>
            <div style={{ fontSize: 12, color: 'var(--text-light)' }}>Trip Context</div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{state.trip.route} • {state.trip.bus}</div>
          </div>
        )}

        {/* Incident Type */}
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Incident Type</h3>
        <div className="type-grid">
          {incidentTypes.map(t => (
            <div key={t.key} className={`type-item ${type === t.key ? 'active' : ''}`} onClick={() => setType(t.key)}>
              {t.icon}
              {t.label}
            </div>
          ))}
        </div>

        {/* Severity */}
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Severity Level</h3>
        <div className="severity-row">
          {severityLevels.map(s => (
            <button key={s} className={`severity-btn ${severity === s ? `active-${s}` : ''}`} onClick={() => setSeverity(s)}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {/* Location */}
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Location</h3>
        <input className="input" placeholder="e.g. KM 85, near Lucena toll" value={location} onChange={e => setLocation(e.target.value)} style={{ marginBottom: 16 }} />

        {/* Description */}
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Description</h3>
        <textarea className="input textarea" placeholder="Describe what happened..." value={description} onChange={e => setDescription(e.target.value)} style={{ marginBottom: 16 }} />

        <button className="btn btn-accent" style={{ width: '100%' }} onClick={handleSubmit} disabled={submitting}>
          <FiSend /> {submitting ? 'Submitting...' : 'Submit Report'}
        </button>
      </div>
    </div>
  );
}
