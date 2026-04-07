import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import confetti from 'canvas-confetti'
import './App.css'
import { orderNotes, menuCategories } from './data/menuData'
import ProfileGateway from './components/ProfileGateway'
import MenuScreen from './components/MenuScreen'
import OrderFooter from './components/OrderFooter'
import SuccessModal from './components/SuccessModal'
import Dashboard from './components/ParentDashboard/Dashboard'

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxiX_dIulvMTLzRZuTN6jYVrms8F8GYVugxdEGU6rcHhW0PU2Y6g4meQjchzrmZqnOodg/exec";

function saveLastOrder(kidId, selectedItems) {
  try {
    localStorage.setItem(`lastOrder_${kidId}`, JSON.stringify(selectedItems));
  } catch {
    // localStorage unavailable — silently ignore
  }
}

function KidApp() {
  const [activeKid, setActiveKid] = useState(null);
  const [selectedItems, setSelectedItems] = useState({});
  const [activeNotes, setActiveNotes] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState(false);

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
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });

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
        <ProfileGateway onSelectKid={handleSelectKid} />
        <Link to="/admin" className="admin-link">🔒 Parent Dashboard</Link>
      </>
    );
  }

  return (
    <div
      className="gateway-bg"
      style={{ '--kid-color': activeKid.color, '--kid-color-shadow': activeKid.color + '66' }}
    >
      {showSuccess && <SuccessModal />}

      <div className={`menu-glass-wrapper ${showSuccess ? 'blur-out' : ''}`}>
        <MenuScreen
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
          <OrderFooter
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
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<KidApp />} />
        <Route path="/admin" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
 