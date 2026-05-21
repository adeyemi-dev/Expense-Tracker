function Summary({ transactions }) {
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
        <span className="summary-card-icon">↑</span>
        <p className="summary-card-label">Total Income</p>
        <p className="income-amount">£{fmt(totalIncome)}</p>
      </div>
      <div className="summary-card expense">
        <span className="summary-card-icon">↓</span>
        <p className="summary-card-label">Total Expenses</p>
        <p className="expense-amount">£{fmt(totalExpenses)}</p>
      </div>
      <div className="summary-card savings">
        <span className="summary-card-icon">🏦</span>
        <p className="summary-card-label">Total Savings</p>
        <p className="savings-amount">£{fmt(totalSavings)}</p>
      </div>
      <div className="summary-card balance">
        <span className="summary-card-icon">◎</span>
        <p className="summary-card-label">Balance</p>
        <p className={balance >= 0 ? 'income-amount' : 'expense-amount'}>
          {balance < 0 ? '-' : ''}£{fmt(balance)}
        </p>
      </div>
    </div>
  );
}

export default Summary
