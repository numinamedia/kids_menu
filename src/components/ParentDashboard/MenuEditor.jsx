import { useState, useEffect } from 'react';
import { useMenuItems } from '../../hooks/useOrders';
import { menuCategories as localMenuCategories, categoryOrder } from '../../data/menuData';

export default function MenuEditor() {
  const { menuItems, loading, addMenuItem, updateMenuItem, deleteMenuItem } = useMenuItems();
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'mains',
    icon: '🍽️',
    bg_color: '#ffeaa7',
    is_available: true,
    sort_order: 0,
  });

  const categories = useMenuCategories(menuItems);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateMenuItem(editingItem.id, formData);
      } else {
        await addMenuItem(formData);
      }
      resetForm();
    } catch (err) {
      alert('Failed to save item: ' + err.message);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', category: 'mains', icon: '🍽️', bg_color: '#ffeaa7', is_available: true, sort_order: 0 });
    setEditingItem(null);
    setShowForm(false);
  };

  const startEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      icon: item.icon || '🍽️',
      bg_color: item.bg_color || '#ffeaa7',
      is_available: item.is_available,
      sort_order: item.sort_order || 0,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this item?')) {
      try {
        await deleteMenuItem(id);
      } catch (err) {
        alert('Failed to delete: ' + err.message);
      }
    }
  };

  const handleToggleAvailability = async (item) => {
    try {
      await updateMenuItem(item.id, { is_available: !item.is_available });
    } catch (err) {
      alert('Failed to update: ' + err.message);
    }
  };

  if (!import.meta.env.VITE_SUPABASE_URL) {
    return (
      <div className="dashboard-section">
        <h2>📝 Menu Editor</h2>
        <div className="setup-notice">
          <p>⚠️ Supabase is not configured.</p>
          <p>Showing local menu from menuData.js. To manage menu items via the dashboard:</p>
          <ol>
            <li>Create a Supabase project at <a href="https://supabase.com" target="_blank">supabase.com</a></li>
            <li>Create the <code>menu_items</code> table (see setup instructions)</li>
            <li>Add your credentials to <code>.env</code></li>
          </ol>
        </div>
        <LocalMenuPreview />
      </div>
    );
  }

  return (
    <div className="dashboard-section">
      <div className="section-header">
        <h2>📝 Menu Editor</h2>
        <button className="add-btn" onClick={() => { resetForm(); setShowForm(true); }}>
          + Add Item
        </button>
      </div>

      {showForm && (
        <form className="menu-form" onSubmit={handleSubmit}>
          <h3>{editingItem ? 'Edit' : 'Add'} Menu Item</h3>
          <div className="form-row">
            <label>
              Name
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                placeholder="e.g., Teriyaki Chicken"
              />
            </label>
            <label>
              Category
              <select
                value={formData.category}
                onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.title}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="form-row">
            <label>
              Icon (emoji)
              <input
                type="text"
                value={formData.icon}
                onChange={e => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                maxLength={4}
              />
            </label>
            <label>
              Color
              <input
                type="color"
                value={formData.bg_color}
                onChange={e => setFormData(prev => ({ ...prev, bg_color: e.target.value }))}
              />
            </label>
            <label>
              Sort Order
              <input
                type="number"
                value={formData.sort_order}
                onChange={e => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) }))}
              />
            </label>
          </div>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.is_available}
              onChange={e => setFormData(prev => ({ ...prev, is_available: e.target.checked }))}
            />
            Available
          </label>
          <div className="form-actions">
            <button type="submit" className="save-btn">
              {editingItem ? 'Update' : 'Create'}
            </button>
            <button type="button" className="cancel-btn" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading && <p className="loading-text">Loading menu items...</p>}

      <div className="menu-items-list">
        {categories.map(cat => (
          <div key={cat.id} className="menu-category-group">
            <h3>{cat.title}</h3>
            <div className="menu-items-grid">
              {menuItems
                .filter(item => item.category === cat.id)
                .map(item => (
                  <div
                    key={item.id}
                    className={`menu-item-card ${!item.is_available ? 'unavailable' : ''}`}
                    style={{ borderLeftColor: item.bg_color || '#ffeaa7' }}
                  >
                    <div className="item-info">
                      <span className="item-emoji">{item.icon}</span>
                      <span className="item-label">{item.name}</span>
                      {!item.is_available && <span className="unavailable-badge">Hidden</span>}
                    </div>
                    <div className="item-actions">
                      <button
                        className={`toggle-btn ${item.is_available ? 'on' : 'off'}`}
                        onClick={() => handleToggleAvailability(item)}
                      >
                        {item.is_available ? '👁️' : '🚫'}
                      </button>
                      <button className="edit-btn" onClick={() => startEdit(item)}>✏️</button>
                      <button className="delete-btn" onClick={() => handleDelete(item.id)}>🗑️</button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LocalMenuPreview() {
  return (
    <div className="local-menu-preview">
      {localMenuCategories.map(cat => (
        <div key={cat.id}>
          <h4>{cat.title}</h4>
          <ul>
            {cat.items.map(item => (
              <li key={item.id}>{item.icon} {item.name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function useMenuCategories(menuItems) {
  const [cats, setCats] = useState([]);
  useEffect(() => {
    const available = menuItems.length > 0
      ? [...new Set(menuItems.map(i => i.category))]
      : categoryOrder;
    setCats(available.map(id => {
      const local = localMenuCategories.find(c => c.id === id);
      return local || { id, title: id };
    }));
  }, [menuItems]);
  return cats;
}
