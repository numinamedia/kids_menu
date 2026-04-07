import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import confetti from 'canvas-confetti'
import './App.css'
import './components/v2/v2.css'
import { orderNotes } from './data/menuData'
import { useMenu } from './hooks/useMenu'
import ProfileGateway from './components/ProfileGateway'
import MenuScreen from './components/MenuScreen'
import OrderFooter from './components/OrderFooter'
import SuccessModal from './components/SuccessModal'
import Dashboard from './components/ParentDashboard/Dashboard'
import { supabase } from './lib/supabase'

// V2 Components
import ProfileGatewayV2 from './components/v2/ProfileGatewayV2'
import MenuScreenV2 from './components/v2/MenuScreenV2'
import OrderFooterV2 from './components/v2/OrderFooterV2'
import SuccessModalV2 from './components/v2/SuccessModalV2'

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxiX_dIulvMTLzRZuTN6jYVrms8F8GYVugxdEGU6rcHhW0PU2Y6g4meQjchzrmZqnOodg/exec";

function saveLastOrder(kidId, selectedItems) {
  try {
    localStorage.setItem(`lastOrder_${kidId}`, JSON.stringify(selectedItems));
  } catch {
    // localStorage unavailable — silently ignore
  }
}

// Get version from URL parameter or default to 'v1'
function getAppVersion() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('v') || 'v1';
}

function KidApp() {
  const { menuCategories } = useMenu();
  const [activeKid, setActiveKid] = useState(null);
  const [selectedItems, setSelectedItems] = useState({});
  const [activeNotes, setActiveNotes] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState(false);

  // Get current version
  const version = getAppVersion();

  // Use V2 components if version is 'v2'
  const GatewayComponent = version === 'v2' ? ProfileGatewayV2 : ProfileGateway;
  const MenuComponent = version === 'v2' ? MenuScreenV2 : MenuScreen;
  const FooterComponent = version === 'v2' ? OrderFooterV2 : OrderFooter;
  const SuccessComponent = version === 'v2' ? SuccessModalV2 : SuccessModal;

  const handleSelectKid = (profile, prefillItems = null) => {
    setActiveKid(profile);
    setSelectedItems(prefillItems || {});
    setActiveNotes([]);
    setOrderError(false);
  };

  const handleSwitchUser = () => {
    setActiveKid(null);
    setSelectedItems({});
    setActiveNotes([]);
    setShowSuccess(false);
    setSubmitting(false);
    setOrderError(false);
  };

  const handleSelectItem = (categoryId, item) => {
    setSelectedItems(prev => ({ ...prev, [categoryId]: item }));
  };

  const handleToggleNote = (noteId) => {
    setActiveNotes(prev =>
      prev.includes(noteId) ? prev.filter(id => id !== noteId) : [...prev, noteId]
    );
  };

  const handleSendOrder = async () => {
    setSubmitting(true);
    setOrderError(false);

    const noteLabels = activeNotes
      .map(id => orderNotes.find(n => n.id === id))
      .filter(Boolean)
      .map(n => `${n.emoji} ${n.label}`)
      .join(', ');

    const orderSummary = {};
    menuCategories.forEach(cat => {
      if (selectedItems[cat.id]) {
        orderSummary[cat.id] = selectedItems[cat.id];
      }
    });

    // Send to Google Sheets (backup)
    const formData = new URLSearchParams();
    formData.append('kid', activeKid.name);
    formData.append('main', selectedItems['mains']?.name || 'None');
    formData.append('side', selectedItems['sides']?.name || 'None');
    formData.append('dessert', selectedItems['desserts']?.name || 'None');
    formData.append('snack', selectedItems['snacks']?.name || 'None');
    formData.append('drink', selectedItems['drinks']?.name || 'None');
    formData.append('notes', noteLabels || 'None');
    formData.append('timestamp', new Date().toLocaleString());
    formData.append('items', JSON.stringify(orderSummary));

    try {
      // Fire and forget to Google Sheets
      fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      }).catch(() => {});

      // Save to Supabase (primary order storage)
      if (import.meta.env.VITE_SUPABASE_URL) {
        await supabase
          .from('orders')
          .insert([{
            kid_name: activeKid.name,
            items: orderSummary,
            notes: noteLabels || 'None',
            status: 'pending',
            timestamp: new Date().toISOString(),
          }]);
      }

      saveLastOrder(activeKid.id, selectedItems);
      setShowSuccess(true);
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      setTimeout(() => handleSwitchUser(), 3500);
    } catch {
      setOrderError(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (!activeKid) {
    return (
      <>
        <GatewayComponent onSelectKid={handleSelectKid} />
        <Link to="/admin" className="admin-link">🔒 Parent Dashboard</Link>
        <Link to={version === 'v2' ? '/' : '/?v=v2'} className="version-toggle">
          {version === 'v2' ? 'Switch to v1' : 'Try v2 ✨'}
        </Link>
      </>
    );
  }

  // V2 layout
  if (version === 'v2') {
    return (
      <>
        {showSuccess && <SuccessComponent />}
        <MenuComponent
          activeKid={activeKid}
          selectedItems={selectedItems}
          onSelectItem={handleSelectItem}
          onSwitchUser={handleSwitchUser}
        />
        {!showSuccess && (
          <>
            {orderError && (
              <div className="order-error">
                ⚠️ Couldn't send — check your connection and try again.
              </div>
            )}
            <FooterComponent
              selectedItems={selectedItems}
              activeNotes={activeNotes}
              onToggleNote={handleToggleNote}
              onSendOrder={handleSendOrder}
              submitting={submitting}
            />
          </>
        )}
      </>
    );
  }

  // V1 layout (original)
  return (
    <div
      className="gateway-bg"
      style={{ '--kid-color': activeKid.color, '--kid-color-shadow': activeKid.color + '66' }}
    >
      {showSuccess && <SuccessComponent />}

      <div className={`menu-glass-wrapper ${showSuccess ? 'blur-out' : ''}`}>
        <MenuComponent
          activeKid={activeKid}
          selectedItems={selectedItems}
          onSelectItem={handleSelectItem}
          onSwitchUser={handleSwitchUser}
        />
      </div>

      {!showSuccess && (
        <>
          {orderError && (
            <div className="order-error">
              ⚠️ Couldn't send — check your connection and try again.
            </div>
          )}
          <FooterComponent
            selectedItems={selectedItems}
            activeNotes={activeNotes}
            onToggleNote={handleToggleNote}
            onSendOrder={handleSendOrder}
            submitting={submitting}
          />
        </>
      )}
    </div>
  );
}

function App() {
  // Force re-render when URL changes by using a key
  const version = getAppVersion();

  return (
    <BrowserRouter>
      <Routes>
        <Route key={version} path="/" element={<KidApp />} />
        <Route path="/admin" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
 