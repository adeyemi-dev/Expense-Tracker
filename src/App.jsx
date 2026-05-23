import { useState, useEffect } from 'react'
import './App.css'
import AuthPage from './AuthPage'
import Summary from './Summary'
import SavingsGoal from './SavingsGoal'
import SpendingChart from './SpendingChart'
import TransactionForm from './TransactionForm'
import TransactionList from './TransactionList'

export const CURRENCIES = [
  { code: 'GBP', symbol: '£',   label: 'GBP — British Pound' },
  { code: 'USD', symbol: '$',   label: 'USD — US Dollar' },
  { code: 'EUR', symbol: '€',   label: 'EUR — Euro' },
  { code: 'NGN', symbol: '₦',   label: 'NGN — Nigerian Naira' },
  { code: 'GHS', symbol: '₵',   label: 'GHS — Ghanaian Cedi' },
  { code: 'KES', symbol: 'KSh', label: 'KES — Kenyan Shilling' },
  { code: 'ZAR', symbol: 'R',   label: 'ZAR — South African Rand' },
  { code: 'INR', symbol: '₹',   label: 'INR — Indian Rupee' },
  { code: 'CAD', symbol: 'CA$', label: 'CAD — Canadian Dollar' },
  { code: 'AUD', symbol: 'A$',  label: 'AUD — Australian Dollar' },
  { code: 'JPY', symbol: '¥',   label: 'JPY — Japanese Yen' },
  { code: 'AED', symbol: 'AED', label: 'AED — UAE Dirham' },
]

const loadUserTransactions = (userId) => {
  try {
    const saved = localStorage.getItem(`ft-transactions-${userId}`);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const s = localStorage.getItem('ft-session');
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });

  const [transactions, setTransactions] = useState(() =>
    currentUser ? loadUserTransactions(currentUser.id) : []
  );

  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');

  const [currencyCode, setCurrencyCode] = useState(() => {
    if (!currentUser) return 'GBP';
    return localStorage.getItem(`ft-currency-${currentUser.id}`) || 'GBP';
  });

  const currency = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0];

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    if (!currentUser) return;
    localStorage.setItem(`ft-transactions-${currentUser.id}`, JSON.stringify(transactions));
  }, [transactions, currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    localStorage.setItem(`ft-currency-${currentUser.id}`, currencyCode);
  }, [currencyCode, currentUser]);

  const handleAuth = (user) => {
    localStorage.setItem('ft-session', JSON.stringify(user));
    setCurrentUser(user);
    setTransactions(loadUserTransactions(user.id));
    setCurrencyCode(localStorage.getItem(`ft-currency-${user.id}`) || 'GBP');
    setEditingTransaction(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('ft-session');
    setCurrentUser(null);
    setTransactions([]);
    setEditingTransaction(null);
  };

  const handleAdd = (transaction) => setTransactions([...transactions, transaction]);
  const handleEdit = (transaction) => setEditingTransaction(transaction);
  const handleUpdate = (updated) => {
    setTransactions(transactions.map(t => t.id === updated.id ? updated : t));
    setEditingTransaction(null);
  };
  const handleDelete = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
    if (editingTransaction?.id === id) setEditingTransaction(null);
  };

  if (!currentUser) {
    return (
      <AuthPage
        onAuth={handleAuth}
        isDark={isDark}
        onToggleTheme={() => setIsDark(d => !d)}
      />
    );
  }

  const firstName = currentUser.name.split(' ')[0];

  return (
    <div className="app">
      <header className="header">
        <div className="header-brand">
          <span className="header-icon">💰</span>
          <div>
            <h1 className="header-title">Finance Tracker</h1>
            <p className="header-subtitle">Welcome back, {firstName} 👋</p>
          </div>
        </div>
        <div className="header-actions">
          <select
            className="currency-select"
            value={currencyCode}
            onChange={e => setCurrencyCode(e.target.value)}
            title="Change currency"
          >
            {CURRENCIES.map(c => (
              <option key={c.code} value={c.code}>{c.code} {c.symbol}</option>
            ))}
          </select>
          <button className="theme-toggle" onClick={() => setIsDark(d => !d)}>
            {isDark ? '☀️' : '🌙'}<span className="toggle-label">{isDark ? ' Light' : ' Dark'}</span>
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </header>

      <Summary transactions={transactions} currency={currency} />
      <SavingsGoal transactions={transactions} userId={currentUser.id} currency={currency} />
      <SpendingChart transactions={transactions} currency={currency} />
      <TransactionForm
        onAdd={handleAdd}
        editingTransaction={editingTransaction}
        onUpdate={handleUpdate}
        onCancelEdit={() => setEditingTransaction(null)}
      />
      <TransactionList
        transactions={transactions}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currency={currency}
      />
    </div>
  );
}

export default App
