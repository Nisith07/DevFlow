import { Check, Circle, GitCommit, Sparkles, AlertTriangle, Bug, ChevronRight, X } from 'lucide-react'

export default function DailySummary({
  today,
  completedYesterday,
  suggestions,
  toggleToday,
  dismissSuggestion,
}) {
  return (
    <div className="df-grid">
      {/* Left Column: Yesterday & Today */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Yesterday Card */}
        <div className="card">
          <div className="card-head">
            <p className="card-title">Yesterday</p>
            <span className="df-count">{completedYesterday.length} items</span>
          </div>
          {completedYesterday.map((item, index) => (
            <div className="df-row" key={item.id || index}>
              <Check size={15} className="df-yesterday-icon" />
              <span className="df-row-text" style={{ color: 'var(--color-app-muted)' }}>
                {typeof item === 'string' ? item : item.title}
              </span>
            </div>
          ))}
          <div className="df-commit-line">
            <GitCommit size={13} />
            <span>4 commits · devflow-api</span>
          </div>
        </div>

        {/* Today Card */}
        <div className="card">
          <div className="card-head">
            <p className="card-title">Today</p>
            <span className="df-count">
              {today.filter((task) => task.status === 'done' || task.done).length}/{today.length} done
            </span>
          </div>
          {today.map((task) => {
            const isDone = task.status === 'done' || !!task.done
            const displayText = task.title || task.text
            return (
              <div className={`df-row ${isDone ? 'df-done' : ''}`} key={task.id}>
                <button
                  className={`df-check-btn ${isDone ? 'checked' : ''}`}
                  onClick={() => toggleToday(task.id, isDone)}
                  aria-label={isDone ? 'Mark incomplete' : 'Mark complete'}
                >
                  {isDone ? <Check size={16} /> : <Circle size={16} />}
                </button>
                <span className="df-row-text">{displayText}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Right Column: AI Suggestions & Recent Errors */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* AI Suggestions Card */}
        <div className="card">
          <div className="card-head">
            <p className="card-title">
              <Sparkles size={13} style={{ marginRight: 6 }} /> AI Suggestions
            </p>
            <span className="df-count">{suggestions.length}</span>
          </div>
          {suggestions.length === 0 ? (
            <p className="df-sugg-empty">All clear — nothing flagged right now.</p>
          ) : (
            suggestions.map((item) => (
              <div className="df-sugg" key={item.id}>
                <AlertTriangle size={14} className="df-sugg-icon" />
                <span className="df-sugg-text">{item.text}</span>
                <button
                  className="df-sugg-dismiss"
                  onClick={() => dismissSuggestion(item.id)}
                  aria-label="Dismiss suggestion"
                >
                  <X size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Recent Errors Card */}
        <div className="card">
          <div className="card-head">
            <p className="card-title">
              <Bug size={13} style={{ marginRight: 6 }} /> Recent Errors
            </p>
          </div>
          <div className="df-error">
            <div className="df-error-top">
              <span className="df-error-name df-mono">Mongo Timeout</span>
            </div>
            <p className="df-error-fixes">
              <ChevronRight size={13} className="sp" /> AI found 3 possible fixes
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
