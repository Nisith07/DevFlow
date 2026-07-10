import { useEffect, useState } from 'react'
import {
  AlertTriangle,
  ArrowLeft,
  Bell,
  Bug,
  Check,
  ChevronRight,
  Circle,
  GitCommit,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  X,
  Zap,
} from 'lucide-react'

function pad(n) {
  return n.toString().padStart(2, '0')
}

export default function DevflowDashboard({ onBack }) {
  const [today, setToday] = useState([
    { id: 1, text: 'Finish Payment API', done: false },
    { id: 2, text: 'Review PR #14', done: false },
    { id: 3, text: 'Write tests for auth module', done: false },
  ])
  const [suggestions, setSuggestions] = useState([
    { id: 1, text: 'Your auth module has duplicate code across login.js and signup.js' },
    { id: 2, text: 'You forgot to write tests for the payment handler' },
    { id: 3, text: 'README needs an update — install steps are out of date' },
  ])
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!running) return undefined
    const intervalId = window.setInterval(() => setSeconds((value) => value + 1), 1000)
    return () => window.clearInterval(intervalId)
  }, [running])

  useEffect(() => {
    if (!toast) return undefined
    const timeoutId = window.setTimeout(() => setToast(null), 3200)
    return () => window.clearTimeout(timeoutId)
  }, [toast])

  const toggleToday = (id) => {
    setToday((list) => list.map((task) => (task.id === id ? { ...task, done: !task.done } : task)))
  }

  const dismissSuggestion = (id) => {
    setSuggestions((list) => list.filter((item) => item.id !== id))
  }

  const sendTestNotification = () => {
    setToast({ title: 'Devflow', body: "Reminder: you've been coding for 45 min. Take a short break." })
  }

  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  const timeStr = `${pad(hrs)}:${pad(mins)}:${pad(secs)}`

  const week = [
    { d: 'M', h: 5 },
    { d: 'T', h: 7 },
    { d: 'W', h: 4 },
    { d: 'T', h: 6 },
    { d: 'F', h: 3, today: true },
  ]
  const maxH = Math.max(...week.map((item) => item.h), 1)
  const completedYesterday = ['Fixed Login API', 'Completed Authentication', '4 commits pushed to main']

  return (
    <div className="df-root">
      <div className="df-wrap">
        <div className="df-topbar">
          <button className="df-back" onClick={onBack}>
            <ArrowLeft size={13} /> Back to homepage
          </button>
          <div className="df-topbrand">
            <Zap size={13} color="var(--amber)" />
            <b>Devflow</b>
          </div>
        </div>

        <p className="df-prompt">
          <span className="df-sigil">$</span> good morning, <span className="df-name">nisith</span>
          <span className="df-cursor" />
        </p>
        <p className="df-subline">
          <span>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</span>
          <span>·</span>
          <span className="df-streak df-mono">🔥 6-day streak</span>
          <span>·</span>
          <span>3 repos active</span>
        </p>

        <div className="df-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="df-card">
              <div className="df-card-head">
                <p className="df-card-title">Yesterday</p>
                <span className="df-count">3 items</span>
              </div>
              {completedYesterday.map((item, index) => (
                <div className="df-row" key={index}>
                  <Check size={15} className="df-yesterday-icon" />
                  <span className="df-row-text" style={{ color: 'var(--text-muted)' }}>{item}</span>
                </div>
              ))}
              <div className="df-commit-line">
                <GitCommit size={13} />
                <span>4 commits · devflow-api</span>
              </div>
            </div>

            <div className="df-card">
              <div className="df-card-head">
                <p className="df-card-title">Today</p>
                <span className="df-count">{today.filter((task) => task.done).length}/{today.length} done</span>
              </div>
              {today.map((task) => (
                <div className={`df-row ${task.done ? 'df-done' : ''}`} key={task.id}>
                  <button
                    className={`df-check-btn ${task.done ? 'checked' : ''}`}
                    onClick={() => toggleToday(task.id)}
                    aria-label={task.done ? 'Mark incomplete' : 'Mark complete'}
                  >
                    {task.done ? <Check size={16} /> : <Circle size={16} />}
                  </button>
                  <span className="df-row-text">{task.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="df-card">
              <div className="df-card-head">
                <p className="df-card-title"><Sparkles size={13} /> AI Suggestions</p>
                <span className="df-count">{suggestions.length}</span>
              </div>
              {suggestions.length === 0 ? (
                <p className="df-sugg-empty">All clear — nothing flagged right now.</p>
              ) : (
                suggestions.map((item) => (
                  <div className="df-sugg" key={item.id}>
                    <AlertTriangle size={14} className="df-sugg-icon" />
                    <span className="df-sugg-text">{item.text}</span>
                    <button className="df-sugg-dismiss" onClick={() => dismissSuggestion(item.id)} aria-label="Dismiss suggestion">
                      <X size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="df-card">
              <div className="df-card-head">
                <p className="df-card-title"><Bug size={13} /> Recent Errors</p>
              </div>
              <div className="df-error">
                <div className="df-error-top">
                  <span className="df-error-name df-mono">Mongo Timeout</span>
                </div>
                <p className="df-error-fixes">
                  <ChevronRight size={13} className="df-sp" /> AI found 3 possible fixes
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="df-card df-timer-card">
          <div>
            <div className="df-timer-label">Focus timer</div>
            <div className={`df-timer-display ${running ? 'running' : ''}`}>{timeStr}</div>
          </div>
          <div>
            <div className="df-timer-label">This week</div>
            <div className="df-week-bars">
              {week.map((item, index) => (
                <div key={index} className={`df-week-bar ${item.today ? 'today' : ''}`} style={{ height: `${(item.h / maxH) * 40}px` }} title={`${item.h}h`} />
              ))}
            </div>
            <div className="df-week-labels">{week.map((item, index) => <span key={index}>{item.d}</span>)}</div>
          </div>
          <div className="df-timer-btns">
            <button className="df-btn primary" onClick={() => setRunning((value) => !value)}>
              {running ? <Pause size={14} /> : <Play size={14} />}
              {running ? 'Pause' : 'Start'}
            </button>
            <button className="df-btn" onClick={() => { setRunning(false); setSeconds(0) }}>
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        <div className="df-notif-row">
          <span className="df-mono"><Bell size={13} style={{ verticalAlign: -2, marginRight: 6 }} /> Notifications on</span>
          <button className="df-btn" onClick={sendTestNotification}>Send test notification</button>
        </div>
      </div>

      {toast && (
        <div className="df-toast">
          <Bell size={16} color="var(--amber)" />
          <div>
            <div className="df-mono" style={{ fontSize: 12, color: 'var(--amber)', marginBottom: 2 }}>{toast.title}</div>
            <div>{toast.body}</div>
          </div>
        </div>
      )}
    </div>
  )
}
