function ConfirmDialog({ transaction, onConfirm, onCancel }) {
  if (!transaction) return null;

  return (
    <div className="dialog-overlay" onClick={onCancel}>
      <div className="dialog" onClick={e => e.stopPropagation()}>
        <div className="dialog-icon">🗑️</div>
        <h3 className="dialog-title">Delete Transaction</h3>
        <p className="dialog-message">
          Are you sure you want to delete{' '}
          <strong>"{transaction.description}"</strong>?{' '}
          This cannot be undone.
        </p>
        <div className="dialog-actions">
          <button className="btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn-danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog
