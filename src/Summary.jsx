const IncomeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
)

const ExpenseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
    <polyline points="17 18 23 18 23 12"/>
  </svg>
)

const SavingsIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2"/>
    <line x1="2" y1="10" x2="22" y2="10"/>
  </svg>
)

const BalanceIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
)

function Summary({ transactions, currency }) {
  const sym = currency?.symbol ?? '£';
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSavings = transactions
    .filter(t => t.type === "savings")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses - totalSavings;

  const fmt = (n) => Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="summary">
      <div className="summary-card income">
        <span className="summary-card-icon"><IncomeIcon /></span>
        <p className="summary-card-label">Total Income</p>
        <p className="income-amount">{sym}{fmt(totalIncome)}</p>
      </div>
      <div className="summary-card expense">
        <span className="summary-card-icon"><ExpenseIcon /></span>
        <p className="summary-card-label">Total Expenses</p>
        <p className="expense-amount">{sym}{fmt(totalExpenses)}</p>
      </div>
      <div className="summary-card savings">
        <span className="summary-card-icon"><SavingsIcon /></span>
        <p className="summary-card-label">Total Savings</p>
        <p className="savings-amount">{sym}{fmt(totalSavings)}</p>
      </div>
      <div className="summary-card balance">
        <span className="summary-card-icon"><BalanceIcon /></span>
        <p className="summary-card-label">Balance</p>
        <p className={balance >= 0 ? 'income-amount' : 'expense-amount'}>
          {balance < 0 ? '-' : ''}{sym}{fmt(balance)}
        </p>
      </div>
    </div>
  );
}

export default Summary
