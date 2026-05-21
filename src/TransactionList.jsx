import { useState } from 'react'
import ConfirmDialog from './ConfirmDialog'

const categories = [
  "food", "groceries", "rent", "housing", "utilities", "phone bill",
  "transport", "entertainment", "clothing", "salary", "savings", "black tax", "miscellaneous",
];

const categoryIcons = {
  food: '🍔',
  groceries: '🛒',
  rent: '🔑',
  housing: '🏠',
  utilities: '⚡',
  'phone bill': '📱',
  transport: '🚗',
  entertainment: '🎬',
  clothing: '👕',
  salary: '💼',
  savings: '🏦',
  'black tax': '🤝',
  miscellaneous: '🗂️',
};

const toTitleCase = (str) => str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

function TransactionList({ transactions, onEdit, onDelete }) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [pendingDelete, setPendingDelete] = useState(null);

  let filtered = transactions;
  if (search.trim()) {
    filtered = filtered.filter(t =>
      t.description.toLowerCase().includes(search.trim().toLowerCase())
    );
  }
  if (filterType !== "all") filtered = filtered.filter(t => t.type === filterType);
  if (filterCategory !== "all") filtered = filtered.filter(t => t.category === filterCategory);

  const fmt = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const exportToCSV = () => {
    const headers = ['Date', 'Description', 'Type', 'Category', 'Amount (£)'];
    const rows = filtered.map(t => [
      t.date,
      `"${t.description.replace(/"/g, '""')}"`,
      t.type,
      t.category,
      t.amount.toFixed(2),
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card">
      <div className="section-header">
        <h2 className="card-title" style={{ marginBottom: 0 }}>Transactions</h2>
        <button className="export-btn" onClick={exportToCSV} disabled={filtered.length === 0}>
          ⬇ Export CSV
        </button>
      </div>

      <div className="list-controls">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            type="text"
            placeholder="Search transactions…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch("")}>✕</button>
          )}
        </div>
        <div className="filters">
          <select className="filter-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
            <option value="savings">Savings</option>
          </select>
          <select className="filter-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{toTitleCase(cat)}</option>
            ))}
          </select>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th className="th-date">Date</th>
            <th>Description</th>
            <th>Category</th>
            <th className="th-amount">Amount</th>
            <th className="th-action"></th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="5" className="empty-state">
                {search || filterType !== "all" || filterCategory !== "all"
                  ? "No transactions match your filters"
                  : "No transactions yet — add one above"}
              </td>
            </tr>
          ) : filtered.map(t => (
            <tr key={t.id}>
              <td className="td-date">{t.date}</td>
              <td className="td-description">{t.description}</td>
              <td>
                <span className="category-badge">
                  {categoryIcons[t.category] || '🗂️'} {toTitleCase(t.category)}
                </span>
              </td>
              <td className={`td-amount ${t.type === "income" ? "income-amount" : t.type === "savings" ? "savings-amount" : "expense-amount"}`}>
                {t.type === "income" ? "+" : t.type === "savings" ? "→" : "−"}£{fmt(t.amount)}
              </td>
              <td className="td-action">
                <button className="edit-btn" onClick={() => onEdit(t)}>Edit</button>
                <button
                  className="delete-btn"
                  onClick={() => setPendingDelete(t)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ConfirmDialog
        transaction={pendingDelete}
        onConfirm={() => { onDelete(pendingDelete.id); setPendingDelete(null); }}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}

export default TransactionList
