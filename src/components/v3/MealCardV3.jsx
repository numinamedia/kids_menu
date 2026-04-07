import { motion } from 'framer-motion';

export default function MealCardV3({ item, categoryId, isSelected, onSelect, index }) {
  return (
    <motion.div
      className={`v3-meal-card ${isSelected ? 'selected' : ''}`}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        delay: index * 0.05,
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onSelect(categoryId, item)}
    >
      {isSelected && (
        <motion.div
          className="v3-check-icon"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          ✓
        </motion.div>
      )}

      <motion.span
        className="v3-meal-emoji"
        animate={isSelected ? { scale: [1, 1.15, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        {item.icon}
      </motion.span>

      <p className="v3-meal-name">{item.name}</p>
    </motion.div>
  );
}