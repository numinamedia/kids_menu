import { useState } from 'react';

const CORRECT_PIN = '1234';

export default function PINDialog({ onAuthenticated, onCancel }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleDigitClick = (digit) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 4) {
        if (newPin === CORRECT_PIN) {
          onAuthenticated();
        } else {
          setError(true);
          setTimeout(() => {
            setPin('');
            setError(false);
          }, 800);
        }
      }
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  return (
    <div className="pin-overlay">
      <div className={`pin-dialog ${error ? 'shake' : ''}`}>
        <h2>Parent Access 🔒</h2>
        <p>Enter PIN to continue</p>
        <div className="pin-display">
          {[0, 1, 2, 3].map(i => (
            <span key={i} className={`pin-dot ${pin[i] ? 'filled' : ''}`}>
              {pin[i] ? '•' : ''}
            </span>
          ))}
        </div>
        <div className="pin-keypad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, 'back'].map((digit, i) => (
            <button
              key={i}
              className={`pin-btn ${digit === 'back' ? 'backspace' : ''}`}
              onClick={() => digit === 'back' ? handleBackspace() : handleDigitClick(String(digit))}
              disabled={digit === null}
            >
              {digit === 'back' ? '⌫' : digit}
            </button>
          ))}
        </div>
        <button className="pin-cancel-btn" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}