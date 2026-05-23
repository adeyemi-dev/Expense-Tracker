function WelcomeModal({ name, onDismiss }) {
  return (
    <div className="dialog-overlay" onClick={onDismiss}>
      <div className="dialog welcome-dialog" onClick={e => e.stopPropagation()}>
        <div className="welcome-icon">💰</div>
        <h2 className="welcome-title">Welcome to Finance Tracker{name ? `, ${name}` : ''}!</h2>
        <p className="welcome-subtitle">Here's everything you can do:</p>

        <ul className="welcome-features">
          <li>
            <span className="welcome-feature-icon">➕</span>
            <div>
              <strong>Add transactions</strong>
              <p>Log your income, expenses and savings with a category and date</p>
            </div>
          </li>
          <li>
            <span className="welcome-feature-icon">🎯</span>
            <div>
              <strong>Set a savings goal</strong>
              <p>Track your progress toward a target amount with a live progress bar</p>
            </div>
          </li>
          <li>
            <span className="welcome-feature-icon">📊</span>
            <div>
              <strong>Spending breakdown</strong>
              <p>See a chart of where your money goes, filtered by month</p>
            </div>
          </li>
          <li>
            <span className="welcome-feature-icon">🔍</span>
            <div>
              <strong>Filter & search</strong>
              <p>Find any transaction by keyword, month, type or category</p>
            </div>
          </li>
          <li>
            <span className="welcome-feature-icon">⬇</span>
            <div>
              <strong>Export to CSV</strong>
              <p>Download your transactions as a spreadsheet anytime</p>
            </div>
          </li>
          <li>
            <span className="welcome-feature-icon">🌍</span>
            <div>
              <strong>Your currency</strong>
              <p>Switch currency in the header — supports GBP, NGN, USD, EUR and more</p>
            </div>
          </li>
        </ul>

        <button className="btn-primary welcome-btn" onClick={onDismiss}>
          Got it, let's go!
        </button>
      </div>
    </div>
  )
}

export default WelcomeModal
