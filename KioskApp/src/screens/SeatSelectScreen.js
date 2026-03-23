import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUser } from 'react-icons/fa';
import KioskHeader from '../components/KioskHeader';

export default function SeatSelectScreen({ booking, setBooking }) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);

  const totalSeats = booking.trip?.totalSeats || 45;
  const cols = 4;
  const aisleAfter = 2;

  // Generate occupied seats
  const occupied = useMemo(() => {
    const occ = new Set();
    const count = Math.floor(totalSeats * 0.35);
    while (occ.size < count) {
      occ.add(Math.floor(Math.random() * totalSeats) + 1);
    }
    return occ;
  }, [totalSeats]);

  const toggleSeat = (seatNum) => {
    if (occupied.has(seatNum)) return;
    setSelected(prev =>
      prev.includes(seatNum)
        ? prev.filter(s => s !== seatNum)
        : prev.length >= 4 ? prev : [...prev, seatNum]
    );
  };

  const rows = Math.ceil(totalSeats / cols);

  const handleContinue = () => {
    const price = booking.trip?.price || 0;
    setBooking(prev => ({
      ...prev,
      seats: selected,
      totalFare: price * selected.length,
    }));
    navigate('/passenger-info');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <KioskHeader />
      <div className="kiosk-screen fade-in" style={{ display: 'flex', gap: 32 }}>
        {/* Left: Seat Map */}
        <div style={{ flex: 1 }}>
          <button className="back-btn" onClick={() => navigate('/trips')}>
            <FaArrowLeft /> Back
          </button>
          <h1 className="screen-title">Select Your Seat</h1>
          <p className="screen-subtitle">
            {booking.trip?.busNumber} • {booking.trip?.busType} • Max 4 seats
          </p>

          <div className="kiosk-card" style={{ textAlign: 'center' }}>
            {/* Driver Area */}
            <div style={{
              background: '#e0e0e0', borderRadius: 10, padding: '10px 20px',
              display: 'inline-block', marginBottom: 20, fontSize: 14, fontWeight: 600, color: '#757575'
            }}>
              🚌 DRIVER
            </div>

            {/* Seat Grid */}
            <div className="seat-map">
              {Array.from({ length: rows }).map((_, row) => (
                <div className="seat-row" key={row}>
                  {Array.from({ length: cols }).map((_, col) => {
                    const seatNum = row * cols + col + 1;
                    if (seatNum > totalSeats) return <div key={col} className="seat" style={{ visibility: 'hidden' }} />;

                    const isOccupied = occupied.has(seatNum);
                    const isSelected = selected.includes(seatNum);

                    return (
                      <React.Fragment key={col}>
                        {col === aisleAfter && <div className="seat aisle" />}
                        <div
                          className={`seat ${isOccupied ? 'occupied' : isSelected ? 'selected' : 'available'}`}
                          onClick={() => toggleSeat(seatNum)}
                        >
                          {isOccupied ? <FaUser style={{ fontSize: 16 }} /> : seatNum}
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="seat-legend">
              <div className="seat-legend-item">
                <div className="seat-legend-dot" style={{ background: '#e8f5e9', border: '2px solid #a5d6a7' }} />
                Available
              </div>
              <div className="seat-legend-item">
                <div className="seat-legend-dot" style={{ background: '#D90045' }} />
                Selected
              </div>
              <div className="seat-legend-item">
                <div className="seat-legend-dot" style={{ background: '#eeeeee' }} />
                Occupied
              </div>
            </div>
          </div>
        </div>

        {/* Right: Summary */}
        <div style={{ width: 320 }}>
          <div className="kiosk-card" style={{ position: 'sticky', top: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Booking Summary</h3>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 13, color: '#9e9e9e' }}>Route</div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Manila → {booking.destination?.name}</div>
            </div>

            <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 13, color: '#9e9e9e' }}>Departure</div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{booking.trip?.departure}</div>
              </div>
              <div>
                <div style={{ fontSize: 13, color: '#9e9e9e' }}>Bus</div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{booking.trip?.busType}</div>
              </div>
            </div>

            <div className="divider" />

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 13, color: '#9e9e9e', marginBottom: 8 }}>Selected Seats</div>
              {selected.length === 0 ? (
                <div style={{ color: '#bdbdbd', fontSize: 14 }}>No seats selected</div>
              ) : (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {selected.sort((a, b) => a - b).map(s => (
                    <span key={s} style={{
                      background: '#D90045', color: 'white', padding: '6px 14px',
                      borderRadius: 10, fontSize: 16, fontWeight: 700
                    }}>
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="divider" />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: '#757575' }}>Fare per seat</span>
              <span style={{ fontWeight: 600 }}>₱{booking.trip?.price || 0}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ color: '#757575' }}>Passengers</span>
              <span style={{ fontWeight: 600 }}>{selected.length}</span>
            </div>

            <div style={{
              display: 'flex', justifyContent: 'space-between',
              background: '#fde8ee', padding: '12px 16px', borderRadius: 10
            }}>
              <span style={{ fontSize: 18, fontWeight: 700 }}>Total</span>
              <span style={{ fontSize: 24, fontWeight: 800, color: '#D90045' }}>
                ₱{(booking.trip?.price || 0) * selected.length}
              </span>
            </div>

            <button
              className="touch-btn full"
              style={{ marginTop: 20 }}
              disabled={selected.length === 0}
              onClick={handleContinue}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
