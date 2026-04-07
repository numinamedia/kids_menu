import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMenu } from '../../hooks/useMenu';
import MealCardV3 from './MealCardV3';

export default function MenuScreenV3({ activeKid, selectedItems, onSelectItem, onSwitchUser }) {
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
  const totalCategories = menuCategories.length;

  // Find the index of the current step
  const currentStepIndex = menuCategories.findIndex(cat => cat.id === currentCategory.id);
  const progressPercentage = ((currentStepIndex) / (totalCategories - 1)) * 100;

  return (
    <div className="v3-menu-screen">
      {/* Progress Path */}
      <div className="v3-progress-container">
        <div className="v3-progress-path">
          <div className="v3-progress-line">
            <div className="v3-progress-line-fill" style={{ width: `${progressPercentage}%` }} />
          </div>
          {menuCategories.map((cat, i) => {
            const isDone = !!selectedItems[cat.id];
            const isActive = i === currentTab;
            return (
              <div
                key={cat.id}
                className={`v3-progress-step ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
                onClick={() => setCurrentTab(i)}
              >
                {isDone ? '✓' : i + 1}
              </div>
            );
          })}
        </div>
        <p className="v3-progress-text">
          Step {currentStepIndex + 1} of {totalCategories}
        </p>
      </div>

      {/* Header */}
      <motion.div className="v3-menu-header" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <button className="v3-back-btn" onClick={onSwitchUser}>
          ← Switch User
        </button>
        <h1>Hey, {activeKid.name}! 👋</h1>
        <p>Pick your favorites!</p>
      </motion.div>

      {/* Category Tabs */}
      <div className="v3-category-tabs">
        {menuCategories.map((cat, i) => {
          const isDone = !!selectedItems[cat.id];
          const isActive = i === currentTab;
          return (
            <button
              key={cat.id}
              className={`v3-category-tab ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
              onClick={() => setCurrentTab(i)}
            >
              <span className="v3-tab-emoji">{cat.items[0]?.icon || '🍽️'}</span>
              <span>
                {cat.title.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim()}
              </span>
            </button>
          );
        })}
      </div>

      {/* Menu Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCategory.id}
          className="v3-menu-content"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
        >
          <h2 className="v3-category-title">{currentCategory.title}</h2>
          <div className="v3-meal-grid">
            {currentCategory.items.map((item, i) => (
              <MealCardV3
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