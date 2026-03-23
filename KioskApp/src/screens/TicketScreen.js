import React from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { FaCheckCircle, FaPrint, FaHome, FaBus, FaCalendarAlt, FaClock, FaChair } from 'react-icons/fa';
import { format } from 'date-fns';

export default function TicketScreen({ booking, resetBooking }) {
  const navigate = useNavigate();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f0f2f5' }}>
      <div className="ticket-container fade-in">
        <div className="ticket-card">
          {/* Success Header */}
          <div className="ticket-success-icon">
            <FaCheckCircle />
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#2e7d32', marginBottom: 4 }}>
            {booking.paymentMethod === 'cash' ? 'Reservation Confirmed!' : 'Booking Confirmed!'}
          </h2>
          <p style={{ color: '#757575', fontSize: 14, marginBottom: 4 }}>
            {booking.paymentMethod === 'cash'
              ? 'Please pay at the cashier counter'
              : 'Your ticket has been issued successfully'}
          </p>

          {/* Booking Code */}
          <div style={{
            background: '#D90045', color: 'white', padding: '10px 24px',
            borderRadius: 10, display: 'inline-block', margin: '16px 0',
            fontSize: 22, fontWeight: 800, letterSpacing: 2
          }}>
            {booking.bookingCode}
          </div>

          {/* QR Code */}
          <div className="ticket-qr">
            <QRCodeSVG
              value={JSON.stringify({
                code: booking.bookingCode,
                route: `Manila-${booking.destination?.name}`,
                seats: booking.seats,
                date: format(new Date(), 'yyyy-MM-dd'),
              })}
              size={160}
              level="H"
            />
          </div>

          {/* Trip Details */}
          <div style={{
            background: '#f5f5f5', borderRadius: 12, padding: 20,
            margin: '16px 0', textAlign: 'left'
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 16
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#212121' }}>
                  {booking.trip?.departure}
                </div>
                <div style={{ fontSize: 12, color: '#9e9e9e' }}>Manila</div>
              </div>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <FaBus style={{ color: '#D90045', fontSize: 20 }} />
                <div style={{ height: 2, background: '#e0e0e0', margin: '4px 20px' }} />
                <div style={{ fontSize: 11, color: '#9e9e9e' }}>{booking.trip?.duration}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#212121' }}>
                  {booking.trip?.arrival}
                </div>
                <div style={{ fontSize: 12, color: '#9e9e9e' }}>{booking.destination?.name}</div>
              </div>
            </div>

            <div className="ticket-details">
              <div className="ticket-detail-item">
                <label><FaCalendarAlt style={{ marginRight: 4 }} /> Date</label>
                <p>{format(new Date(), 'MMM dd, yyyy')}</p>
              </div>
              <div className="ticket-detail-item">
                <label><FaBus style={{ marginRight: 4 }} /> Bus</label>
                <p>{booking.trip?.busNumber} ({booking.trip?.busType})</p>
              </div>
              <div className="ticket-detail-item">
                <label><FaChair style={{ marginRight: 4 }} /> Seat{booking.seats.length > 1 ? 's' : ''}</label>
                <p>{booking.seats.sort((a, b) => a - b).join(', ')}</p>
              </div>
              <div className="ticket-detail-item">
                <label><FaClock style={{ marginRight: 4 }} /> Passengers</label>
                <p>{booking.passengers?.length || booking.seats.length}</p>
              </div>
            </div>
          </div>

          {/* Total */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: '#fde8ee', padding: '14px 20px', borderRadius: 10, marginBottom: 20
          }}>
            <span style={{ fontWeight: 600, color: '#424242' }}>
              {booking.paymentMethod === 'cash' ? 'Amount Due' : 'Amount Paid'}
            </span>
            <span style={{ fontSize: 24, fontWeight: 800, color: '#D90045' }}>
              ₱{booking.totalFare + 20}
            </span>
          </div>

          {/* Payment Method Notice */}
          {booking.paymentMethod === 'cash' && (
            <div style={{
              background: '#fff3e0', padding: '12px 16px', borderRadius: 10,
              color: '#e65100', fontSize: 14, marginBottom: 20, textAlign: 'center'
            }}>
              ⚠️ Please pay at the cashier counter before departure
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="touch-btn outline" style={{ flex: 1 }} onClick={handlePrint}>
              <FaPrint /> Print Ticket
            </button>
            <button className="touch-btn accent" style={{ flex: 1 }} onClick={resetBooking}>
              <FaHome /> Back to Home
            </button>
          </div>

          {/* Passenger Names */}
          {booking.passengers && booking.passengers.length > 0 && (
            <div style={{ marginTop: 20, textAlign: 'left' }}>
              <div style={{ fontSize: 13, color: '#9e9e9e', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Passengers
              </div>
              {booking.passengers.map((p, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '8px 0', borderBottom: '1px solid #f5f5f5', fontSize: 14
                }}>
                  <span>{p.name}</span>
                  <span style={{ color: '#9e9e9e' }}>Seat {p.seat}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ marginTop: 24, color: '#9e9e9e', fontSize: 13, textAlign: 'center' }}>
          GV Florida Transport Inc. • Thank you for choosing us!
          <br />This screen will reset in 2 minutes
        </div>
      </div>
    </div>
  );
}
