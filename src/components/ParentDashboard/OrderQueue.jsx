import { useOrders, useUpdateOrder } from '../../hooks/useOrders';

// Format date/time in Edmonton timezone (America/Edmonton)
function formatEdmontonTime(timestamp) {
  if (!timestamp) return 'N/A';
  const date = new Date(timestamp);
  return date.toLocaleString('en-CA', {
    timeZone: 'America/Edmonton',
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

const STATUS_LABELS = {
  pending: '⏳ Pending',
  preparing: '🍳 Preparing',
  ready: '✅ Ready',
  completed: '🎉 Completed',
};

const STATUS_COLORS = {
  pending: '#fdcb6e',
  preparing: '#e17055',
  ready: '#00b894',
  completed: '#636e72',
};

export default function OrderQueue() {
  const { orders, loading, error, filter, setFilter, refresh } = useOrders('pending');
  const { updateOrderStatus, updating } = useUpdateOrder();

  const advanceStatus = (currentStatus) => {
    const flow = ['pending', 'preparing', 'ready', 'completed'];
    const idx = flow.indexOf(currentStatus);
    return flow[Math.min(idx + 1, flow.length - 1)];
  };

  const handleAdvanceOrder = async (order) => {
    const nextStatus = advanceStatus(order.status);
    const success = await updateOrderStatus(order.id, nextStatus);
    if (success) {
      refresh(); // Force refresh after status update
    }
  };

  if (!import.meta.env.VITE_SUPABASE_URL) {
    return (
      <div className="dashboard-section">
        <h2>📋 Order Queue</h2>
        <div className="setup-notice">
          <p>⚠️ Supabase is not configured.</p>
          <p>Orders are currently sent to Google Sheets. To use the dashboard:</p>
          <ol>
            <li>Create a Supabase project at <a href="https://supabase.com" target="_blank">supabase.com</a></li>
            <li>Create the <code>orders</code> and <code>menu_items</code> tables (see SETUP.md)</li>
            <li>Add your credentials to <code>.env</code></li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-section">
      <div className="section-header">
        <h2>📋 Order Queue</h2>
        <button className="refresh-btn" onClick={refresh} disabled={loading}>🔄</button>
      </div>

      <div className="status-filters">
        {['pending', 'preparing', 'ready', 'completed', 'all'].map(status => (
          <button
            key={status}
            className={`filter-btn ${filter === status ? 'active' : ''}`}
            onClick={() => setFilter(status)}
          >
            {STATUS_LABELS[status] || status}
          </button>
        ))}
      </div>

      {loading && <p className="loading-text">Loading orders...</p>}
      {error && <p className="error-text">Error: {error}</p>}

      {!loading && orders.length === 0 && (
        <p className="empty-text">No orders found</p>
      )}

      <div className="orders-grid">
        {orders.map(order => (
          <div
            key={order.id}
            className="order-card"
            style={{ borderLeftColor: STATUS_COLORS[order.status] || '#ccc' }}
          >
            <div className="order-header">
              <div className="order-kid">
                <span className="kid-avatar">{order.kid_name?.[0]}</span>
                <strong>{order.kid_name}</strong>
              </div>
              <span
                className="order-status-badge"
                style={{ backgroundColor: STATUS_COLORS[order.status] || '#ccc' }}
              >
                {STATUS_LABELS[order.status] || order.status}
              </span>
            </div>

            <div className="order-items">
              {order.items && typeof order.items === 'object' && Object.entries(order.items).map(([category, item]) => (
                item && item.name && (
                  <div key={category} className="order-item">
                    <span className="item-category">{category}:</span>
                    <span className="item-icon">{item.icon}</span>
                    <span className="item-name">{item.name}</span>
                  </div>
                )
              ))}
            </div>

            {order.notes && order.notes !== 'None' && (
              <div className="order-notes">📝 {order.notes}</div>
            )}

            <div className="order-timestamp">
              🕐 {formatEdmontonTime(order.timestamp)}
            </div>

            <div className="order-footer">
              {order.status !== 'completed' && (
                <button
                  className="advance-btn"
                  onClick={() => handleAdvanceOrder(order)}
                  disabled={updating}
                >
                  {order.status === 'pending' ? 'Start Preparing →' : 
                   order.status === 'preparing' ? 'Mark Ready →' : 
                   'Complete →'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}