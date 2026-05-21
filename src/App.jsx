import { useState, useEffect } from 'react'
import './App.css'
import AuthPage from './AuthPage'
import Summary from './Summary'
import TransactionForm from './TransactionForm'
import TransactionList from './TransactionList'

const INITIAL_TRANSACTIONS = [
  { id: 1, description: "Salary", amount: 5000, type: "income", category: "salary", date: "2025-01-01" },
  { id: 2, description: "Rent", amount: 1200, type: "expense", category: "rent", date: "2025-01-02" },
  { id: 3, description: "Groceries", amount: 150, type: "expense", category: "groceries", date: "2025-01-03" },
  { id: 4, description: "Freelance Work", amount: 800, type: "income", category: "salary", date: "2025-01-05" },
  { id: 5, description: "Electric Bill", amount: 95, type: "expense", category: "utilities", date: "2025-01-06" },
  { id: 6, description: "Dinner Out", amount: 65, type: "expense", category: "food", date: "2025-01-07" },
  { id: 7, description: "Gas", amount: 45, type: "expense", category: "transport", date: "2025-01-08" },
  { id: 8, description: "Netflix", amount: 15, type: "expense", category: "entertainment", date: "2025-01-10" },
];

const loadUserTransactions = (userId) => {
  try {
    const saved = localStorage.getItem(`ft-transactions-${userId}`);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  } catch {
    return INITIAL_TRANSACTIONS;
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

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    if (!currentUser) return;
    localStorage.setItem(`ft-transactions-${currentUser.id}`, JSON.stringify(transactions));
  }, [transactions, currentUser]);

  const handleAuth = (user) => {
    localStorage.setItem('ft-session', JSON.stringify(user));
    setCurrentUser(user);
    setTransactions(loadUserTransactions(user.id));
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

  const handleCancelEdit = () => setEditingTransaction(null);

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
          <button className="theme-toggle" onClick={() => setIsDark(d => !d)}>
            {isDark ? '☀️ Light' : '🌙 Dark'}
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </header>

      <Summary transactions={transactions} />
      <TransactionForm
        onAdd={handleAdd}
        editingTransaction={editingTransaction}
        onUpdate={handleUpdate}
        onCancelEdit={handleCancelEdit}
      />
      <TransactionList
        transactions={transactions}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default App
