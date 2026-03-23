import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUser, FaPhone, FaIdCard } from 'react-icons/fa';
import KioskHeader from '../components/KioskHeader';

export default function PassengerInfoScreen({ booking, setBooking }) {
  const navigate = useNavigate();
  const [passengers, setPassengers] = useState(
    booking.seats.map((seat, i) => ({
      seat,
      name: '',
      phone: '',
      idType: 'None',
      idNumber: '',
    }))
  );
  const [errors, setErrors] = useState({});

  const idTypes = ['None', 'National ID', 'Driver\'s License', 'Passport', 'Student ID', 'Senior Citizen ID', 'PWD ID'];

  const updatePassenger = (index, field, value) => {
    setPassengers(prev => prev.map((p, i) => i === index ? { ...p, [field]: value } : p));
    setErrors(prev => ({ ...prev, [`${index}-${field}`]: null }));
  };

  const validate = () => {
    const newErrors = {};
    passengers.forEach((p, i) => {
      if (!p.name.trim()) newErrors[`${i}-name`] = 'Name is required';
      if (!p.phone.trim()) newErrors[`${i}-phone`] = 'Phone is required';
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validate()) return;
    setBooking(prev => ({ ...prev, passengers }));
    navigate('/baggage');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <KioskHeader />
      <div className="kiosk-screen fade-in">
        <button className="back-btn" onClick={() => navigate('/seats')}>
          <FaArrowLeft /> Back
        </button>

        <h1 className="screen-title">Passenger Information</h1>
        <p className="screen-subtitle">Enter details for {passengers.length} passenger{passengers.length > 1 ? 's' : ''}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 800 }}>
          {passengers.map((passenger, index) => (
            <div key={index} className="kiosk-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: '#D90045', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 16
                }}>
                  {passenger.seat}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 16 }}>Passenger {index + 1}</div>
                  <div style={{ fontSize: 13, color: '#9e9e9e' }}>Seat {passenger.seat}</div>
                </div>
              </div>

              <div className="grid-2" style={{ gap: 16 }}>
                <div>
                  <label className="input-label"><FaUser style={{ marginRight: 6 }} />Full Name *</label>
                  <input
                    className="kiosk-input"
                    placeholder="Enter full name"
                    value={passenger.name}
                    onChange={e => updatePassenger(index, 'name', e.target.value)}
                    style={errors[`${index}-name`] ? { borderColor: '#c62828' } : {}}
                  />
                  {errors[`${index}-name`] && (
                    <div style={{ color: '#c62828', fontSize: 12, marginTop: 4 }}>{errors[`${index}-name`]}</div>
                  )}
                </div>

                <div>
                  <label className="input-label"><FaPhone style={{ marginRight: 6 }} />Phone Number *</label>
                  <input
                    className="kiosk-input"
                    placeholder="09XX XXX XXXX"
                    value={passenger.phone}
                    onChange={e => updatePassenger(index, 'phone', e.target.value)}
                    style={errors[`${index}-phone`] ? { borderColor: '#c62828' } : {}}
                  />
                  {errors[`${index}-phone`] && (
                    <div style={{ color: '#c62828', fontSize: 12, marginTop: 4 }}>{errors[`${index}-phone`]}</div>
                  )}
                </div>

                <div>
                  <label className="input-label"><FaIdCard style={{ marginRight: 6 }} />ID Type</label>
                  <select
                    className="kiosk-input"
                    value={passenger.idType}
                    onChange={e => updatePassenger(index, 'idType', e.target.value)}
                  >
                    {idTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                {passenger.idType !== 'None' && (
                  <div>
                    <label className="input-label">ID Number</label>
                    <input
                      className="kiosk-input"
                      placeholder="Enter ID number"
                      value={passenger.idNumber}
                      onChange={e => updatePassenger(index, 'idNumber', e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* Discount Badges */}
              {(passenger.idType === 'Senior Citizen ID' || passenger.idType === 'PWD ID' || passenger.idType === 'Student ID') && (
                <div style={{
                  marginTop: 12, padding: '8px 16px', borderRadius: 10,
                  background: '#e8f5e9', color: '#2e7d32', fontSize: 13, fontWeight: 600
                }}>
                  {passenger.idType === 'Student ID' ? '🎓 Student Discount: 20% off' :
                   '♿ Senior/PWD Discount: 20% off'} — Present valid ID upon boarding
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="kiosk-bottom-bar">
        <div className="bottom-bar-info">
          <span className="bottom-bar-label">{passengers.length} Passenger{passengers.length > 1 ? 's' : ''}</span>
          <span className="bottom-bar-value">₱{booking.totalFare}</span>
        </div>
        <button className="touch-btn large" onClick={handleContinue}>
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}
