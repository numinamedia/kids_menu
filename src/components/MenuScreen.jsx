import { useState, useEffect } from 'react';
import { menuCategories as localMenuCategories } from '../data/menuData';
import { useMenu } from '../hooks/useMenu';
import MealCard from './MealCard';

export default function MenuScreen({ activeKid, selectedItems, onSelectItem, onSwitchUser }) {
  const { menuCategories } = useMenu();
  const [currentTab, setCurrentTab] = useState(0);

  // Reset to first tab whenever the active kid changes
  useEffect(() => {
    setCurrentTab(0);
  }, [activeKid?.id]);

  const handleSelectItem = (categoryId, item) => {
    onSelectItem(categoryId, item);

    // Auto-advance to next tab after a short delay so the selection is visible
    const currentIndex = menuCategories.findIndex(c => c.id === categoryId);
    const nextCategory = menuCategories[currentIndex + 1];
    if (nextCategory) {
      setTimeout(() => setCurrentTab(currentIndex + 1), 400);
    }
  };

  const currentCategory = menuCategories[currentTab];
  if (!currentCategory) return null;

  return (
    <div className="glass-panel menu-glass">
      <div className="menu-nav">
        <button className="duo-back-btn glass-btn" onClick={onSwitchUser}>← Switch User</button>
      </div>

      <div className="tab-bar">
        {menuCategories.map(cat => {
          const isDone = !!selectedItems[cat.id];
          return (
            <button
              key={cat.id}
              className={`tab-btn ${currentTab === menuCategories.indexOf(cat) ? 'active' : ''} ${isDone ? 'done' : ''}`}
              onClick={() => setCurrentTab(menuCategories.indexOf(cat))}
            >
              {isDone && <span className="tab-check">✓ </span>}
              {cat.title.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim()}
            </button>
          );
        })}
      </div>

      <header className="menu-header">
        <h1>Hey, {activeKid.name}!</h1>
        <p>Pick one from each tab.</p>
      </header>

      <div className="menu-categories-container">
        <div className="category-section">
          <h2 className="category-title">{currentCategory.title}</h2>
          <div className="meal-grid">
            {currentCategory.items.map(item => (
              <MealCard
                key={item.id}
                item={item}
                categoryId={currentCategory.id}
                isSelected={selectedItems[currentCategory.id]?.id === item.id}
                onSelect={handleSelectItem}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
