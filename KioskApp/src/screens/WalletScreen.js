import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaArrowLeft, FaWallet, FaMoneyBillWave, FaMobileAlt,
  FaCreditCard, FaHistory, FaCheckCircle
} from 'react-icons/fa';
import KioskHeader from '../components/KioskHeader';

const presetAmounts = [100, 200, 300, 500, 1000, 2000];

const topUpMethods = [
  { id: 'cash', name: 'Cash', desc: 'Insert bills at the acceptor', icon: <FaMoneyBillWave />, color: '#2e7d32', bg: '#e8f5e9' },
  { id: 'gcash', name: 'GCash', desc: 'Scan QR code', icon: <FaMobileAlt />, color: '#0070f0', bg: '#e3f2fd' },
  { id: 'card', name: 'Card', desc: 'Tap or insert card', icon: <FaCreditCard />, color: '#ff6f00', bg: '#fff3e0' },
];

export default function WalletScreen() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [verified, setVerified] = useState(false);
  const [balance, setBalance] = useState(1250);
  const [amount, setAmount] = useState(0);
  const [customAmount, setCustomAmount] = useState('');
  const [method, setMethod] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const transactions = [
    { type: 'topup', amount: 500, date: 'Jan 14, 2025', method: 'Cash' },
    { type: 'payment', amount: -850, date: 'Jan 12, 2025', desc: 'Manila → Tuguegarao' },
    { type: 'topup', amount: 1000, date: 'Jan 10, 2025', method: 'GCash' },
    { type: 'refund', amount: 280, date: 'Jan 8, 2025', desc: 'Cancelled booking' },
    { type: 'payment', amount: -500, date: 'Jan 5, 2025', desc: 'Manila → Baguio' },
  ];

  const handleVerify = () => {
    if (phone.length >= 10) {
      setVerified(true);
    }
  };

  const handleTopUp = () => {
    const topUpAmount = amount || parseInt(customAmount) || 0;
    if (topUpAmount <= 0 || !method) return;

    setProcessing(true);
    setTimeout(() => {
      setBalance(prev => prev + topUpAmount);
      setProcessing(false);
      setSuccess(true);
    }, 2000);
  };

  if (success) {
    const topUpAmount = amount || parseInt(customAmount) || 0;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <KioskHeader />
        <div className="kiosk-screen fade-in" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ textAlign: 'center', maxWidth: 400 }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%', background: '#e8f5e9',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px', color: '#2e7d32', fontSize: 40
            }}>
              <FaCheckCircle />
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: '#2e7d32', marginBottom: 8 }}>
              Top-Up Successful!
            </h2>
            <p style={{ color: '#757575', fontSize: 16, marginBottom: 24 }}>
              ₱{topUpAmount} has been added to your wallet
            </p>
            <div style={{
              background: '#fde8ee', padding: '20px 32px', borderRadius: 16, marginBottom: 32
            }}>
              <div style={{ fontSize: 14, color: '#757575' }}>New Balance</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: '#D90045' }}>
                ₱{balance.toLocaleString()}
              </div>
            </div>
            <button className="touch-btn large full" onClick={() => navigate('/')}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!verified) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <KioskHeader />
        <div className="kiosk-screen fade-in" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ maxWidth: 480, width: '100%' }}>
            <button className="back-btn" onClick={() => navigate('/')}>
              <FaArrowLeft /> Back
            </button>

            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <FaWallet style={{ fontSize: 48, color: '#D90045', marginBottom: 12 }} />
              <h1 className="screen-title">Wallet Top-Up</h1>
              <p className="screen-subtitle">Enter your registered phone number</p>
            </div>

            <div className="kiosk-card">
              <label className="input-label">Phone Number</label>
              <input
                className="kiosk-input"
                placeholder="09XX XXX XXXX"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                style={{ fontSize: 24, textAlign: 'center', fontWeight: 600, letterSpacing: 2 }}
              />

              {/* Numpad */}
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
                <div className="numpad">
                  {[1,2,3,4,5,6,7,8,9].map(n => (
                    <button key={n} className="numpad-key" onClick={() => setPhone(p => p + n)}>
                      {n}
                    </button>
                  ))}
                  <button className="numpad-key" onClick={() => setPhone(p => p.slice(0,-1))}>⌫</button>
                  <button className="numpad-key" onClick={() => setPhone(p => p + '0')}>0</button>
                  <button className="numpad-key action" onClick={handleVerify}>→</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <KioskHeader />
      <div className="kiosk-screen fade-in" style={{ display: 'flex', gap: 32 }}>
        {/* Left: Top-Up Options */}
        <div style={{ flex: 1 }}>
          <button className="back-btn" onClick={() => setVerified(false)}>
            <FaArrowLeft /> Back
          </button>

          {/* Balance Card */}
          <div className="kiosk-card" style={{
            background: 'linear-gradient(135deg, #D90045, #E8336E)', color: 'white', marginBottom: 24
          }}>
            <div style={{ fontSize: 14, opacity: 0.7 }}>Current Balance</div>
            <div style={{ fontSize: 36, fontWeight: 800 }}>₱{balance.toLocaleString()}</div>
            <div style={{ fontSize: 13, opacity: 0.7, marginTop: 4 }}>Phone: {phone}</div>
          </div>

          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Select Amount</h3>
          <div className="grid-3" style={{ marginBottom: 20 }}>
            {presetAmounts.map(a => (
              <button
                key={a}
                onClick={() => { setAmount(a); setCustomAmount(''); }}
                style={{
                  padding: '16px 8px', borderRadius: 12,
                  border: amount === a ? '3px solid #D90045' : '2px solid #e0e0e0',
                  background: amount === a ? '#fde8ee' : 'white',
                  cursor: 'pointer', fontFamily: 'Poppins', textAlign: 'center',
                  fontSize: 20, fontWeight: 700, color: '#D90045'
                }}
              >
                ₱{a}
              </button>
            ))}
          </div>

          <div style={{ marginBottom: 24 }}>
            <label className="input-label">Or enter custom amount</label>
            <input
              className="kiosk-input"
              type="number"
              placeholder="₱ Custom amount"
              value={customAmount}
              onChange={e => { setCustomAmount(e.target.value); setAmount(0); }}
              style={{ fontSize: 20 }}
            />
          </div>

          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Payment Method</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {topUpMethods.map(m => (
              <div
                key={m.id}
                className={`payment-option ${method === m.id ? 'selected' : ''}`}
                onClick={() => setMethod(m.id)}
              >
                <div className="payment-icon" style={{ background: m.bg, color: m.color }}>{m.icon}</div>
                <div className="payment-info" style={{ flex: 1 }}>
                  <h3>{m.name}</h3>
                  <p>{m.desc}</p>
                </div>
                {method === m.id && <FaCheckCircle style={{ color: '#D90045', fontSize: 22 }} />}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Transaction History */}
        <div style={{ width: 340 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>
            <FaHistory style={{ marginRight: 8 }} />Recent Transactions
          </h3>
          {transactions.map((t, i) => (
            <div key={i} className="kiosk-card" style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>
                    {t.type === 'topup' ? `Top-up via ${t.method}` : t.type === 'refund' ? 'Refund' : 'Payment'}
                  </div>
                  <div style={{ fontSize: 12, color: '#9e9e9e' }}>
                    {t.desc || t.date}
                  </div>
                </div>
                <div style={{
                  fontWeight: 700, fontSize: 16,
                  color: t.amount > 0 ? '#2e7d32' : '#c62828'
                }}>
                  {t.amount > 0 ? '+' : ''}₱{Math.abs(t.amount)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="kiosk-bottom-bar">
        <div className="bottom-bar-info">
          <span className="bottom-bar-label">Top-up Amount</span>
          <span className="bottom-bar-value">₱{amount || customAmount || 0}</span>
        </div>
        <button
          className="touch-btn large accent"
          disabled={(!amount && !customAmount) || !method || processing}
          onClick={handleTopUp}
        >
          {processing ? (
            <>
              <div className="spinner" style={{ width: 24, height: 24, borderWidth: 3 }} />
              Processing...
            </>
          ) : (
            'Confirm Top-Up'
          )}
        </button>
      </div>
    </div>
  );
}
