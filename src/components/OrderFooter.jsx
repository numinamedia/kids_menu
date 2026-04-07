import { orderNotes } from '../data/menuData';

export default function OrderFooter({ selectedItems, activeNotes, onToggleNote, onSendOrder, submitting }) {
  const hasSelections = Object.keys(selectedItems).length > 0;

  if (!hasSelections) return null;

  return (
    <div className="order-footer">
      <div className="notes-row">
        {orderNotes.map(note => (
          <button
            key={note.id}
            className={`note-btn ${activeNotes.includes(note.id) ? 'active' : ''}`}
            onClick={() => onToggleNote(note.id)}
          >
            {note.emoji} {note.label}
          </button>
        ))}
      </div>
      <div className="tray-summary">
        {Object.entries(selectedItems).map(([key, item]) => (
          <div key={key} className="tray-badge">
            <span className="tray-badge-icon">{item.icon}</span>
            <span className="tray-badge-text">{item.name}</span>
          </div>
        ))}
      </div>
      <button className="duo-order-btn" onClick={onSendOrder} disabled={submitting}>
        {submitting ? '⏳ Sending...' : '🚀 Send Order!'}
      </button>
    </div>
  );
}
