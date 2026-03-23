import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaArrowLeft, FaBus, FaRoute, FaClock, FaMapMarkerAlt,
  FaPhone, FaEnvelope, FaShieldAlt, FaSuitcase, FaWheelchair,
  FaInfoCircle, FaChevronDown, FaChevronUp
} from 'react-icons/fa';
import KioskHeader from '../components/KioskHeader';

const schedules = [
  { destination: 'Tuguegarao', departures: ['04:00', '06:00', '08:00', '12:00', '18:00', '20:00', '22:00'], duration: '10-12 hrs', price: '₱750-₱1,530' },
  { destination: 'Tabuk', departures: ['06:00', '10:00', '18:00', '22:00'], duration: '12-14 hrs', price: '₱850-₱1,710' },
  { destination: 'Baguio', departures: ['04:00', '06:00', '08:00', '10:00', '12:00', '22:00'], duration: '5-6 hrs', price: '₱400-₱900' },
  { destination: 'Santiago', departures: ['06:00', '12:00', '20:00'], duration: '8-9 hrs', price: '₱560-₱1,260' },
  { destination: 'Cauayan', departures: ['08:00', '14:00', '22:00'], duration: '8-10 hrs', price: '₱576-₱1,296' },
  { destination: 'Solano', departures: ['06:00', '10:00', '18:00'], duration: '7-8 hrs', price: '₱496-₱1,116' },
];

const terminalInfo = [
  { icon: <FaMapMarkerAlt />, color: '#c62828', bg: '#ffebee', title: 'Terminal Location', desc: '832 AH Lacson Ave. Cor. Earnshaw St. Sampaloc, Manila 1008' },
  { icon: <FaPhone />, color: '#1565c0', bg: '#e3f2fd', title: 'Contact Number', desc: '02-493-7956 | 0917-123-4567' },
  { icon: <FaEnvelope />, color: '#2e7d32', bg: '#e8f5e9', title: 'Email', desc: 'gvfloridatrans@gmail.com' },
  { icon: <FaClock />, color: '#ff6f00', bg: '#fff3e0', title: 'Operating Hours', desc: 'Open 24 hours, 7 days a week' },
];

const policies = [
  { icon: <FaSuitcase />, title: 'Baggage', text: 'Free 20kg baggage allowance. Excess baggage: ₱50/bag. Oversized items require separate handling.' },
  { icon: <FaShieldAlt />, title: 'Refund Policy', text: 'Full refund if cancelled 24+ hours before departure. 50% refund if cancelled 4-24 hours before. No refund within 4 hours of departure.' },
  { icon: <FaWheelchair />, title: 'PWD / Senior', text: '20% discount for Senior Citizens and Persons with Disability. Present valid ID upon boarding.' },
  { icon: <FaInfoCircle />, title: 'Boarding', text: 'Arrive at least 30 minutes before departure. Present your ticket QR code or booking code at the gate.' },
];

const facilities = [
  'Waiting Lounge', 'Restrooms', 'Luggage Area', 'Snack Bar',
  'Charging Station', 'Free WiFi', 'CCTV Monitored', 'Security Guard',
];

export default function StationInfoScreen() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('schedules');
  const [expanded, setExpanded] = useState(null);

  const tabs = [
    { id: 'schedules', label: 'Schedules', icon: <FaClock /> },
    { id: 'terminal', label: 'Terminal', icon: <FaMapMarkerAlt /> },
    { id: 'policies', label: 'Policies', icon: <FaShieldAlt /> },
    { id: 'routes', label: 'Routes', icon: <FaRoute /> },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <KioskHeader />
      <div className="kiosk-screen fade-in">
        <button className="back-btn" onClick={() => navigate('/')}>
          <FaArrowLeft /> Back to Home
        </button>

        <h1 className="screen-title">Station Information</h1>
        <p className="screen-subtitle">Sampaloc Terminal — Manila</p>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '12px 24px', borderRadius: 12,
                border: tab === t.id ? '2px solid #D90045' : '2px solid #e0e0e0',
                background: tab === t.id ? '#D90045' : 'white',
                color: tab === t.id ? 'white' : '#424242',
                cursor: 'pointer', fontFamily: 'Poppins', fontWeight: 600, fontSize: 15
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Schedules Tab */}
        {tab === 'schedules' && (
          <div className="fade-in">
            <div style={{
              background: '#fff3e0', padding: '12px 20px', borderRadius: 12,
              color: '#e65100', fontSize: 14, marginBottom: 20, fontWeight: 500
            }}>
              📌 Schedules are subject to change. Confirm at counter before booking.
            </div>

            {schedules.map((s, i) => (
              <div key={i} className="kiosk-card" style={{ marginBottom: 12 }}>
                <div
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    cursor: 'pointer'
                  }}
                  onClick={() => setExpanded(expanded === i ? null : i)}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <FaBus style={{ color: '#D90045' }} />
                      <span style={{ fontSize: 18, fontWeight: 700 }}>Manila → {s.destination}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#757575' }}>
                      <span><FaClock style={{ marginRight: 4 }} />{s.duration}</span>
                      <span>{s.price}</span>
                      <span>{s.departures.length} trips daily</span>
                    </div>
                  </div>
                  {expanded === i ? <FaChevronUp /> : <FaChevronDown />}
                </div>

                {expanded === i && (
                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#9e9e9e', marginBottom: 8 }}>
                      DEPARTURE TIMES
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {s.departures.map((dep, j) => (
                        <span key={j} style={{
                          padding: '8px 16px', borderRadius: 10,
                          background: '#fde8ee', color: '#D90045',
                          fontWeight: 700, fontSize: 16
                        }}>
                          {dep}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Terminal Tab */}
        {tab === 'terminal' && (
          <div className="fade-in">
            <div className="grid-2" style={{ marginBottom: 24 }}>
              {terminalInfo.map((info, i) => (
                <div key={i} className="info-card">
                  <div className="info-icon" style={{ background: info.bg, color: info.color }}>
                    {info.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{info.title}</div>
                    <div style={{ fontSize: 14, color: '#757575' }}>{info.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Terminal Facilities</h3>
            <div className="grid-4">
              {facilities.map((f, i) => (
                <div key={i} style={{
                  background: 'white', borderRadius: 12, padding: '16px 12px',
                  textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', fontSize: 14, fontWeight: 500
                }}>
                  {f}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Policies Tab */}
        {tab === 'policies' && (
          <div className="fade-in">
            {policies.map((p, i) => (
              <div key={i} className="kiosk-card" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14, background: '#fde8ee',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#D90045', fontSize: 20, flexShrink: 0
                }}>
                  {p.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{p.title}</h3>
                  <p style={{ fontSize: 14, color: '#616161', lineHeight: 1.6 }}>{p.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Routes Tab */}
        {tab === 'routes' && (
          <div className="fade-in">
            <div className="kiosk-card" style={{ textAlign: 'center' }}>
              <FaRoute style={{ fontSize: 48, color: '#D90045', marginBottom: 16 }} />
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Our Route Network</h3>
              <p style={{ color: '#757575', marginBottom: 24 }}>
                GV Florida operates routes from Manila (Sampaloc) to major destinations in Northern Luzon
              </p>

              <div style={{
                background: '#f5f5f5', borderRadius: 16, padding: '24px 20px',
                textAlign: 'left'
              }}>
                {[
                  { region: 'Cagayan Valley', cities: ['Tuguegarao', 'Aparri', 'Ilagan', 'Cauayan', 'Santiago'] },
                  { region: 'Cordillera', cities: ['Baguio', 'Tabuk'] },
                  { region: 'Nueva Vizcaya', cities: ['Bayombong', 'Solano'] },
                  { region: 'Nueva Ecija', cities: ['Cabanatuan', 'San Jose'] },
                ].map((r, i) => (
                  <div key={i} style={{ marginBottom: i < 3 ? 16 : 0 }}>
                    <div style={{
                      fontWeight: 700, fontSize: 14, color: '#D90045',
                      marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5
                    }}>
                      {r.region}
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {r.cities.map((c, j) => (
                        <span key={j} style={{
                          background: 'white', padding: '6px 14px', borderRadius: 20,
                          fontSize: 14, color: '#424242', boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
                        }}>
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
