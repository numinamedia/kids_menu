import { motion } from 'framer-motion';
import { orderNotes } from '../../data/menuData';

export default function OrderFooterV3({ selectedItems, activeNotes, onToggleNote, onSendOrder, submitting }) {
  const selectedCount = Object.keys(selectedItems).length;
  const hasRequiredItems = selectedItems['mains'] && selectedItems['sides'] && selectedItems['drinks'];

  return (
    <motion.div
      className="v3-order-footer"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      {/* Notes row */}
      <div className="v3-notes-row">
        {orderNotes.map(note => (
          <motion.button
            key={note.id}
            className={`v3-note-btn ${activeNotes.includes(note.id) ? 'active' : ''}`}
            whileTap={{ scale: 0.9 }}
            onClick={() => onToggleNote(note.id)}
          >
            {note.emoji} {note.label}
          </motion.button>
        ))}
      </div>

      {/* Tray summary */}
      <div className="v3-tray-container">
        {selectedCount > 0 ? (
          Object.entries(selectedItems).map(([cat, item], i) => (
            <motion.span
              key={cat}
              className="v3-tray-item"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.05, type: 'spring' }}
            >
              {item.icon}
            </motion.span>
          ))
        ) : (
          <span className="v3-tray-empty">Select your food! 🍽️</span>
        )}
      </div>

      {/* Send Order Button */}
      <motion.button
        className={`v3-send-btn ${hasRequiredItems ? 'ready' : ''}`}
        disabled={!hasRequiredItems || submitting}
        whileTap={hasRequiredItems ? { scale: 0.95, y: 4 } : {}}
        onClick={onSendOrder}
      >
        {submitting ? (
          <>Sending...</>
        ) : (
          <>
            {hasRequiredItems ? '🚀' : '🔒'} Send Order!
          </>
        )}
      </motion.button>
    </motion.div>
  );
}