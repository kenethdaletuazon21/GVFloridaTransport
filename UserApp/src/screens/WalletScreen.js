import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiPlus, FiArrowUpRight, FiArrowDownLeft, FiCreditCard } from 'react-icons/fi';
import BottomTabs from '../components/BottomTabs';

const transactions = [
  { id: 1, type: 'topup', label: 'GCash Top Up', amount: 500, date: 'Today, 10:30 AM' },
  { id: 2, type: 'payment', label: 'Naga City — 2 seats', amount: -1500, date: 'Today, 09:15 AM' },
  { id: 3, type: 'topup', label: 'Bank Transfer', amount: 2000, date: 'Yesterday, 03:00 PM' },
  { id: 4, type: 'refund', label: 'Cancelled — Legazpi', amount: 750, date: 'Jan 15, 11:00 AM' },
  { id: 5, type: 'payment', label: 'Daet — 1 seat', amount: -680, date: 'Jan 12, 08:00 PM' },
];

export default function WalletScreen() {
  const { user } = useAuth();
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmt, setTopUpAmt] = useState('');

  return (
    <div className="screen">
      <div className="screen-header"><h2>GV Wallet</h2></div>
      <div className="screen-body" style={{ paddingBottom: 70 }}>
        <div className="wallet-card">
          <div style={{ fontSize: 12, opacity: .8 }}>Available Balance</div>
          <div style={{ fontSize: 32, fontWeight: 800 }}>₱{(user?.wallet_balance || 1500).toLocaleString()}.00</div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button onClick={() => setShowTopUp(!showTopUp)}
              style={{ flex: 1, padding: '10px', border: '1px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.15)', color: '#fff', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <FiPlus /> Top Up
            </button>
            <button style={{ flex: 1, padding: '10px', border: '1px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.15)', color: '#fff', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <FiCreditCard /> Transfer
            </button>
          </div>
        </div>

        {showTopUp && (
          <div className="card" style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Top Up Wallet</h3>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              {[100, 200, 500, 1000, 2000].map(a => (
                <button key={a} onClick={() => setTopUpAmt(String(a))}
                  style={{ padding: '8px 16px', borderRadius: 8, border: topUpAmt === String(a) ? '2px solid var(--primary)' : '1px solid #ddd', background: topUpAmt === String(a) ? '#fff0f3' : '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>
                  ₱{a}
                </button>
              ))}
            </div>
            <input className="input" type="number" placeholder="Or enter amount" value={topUpAmt} onChange={e => setTopUpAmt(e.target.value)} />
            <button className="btn btn-primary" style={{ width: '100%', marginTop: 8 }}
              onClick={() => { alert(`Top up ₱${topUpAmt} successful!`); setShowTopUp(false); setTopUpAmt(''); }}>
              Confirm Top Up
            </button>
          </div>
        )}

        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Transaction History</h3>
        {transactions.map(tx => (
          <div key={tx.id} className="transaction-item">
            <div style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
              background: tx.type === 'payment' ? '#fce4ec' : tx.type === 'refund' ? '#e3f2fd' : '#e8f5e9',
              color: tx.type === 'payment' ? 'var(--primary)' : tx.type === 'refund' ? '#1976d2' : 'var(--success)' }}>
              {tx.type === 'payment' ? <FiArrowUpRight /> : <FiArrowDownLeft />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{tx.label}</div>
              <div style={{ fontSize: 12, color: '#999' }}>{tx.date}</div>
            </div>
            <div style={{ fontWeight: 700, fontSize: 14, color: tx.amount > 0 ? 'var(--success)' : 'var(--primary)' }}>
              {tx.amount > 0 ? '+' : ''}₱{Math.abs(tx.amount).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
      <BottomTabs />
    </div>
  );
}
