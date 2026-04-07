import { motion } from 'framer-motion';
import { orderNotes } from '../../data/menuData';

export default function OrderFooterV2({ selectedItems, activeNotes, onToggleNote, onSendOrder, submitting }) {
  const selectedCount = Object.keys(selectedItems).length;
  const hasRequiredItems = selectedItems['mains'] && selectedItems['sides'] && selectedItems['drinks'];

  return (
    <motion.div
      className="v2-order-footer"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      {/* Notes row */}
      <div className="v2-notes-row">
        {orderNotes.map(note => (
          <motion.button
            key={note.id}
            className={`v2-note-btn ${activeNotes.includes(note.id) ? 'active' : ''}`}
            whileTap={{ scale: 0.9 }}
            onClick={() => onToggleNote(note.id)}
          >
            {note.emoji} {note.label}
          </motion.button>
        ))}
      </div>

      {/* Floating pill */}
      <motion.div
        className="v2-order-pill"
        animate={hasRequiredItems ? { scale: [1, 1.02, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {/* Tray summary */}
        <div className="v2-tray-summary">
          {Object.entries(selectedItems).map(([cat, item]) => (
            <motion.span
              key={cat}
              className="v2-tray-item"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              {item.icon}
            </motion.span>
          ))}
          {selectedCount === 0 && <span className="v2-tray-empty">Pick your food! 🍽️</span>}
        </div>

        {/* Send order button */}
        <motion.button
          className={`v2-send-btn ${hasRequiredItems ? 'ready' : ''}`}
          disabled={!hasRequiredItems || submitting}
          whileTap={hasRequiredItems ? { scale: 0.9 } : {}}
          onClick={onSendOrder}
        >
          {submitting ? '⏳' : '🚀'}
          <span>{submitting ? 'Sending...' : 'Send Order!'}</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}