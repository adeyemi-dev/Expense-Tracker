import { useState } from 'react'

const fmt = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

function SavingsGoal({ transactions, userId, currency }) {
  const sym = currency?.symbol ?? '£';
  const storageKey = `ft-goal-${userId}`

  const [goal, setGoal] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      return saved ? JSON.parse(saved) : null
    } catch { return null }
  })

  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')
  const [target, setTarget] = useState('')
  const [deadline, setDeadline] = useState('')

  const totalSavings = transactions
    .filter(t => t.type === 'savings')
    .reduce((sum, t) => sum + t.amount, 0)

  const startEdit = () => {
    setName(goal?.name || '')
    setTarget(goal ? String(goal.target) : '')
    setDeadline(goal?.deadline || '')
    setEditing(true)
  }

  const handleSave = (e) => {
    e.preventDefault()
    const newGoal = {
      name: name.trim() || 'Savings Goal',
      target: parseFloat(target),
      deadline: deadline || null,
    }
    localStorage.setItem(storageKey, JSON.stringify(newGoal))
    setGoal(newGoal)
    setEditing(false)
  }

  const handleDelete = () => {
    localStorage.removeItem(storageKey)
    setGoal(null)
  }

  if (!goal && !editing) {
    return (
      <div className="card goal-empty">
        <span className="goal-empty-icon">🎯</span>
        <div className="goal-empty-text">
          <p className="goal-empty-title">Set a savings goal</p>
          <p className="goal-empty-sub">Track your progress toward a target amount</p>
        </div>
        <button
          className="btn-primary"
          onClick={() => { setName(''); setTarget(''); setDeadline(''); setEditing(true) }}
        >
          Set Goal
        </button>
      </div>
    )
  }

  if (editing) {
    return (
      <div className="card">
        <h2 className="card-title">🎯 {goal ? 'Edit Goal' : 'Set a Savings Goal'}</h2>
        <form onSubmit={handleSave}>
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label">Goal Name</label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g. Holiday Fund"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label className="form-label">Target Amount ({sym})</label>
              <input
                className="form-input"
                type="number"
                placeholder="0.00"
                min="1"
                step="0.01"
                value={target}
                onChange={e => setTarget(e.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <label className="form-label">
                Deadline <span className="form-label-optional">(optional)</span>
              </label>
              <input
                className="form-input"
                type="date"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
              />
            </div>
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
              <button type="submit" className="btn-primary">Save Goal</button>
            </div>
          </div>
        </form>
      </div>
    )
  }

  const pct = Math.min((totalSavings / goal.target) * 100, 100)
  const reached = totalSavings >= goal.target

  return (
    <div className="card">
      <div className="section-header">
        <h2 className="card-title" style={{ marginBottom: 0 }}>🎯 {goal.name}</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="icon-btn icon-btn--edit" title="Edit goal" onClick={startEdit}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button className="icon-btn icon-btn--delete" title="Delete goal" onClick={handleDelete}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6"/><path d="M14 11v6"/>
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="goal-amounts">
        <span className="goal-saved">{sym}{fmt(totalSavings)}</span>
        <span className="goal-separator"> of </span>
        <span className="goal-target">{sym}{fmt(goal.target)}</span>
        {goal.deadline && (
          <span className="goal-deadline">
            &nbsp;· Due {new Date(goal.deadline + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        )}
      </div>

      <div className="goal-bar-track">
        <div className={`goal-bar-fill${reached ? ' goal-bar-fill--reached' : ''}`} style={{ width: `${pct}%` }} />
      </div>

      <div className="goal-footer">
        <span className="goal-pct">{pct.toFixed(1)}% reached</span>
        {reached
          ? <span className="goal-status goal-status--reached">🎉 Goal reached!</span>
          : <span className="goal-status">{sym}{fmt(goal.target - totalSavings)} to go</span>
        }
      </div>
    </div>
  )
}

export default SavingsGoal
