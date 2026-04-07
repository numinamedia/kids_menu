import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMenu } from '../../hooks/useMenu';
import MealCardV2 from './MealCardV2';

export default function MenuScreenV2({ activeKid, selectedItems, onSelectItem, onSwitchUser }) {
  const { menuCategories } = useMenu();
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    setCurrentTab(0);
  }, [activeKid?.id]);

  const handleSelectItem = (categoryId, item) => {
    onSelectItem(categoryId, item);

    // Auto-advance only for mains → sides → drinks
    const autoAdvanceCategories = ['mains', 'sides', 'drinks'];
    if (autoAdvanceCategories.includes(categoryId)) {
      const currentIndex = menuCategories.findIndex(c => c.id === categoryId);
      const nextCategory = menuCategories[currentIndex + 1];
      if (nextCategory) {
        setTimeout(() => setCurrentTab(currentIndex + 1), 400);
      }
    }
  };

  const currentCategory = menuCategories[currentTab];
  if (!currentCategory) return null;

  // Calculate progress
  const completedCategories = menuCategories.filter(cat => selectedItems[cat.id]).length;
  const progress = (completedCategories / menuCategories.length) * 100;

  return (
    <div className="v2-menu-screen">
      {/* Progress bar */}
      <div className="v2-progress-bar">
        <div className="v2-progress-fill" style={{ width: `${progress}%` }} />
        <div className="v2-progress-steps">
          {menuCategories.map((cat, i) => (
            <div
              key={cat.id}
              className={`v2-progress-step ${i <= currentTab ? 'active' : ''} ${selectedItems[cat.id] ? 'done' : ''}`}
              onClick={() => setCurrentTab(i)}
            >
              <span className="v2-step-icon">
                {selectedItems[cat.id] ? '✓' : cat.items[0]?.icon || '🍽️'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Header */}
      <motion.div
        className="v2-menu-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button className="v2-back-btn" onClick={onSwitchUser}>
          ← Back
        </button>
        <h1>
          Hey, {activeKid.name}! 👋
        </h1>
        <p>Pick your favorites!</p>
      </motion.div>

      {/* Category carousel */}
      <div className="v2-category-carousel">
        {menuCategories.map((cat, i) => (
          <button
            key={cat.id}
            className={`v2-carousel-tab ${i === currentTab ? 'active' : ''} ${selectedItems[cat.id] ? 'done' : ''}`}
            onClick={() => setCurrentTab(i)}
          >
            <span className="v2-tab-emoji">{cat.items[0]?.icon || '🍽️'}</span>
            <span className="v2-tab-label">
              {cat.title.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim()}
            </span>
            {selectedItems[cat.id] && <span className="v2-tab-check">✓</span>}
          </button>
        ))}
      </div>

      {/* Menu items grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCategory.id}
          className="v2-menu-grid"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <motion.h2
            className="v2-category-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {currentCategory.title}
          </motion.h2>
          
          <div className="v2-meal-grid">
            {currentCategory.items.map((item, i) => (
              <MealCardV2
                key={item.id}
                item={item}
                categoryId={currentCategory.id}
                isSelected={selectedItems[currentCategory.id]?.id === item.id}
                onSelect={handleSelectItem}
                index={i}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}