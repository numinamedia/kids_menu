import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMenu } from '../../hooks/useMenu';
import MealCardV3 from './MealCardV3';

// Core ordering flow categories (in order)
const FLOW_CATEGORIES = ['mains', 'sides', 'drinks'];

export default function MenuScreenV3({ activeKid, selectedItems, onSelectItem, onSwitchUser }) {
  const { menuCategories } = useMenu();
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    setCurrentTab(0);
  }, [activeKid?.id]);

  const handleSelectItem = (categoryId, item) => {
    onSelectItem(categoryId, item);

    // Auto-advance only for mains → sides → drinks
    if (FLOW_CATEGORIES.includes(categoryId)) {
      const flowIndex = FLOW_CATEGORIES.indexOf(categoryId);
      const nextCatId = FLOW_CATEGORIES[flowIndex + 1];
      if (nextCatId) {
        // Find the actual tab index for the next category
        const nextTabIndex = menuCategories.findIndex(c => c.id === nextCatId);
        if (nextTabIndex >= 0) {
          setTimeout(() => setCurrentTab(nextTabIndex), 400);
        }
      }
    }
  };

  const currentCategory = menuCategories[currentTab];
  if (!currentCategory) return null;

  // Calculate progress based only on flow categories
  const completedFlowSteps = FLOW_CATEGORIES.filter(id => {
    const cat = menuCategories.find(c => c.id === id);
    return cat && selectedItems[cat.id];
  }).length;
  const totalFlowSteps = FLOW_CATEGORIES.length;

  // Find which flow step we're on (0-indexed based on flow categories only)
  const currentFlowIndex = FLOW_CATEGORIES.indexOf(currentCategory.id);
  // If current category is not in flow, find the last completed flow step
  const displayFlowIndex = currentFlowIndex >= 0 ? currentFlowIndex : completedFlowSteps;
  const progressPercentage = Math.min((displayFlowIndex / (totalFlowSteps - 1)) * 100, 100);

  return (
    <div className="v3-menu-screen">
      {/* Progress Path - Only show 3 core steps */}
      <div className="v3-progress-container">
        <div className="v3-progress-path">
          <div className="v3-progress-line">
            <div className="v3-progress-line-fill" style={{ width: `${progressPercentage}%` }} />
          </div>
          {FLOW_CATEGORIES.map((flowId, i) => {
            const cat = menuCategories.find(c => c.id === flowId);
            if (!cat) return null;
            const isDone = !!selectedItems[cat.id];
            const isActive = currentCategory.id === flowId;
            return (
              <div
                key={flowId}
                className={`v3-progress-step ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
                onClick={() => {
                  const tabIndex = menuCategories.findIndex(c => c.id === flowId);
                  if (tabIndex >= 0) setCurrentTab(tabIndex);
                }}
              >
                {isDone ? '✓' : i + 1}
              </div>
            );
          })}
        </div>
        <p className="v3-progress-text">
          Step {Math.min(displayFlowIndex + 1, totalFlowSteps)} of {totalFlowSteps}
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

      {/* Category Tabs - Shows ALL categories */}
      <div className="v3-category-tabs">
        {menuCategories.map((cat) => {
          const isDone = !!selectedItems[cat.id];
          const isActive = currentTab === menuCategories.indexOf(cat);
          const isInFlow = FLOW_CATEGORIES.includes(cat.id);
          return (
            <button
              key={cat.id}
              className={`v3-category-tab ${isActive ? 'active' : ''} ${isDone ? 'done' : ''} ${!isInFlow ? 'optional' : ''}`}
              onClick={() => setCurrentTab(menuCategories.indexOf(cat))}
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