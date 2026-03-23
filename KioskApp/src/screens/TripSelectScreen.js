import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaBus, FaClock, FaSnowflake, FaWifi, FaChair, FaArrowRight } from 'react-icons/fa';
import { format, addHours } from 'date-fns';
import KioskHeader from '../components/KioskHeader';

const generateTrips = (destination) => {
  const today = new Date();
  const basePrice = destination?.price || 500;
  const types = [
    { type: 'Deluxe', multiplier: 1.5, amenities: ['AC', 'WiFi', 'Reclining', 'CR'], seats: 32 },
    { type: 'Super Deluxe', multiplier: 1.8, amenities: ['AC', 'WiFi', 'Reclining', 'CR', 'TV'], seats: 28 },
    { type: 'Regular AC', multiplier: 1.0, amenities: ['AC'], seats: 45 },
    { type: 'Regular', multiplier: 0.8, amenities: [], seats: 49 },
  ];

  const departures = ['04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '18:00', '20:00', '22:00'];

  return departures.map((dep, i) => {
    const busType = types[i % types.length];
    const [h, m] = dep.split(':');
    const depTime = new Date(today);
    depTime.setHours(parseInt(h), parseInt(m), 0);
    const durationHrs = 6 + Math.floor(Math.random() * 6);
    const arrTime = addHours(depTime, durationHrs);
    const available = Math.floor(Math.random() * busType.seats * 0.6) + 5;

    return {
      id: i + 1,
      busNumber: `GVF-${100 + i}`,
      busType: busType.type,
      departure: dep,
      arrival: format(arrTime, 'HH:mm'),
      duration: `${durationHrs}h`,
      price: Math.round(basePrice * busType.multiplier),
      amenities: busType.amenities,
      totalSeats: busType.seats,
      available,
      date: format(today, 'yyyy-MM-dd'),
    };
  });
};

export default function TripSelectScreen({ booking, setBooking }) {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(0);

  const trips = generateTrips(booking.destination);

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  const amenityIcons = { AC: <FaSnowflake />, WiFi: <FaWifi />, Reclining: <FaChair /> };

  const selectTrip = (trip) => {
    setBooking(prev => ({ ...prev, trip, totalFare: trip.price }));
    navigate('/seats');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <KioskHeader />
      <div className="kiosk-screen fade-in">
        <button className="back-btn" onClick={() => navigate('/destination')}>
          <FaArrowLeft /> Back
        </button>

        <h1 className="screen-title">Available Trips</h1>
        <p className="screen-subtitle">
          Manila → {booking.destination?.name || 'Destination'}
        </p>

        {/* Date Selector */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24, overflowX: 'auto', paddingBottom: 8 }}>
          {dates.map((date, i) => (
            <button
              key={i}
              onClick={() => setSelectedDate(i)}
              style={{
                padding: '12px 20px',
                borderRadius: 12,
                border: selectedDate === i ? '2px solid #D90045' : '2px solid #e0e0e0',
                background: selectedDate === i ? '#D90045' : 'white',
                color: selectedDate === i ? 'white' : '#424242',
                cursor: 'pointer',
                fontFamily: 'Poppins',
                minWidth: 90,
                textAlign: 'center',
                flexShrink: 0,
              }}
            >
              <div style={{ fontSize: 12, opacity: 0.7 }}>
                {i === 0 ? 'Today' : format(date, 'EEE')}
              </div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{format(date, 'dd')}</div>
              <div style={{ fontSize: 11, opacity: 0.7 }}>{format(date, 'MMM')}</div>
            </button>
          ))}
        </div>

        {/* Trip List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {trips.map(trip => (
            <button
              key={trip.id}
              className="kiosk-card"
              onClick={() => selectTrip(trip)}
              style={{
                cursor: 'pointer',
                border: '2px solid #e0e0e0',
                textAlign: 'left',
                fontFamily: 'Poppins',
                transition: 'all 0.15s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span className="badge primary">{trip.busType}</span>
                  <span style={{ fontSize: 13, color: '#9e9e9e' }}>
                    <FaBus style={{ marginRight: 4 }} /> {trip.busNumber}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#212121' }}>{trip.departure}</div>
                    <div style={{ fontSize: 12, color: '#9e9e9e' }}>Manila</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#bdbdbd' }}>
                    <div style={{ width: 40, height: 2, background: '#e0e0e0' }} />
                    <FaClock style={{ fontSize: 12 }} />
                    <span style={{ fontSize: 12 }}>{trip.duration}</span>
                    <div style={{ width: 40, height: 2, background: '#e0e0e0' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#212121' }}>{trip.arrival}</div>
                    <div style={{ fontSize: 12, color: '#9e9e9e' }}>{booking.destination?.name}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  {trip.amenities.map((a, i) => (
                    <span key={i} style={{
                      fontSize: 11, color: '#757575', background: '#f5f5f5',
                      padding: '2px 8px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 4
                    }}>
                      {amenityIcons[a] || null} {a}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ textAlign: 'right', paddingLeft: 24 }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: '#D90045' }}>₱{trip.price}</div>
                <div style={{
                  fontSize: 13,
                  color: trip.available < 10 ? '#c62828' : '#2e7d32',
                  fontWeight: 600
                }}>
                  {trip.available} seats left
                </div>
                <FaArrowRight style={{ color: '#D90045', marginTop: 8, fontSize: 18 }} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
