import { useState, useEffect } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'
import { pad } from '@/shared/lib/utils'

export default function FocusTimer() {
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running) return undefined
    const intervalId = window.setInterval(() => setSeconds((value) => value + 1), 1000)
    return () => window.clearInterval(intervalId)
  }, [running])

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

  return (
    <div className="card df-timer-card">
      <div>
        <div className="df-timer-label">Focus timer</div>
        <div className={`df-timer-display ${running ? 'running' : ''}`}>{timeStr}</div>
      </div>
      <div>
        <div className="df-timer-label">This week</div>
        <div className="df-week-bars">
          {week.map((item, index) => (
            <div
              key={index}
              className={`df-week-bar ${item.today ? 'today' : ''}`}
              style={{ height: `${(item.h / maxH) * 40}px` }}
              title={`${item.h}h`}
            />
          ))}
        </div>
        <div className="df-week-labels">
          {week.map((item, index) => (
            <span key={index}>{item.d}</span>
          ))}
        </div>
      </div>
      <div className="df-timer-btns">
        <button className="app-btn primary" onClick={() => setRunning((value) => !value)}>
          {running ? <Pause size={14} /> : <Play size={14} />}
          {running ? 'Pause' : 'Start'}
        </button>
        <button
          className="app-btn"
          onClick={() => {
            setRunning(false)
            setSeconds(0)
          }}
        >
          <RotateCcw size={14} />
        </button>
      </div>
    </div>
  )
}
