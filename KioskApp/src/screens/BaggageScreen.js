import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSuitcaseRolling, FaGem, FaExclamationTriangle, FaCheckCircle, FaInfoCircle, FaPlus, FaTrash } from 'react-icons/fa';
import KioskHeader from '../components/KioskHeader';

const BAG_TYPES = ['Suitcase', 'Backpack', 'Box/Parcel', 'Bag', 'Other'];
const WEIGHT_OPTIONS = [
  { label: 'Up to 10 kg (Light)', value: 10, fee: 0 },
  { label: '10–15 kg', value: 15, fee: 0 },
  { label: '15–20 kg (Free Allowance)', value: 20, fee: 0 },
  { label: '20–25 kg (+₱50)', value: 25, fee: 50 },
  { label: '25–30 kg (+₱100)', value: 30, fee: 100 },
];

export default function BaggageScreen({ booking, setBooking }) {
  const navigate = useNavigate();
  const [bags, setBags] = useState([{ description: '', type: 'Suitcase' }]);
  const [weightIdx, setWeightIdx] = useState(2);
  const [valuables, setValuables] = useState('');
  const [fragile, setFragile] = useState(false);
  const [perishable, setPerishable] = useState(false);
  const [oversized, setOversized] = useState(false);

  const addBag = () => {
    if (bags.length < 3) setBags([...bags, { description: '', type: 'Suitcase' }]);
  };

  const removeBag = (index) => {
    setBags(bags.filter((_, i) => i !== index));
  };

  const updateBag = (index, field, value) => {
    setBags(bags.map((b, i) => i === index ? { ...b, [field]: value } : b));
  };

  const excessFee = WEIGHT_OPTIONS[weightIdx].fee;

  const handleContinue = () => {
    setBooking(prev => ({
      ...prev,
      baggage: {
        count: bags.length,
        weight: WEIGHT_OPTIONS[weightIdx].value,
        excessFee,
        bags,
        valuables,
        specialHandling: { fragile, perishable, oversized },
      },
      totalFare: (prev.totalFare || 0) + excessFee,
    }));
    navigate('/payment');
  };

  return (
    <div className="kiosk-screen">
      <KioskHeader title="Baggage Declaration" />
      <div className="kiosk-body baggage-body">
        {/* Left Panel - Bag Configuration */}
        <div className="baggage-left">
          {/* Free Allowance Banner */}
          <div className="baggage-banner">
            <FaInfoCircle />
            <span>Each passenger has a <strong>20 kg free baggage allowance</strong></span>
          </div>

          {/* Estimated Weight */}
          <h3 className="baggage-section-title"><FaSuitcaseRolling /> Estimated Total Weight</h3>
          <div className="baggage-weight-grid">
            {WEIGHT_OPTIONS.map((opt, i) => (
              <button
                key={i}
                className={`baggage-weight-btn${weightIdx === i ? ' active' : ''}`}
                onClick={() => setWeightIdx(i)}
              >
                <span className="bw-radio" />
                <span className="bw-label">{opt.label}</span>
                {opt.fee > 0 && <span className="bw-fee">+₱{opt.fee}</span>}
              </button>
            ))}
          </div>

          {excessFee > 0 && (
            <div className="baggage-fee-alert">
              <FaExclamationTriangle /> Excess baggage fee: <strong>₱{excessFee}</strong>
            </div>
          )}

          {/* Bag Details */}
          <h3 className="baggage-section-title"><FaSuitcaseRolling /> Your Bags ({bags.length})</h3>
          <div className="baggage-bag-list">
            {bags.map((bag, i) => (
              <div key={i} className="baggage-bag-card">
                <div className="bag-card-header">
                  <strong>Bag {i + 1}</strong>
                  {bags.length > 1 && (
                    <button className="bag-remove-btn" onClick={() => removeBag(i)}>
                      <FaTrash />
                    </button>
                  )}
                </div>
                <input
                  className="kiosk-input"
                  placeholder="Description (e.g., Black rolling suitcase)"
                  value={bag.description}
                  onChange={(e) => updateBag(i, 'description', e.target.value)}
                />
                <div className="bag-type-chips">
                  {BAG_TYPES.map(type => (
                    <button
                      key={type}
                      className={`bag-type-chip${bag.type === type ? ' active' : ''}`}
                      onClick={() => updateBag(i, 'type', type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {bags.length < 3 && (
              <button className="baggage-add-btn" onClick={addBag}>
                <FaPlus /> Add Another Bag
              </button>
            )}
          </div>
        </div>

        {/* Right Panel - Valuables & Policy */}
        <div className="baggage-right">
          {/* Valuable Items */}
          <h3 className="baggage-section-title"><FaGem /> Declare Valuable Items</h3>
          <p className="baggage-hint">Optional — enables insurance coverage up to ₱100,000</p>
          <textarea
            className="kiosk-input kiosk-textarea"
            placeholder="e.g., Laptop worth ₱45,000; Gold jewelry ₱15,000; Camera ₱30,000"
            value={valuables}
            onChange={(e) => setValuables(e.target.value)}
            rows={3}
          />

          {/* Special Handling */}
          <h3 className="baggage-section-title"><FaExclamationTriangle /> Special Handling</h3>
          <div className="baggage-toggles">
            <label className={`baggage-toggle${fragile ? ' active' : ''}`}>
              <input type="checkbox" checked={fragile} onChange={(e) => setFragile(e.target.checked)} />
              <div className="bt-info">
                <strong>Fragile Items</strong>
                <small>Handle with care</small>
              </div>
            </label>
            <label className={`baggage-toggle${perishable ? ' active' : ''}`}>
              <input type="checkbox" checked={perishable} onChange={(e) => setPerishable(e.target.checked)} />
              <div className="bt-info">
                <strong>Perishable Goods</strong>
                <small>Temperature sensitive</small>
              </div>
            </label>
            <label className={`baggage-toggle${oversized ? ' active' : ''}`}>
              <input type="checkbox" checked={oversized} onChange={(e) => setOversized(e.target.checked)} />
              <div className="bt-info">
                <strong>Oversized Item</strong>
                <small>Larger than standard size</small>
              </div>
            </label>
          </div>

          {/* Baggage Policy */}
          <div className="baggage-policy">
            <h4><FaInfoCircle /> Baggage Policy</h4>
            <ul>
              <li><FaCheckCircle className="policy-check" /> 20 kg free baggage per passenger</li>
              <li><FaCheckCircle className="policy-check" /> Excess: ₱50 per additional 5 kg</li>
              <li><FaCheckCircle className="policy-check" /> Maximum single item weight: 30 kg</li>
              <li><FaCheckCircle className="policy-check" /> Declare valuables for insurance</li>
              <li><FaCheckCircle className="policy-check" /> Prohibited: flammable, hazardous items</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="kiosk-bottom-bar">
        <button className="back-btn" onClick={() => navigate('/passenger-info')}>
          <FaArrowLeft /> Back
        </button>
        <button className="continue-btn" onClick={handleContinue}>
          Continue to Payment <FaSuitcaseRolling />
        </button>
      </div>
    </div>
  );
}
