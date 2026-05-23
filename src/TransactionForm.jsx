import { useState, useEffect, useRef } from 'react'

const categories = [
  "food", "groceries", "rent", "housing", "utilities", "phone bill",
  "transport", "entertainment", "clothing", "salary", "savings", "black tax", "debt", "gym & fitness", "miscellaneous",
];

const toTitleCase = (str) => str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

function TransactionForm({ onAdd, editingTransaction, onUpdate, onCancelEdit }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const cardRef = useRef(null);

  useEffect(() => {
    if (editingTransaction) {
      const isKnown = categories.includes(editingTransaction.category);
      setDescription(editingTransaction.description);
      setAmount(String(editingTransaction.amount));
      setType(editingTransaction.type || "");
      setCategory(isKnown ? editingTransaction.category : "other");
      setCustomCategory(isKnown ? "" : editingTransaction.category);
      cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      setDescription("");
      setAmount("");
      setType("");
      setCategory("");
      setCustomCategory("");
    }
  }, [editingTransaction]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount || !type || !category) return;
    if (category === "other" && !customCategory.trim()) return;

    const resolvedCategory = category === "other" ? customCategory.trim().toLowerCase() : category;

    const transaction = {
      id: editingTransaction ? editingTransaction.id : Date.now(),
      description,
      amount: parseFloat(amount),
      type,
      category: resolvedCategory,
      date: editingTransaction ? editingTransaction.date : new Date().toISOString().split('T')[0],
    };

    if (editingTransaction) {
      onUpdate(transaction);
    } else {
      onAdd(transaction);
      setDescription("");
      setAmount("");
      setType("");
      setCategory("");
      setCustomCategory("");
    }
  };

  return (
    <div ref={cardRef} className={`card${editingTransaction ? ' editing' : ''}`}>
      <h2 className="card-title">
        {editingTransaction ? '✏️ Edit Transaction' : 'Add Transaction'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-field">
            <label className="form-label">Description</label>
            <input
              className="form-input"
              type="text"
              placeholder="e.g. Coffee, Rent…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label className="form-label">Amount</label>
            <input
              className="form-input"
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label className="form-label">Type</label>
            <select className="form-select" value={type} onChange={(e) => setType(e.target.value)} required>
              <option value="" disabled>Select type…</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
              <option value="savings">Savings</option>
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Category</label>
            <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)} required>
              <option value="" disabled>Select category…</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{toTitleCase(cat)}</option>
              ))}
              <option value="other">Other…</option>
            </select>
          </div>
          {category === "other" && (
            <div className="form-field">
              <label className="form-label">Custom Category</label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g. Pet care, Medical…"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                required
              />
            </div>
          )}
          <div className="form-actions">
            {editingTransaction && (
              <button type="button" className="btn-secondary" onClick={onCancelEdit}>
                Cancel
              </button>
            )}
            <button type="submit" className="btn-primary">
              {editingTransaction ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default TransactionForm
