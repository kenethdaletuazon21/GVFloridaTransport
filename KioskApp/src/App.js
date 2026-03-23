import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import WelcomeScreen from './screens/WelcomeScreen';
import DestinationScreen from './screens/DestinationScreen';
import TripSelectScreen from './screens/TripSelectScreen';
import SeatSelectScreen from './screens/SeatSelectScreen';
import PassengerInfoScreen from './screens/PassengerInfoScreen';
import BaggageScreen from './screens/BaggageScreen';
import PaymentScreen from './screens/PaymentScreen';
import TicketScreen from './screens/TicketScreen';
import AccountScreen from './screens/AccountScreen';
import WalletScreen from './screens/WalletScreen';
import StationInfoScreen from './screens/StationInfoScreen';
import './App.css';

const IDLE_TIMEOUT = 120000; // 2 minutes idle timeout

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [booking, setBooking] = useState({
    origin: 'Manila (Sampaloc Terminal)',
    destination: null,
    trip: null,
    seats: [],
    passengers: [],
    paymentMethod: null,
    totalFare: 0,
    bookingCode: null,
  });

  const resetBooking = useCallback(() => {
    setBooking({
      origin: 'Manila (Sampaloc Terminal)',
      destination: null,
      trip: null,
      seats: [],
      passengers: [],
      paymentMethod: null,
      totalFare: 0,
      bookingCode: null,
    });
    navigate('/');
  }, [navigate]);

  // Idle timeout — reset to welcome after inactivity
  useEffect(() => {
    if (location.pathname === '/') return;

    let timer;
    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(resetBooking, IDLE_TIMEOUT);
    };

    const events = ['touchstart', 'mousedown', 'keydown'];
    events.forEach(e => window.addEventListener(e, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timer);
      events.forEach(e => window.removeEventListener(e, resetTimer));
    };
  }, [location.pathname, resetBooking]);

  return (
    <div className="kiosk-app">
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/destination" element={
          <DestinationScreen booking={booking} setBooking={setBooking} />
        } />
        <Route path="/trips" element={
          <TripSelectScreen booking={booking} setBooking={setBooking} />
        } />
        <Route path="/seats" element={
          <SeatSelectScreen booking={booking} setBooking={setBooking} />
        } />
        <Route path="/passenger-info" element={
          <PassengerInfoScreen booking={booking} setBooking={setBooking} />
        } />
        <Route path="/baggage" element={
          <BaggageScreen booking={booking} setBooking={setBooking} />
        } />
        <Route path="/payment" element={
          <PaymentScreen booking={booking} setBooking={setBooking} />
        } />
        <Route path="/ticket" element={
          <TicketScreen booking={booking} resetBooking={resetBooking} />
        } />
        <Route path="/account" element={<AccountScreen />} />
        <Route path="/wallet" element={<WalletScreen />} />
        <Route path="/station-info" element={<StationInfoScreen />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
