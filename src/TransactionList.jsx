import { useState } from 'react'
import ConfirmDialog from './ConfirmDialog'

const categories = [
  "food", "groceries", "rent", "housing", "utilities", "phone bill",
  "transport", "entertainment", "clothing", "salary", "savings", "black tax", "debt", "gym & fitness", "miscellaneous",
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
  debt: '💳',
  'gym & fitness': '🏋️',
  miscellaneous: '🗂️',
};

const toTitleCase = (str) => str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

function SortIcon({ column, sortBy, sortDir }) {
  if (sortBy !== column) return <span className="sort-icon sort-icon--inactive">↕</span>;
  return <span className="sort-icon">{sortDir === 'asc' ? '↑' : '↓'}</span>;
}

function TransactionList({ transactions, onEdit, onDelete, currency }) {
  const sym = currency?.symbol ?? '£';
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterMonth, setFilterMonth] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [pendingDelete, setPendingDelete] = useState(null);

  const months = [...new Set(transactions.map(t => t.date.slice(0, 7)))].sort().reverse();

  const allCategories = [
    ...categories,
    ...transactions
      .map(t => t.category)
      .filter(c => !categories.includes(c)),
  ];

  const handleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir(col === 'date' ? 'desc' : 'desc'); }
  };

  let filtered = transactions;
  if (search.trim()) filtered = filtered.filter(t => t.description.toLowerCase().includes(search.trim().toLowerCase()));
  if (filterType !== "all") filtered = filtered.filter(t => t.type === filterType);
  if (filterCategory !== "all") filtered = filtered.filter(t => t.category === filterCategory);
  if (filterMonth !== "all") filtered = filtered.filter(t => t.date.startsWith(filterMonth));

  filtered = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortBy === 'date') cmp = a.date.localeCompare(b.date);
    if (sortBy === 'amount') cmp = a.amount - b.amount;
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const fmt = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const exportToCSV = () => {
    const headers = ['Date', 'Description', 'Type', 'Category', `Amount (${sym})`];
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
          <select className="filter-select" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
            <option value="all">All Months</option>
            {months.map(m => (
              <option key={m} value={m}>
                {new Date(m + '-02').toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
              </option>
            ))}
          </select>
          <select className="filter-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
            <option value="savings">Savings</option>
          </select>
          <select className="filter-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="all">All Categories</option>
            {allCategories.map(cat => (
              <option key={cat} value={cat}>{toTitleCase(cat)}</option>
            ))}
          </select>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th className="th-date th-sortable" onClick={() => handleSort('date')}>
              Date <SortIcon column="date" sortBy={sortBy} sortDir={sortDir} />
            </th>
            <th>Description</th>
            <th className="th-category">Category</th>
            <th className="th-amount th-sortable" onClick={() => handleSort('amount')}>
              Amount <SortIcon column="amount" sortBy={sortBy} sortDir={sortDir} />
            </th>
            <th className="th-action"></th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="5" className="empty-state">
                {search || filterType !== "all" || filterCategory !== "all" || filterMonth !== "all"
                  ? "No transactions match your filters"
                  : "No transactions yet — add one above"}
              </td>
            </tr>
          ) : filtered.map(t => (
            <tr key={t.id}>
              <td className="td-date">{t.date}</td>
              <td className="td-description">{t.description}</td>
              <td className="td-category">
                <span className="category-badge">
                  {categoryIcons[t.category] || '🗂️'} {toTitleCase(t.category)}
                </span>
              </td>
              <td className={`td-amount ${t.type === "income" ? "income-amount" : t.type === "savings" ? "savings-amount" : "expense-amount"}`}>
                {t.type === "income" ? "+" : t.type === "savings" ? "→" : "−"}{sym}{fmt(t.amount)}
              </td>
              <td className="td-action">
                <button className="icon-btn icon-btn--edit" title="Edit" onClick={() => onEdit(t)}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <button className="icon-btn icon-btn--delete" title="Delete" onClick={() => setPendingDelete(t)}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                    <path d="M10 11v6"/><path d="M14 11v6"/>
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                  </svg>
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
