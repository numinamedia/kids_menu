import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import confetti from 'canvas-confetti'
import './App.css'
import './components/v3/v3.css'
import { orderNotes } from './data/menuData'
import { useMenu } from './hooks/useMenu'
import ProfileGateway from './components/ProfileGateway'
import MenuScreen from './components/MenuScreen'
import OrderFooter from './components/OrderFooter'
import SuccessModal from './components/SuccessModal'
import Dashboard from './components/ParentDashboard/Dashboard'
import { supabase } from './lib/supabase'

// V3 Duolingo-Style Components
import ProfileGatewayV3 from './components/v3/ProfileGatewayV3'
import MenuScreenV3 from './components/v3/MenuScreenV3'
import OrderFooterV3 from './components/v3/OrderFooterV3'
import SuccessModalV3 from './components/v3/SuccessModalV3'

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxiX_dIulvMTLzRZuTN6jYVrms8F8GYVugxdEGU6rcHhW0PU2Y6g4meQjchzrmZqnOodg/exec";

function saveLastOrder(kidId, selectedItems) {
  try {
    localStorage.setItem(`lastOrder_${kidId}`, JSON.stringify(selectedItems));
  } catch {
    // localStorage unavailable — silently ignore
  }
}

// Theme management
function getTheme() {
  return localStorage.getItem('v3-theme') || 'dark';
}

function KidApp() {
  const { menuCategories } = useMenu();
  const [activeKid, setActiveKid] = useState(null);
  const [selectedItems, setSelectedItems] = useState({});
  const [activeNotes, setActiveNotes] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState(false);
  const [theme, setTheme] = useState(getTheme());

  // Apply theme class
  useEffect(() => {
    document.documentElement.classList.toggle('v3-light-mode', theme === 'light');
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('v3-theme', newTheme);
  };

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
        {/* Animated gradient mesh background */}
        <div className="v3-mesh-bg">
          <div className="v3-mesh-bg__blob v3-mesh-bg__blob--1" />
          <div className="v3-mesh-bg__blob v3-mesh-bg__blob--2" />
          <div className="v3-mesh-bg__blob v3-mesh-bg__blob--3" />
          <div className="v3-mesh-bg__blob v3-mesh-bg__blob--4" />
        </div>
        <button className="v3-theme-toggle" onClick={toggleTheme}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <ProfileGatewayV3 onSelectKid={handleSelectKid} />
        <Link to="/admin" className="admin-link">🔒 Parent Dashboard</Link>
      </>
    );
  }

  return (
    <>
      {/* Animated gradient mesh background */}
      <div className="v3-mesh-bg">
        <div className="v3-mesh-bg__blob v3-mesh-bg__blob--1" />
        <div className="v3-mesh-bg__blob v3-mesh-bg__blob--2" />
        <div className="v3-mesh-bg__blob v3-mesh-bg__blob--3" />
        <div className="v3-mesh-bg__blob v3-mesh-bg__blob--4" />
      </div>
      <button className="v3-theme-toggle" onClick={toggleTheme}>
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
      {showSuccess && <SuccessModalV3 />}

      <MenuScreenV3
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
          <OrderFooterV3
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