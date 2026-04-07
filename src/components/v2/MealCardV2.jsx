import { motion, AnimatePresence } from 'framer-motion';

export default function MealCardV2({ item, categoryId, isSelected, onSelect, index }) {
  return (
    <motion.div
      className={`v2-meal-card ${isSelected ? 'selected' : ''}`}
      style={{ '--card-color': item.bgColor || '#ffeaa7' }}
      initial={{ opacity: 0, scale: 0.8, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        delay: index * 0.05,
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onSelect(categoryId, item)}
    >
      {/* Selection indicator */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            className="v2-check-badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            ✓
          </motion.div>
        )}
      </AnimatePresence>

      {/* Food icon */}
      <motion.div
        className="v2-meal-icon-wrapper"
        animate={isSelected ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <span className="v2-meal-emoji">{item.icon}</span>
      </motion.div>

      {/* Item name */}
      <motion.p
        className="v2-meal-name"
        animate={isSelected ? { color: '#6C5CE7' } : {}}
      >
        {item.name}
      </motion.p>
    </motion.div>
  );
}