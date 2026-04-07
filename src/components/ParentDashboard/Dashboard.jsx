import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PINDialog from './PINDialog';
import OrderQueue from './OrderQueue';
import MenuEditor from './MenuEditor';

const TABS = [
  { id: 'orders', label: '📋 Orders' },
  { id: 'menu', label: '📝 Menu' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [showPin, setShowPin] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');

  const handleAuthenticated = useCallback(() => {
    setAuthenticated(true);
    setShowPin(false);
  }, []);

  const handleCancel = useCallback(() => {
    navigate('/');
  }, [navigate]);

  if (showPin) {
    return <PINDialog onAuthenticated={handleAuthenticated} onCancel={handleCancel} />;
  }

  return (
    <div className="dashboard-container v3-dark-dashboard">
      {/* Static kid-friendly gradient background */}
      <div className="v3-kids-bg" />
      
      <div className="v3-dark-dashboard-content">
        <div className="dashboard-header">
          <h1>🍽️ Parent Dashboard</h1>
          <div className="header-actions">
            <button className="back-to-kids-btn" onClick={() => navigate('/')}>
              ← Back to Kids App
            </button>
          </div>
        </div>

        <div className="dashboard-tabs v3-tabs">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="dashboard-content">
          {activeTab === 'orders' && <OrderQueue />}
          {activeTab === 'menu' && <MenuEditor />}
        </div>
      </div>
    </div>
  );
}
