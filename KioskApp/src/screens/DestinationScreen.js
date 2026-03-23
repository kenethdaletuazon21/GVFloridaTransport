import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaMapMarkerAlt, FaSearch, FaClock } from 'react-icons/fa';
import KioskHeader from '../components/KioskHeader';

const destinations = [
  { id: 1, name: 'Tuguegarao', province: 'Cagayan', duration: '10-12 hrs', price: 850, popular: true },
  { id: 2, name: 'Tabuk', province: 'Kalinga', duration: '12-14 hrs', price: 950, popular: true },
  { id: 3, name: 'Baguio', province: 'Benguet', duration: '5-6 hrs', price: 500, popular: true },
  { id: 4, name: 'Santiago', province: 'Isabela', duration: '8-9 hrs', price: 700, popular: false },
  { id: 5, name: 'Cauayan', province: 'Isabela', duration: '8-10 hrs', price: 720, popular: false },
  { id: 6, name: 'Ilagan', province: 'Isabela', duration: '9-11 hrs', price: 780, popular: false },
  { id: 7, name: 'Solano', province: 'Nueva Vizcaya', duration: '7-8 hrs', price: 620, popular: false },
  { id: 8, name: 'Bayombong', province: 'Nueva Vizcaya', duration: '7-8 hrs', price: 600, popular: false },
  { id: 9, name: 'San Jose', province: 'Nueva Ecija', duration: '4-5 hrs', price: 380, popular: false },
  { id: 10, name: 'Cabanatuan', province: 'Nueva Ecija', duration: '3-4 hrs', price: 280, popular: false },
  { id: 11, name: 'Aparri', province: 'Cagayan', duration: '12-14 hrs', price: 920, popular: false },
  { id: 12, name: 'Roxas', province: 'Isabela', duration: '10-11 hrs', price: 800, popular: false },
];

export default function DestinationScreen({ booking, setBooking }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = destinations.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.province.toLowerCase().includes(search.toLowerCase())
  );

  const popular = filtered.filter(d => d.popular);
  const others = filtered.filter(d => !d.popular);

  const selectDestination = (dest) => {
    setBooking(prev => ({ ...prev, destination: dest }));
    navigate('/trips');
  };

  return (
    <div className="kiosk-app" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <KioskHeader />
      <div className="kiosk-screen fade-in">
        <button className="back-btn" onClick={() => navigate('/')}>
          <FaArrowLeft /> Back
        </button>

        <h1 className="screen-title">Where are you headed?</h1>
        <p className="screen-subtitle">Select your destination from {booking.origin}</p>

        <div style={{ position: 'relative', marginBottom: 24 }}>
          <FaSearch style={{ position: 'absolute', left: 18, top: 18, color: '#9e9e9e', fontSize: 18 }} />
          <input
            className="kiosk-input"
            placeholder="Search destination or province..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 48 }}
          />
        </div>

        {popular.length > 0 && (
          <>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#ff6f00', marginBottom: 12 }}>
              ⭐ Popular Destinations
            </h3>
            <div className="grid-3" style={{ marginBottom: 24 }}>
              {popular.map(dest => (
                <button
                  key={dest.id}
                  className="kiosk-card"
                  onClick={() => selectDestination(dest)}
                  style={{
                    cursor: 'pointer', border: '2px solid #e0e0e0',
                    textAlign: 'left', transition: 'all 0.15s', fontFamily: 'Poppins'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <FaMapMarkerAlt style={{ color: '#ff6f00' }} />
                    <span style={{ fontSize: 18, fontWeight: 700, color: '#212121' }}>{dest.name}</span>
                  </div>
                  <div style={{ fontSize: 13, color: '#757575', marginBottom: 6 }}>{dest.province}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: '#9e9e9e', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <FaClock /> {dest.duration}
                    </span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: '#D90045' }}>₱{dest.price}</span>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {others.length > 0 && (
          <>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#424242', marginBottom: 12 }}>
              All Destinations
            </h3>
            <div className="grid-3">
              {others.map(dest => (
                <button
                  key={dest.id}
                  className="kiosk-card"
                  onClick={() => selectDestination(dest)}
                  style={{
                    cursor: 'pointer', border: '2px solid #e0e0e0',
                    textAlign: 'left', transition: 'all 0.15s', fontFamily: 'Poppins'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <FaMapMarkerAlt style={{ color: '#D90045' }} />
                    <span style={{ fontSize: 16, fontWeight: 600, color: '#212121' }}>{dest.name}</span>
                  </div>
                  <div style={{ fontSize: 13, color: '#757575', marginBottom: 6 }}>{dest.province}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: '#9e9e9e', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <FaClock /> {dest.duration}
                    </span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: '#D90045' }}>₱{dest.price}</span>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: '#9e9e9e' }}>
            <FaSearch style={{ fontSize: 48, marginBottom: 16 }} />
            <p style={{ fontSize: 18 }}>No destinations found</p>
          </div>
        )}
      </div>
    </div>
  );
}
