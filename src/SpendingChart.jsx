import { useState } from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const CATEGORY_COLORS = {
  food: '#f97316',
  groceries: '#22c55e',
  rent: '#ef4444',
  housing: '#d97706',
  utilities: '#eab308',
  'phone bill': '#3b82f6',
  transport: '#14b8a6',
  entertainment: '#a855f7',
  clothing: '#ec4899',
  'black tax': '#64748b',
  miscellaneous: '#94a3b8',
  salary: '#10b981',
  savings: '#6366f1',
}

const toTitleCase = (str) => str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

const fmt = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

function SpendingChart({ transactions }) {
  const [open, setOpen] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState('')

  const months = [...new Set(transactions.map(t => t.date.slice(0, 7)))].sort().reverse()

  const expenses = transactions.filter(t =>
    t.type === 'expense' && (!selectedMonth || t.date.startsWith(selectedMonth))
  )

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
  const textColor = isDark ? '#cbd5e1' : '#475569'

  const grouped = {}
  expenses.forEach(t => {
    grouped[t.category] = (grouped[t.category] || 0) + t.amount
  })

  const labels = Object.keys(grouped)
  const total = Object.values(grouped).reduce((s, v) => s + v, 0)

  const chartData = {
    labels: labels.map(toTitleCase),
    datasets: [{
      data: Object.values(grouped),
      backgroundColor: labels.map(c => CATEGORY_COLORS[c] || '#94a3b8'),
      borderWidth: 2,
      borderColor: isDark ? '#1e293b' : '#ffffff',
      hoverOffset: 6,
    }],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: textColor,
          padding: 14,
          font: { size: 12, family: 'Inter, sans-serif' },
          boxWidth: 12,
          boxHeight: 12,
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const pct = ((ctx.raw / total) * 100).toFixed(1)
            return `  £${fmt(ctx.raw)}  (${pct}%)`
          },
        },
      },
    },
  }

  return (
    <div className="card">
      <div className="section-header">
        <h2 className="card-title" style={{ marginBottom: 0 }}>Spending Breakdown</h2>
        <button className="chart-toggle-btn" onClick={() => setOpen(o => !o)}>
          {open ? 'Hide' : 'Show'} <span className="chart-toggle-arrow">{open ? '▲' : '▼'}</span>
        </button>
      </div>

      {open && (
        <>
          <div className="chart-controls">
            <select className="filter-select" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
              <option value="">All time</option>
              {months.map(m => (
                <option key={m} value={m}>
                  {new Date(m + '-02').toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                </option>
              ))}
            </select>
          </div>
          {expenses.length === 0 ? (
            <p className="empty-state" style={{ padding: '2rem 0' }}>No expense data to display</p>
          ) : (
            <>
              <div className="chart-total">Total spent: £{fmt(total)}</div>
              <div className="chart-wrapper">
                <Doughnut data={chartData} options={options} />
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default SpendingChart
