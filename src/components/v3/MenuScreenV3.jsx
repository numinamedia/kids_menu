import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useMenu } from '../../hooks/useMenu';
import MealCardV3 from './MealCardV3';

// Core ordering flow categories (in order)
const FLOW_CATEGORIES = ['mains', 'sides', 'drinks'];

export default function MenuScreenV3({ activeKid, selectedItems, onSelectItem, onSwitchUser }) {
  const { menuCategories } = useMenu();
  const [activeFlowStep, setActiveFlowStep] = useState(0);
  const categoryRefs = useRef({});

  useEffect(() => {
    setActiveFlowStep(0);
  }, [activeKid?.id]);

  const handleSelectItem = (categoryId, item) => {
    onSelectItem(categoryId, item);

    // Auto-advance only for mains → sides → drinks
    if (FLOW_CATEGORIES.includes(categoryId)) {
      const flowIndex = FLOW_CATEGORIES.indexOf(categoryId);
      const nextFlowStep = flowIndex + 1;
      if (nextFlowStep < FLOW_CATEGORIES.length) {
        setActiveFlowStep(nextFlowStep);
        // Scroll to the next category
        const nextCatId = FLOW_CATEGORIES[nextFlowStep];
        if (categoryRefs.current[nextCatId]) {
          setTimeout(() => {
            categoryRefs.current[nextCatId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 300);
        }
      }
    }
  };

  // Calculate progress based only on flow categories
  const completedFlowSteps = FLOW_CATEGORIES.filter(id => {
    const cat = menuCategories.find(c => c.id === id);
    return cat && selectedItems[cat.id];
  }).length;
  const totalFlowSteps = FLOW_CATEGORIES.length;
  const progressPercentage = Math.min((completedFlowSteps / totalFlowSteps) * 100, 100);

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
            const isActive = i === activeFlowStep && !isDone;
            return (
              <div
                key={flowId}
                className={`v3-progress-step ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
                onClick={() => {
                  setActiveFlowStep(i);
                  if (categoryRefs.current[flowId]) {
                    categoryRefs.current[flowId].scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              >
                {isDone ? '✓' : i + 1}
              </div>
            );
          })}
        </div>
        <p className="v3-progress-text">
          Step {Math.min(completedFlowSteps + 1, totalFlowSteps)} of {totalFlowSteps}
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

      {/* All Categories - Show ALL at once, scrollable */}
      {menuCategories.map((cat) => {
        const isDone = !!selectedItems[cat.id];
        const isInFlow = FLOW_CATEGORIES.includes(cat.id);
        const flowIndex = isInFlow ? FLOW_CATEGORIES.indexOf(cat.id) : -1;
        const isActive = isInFlow && flowIndex === activeFlowStep && !isDone;

        // Clean category name without emoji
        const cleanTitle = cat.title.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();

        return (
          <div
            key={cat.id}
            ref={el => categoryRefs.current[cat.id] = el}
            className="v3-category-section"
          >
            <div className="v3-category-section-header">
              <h2 className="v3-category-title">{cleanTitle}</h2>
              {isInFlow && (
                <span className={`v3-category-step-badge ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}>
                  {isDone ? '✓' : flowIndex + 1}
                </span>
              )}
              {!isInFlow && (
                <span className="v3-category-step-badge optional">optional</span>
              )}
            </div>
            <div className="v3-meal-grid">
              {cat.items.map((item, i) => (
                <MealCardV3
                  key={item.id}
                  item={item}
                  categoryId={cat.id}
                  isSelected={selectedItems[cat.id]?.id === item.id}
                  onSelect={handleSelectItem}
                  index={i}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}